import type { ComponentItemModel, GridConfig, Position, Size, ContainerInfo } from "../types/layout";
import { COLUMNS, MIN_HEIGHT } from "./constant";

class LayoutManager {
  // 通用工具方法
  private roundToThree(num: number): number {
    return parseFloat(num.toFixed(3));
  }

  private getUnitWidth(gridConfig: GridConfig): number {
    return gridConfig.cellWidth + gridConfig.gap;
  }

  private hasOverlap(pos1: Position, size1: Size, pos2: Position, size2: Size): boolean {
    return pos1.x < pos2.x + size2.width &&
      pos1.x + size1.width > pos2.x &&
      pos1.y < pos2.y + size2.height &&
      pos1.y + size1.height > pos2.y;
  }

  private calculateColumnSpan(componentWidth: number, unitWidth: number): number {
    return Math.min(Math.ceil(componentWidth / unitWidth), COLUMNS);
  }

  private getXFromColumn(column: number, unitWidth: number): number {
    return column * unitWidth;
  }

  // 构建列高度数组
  private buildColumnHeights(components: ComponentItemModel[], gridConfig: GridConfig): number[] {
    const { gap } = gridConfig;
    const unitWidth = this.getUnitWidth(gridConfig);
    const columnHeights: number[] = new Array(COLUMNS).fill(0);

    components.forEach(comp => {
      const startCol = Math.floor(comp.x / unitWidth);
      const compSpanCols = this.calculateColumnSpan(comp.width, unitWidth);
      const endCol = Math.min(startCol + compSpanCols, COLUMNS);
      const compBottomY = comp.y + comp.height + gap;

      for (let i = startCol; i < endCol; i++) {
        if (i >= 0 && i < COLUMNS) {
          columnHeights[i] = Math.max(columnHeights[i] || 0, compBottomY);
        }
      }
    });

    return columnHeights;
  }

  // 查找最佳放置位置
  private findBestPosition(columnHeights: number[], spanCols: number): { startCol: number; height: number } {
    let bestStartCol = 0;
    let minHeight = Infinity;

    for (let startCol = 0; startCol <= COLUMNS - spanCols; startCol++) {
      const maxHeightInRange = Math.max(...columnHeights.slice(startCol, startCol + spanCols));

      if (maxHeightInRange < minHeight) {
        minHeight = maxHeightInRange;
        bestStartCol = startCol;
      }
    }

    return { startCol: bestStartCol, height: minHeight };
  }

  // 查找可用位置自动向后排列
  public findAvailablePosition(
    components: ComponentItemModel[],
    newComponent: ComponentItemModel,
    containerInfo: ContainerInfo,
    gridConfig: GridConfig
  ): Position | null {
    const { width: containerWidth, height: containerHeight } = containerInfo;
    const unitWidth = this.getUnitWidth(gridConfig);

    this.autoFillComponentToGrid(newComponent, gridConfig);

    if (newComponent.width > containerWidth) {
      console.warn('组件宽度超过容器宽度');
      return null;
    }

    const spanCols = this.calculateColumnSpan(newComponent.width, unitWidth);
    const columnHeights = this.buildColumnHeights(components, gridConfig);
    const { startCol: bestStartCol, height: minHeight } = this.findBestPosition(columnHeights, spanCols);

    const newX = this.getXFromColumn(bestStartCol, unitWidth);
    const newY = minHeight;

    if (newY + newComponent.height > containerHeight) {
      console.warn('位置超出容器高度');
      return null;
    }

    // 验证新位置不与现有组件重叠
    const newPosition = { x: this.roundToThree(newX), y: this.roundToThree(newY) };
    const hasOverlapWithExisting = components.some(existingComp =>
      this.hasOverlap(
        newPosition,
        { width: newComponent.width, height: newComponent.height },
        { x: existingComp.x, y: existingComp.y },
        { width: existingComp.width, height: existingComp.height }
      )
    );

    if (hasOverlapWithExisting) {
      console.warn('新组件位置与现有组件重叠');
      return null;
    }

    return newPosition;
  }

  // 智能高度吸附
  public snapToColumnGridWithSmartHeight(
    position: Position,
    componentSize: Size,
    components: ComponentItemModel[],
    currentId: string,
    containerInfo: ContainerInfo,
    gridConfig: GridConfig
  ): Position {
    const { width: containerWidth, height: containerHeight } = containerInfo;
    const { gap } = gridConfig;

    const columnWidth = (containerWidth - (COLUMNS - 1) * gap) / COLUMNS;
    const unitWidth = columnWidth + gap;

    const componentCols = this.calculateColumnSpan(componentSize.width, unitWidth);
    const maxColumn = COLUMNS - componentCols;
    const nearestColumn = Math.max(0, Math.min(Math.round(position.x / unitWidth), maxColumn));

    const snappedX = this.getXFromColumn(nearestColumn, unitWidth);
    let snappedY = position.y;

    // 查找在当前组件上方且有水平重叠的组件
    const candidateComponents = components.filter(comp => {
      if (comp.id === currentId) return false;
      const horizontalOverlap = snappedX < comp.x + comp.width && snappedX + componentSize.width > comp.x;
      const isAbove = comp.y + comp.height <= position.y;
      return horizontalOverlap && isAbove;
    });

    if (candidateComponents.length > 0) {
      const closestComponent = candidateComponents.reduce((closest: { comp: ComponentItemModel | null; distance: number }, comp) => {
        const distance = position.y - (comp.y + comp.height);
        return distance >= 0 && distance < closest.distance ?
          { comp, distance } : closest;
      }, { comp: null, distance: Infinity });

      if (closestComponent.comp && closestComponent.distance <= gap) {
        snappedY = closestComponent.comp.y + closestComponent.comp.height + gap;
      }
    }

    snappedY = Math.max(0, Math.min(snappedY, containerHeight - componentSize.height));

    return {
      x: this.roundToThree(snappedX),
      y: this.roundToThree(snappedY)
    };
  }

  // 重新组织布局
  public reorganizeLayout(
    components: ComponentItemModel[],
    containerInfo: ContainerInfo,
    gridConfig: GridConfig,
    skipAutoFill: boolean = false,
    onlyOnSizeIncrease: boolean = false
  ): boolean {
    if (components.length === 0) return true;

    const { gap } = gridConfig;
    const { width: containerWidth, height: containerHeight } = containerInfo;

    if (onlyOnSizeIncrease) {
      components.forEach(comp => {
        comp.x = Math.max(0, Math.min(comp.x, containerWidth - comp.width));
        comp.y = Math.max(0, Math.min(comp.y, containerHeight - comp.height));
      });
      return true;
    }
    const unitWidth = this.getUnitWidth(gridConfig);
    const columnHeights: number[] = new Array(COLUMNS).fill(0);

    for (const comp of components) {
      if (!skipAutoFill) {
        this.autoFillComponentToGrid(comp, gridConfig);
      }

      const spanCols = this.calculateColumnSpan(comp.width, unitWidth);
      const { startCol: bestStartCol, height: minHeight } = this.findBestPosition(columnHeights, spanCols);

      comp.x = this.roundToThree(this.getXFromColumn(bestStartCol, unitWidth));
      comp.y = this.roundToThree(minHeight);

      if (comp.y + comp.height > containerHeight) {
        console.warn('组件超出容器高度，无法完成布局');
        return false;
      }

      const newHeight = comp.y + comp.height + gap;
      for (let i = bestStartCol; i < bestStartCol + spanCols; i++) {
        columnHeights[i] = newHeight;
      }
    }

    return true;
  }

  // 组件自动填充
  public autoFillComponentToGrid(component: ComponentItemModel, gridConfig: GridConfig): void {
    const { cellWidth, gap } = gridConfig;
    const unitWidth = this.getUnitWidth(gridConfig);

    const minWidth = component.minWidth || cellWidth;
    const minHeight = component.minHeight || MIN_HEIGHT;

    component.width = Math.max(component.width, minWidth);
    component.height = Math.max(component.height, minHeight);

    const actualCols = this.calculateColumnSpan(component.width, unitWidth);
    const filledWidth = actualCols * cellWidth + (actualCols - 1) * gap;

    component.width = this.roundToThree(filledWidth);
  }

  // 调整大小自动填充
  public resizeComponentWithAutoFill(
    component: ComponentItemModel,
    newSize: Size,
    gridConfig: GridConfig,
  ): Size {
    const { gap, cellWidth } = gridConfig;
    const unitWidth = this.getUnitWidth(gridConfig);

    const minWidth = component.minWidth || cellWidth;
    const minHeight = component.minHeight || MIN_HEIGHT;

    const actualWidth = Math.max(newSize.width, minWidth);
    const actualHeight = Math.max(newSize.height, minHeight);

    const actualCols = this.calculateColumnSpan(actualWidth, unitWidth);
    const filledWidth = actualCols * cellWidth + (actualCols - 1) * gap;

    const finalWidth = Math.max(filledWidth, minWidth);
    const finalHeight = Math.max(actualHeight, minHeight);

    return {
      width: this.roundToThree(finalWidth),
      height: this.roundToThree(finalHeight)
    };
  }

  // 左侧延展处理
  public handleLeftExpansion(
    components: ComponentItemModel[],
    resizingComponent: ComponentItemModel,
    newPosition: Position,
    newSize: Size,
    containerInfo: ContainerInfo,
    gridConfig: GridConfig
  ):  { affected: ComponentItemModel[]; canResize: boolean } {
    const affected: ComponentItemModel[] = [];
    const { height: containerHeight } = containerInfo;
    const { gap } = gridConfig;
    const resizedComponent = {
      ...resizingComponent,
      x: newPosition.x,
      y: newPosition.y,
      width: newSize.width,
      height: newSize.height
    };

     // 找到所有需要连锁移动的左侧侧组件：与调整后组件有垂直重叠且在左侧侧的组件
    const leftComponents = components.filter(comp => {
      if (comp.id === resizingComponent.id) return false;

      // 检查垂直重叠
      const verticalOverlap = !(resizedComponent.y + resizedComponent.height <= comp.y ||
        comp.y + comp.height <= resizedComponent.y);

      // 检查是否在原始组件的左侧侧
      const isOnLeft = comp.x + comp.width + gap <= resizingComponent.x;

      return verticalOverlap && isOnLeft;
    });

    if (leftComponents.length === 0) {
      return { affected: [], canResize: true };
    }
    // 按x坐标排序，从右到左处理
    leftComponents.sort((a, b) => b.x - a.x);

    const componentsToMove: ComponentItemModel[] = [];
    const componentsToWrap: ComponentItemModel[] = [];

    // 计算推动距离：确保所有左侧组件都能安全移动
    let pushDistance = 0;

    // 计算调整后组件与最后左侧组件的碰撞距离
    const firstLeftComponent = leftComponents[0]!;
    const requiredDistance = firstLeftComponent.x + firstLeftComponent.width + gap - resizedComponent.x
    
    if (requiredDistance <= 0) {
      // 没有碰撞，不需要移动
      return { affected: [], canResize: true };
    }

    pushDistance = requiredDistance;

     // 检查连锁碰撞：确保推动后的组件不会相互碰撞
    for (let i = 0; i < leftComponents.length - 1; i++) {
      const currentComp = leftComponents[i]!;
      const nextComp = leftComponents[i + 1];

      const currentNewX = currentComp.x - pushDistance;
      const requiredGapToNext = nextComp ? nextComp.x + nextComp.width + gap - currentNewX : 0;

      if (requiredGapToNext > 0) {
        // 当前组件推动后会与下一个组件碰撞，需要增加推动距离
        pushDistance += requiredGapToNext;
      }
    }

    // 所有左侧侧组件都需要按相同距离移动（连锁反应）
    for (const comp of leftComponents) {
      const newX = comp.x - pushDistance;

      if (newX < 0) {
        // 需要换行
        pushDistance = 0

        // 换行的组件保持在最左侧
        componentsToWrap.push({
          ...comp,
          x: 0
        });
      } else {
        // 可以推动到新位置
        componentsToMove.push({ ...comp, x: newX, y: comp.y });
      }
    }

    // 处理需要换行的组件
    if (componentsToWrap.length > 0) {
      for (const comp of componentsToWrap) {
        const tempAllComponents = [
          ...components.filter(c => c.id !== resizingComponent.id && !leftComponents.some(rc => rc.id === c.id)),
          resizedComponent,
          ...componentsToMove
        ];

        const newY = this.findPositionBelowComponent(tempAllComponents, comp, gridConfig);

        // 如果换行后超出容器高度，说明无法换行
        if (newY + comp.height > containerHeight) {
          return { affected: [], canResize: false };
        }

        const wrappedComponent = { ...comp, x: comp.x, y: newY };
        componentsToMove.push(wrappedComponent);
      }
    }

    affected.push(...componentsToMove);

    return { affected, canResize: true };
  }

  // 碰撞检测核心方法
  // private handleRightExpansion(
  //   components: ComponentItemModel[],
  //   resizingComponent: ComponentItemModel,
  //   newPosition: Position,
  //   newSize: Size,
  //   containerInfo: ContainerInfo,
  //   gridConfig: GridConfig
  // ): { affected: ComponentItemModel[]; canResize: boolean } {
  //   const affected: ComponentItemModel[] = [];
  //   const { width: containerWidth, height: containerHeight } = containerInfo;
  //   const { gap } = gridConfig;
  //   const resizedComponent = {
  //     ...resizingComponent,
  //     x: newPosition.x,
  //     y: newPosition.y,
  //     width: newSize.width,
  //     height: newSize.height
  //   };

  //   // 找到所有需要连锁移动的右侧组件：与调整后组件有垂直重叠且在右侧的组件
  //   const rightComponents = components.filter(comp => {
  //     if (comp.id === resizingComponent.id) return false;

  //     // 检查垂直重叠
  //     const verticalOverlap = !(resizedComponent.y + resizedComponent.height <= comp.y ||
  //       comp.y + comp.height <= resizedComponent.y);

  //     // 检查是否在原始组件的右侧
  //     const isOnRight = comp.x >= resizingComponent.x + resizingComponent.width + gap;

  //     return verticalOverlap && isOnRight;
  //   });

  //   if (rightComponents.length === 0) {
  //     return { affected: [], canResize: true };
  //   }

  //   // 按x坐标排序，从左到右处理
  //   rightComponents.sort((a, b) => a.x - b.x);

  //   const componentsToMove: ComponentItemModel[] = [];
  //   const componentsToWrap: ComponentItemModel[] = [];

  //   // 计算推动距离：确保所有右侧组件都能安全移动
  //   const newRightEdge = resizedComponent.x + resizedComponent.width;
  //   let pushDistance = 0;

  //   // 计算调整后组件与第一个右侧组件的碰撞距离
  //   const firstRightComponent = rightComponents[0]!;
  //   const requiredDistance = newRightEdge + gap - firstRightComponent.x;

  //   if (requiredDistance <= 0) {
  //     // 没有碰撞，不需要移动
  //     return { affected: [], canResize: true };
  //   }

  //   pushDistance = requiredDistance;

  //   // 检查连锁碰撞：确保推动后的组件不会相互碰撞
  //   for (let i = 0; i < rightComponents.length - 1; i++) {
  //     const currentComp = rightComponents[i]!;
  //     const nextComp = rightComponents[i + 1];

  //     const currentNewX = currentComp.x + pushDistance;
  //     const currentNewRightEdge = currentNewX + currentComp.width;
  //     const requiredGapToNext = nextComp ? currentNewRightEdge + gap - nextComp.x : 0;

  //     if (requiredGapToNext > 0) {
  //       // 当前组件推动后会与下一个组件碰撞，需要增加推动距离
  //       pushDistance += requiredGapToNext;
  //     }
  //   }

  //   // 所有右侧组件都需要按相同距离移动（连锁反应）
  //   for (const comp of rightComponents) {
  //     const newX = comp.x + pushDistance;

  //     // 检查推动后是否超出容器宽度
  //     if (newX + comp.width > containerWidth) {
  //       // 需要换行
  //       pushDistance = 0

  //       // 换行的组件保持在最右侧
  //       componentsToWrap.push({
  //         ...comp,
  //         x: containerWidth - comp.width
  //       });
  //     } else {
  //       // 可以推动到新位置
  //       componentsToMove.push({ ...comp, x: newX, y: comp.y });
  //     }
  //   }

  //   // 处理需要换行的组件
  //   if (componentsToWrap.length > 0) {
  //     // 停止条件1：右侧组件到达容器右边缘并无法换行
  //     for (const comp of componentsToWrap) {
  //       const tempAllComponents = [
  //         ...components.filter(c => c.id !== resizingComponent.id && !rightComponents.some(rc => rc.id === c.id)),
  //         resizedComponent,
  //         ...componentsToMove
  //       ];

  //       const newY = this.findPositionBelowComponent(tempAllComponents, comp, gridConfig);

  //       // 如果换行后超出容器高度，说明无法换行
  //       if (newY + comp.height > containerHeight) {
  //         return { affected: [], canResize: false };
  //       }

  //       const wrappedComponent = { ...comp, x: comp.x, y: newY };
  //       componentsToMove.push(wrappedComponent);
  //     }
  //   }

  //   affected.push(...componentsToMove);
  //   return { affected, canResize: true };
  // }
  private handleWrapScenario(
    allComponents: ComponentItemModel[],
    originalResizingComponent: ComponentItemModel,
    resizedComponent: ComponentItemModel,
    rightComponents: ComponentItemModel[],
    componentToWrap: ComponentItemModel,
    containerInfo: ContainerInfo,
    gridConfig: GridConfig
  ): { affected: ComponentItemModel[]; canResize: boolean } {
    const { width: containerWidth, height: containerHeight } = containerInfo;
    const { gap } = gridConfig;
    const affected: ComponentItemModel[] = [];
  
    // 找出需要换行的组件及其右侧的所有组件
    const wrapIndex = rightComponents.findIndex(comp => comp.id === componentToWrap.id);
    const componentsToWrap = rightComponents.slice(wrapIndex);
    const componentsToMove = rightComponents.slice(0, wrapIndex);
  
    // 计算需要移动的组件的移动距离（不包括换行组件）
    const moveDistances = new Map<string, number>();
    
    for (const comp of componentsToMove) {
      let moveDistance = 0;
      
      if (this.hasHorizontalCollision(resizedComponent, comp, gap)) {
        moveDistance = Math.max(moveDistance, resizedComponent.x + resizedComponent.width + gap - comp.x);
      }
  
      for (const [prevCompId, prevMoveDistance] of moveDistances) {
        const prevComp = componentsToMove.find(c => c.id === prevCompId);
        if (prevComp && this.hasVerticalOverlap(prevComp, comp)) {
          const prevNewX = prevComp.x + prevMoveDistance;
          const prevNewRightEdge = prevNewX + prevComp.width;
          const requiredDistance = prevNewRightEdge + gap - comp.x;
          if (requiredDistance > moveDistance) {
            moveDistance = requiredDistance;
          }
        }
      }
  
      moveDistances.set(comp.id, moveDistance);
    }
  
    // 移动不需要换行的组件
    for (const comp of componentsToMove) {
      const moveDistance = moveDistances.get(comp.id) || 0;
      if (moveDistance > 0) {
        const newX = comp.x + moveDistance;
        affected.push({
          ...comp,
          x: newX
        });
      }
    }
  
    // 处理需要换行的组件：从底部开始向上排列
    const existingComponentsAfterMove = [
      ...allComponents.filter(comp => 
        comp.id !== originalResizingComponent.id && 
        !rightComponents.some(rc => rc.id === comp.id)
      ),
      resizedComponent,
      ...affected
    ];
  
    const wrapX = containerWidth - componentToWrap.width;
    
    // 计算换行组件的总高度（包括间隙）
    const totalWrapHeight = componentsToWrap.reduce((total, comp, index) => {
      return total + comp.height + (index < componentsToWrap.length - 1 ? gap : 0);
    }, 0);
  
    // 从容器底部开始向上排列换行组件
    let currentY = containerHeight - totalWrapHeight;
  
    // 如果从底部开始放不下，就从顶部开始（fallback）
    if (currentY < 0) {
      currentY = 0;
    }
  
    for (const comp of componentsToWrap) {
      const wrapPosition = this.findWrapPositionFromBottom(
        existingComponentsAfterMove,
        comp,
        wrapX,
        currentY,
        containerHeight,
        gridConfig
      );
  
      if (wrapPosition !== null) {
        affected.push({
          ...comp,
          x: wrapX,
          y: wrapPosition
        });
        // 移动到下一个位置（当前组件下方）
        currentY = wrapPosition + comp.height + gap;
      } else {
        // 无法找到合适的换行位置
        return { affected: [], canResize: false };
      }
    }
  
    return { affected, canResize: true };
  }
  
  // 从指定Y位置开始向下搜索可用位置
  private findWrapPositionFromBottom(
    existingComponents: ComponentItemModel[],
    component: ComponentItemModel,
    wrapX: number,
    startY: number,
    containerHeight: number,
    gridConfig: GridConfig
  ): number | null {
    const { gap } = gridConfig;
    const componentHeight = component.height;
  
    // 从startY开始向下搜索可用位置
    for (let y = startY; y <= containerHeight - componentHeight; y += gap) {
      const testBounds = {
        x: wrapX,
        y: y,
        width: component.width,
        height: componentHeight
      };
  
      const hasCollision = existingComponents.some(existingComp =>
        this.hasCollision(testBounds, existingComp, gap)
      );
  
      if (!hasCollision) {
        return y;
      }
    }
  
    return null;
  }
  
  // 修改主方法中的换行检测逻辑，确保正确识别最先到达边缘的组件
  private handleRightExpansion(
    components: ComponentItemModel[],
    resizingComponent: ComponentItemModel,
    newPosition: Position,
    newSize: Size,
    containerInfo: ContainerInfo,
    gridConfig: GridConfig
  ): { affected: ComponentItemModel[]; canResize: boolean } {
    const affected: ComponentItemModel[] = [];
    const { width: containerWidth, height: containerHeight } = containerInfo;
    const { gap } = gridConfig;
  
    const resizedComponent = {
      ...resizingComponent,
      x: newPosition.x,
      y: newPosition.y,
      width: newSize.width,
      height: newSize.height
    };
  
    const newRightEdge = resizedComponent.x + resizedComponent.width;
  
    // 找出所有可能受影响的右侧组件（有垂直重叠且在右侧）
    const rightComponents = components.filter(comp => 
      comp.id !== resizingComponent.id &&
      this.hasVerticalOverlap(resizedComponent, comp) &&
      comp.x >= resizingComponent.x + resizingComponent.width + gap
    );
  
    if (rightComponents.length === 0) {
      return { affected: [], canResize: true };
    }
  
    // 按x坐标排序，从左到右处理
    const sortedComponents = [...rightComponents].sort((a, b) => a.x - b.x);
  
    // 第一轮：计算所有组件需要的移动距离
    const moveDistances = new Map<string, number>();
    
    for (const comp of sortedComponents) {
      let moveDistance = 0;
      
      // 计算与调整后组件的碰撞距离
      if (this.hasHorizontalCollision(resizedComponent, comp, gap)) {
        moveDistance = Math.max(moveDistance, newRightEdge + gap - comp.x);
      }
  
      // 计算与前面已移动组件的连锁碰撞
      for (const [prevCompId, prevMoveDistance] of moveDistances) {
        const prevComp = sortedComponents.find(c => c.id === prevCompId);
        if (prevComp && this.hasVerticalOverlap(prevComp, comp)) {
          const prevNewX = prevComp.x + prevMoveDistance;
          const prevNewRightEdge = prevNewX + prevComp.width;
          const requiredDistance = prevNewRightEdge + gap - comp.x;
          if (requiredDistance > moveDistance) {
            moveDistance = requiredDistance;
          }
        }
      }
  
      moveDistances.set(comp.id, moveDistance);
    }
  
    // 检查是否需要换行：找出最先到达右边缘的组件
    let firstComponentToHitEdge: ComponentItemModel | null = null;
    let minDistanceToEdge = Infinity;
  
    for (const comp of sortedComponents) {
      const moveDistance = moveDistances.get(comp.id) || 0;
      const newX = comp.x + moveDistance;
      const newRightEdge = newX + comp.width;
      
      if (newRightEdge > containerWidth) {
        const distanceToEdge = newRightEdge - containerWidth;
        // 选择超出边界距离最小的组件，即最先到达边缘的
        if (distanceToEdge < minDistanceToEdge) {
          minDistanceToEdge = distanceToEdge;
          firstComponentToHitEdge = comp;
        }
      }
    }
  
    // 如果有组件会超出右边界，让最先到达边缘的组件及其右侧所有组件换行
    if (firstComponentToHitEdge) {
      return this.handleWrapScenario(
        components,
        resizingComponent,
        resizedComponent,
        sortedComponents,
        firstComponentToHitEdge,
        containerInfo,
        gridConfig
      );
    }
  
    // 没有组件超出边界，直接移动所有组件
    for (const comp of sortedComponents) {
      const moveDistance = moveDistances.get(comp.id) || 0;
      if (moveDistance > 0) {
        const newX = comp.x + moveDistance;
        affected.push({
          ...comp,
          x: newX
        });
      }
    }
  
    return { affected, canResize: true };
  }
  
  // 辅助方法保持不变
  private hasVerticalOverlap(compA: ComponentItemModel, compB: ComponentItemModel): boolean {
    return !(compA.y + compA.height <= compB.y || compB.y + compB.height <= compA.y);
  }
  
  private hasHorizontalCollision(compA: ComponentItemModel, compB: ComponentItemModel, gap: number): boolean {
    const compARight = compA.x + compA.width;
    return compARight + gap > compB.x && this.hasVerticalOverlap(compA, compB);
  }
  
  private hasCollision(compA: ComponentItemModel, compB: ComponentItemModel, gap: number): boolean {
    const horizontalCollision = !(compA.x + compA.width + gap <= compB.x || compB.x + compB.width + gap <= compA.x);
    const verticalCollision = !(compA.y + compA.height + gap <= compB.y || compB.y + compB.height + gap <= compA.y);
    return horizontalCollision && verticalCollision;
  }
  
  private handleBottomExpansion(
    components: ComponentItemModel[],
    resizingComponent: ComponentItemModel,
    newPosition: Position,
    newSize: Size,
    containerInfo: ContainerInfo,
    gridConfig: GridConfig
  ): { affected: ComponentItemModel[]; canResize: boolean } {
    const affected: ComponentItemModel[] = [];
    const { height: containerHeight } = containerInfo;
    const { gap } = gridConfig;

    const resizedComponent = {
      ...resizingComponent,
      x: newPosition.x,
      y: newPosition.y,
      width: newSize.width,
      height: newSize.height
    };

    // 找到所有与调整后组件有水平重叠且在下方的组件
    const bottomComponents = components.filter(comp => {
      if (comp.id === resizingComponent.id) return false;
      const horizontalOverlap = !(resizedComponent.x + resizedComponent.width <= comp.x || comp.x + comp.width <= resizedComponent.x);
      const isBelow = comp.y >= resizingComponent.y + resizingComponent.height - gap;
      return horizontalOverlap && isBelow;
    });

    if (bottomComponents.length === 0) {
      return { affected: [], canResize: true };
    }

    bottomComponents.sort((a, b) => a.y - b.y);
    const newBottomEdge = resizedComponent.y + resizedComponent.height;

    // 检查碰撞并计算推动距离
    let pushDistance = 0;
    for (const comp of bottomComponents) {
      const requiredDistance = newBottomEdge + gap - comp.y;
      if (requiredDistance > 0) {
        pushDistance = requiredDistance;
        break;
      }
    }

    if (pushDistance === 0) {
      return { affected: [], canResize: true };
    }

    // 推动下方组件
    for (const comp of bottomComponents) {
      const newY = comp.y + pushDistance;
      if (newY + comp.height > containerHeight) {
        return { affected: [], canResize: false };
      }
      affected.push({ ...comp, x: this.roundToThree(comp.x), y: this.roundToThree(newY) });
    }

    return { affected, canResize: true };
  }

  private handleTopExpansion(
    components: ComponentItemModel[],
    resizingComponent: ComponentItemModel,
    newPosition: Position,
    newSize: Size,
    containerInfo: ContainerInfo,
    gridConfig: GridConfig
  ): { affected: ComponentItemModel[]; canResize: boolean } {
    const affected: ComponentItemModel[] = [];
    const { gap } = gridConfig;

    const resizedComponent = {
      ...resizingComponent,
      x: newPosition.x,
      y: newPosition.y,
      width: newSize.width,
      height: newSize.height
    };

    // 找到所有与调整后组件有水平重叠且在上方的组件
    const topComponents = components.filter(comp => {
      if (comp.id === resizingComponent.id) return false;
      const horizontalOverlap = !(resizedComponent.x + resizedComponent.width <= comp.x || comp.x + comp.width <= resizedComponent.x);
      const isAbove = comp.y + comp.height + gap <= resizingComponent.y;
      return horizontalOverlap && isAbove;
    });

    if (topComponents.length === 0) {
      return { affected: [], canResize: true };
    }

    topComponents.sort((a, b) => b.y - a.y); // 从下到上排序

    // 检查碰撞并计算推动距离
    let pushDistance = 0;
    for (const comp of topComponents) {
      const requiredDistance = comp.y + comp.height + gap - resizedComponent.y;
      if (requiredDistance > 0) {
        pushDistance = requiredDistance;
        break;
      }
    }

    if (pushDistance === 0) {
      return { affected: [], canResize: true };
    }

    // 推动上方组件
    for (const comp of topComponents) {
      const newY = comp.y - pushDistance;
      if (newY < 0) {
        return { affected: [], canResize: false };
      }
      affected.push({ ...comp, x: this.roundToThree(comp.x), y: this.roundToThree(newY) });
    }

    return { affected, canResize: true };
  }

  private handleBottomRightExpansion(
    components: ComponentItemModel[],
    resizingComponent: ComponentItemModel,
    newPosition: Position,
    newSize: Size,
    containerInfo: ContainerInfo,
    gridConfig: GridConfig
  ): { affected: ComponentItemModel[]; canResize: boolean } {
    // 先处理向右扩展
    const rightResult = this.handleRightExpansion(components, resizingComponent, newPosition, newSize, containerInfo, gridConfig);
    if (!rightResult.canResize) {
      return rightResult;
    }

    // 在临时列表基础上处理向下扩展
    const tempComponents = components.map(comp => {
      const affectedComp = rightResult.affected.find(ac => ac.id === comp.id);
      return affectedComp ? { ...comp, x: affectedComp.x, y: affectedComp.y } : comp;
    });

    const bottomResult = this.handleBottomExpansion(tempComponents, resizingComponent, newPosition, newSize, containerInfo, gridConfig);
    if (!bottomResult.canResize) {
      return bottomResult;
    }

    // 合并两个方向的影响组件
    const allAffected: ComponentItemModel[] = [];
    const affectedIds = new Set<string>();

    for (const comp of rightResult.affected) {
      allAffected.push(comp);
      affectedIds.add(comp.id);
    }

    for (const comp of bottomResult.affected) {
      if (!affectedIds.has(comp.id)) {
        allAffected.push(comp);
      } else {
        const existingComp = allAffected.find(ac => ac.id === comp.id);
        if (existingComp) {
          existingComp.y = comp.y;
        }
      }
    }

    return { affected: allAffected, canResize: true };
  }

  private handleTopLeftExpansion(
    components: ComponentItemModel[],
    resizingComponent: ComponentItemModel,
    newPosition: Position,
    newSize: Size,
    containerInfo: ContainerInfo,
    gridConfig: GridConfig
  ): { affected: ComponentItemModel[]; canResize: boolean } {
    // 先处理向左扩展
    const leftResult = this.handleLeftExpansion(components, resizingComponent, newPosition, newSize, containerInfo, gridConfig);
    if (!leftResult.canResize) {
      return leftResult;
    }

    // 在临时列表基础上处理向上扩展
    const tempComponents = components.map(comp => {
      const affectedComp = leftResult.affected.find(ac => ac.id === comp.id);
      return affectedComp ? { ...comp, x: affectedComp.x, y: affectedComp.y } : comp;
    });

    const topResult = this.handleTopExpansion(tempComponents, resizingComponent, newPosition, newSize, containerInfo, gridConfig);
    if (!topResult.canResize) {
      return topResult;
    }

    // 合并两个方向的影响组件
    const allAffected: ComponentItemModel[] = [];
    const affectedIds = new Set<string>();

    for (const comp of leftResult.affected) {
      allAffected.push(comp);
      affectedIds.add(comp.id);
    }

    for (const comp of topResult.affected) {
      if (!affectedIds.has(comp.id)) {
        allAffected.push(comp);
      } else {
        const existingComp = allAffected.find(ac => ac.id === comp.id);
        if (existingComp) {
          existingComp.y = comp.y;
        }
      }
    }

    return { affected: allAffected, canResize: true };
  }

  private handleTopRightExpansion(
    components: ComponentItemModel[],
    resizingComponent: ComponentItemModel,
    newPosition: Position,
    newSize: Size,
    containerInfo: ContainerInfo,
    gridConfig: GridConfig
  ): { affected: ComponentItemModel[]; canResize: boolean } {
    // 先处理向右扩展
    const rightResult = this.handleRightExpansion(components, resizingComponent, newPosition, newSize, containerInfo, gridConfig);
    if (!rightResult.canResize) {
      return rightResult;
    }

    // 在临时列表基础上处理向上扩展
    const tempComponents = components.map(comp => {
      const affectedComp = rightResult.affected.find(ac => ac.id === comp.id);
      return affectedComp ? { ...comp, x: affectedComp.x, y: affectedComp.y } : comp;
    });

    const topResult = this.handleTopExpansion(tempComponents, resizingComponent, newPosition, newSize, containerInfo, gridConfig);
    if (!topResult.canResize) {
      return topResult;
    }

    // 合并两个方向的影响组件
    const allAffected: ComponentItemModel[] = [];
    const affectedIds = new Set<string>();

    for (const comp of rightResult.affected) {
      allAffected.push(comp);
      affectedIds.add(comp.id);
    }

    for (const comp of topResult.affected) {
      if (!affectedIds.has(comp.id)) {
        allAffected.push(comp);
      } else {
        const existingComp = allAffected.find(ac => ac.id === comp.id);
        if (existingComp) {
          existingComp.y = comp.y;
        }
      }
    }

    return { affected: allAffected, canResize: true };
  }

  private handleBottomLeftExpansion(
    components: ComponentItemModel[],
    resizingComponent: ComponentItemModel,
    newPosition: Position,
    newSize: Size,
    containerInfo: ContainerInfo,
    gridConfig: GridConfig
  ): { affected: ComponentItemModel[]; canResize: boolean } {
    // 先处理向左扩展
    const leftResult = this.handleLeftExpansion(components, resizingComponent, newPosition, newSize, containerInfo, gridConfig);
    if (!leftResult.canResize) {
      return leftResult;
    }

    // 在临时列表基础上处理向下扩展
    const tempComponents = components.map(comp => {
      const affectedComp = leftResult.affected.find(ac => ac.id === comp.id);
      return affectedComp ? { ...comp, x: affectedComp.x, y: affectedComp.y } : comp;
    });

    const bottomResult = this.handleBottomExpansion(tempComponents, resizingComponent, newPosition, newSize, containerInfo, gridConfig);
    if (!bottomResult.canResize) {
      return bottomResult;
    }

    // 合并两个方向的影响组件
    const allAffected: ComponentItemModel[] = [];
    const affectedIds = new Set<string>();

    for (const comp of leftResult.affected) {
      allAffected.push(comp);
      affectedIds.add(comp.id);
    }

    for (const comp of bottomResult.affected) {
      if (!affectedIds.has(comp.id)) {
        allAffected.push(comp);
      } else {
        const existingComp = allAffected.find(ac => ac.id === comp.id);
        if (existingComp) {
          existingComp.y = comp.y;
        }
      }
    }

    return { affected: allAffected, canResize: true };
  }

  private findPositionBelowComponent(
    components: ComponentItemModel[],
    component: ComponentItemModel,
    gridConfig: GridConfig
  ): number {
    const { gap } = gridConfig;
    let targetY = component.y + component.height + gap;

    const overlappingComponents = components.filter(comp => {
      if (comp.id === component.id) return false;
      return !(component.x + component.width <= comp.x || comp.x + comp.width <= component.x);
    });

    overlappingComponents.sort((a, b) => a.y - b.y);

    let foundPosition = false;
    while (!foundPosition) {
      foundPosition = true;
      for (const comp of overlappingComponents) {
        const verticalOverlap = !(targetY + component.height <= comp.y || comp.y + comp.height <= targetY);
        if (verticalOverlap) {
          targetY = comp.y + comp.height + gap;
          foundPosition = false;
          break;
        }
      }
    }

    return targetY;
  }

  // 获取受影响的组件
  public getAffectedComponents(
    components: ComponentItemModel[],
    resizingComponent: ComponentItemModel,
    newPosition: Position,
    newSize: Size,
    containerInfo: ContainerInfo,
    gridConfig: GridConfig,
    resizeType?: string
  ): { affected: ComponentItemModel[]; canResize: boolean } {
    console.log(newSize, resizingComponent.width)
    const widthIncreased = newSize.width > resizingComponent.width;
    const heightIncreased = newSize.height > resizingComponent.height;
    const positionChanged = newPosition.x !== resizingComponent.x || newPosition.y !== resizingComponent.y;

    // 优先根据 resizeType 处理调整大小的情况
    if (resizeType) {
      console.log(resizeType, widthIncreased, heightIncreased)

      // 处理各种调整大小的情况
      if (resizeType === 'bottom-right' && widthIncreased && heightIncreased) {
        return this.handleBottomRightExpansion(components, resizingComponent, newPosition, newSize, containerInfo, gridConfig);
      } else if (widthIncreased && resizeType.includes('right')) {
        return this.handleRightExpansion(components, resizingComponent, newPosition, newSize, containerInfo, gridConfig);
      } else if (heightIncreased && resizeType.includes('bottom')) {
        return this.handleBottomExpansion(components, resizingComponent, newPosition, newSize, containerInfo, gridConfig);
      } else if (widthIncreased && resizeType.includes('left')) {
        return this.handleLeftExpansion(components, resizingComponent, newPosition, newSize, containerInfo, gridConfig);
      } else if (heightIncreased && resizeType.includes('top')) {
        // 处理向上扩展的情况
        return this.handleTopExpansion(components, resizingComponent, newPosition, newSize, containerInfo, gridConfig);
      } else if (resizeType.includes('top') && resizeType.includes('left') && (widthIncreased || heightIncreased)) {
        // 处理左上角扩展
        return this.handleTopLeftExpansion(components, resizingComponent, newPosition, newSize, containerInfo, gridConfig);
      } else if (resizeType.includes('top') && resizeType.includes('right') && (widthIncreased || heightIncreased)) {
        // 处理右上角扩展
        return this.handleTopRightExpansion(components, resizingComponent, newPosition, newSize, containerInfo, gridConfig);
      } else if (resizeType.includes('bottom') && resizeType.includes('left') && (widthIncreased || heightIncreased)) {
        // 处理左下角扩展
        return this.handleBottomLeftExpansion(components, resizingComponent, newPosition, newSize, containerInfo, gridConfig);
      }
    }

    // 如果只是位置改变（拖拽移动），使用重叠检查
    if (positionChanged && !widthIncreased && !heightIncreased) {
      const resizedComponent = {
        ...resizingComponent,
        x: newPosition.x,
        y: newPosition.y,
        width: newSize.width,
        height: newSize.height
      };

      for (const otherComponent of components) {
        if (otherComponent.id === resizingComponent.id) continue;
        if (this.hasOverlap(
          { x: resizedComponent.x, y: resizedComponent.y },
          { width: resizedComponent.width, height: resizedComponent.height },
          { x: otherComponent.x, y: otherComponent.y },
          { width: otherComponent.width, height: otherComponent.height }
        )) {
          return { affected: [], canResize: false };
        }
      }
      return { affected: [], canResize: true };
    }

    // 其他情况，检查重叠
    const resizedComponent = {
      ...resizingComponent,
      x: newPosition.x,
      y: newPosition.y,
      width: newSize.width,
      height: newSize.height
    };

    for (const otherComponent of components) {
      if (otherComponent.id === resizingComponent.id) continue;
      if (this.hasOverlap(
        { x: resizedComponent.x, y: resizedComponent.y },
        { width: resizedComponent.width, height: resizedComponent.height },
        { x: otherComponent.x, y: otherComponent.y },
        { width: otherComponent.width, height: otherComponent.height }
      )) {
        return { affected: [], canResize: false };
      }
    }
    return { affected: [], canResize: true };
  }

  // 智能验证位置
  public validatePositionWithLayout(
    components: ComponentItemModel[],
    currentId: string,
    position: Position,
    size: Size,
    containerInfo: ContainerInfo,
    gridConfig: GridConfig,
    resizeType?: string
  ): { valid: boolean; affectedComponents: ComponentItemModel[] } {
    const { width: containerWidth, height: containerHeight } = containerInfo;

    // 基础边界检查
    if (position.x < 0 ||
      position.y < 0 ||
      position.x + size.width > containerWidth ||
      position.y + size.height > containerHeight) {
      return { valid: false, affectedComponents: [] };
    }

    const currentComponent = components.find(c => c.id === currentId);
    if (!currentComponent) {
      return { valid: false, affectedComponents: [] };
    }

    const { affected, canResize } = this.getAffectedComponents(
      components,
      currentComponent,
      position,
      size,
      containerInfo,
      gridConfig,
      resizeType
    );

    return { valid: canResize, affectedComponents: affected };
  }

  // 验证拖拽位置
  public validateDragPosition(
    components: ComponentItemModel[],
    currentId: string,
    newPosition: Position,
    containerInfo: ContainerInfo,
    gridConfig: GridConfig
  ): { valid: boolean; affectedComponents: ComponentItemModel[]; finalPosition: Position } {
    const { width: containerWidth, height: containerHeight } = containerInfo;

    const currentComponent = components.find(c => c.id === currentId);
    if (!currentComponent) {
      return { valid: false, affectedComponents: [], finalPosition: newPosition };
    }

    const currentSize = { width: currentComponent.width, height: currentComponent.height };
    const snappedPosition = this.snapToColumnGridWithSmartHeight(
      newPosition,
      currentSize,
      components,
      currentId,
      containerInfo,
      gridConfig
    );

    // 基础边界检查
    if (snappedPosition.x < 0 ||
      snappedPosition.y < 0 ||
      snappedPosition.x + currentSize.width > containerWidth ||
      snappedPosition.y + currentSize.height > containerHeight) {
      return { valid: false, affectedComponents: [], finalPosition: snappedPosition };
    }

    // 严格检查是否与其他组件重叠
    for (const otherComponent of components) {
      if (otherComponent.id === currentId) continue;
      if (this.hasOverlap(
        snappedPosition,
        currentSize,
        { x: otherComponent.x, y: otherComponent.y },
        { width: otherComponent.width, height: otherComponent.height }
      )) {
        return { valid: false, affectedComponents: [], finalPosition: snappedPosition };
      }
    }

    return { valid: true, affectedComponents: [], finalPosition: snappedPosition };
  }

  // 自适应布局
  public adaptiveLayoutResize(
    components: ComponentItemModel[],
    oldCellWidth: number,
    newCellWidth: number,
    containerInfo: ContainerInfo
  ): ComponentItemModel[] {
    if (oldCellWidth === newCellWidth) {
      return components;
    }

    const scaleRatio = newCellWidth / oldCellWidth;

    return components.map(component => {
      const newPixelWidth = Math.round(component.width * scaleRatio);
      const newPixelHeight = component.height;

      const maxWidth = containerInfo.width - component.x;
      const maxHeight = containerInfo.height - component.y;

      return {
        ...component,
        width: Math.min(newPixelWidth, maxWidth),
        height: Math.min(newPixelHeight, maxHeight)
      };
    });
  }

  public adaptiveLayoutOnResize(
    components: ComponentItemModel[],
    oldContainerInfo: ContainerInfo,
    newContainerInfo: ContainerInfo,
    oldCellWidth: number,
    newCellWidth: number,
    gridConfig: GridConfig
  ): ComponentItemModel[] {
    if (oldContainerInfo.width === newContainerInfo.width) {
      return components;
    }

    const { gap } = gridConfig;
    const cellWidthRatio = newCellWidth / oldCellWidth;

    return components.map(component => {
      let newX = component.x;
      let newWidth = component.width;

      if (cellWidthRatio !== 1) {
        const oldUnitWidth = oldCellWidth + gap;
        const newUnitWidth = newCellWidth + gap;

        const oldStartColumn = Math.round(component.x / oldUnitWidth);
        const oldColumnsSpanned = Math.max(1, Math.round((component.width + gap) / oldUnitWidth));

        newX = oldStartColumn * newUnitWidth;
        newWidth = oldColumnsSpanned * newCellWidth + (oldColumnsSpanned - 1) * gap;
        newWidth = Math.max(newWidth, newCellWidth);
      }

      if (newX + newWidth > newContainerInfo.width) {
        const availableWidth = newContainerInfo.width - newX;
        if (availableWidth > 0) {
          newWidth = Math.min(newWidth, availableWidth);
        } else {
          newX = Math.max(0, newContainerInfo.width - newWidth);
        }
      }

      const newY = Math.min(component.y, newContainerInfo.height - component.height);

      return {
        ...component,
        x: this.roundToThree(newX),
        y: this.roundToThree(newY),
        width: this.roundToThree(newWidth),
        height: this.roundToThree(component.height)
      };
    });
  }
}

// 创建实例并导出
const layoutManager = new LayoutManager();

// 直接导出实例方法，避免this绑定问题
export const findAvailablePosition = layoutManager.findAvailablePosition.bind(layoutManager);
export const snapToColumnGridWithSmartHeight = layoutManager.snapToColumnGridWithSmartHeight.bind(layoutManager);
export const reorganizeLayout = layoutManager.reorganizeLayout.bind(layoutManager);
export const autoFillComponentToGrid = layoutManager.autoFillComponentToGrid.bind(layoutManager);
export const resizeComponentWithAutoFill = layoutManager.resizeComponentWithAutoFill.bind(layoutManager);
export const getAffectedComponents = layoutManager.getAffectedComponents.bind(layoutManager);
export const validatePositionWithLayout = layoutManager.validatePositionWithLayout.bind(layoutManager);
export const validateDragPosition = layoutManager.validateDragPosition.bind(layoutManager);
export const adaptiveLayoutResize = layoutManager.adaptiveLayoutResize.bind(layoutManager);
export const adaptiveLayoutOnResize = layoutManager.adaptiveLayoutOnResize.bind(layoutManager);

export default layoutManager;