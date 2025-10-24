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
          columnHeights[i] = Math.max(columnHeights[i], compBottomY);
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
      const closestComponent = candidateComponents.reduce((closest, comp) => {
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

    const columnWidth = (containerWidth - (COLUMNS - 1) * gap) / COLUMNS;
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
  public handleLeftResize(
    component: ComponentItemModel,
    newWidth: number,
    components: ComponentItemModel[],
    gridConfig: GridConfig,
    containerInfo: ContainerInfo
  ): { x: number; width: number; valid: boolean } {
    const { gap, cellWidth } = gridConfig;
    const unitWidth = this.getUnitWidth(gridConfig);
    
    const minWidth = component.minWidth || cellWidth;
    const actualWidth = Math.max(newWidth, minWidth);
    
    const filledSize = this.resizeComponentWithAutoFill(component, { width: actualWidth, height: component.height }, gridConfig);
    
    const rightEdge = component.x + component.width;
    let newX = rightEdge - filledSize.width;
    
    const alignedColumn = Math.round(newX / unitWidth);
    newX = Math.max(0, alignedColumn * unitWidth);
    
    const otherComponents = components.filter(c => c.id !== component.id);
    
    for (const comp of otherComponents) {
      const verticalOverlap = !(component.y + component.height <= comp.y || comp.y + comp.height <= component.y);
      
      if (verticalOverlap) {
        if (comp.x + comp.width <= component.x) {
          const distance = newX - (comp.x + comp.width);
          if (distance < gap) {
            const minRequiredX = comp.x + comp.width + gap;
            const minColumn = Math.ceil(minRequiredX / unitWidth);
            newX = Math.max(newX, minColumn * unitWidth);
          }
        }
        
        if (newX < comp.x + comp.width && newX + filledSize.width > comp.x) {
          return { x: component.x, width: component.width, valid: false };
        }
      }
    }
    
    if (newX < 0) {
      newX = 0;
      filledSize.width = rightEdge - newX;
    }
    
    if (newX + filledSize.width > containerInfo.width) {
      return { x: component.x, width: component.width, valid: false };
    }
    
    return {
      x: this.roundToThree(newX),
      width: this.roundToThree(filledSize.width),
      valid: true
    };
  }

  // 碰撞检测核心方法
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

    // 找到所有与调整后组件有垂直重叠且在右侧的组件
    const rightComponents = components.filter(comp => {
      if (comp.id === resizingComponent.id) return false;
      const verticalOverlap = !(resizedComponent.y + resizedComponent.height <= comp.y || comp.y + comp.height <= resizedComponent.y);
      const isOnRight = comp.x >= resizingComponent.x + resizingComponent.width - gap;
      return verticalOverlap && isOnRight;
    });

    if (rightComponents.length === 0) {
      return { affected: [], canResize: true };
    }

    rightComponents.sort((a, b) => a.x - b.x);
    const newRightEdge = resizedComponent.x + resizedComponent.width;

    // 检查碰撞并计算推动距离
    let pushDistance = 0;
    for (const comp of rightComponents) {
      const requiredDistance = newRightEdge + gap - comp.x;
      if (requiredDistance > 0) {
        pushDistance = requiredDistance;
        break;
      }
    }

    if (pushDistance === 0) {
      return { affected: [], canResize: true };
    }

    const componentsToMove: ComponentItemModel[] = [];
    const componentsToWrap: ComponentItemModel[] = [];

    // 处理右侧组件
    for (const comp of rightComponents) {
      const newX = comp.x + pushDistance;
      if (newX + comp.width > containerWidth) {
        componentsToWrap.push(comp);
      } else {
        componentsToMove.push({ ...comp, x: newX, y: comp.y });
      }
    }

    // 处理需要换行的组件
    if (componentsToWrap.length > 0) {
      const allComponents = [
        ...components.filter(c => c.id !== resizingComponent.id && !rightComponents.some(rc => rc.id === c.id)),
        resizedComponent,
        ...componentsToMove
      ];

      componentsToWrap.sort((a, b) => a.x - b.x);

      for (const comp of componentsToWrap) {
        const newY = this.findPositionBelowComponent(allComponents, comp, gridConfig);
        if (newY + comp.height > containerHeight) {
          const rightmostX = containerWidth - comp.width;
          const movedComponent = { ...comp, x: rightmostX, y: comp.y };
          componentsToMove.push(movedComponent);
          allComponents.push(movedComponent);
          return { affected: [], canResize: false };
        } else {
          const movedComponent = { ...comp, x: comp.x, y: newY };
          componentsToMove.push(movedComponent);
          allComponents.push(movedComponent);
        }
      }
    }

    affected.push(...componentsToMove);
    return { affected, canResize: true };
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
    const widthIncreased = newSize.width > resizingComponent.width;
    const heightIncreased = newSize.height > resizingComponent.height;
    const positionChanged = newPosition.x !== resizingComponent.x || newPosition.y !== resizingComponent.y;

    // 如果位置改变了，使用重叠检查
    if (positionChanged) {
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

    // 根据调整类型选择处理方式
    if (resizeType === 'bottom-right' && widthIncreased && heightIncreased) {
      return this.handleBottomRightExpansion(components, resizingComponent, newPosition, newSize, containerInfo, gridConfig);
    } else if (widthIncreased && (resizeType === 'right' || resizeType?.includes('right'))) {
      return this.handleRightExpansion(components, resizingComponent, newPosition, newSize, containerInfo, gridConfig);
    } else if (heightIncreased && (resizeType === 'bottom' || resizeType?.includes('bottom'))) {
      return this.handleBottomExpansion(components, resizingComponent, newPosition, newSize, containerInfo, gridConfig);
    } else {
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
export const handleLeftResize = layoutManager.handleLeftResize.bind(layoutManager);
export const getAffectedComponents = layoutManager.getAffectedComponents.bind(layoutManager);
export const validatePositionWithLayout = layoutManager.validatePositionWithLayout.bind(layoutManager);
export const validateDragPosition = layoutManager.validateDragPosition.bind(layoutManager);
export const adaptiveLayoutResize = layoutManager.adaptiveLayoutResize.bind(layoutManager);
export const adaptiveLayoutOnResize = layoutManager.adaptiveLayoutOnResize.bind(layoutManager);

export default layoutManager;