import type { ComponentItemModel, GridConfig, Position, Size, ContainerInfo } from "../types/layout";
import { COLUMNS } from "./constant";

// 计算两个组件之间的最小距离
function getComponentDistance(comp1: ComponentItemModel, comp2: ComponentItemModel): number {
  // 计算水平距离
  let horizontalDistance = 0;
  if (comp1.x + comp1.width <= comp2.x) {
    // comp1 在 comp2 左侧
    horizontalDistance = comp2.x - (comp1.x + comp1.width);
  } else if (comp2.x + comp2.width <= comp1.x) {
    // comp1 在 comp2 右侧
    horizontalDistance = comp1.x - (comp2.x + comp2.width);
  }

  // 计算垂直距离
  let verticalDistance = 0;
  if (comp1.y + comp1.height <= comp2.y) {
    // comp1 在 comp2 上方
    verticalDistance = comp2.y - (comp1.y + comp1.height);
  } else if (comp2.y + comp2.height <= comp1.y) {
    // comp1 在 comp2 下方
    verticalDistance = comp1.y - (comp2.y + comp2.height);
  }

  // 如果组件重叠，返回0
  if (horizontalDistance === 0 && verticalDistance === 0) {
    return 0;
  }

  // 返回最小距离（如果一个方向重叠，则返回另一个方向的距离）
  if (horizontalDistance === 0) return verticalDistance;
  if (verticalDistance === 0) return horizontalDistance;

  // 如果两个方向都有距离，返回较小的那个
  return Math.min(horizontalDistance, verticalDistance);
}

// 检查组件调整大小后是否需要重新布局
function shouldTriggerLayout(
  resizingComponent: ComponentItemModel,
  newPosition: Position,
  newSize: Size,
  allComponents: ComponentItemModel[],
  gap: number
): boolean {
  // 创建调整后的组件副本
  const resizedComponent = {
    ...resizingComponent,
    x: newPosition.x,
    y: newPosition.y,
    width: newSize.width,
    height: newSize.height
  };

  // 检查与其他组件的距离
  for (const otherComponent of allComponents) {
    if (otherComponent.id === resizingComponent.id) continue;

    const distance = getComponentDistance(resizedComponent, otherComponent);

    // 如果距离小于等于gap，需要触发布局调整
    if (distance <= gap) {
      return true;
    }
  }

  return false;
}



// 检查位置是否可用
export const validatePosition = (
  components: ComponentItemModel[],
  currentId: string,
  position: Position,
  size: Size,
  containerInfo: ContainerInfo,
  _gridConfig: GridConfig
): boolean => {
  const { width: containerWidth, height: containerHeight } = containerInfo

  // 检查边界
  if (position.x < 0 ||
    position.y < 0 ||
    position.x + size.width > containerWidth ||
    position.y + size.height > containerHeight) {
    return false
  }


  // 检查与其他组件的重叠
  for (const comp of components) {
    if (comp.id === currentId) continue

    // 计算重叠区域
    const overlapX = position.x < comp.x + comp.width && position.x + size.width > comp.x
    const overlapY = position.y < comp.y + comp.height && position.y + size.height > comp.y

    if (overlapX && overlapY) {
      return false
    }
  }

  return true
}

// 查找可用位置（基于瀑布流布局）
export function findAvailablePosition(
  components: ComponentItemModel[],
  newComponent: ComponentItemModel,
  containerInfo: ContainerInfo,
  gridConfig: GridConfig
): Position | null {
  const { width: containerWidth, height: containerHeight } = containerInfo
  const { gap } = gridConfig

  // 计算每列的宽度（24列固定）
  const columnWidth = (containerWidth - (COLUMNS - 1) * gap) / COLUMNS

  // 首先对组件进行自动填充
  autoFillComponentToGrid(newComponent, columnWidth, gap)

  // 如果组件宽度超过容器宽度，无法放置
  if (newComponent.width > containerWidth) {
    console.warn('组件宽度超过容器宽度')
    return null
  }

  // 模拟添加组件后的布局，检查是否会导致超出容器高度
  const testComponents = [...components, { ...newComponent, x: 0, y: 0 }]
  const layoutSuccess = reorganizeLayout(testComponents, containerInfo, gridConfig)

  if (!layoutSuccess) {
    console.warn('添加此组件会导致超出容器高度')
    return null
  }

  // 计算每列的当前高度
  const columnHeights: number[] = new Array(COLUMNS).fill(0)

  // 根据现有组件更新列高度
  for (const comp of components) {
    const startCol = Math.floor(comp.x / (columnWidth + gap))
    const spanCols = Math.ceil((comp.width + gap) / (columnWidth + gap))
    const endCol = Math.min(startCol + spanCols, COLUMNS)
    const compBottomY = comp.y + comp.height + gap

    for (let i = startCol; i < endCol; i++) {
      columnHeights[i] = Math.max(columnHeights[i] || 0, compBottomY)
    }
  }

  // 计算新组件占用的列数
  const spanCols = Math.ceil((newComponent.width + gap) / (columnWidth + gap))
  const actualSpanCols = Math.min(spanCols, COLUMNS)

  // 找到最佳放置位置（高度最低的连续列）
  let bestStartCol = 0
  let minHeight = Infinity

  for (let startCol = 0; startCol <= COLUMNS - actualSpanCols; startCol++) {
    let maxHeightInRange = 0
    for (let i = startCol; i < startCol + actualSpanCols; i++) {
      maxHeightInRange = Math.max(maxHeightInRange, columnHeights[i] || 0)
    }

    if (maxHeightInRange < minHeight) {
      minHeight = maxHeightInRange
      bestStartCol = startCol
    }
  }

  const newX = bestStartCol * (columnWidth + gap)
  const newY = minHeight

  // 检查是否超出容器高度
  if (newY + newComponent.height > containerHeight) {
    console.warn('位置超出容器高度')
    return null
  }

  return { x: parseFloat(newX.toFixed(2)), y: parseFloat(newY.toFixed(2)) }
}


// 检查是否可以添加组件（提前验证）
export function canAddComponent(
  components: ComponentItemModel[],
  newComponent: ComponentItemModel,
  containerInfo: ContainerInfo,
  gridConfig: GridConfig
): boolean {
  const testComponents = [...components, { ...newComponent, x: 0, y: 0 }]
  return reorganizeLayout(testComponents, containerInfo, gridConfig)
}

// 计算可用空间
export function calculateAvailableSpace(
  components: ComponentItemModel[],
  containerInfo: ContainerInfo,
  _gridConfig: GridConfig
) {
  const usedArea = components.reduce((total, comp) => {
    return total + (comp.width * comp.height)
  }, 0)

  const totalArea = containerInfo.width * containerInfo.height

  return {
    usedArea,
    totalArea,
    availableArea: totalArea - usedArea,
    utilization: ((usedArea / totalArea) * 100).toFixed(1) + '%'
  }
}

// 吸附到网格
export function snapToGrid(position: Position, gridConfig: GridConfig): Position {
  const { cellWidth, cellHeight, gap } = gridConfig
  const unitWidth = cellWidth + gap
  const unitHeight = cellHeight + gap

  return {
    x: parseFloat(((position.x / unitWidth) * unitWidth).toFixed(2)),
    y: parseFloat(((position.y / unitHeight) * unitHeight).toFixed(2))
  }
}

// 重新组织布局（瀑布流布局，固定24列）
export function reorganizeLayout(
  components: ComponentItemModel[],
  containerInfo: ContainerInfo,
  gridConfig: GridConfig,
  skipAutoFill: boolean = false,
  onlyOnSizeIncrease: boolean = false
): boolean {
  if (components.length === 0) return true

  const { gap } = gridConfig
  const containerWidth = containerInfo.width
  const containerHeight = containerInfo.height

  // 计算每列的宽度（24列固定）
  const columnWidth = (containerWidth - (COLUMNS - 1) * gap) / COLUMNS

  // 如果是尺寸减小的情况，只检查边界，不重新布局
  if (onlyOnSizeIncrease) {
    // 检查所有组件是否仍在容器范围内
    for (const comp of components) {
      if (comp.x + comp.width > containerWidth || comp.y + comp.height > containerHeight) {
        // 如果有组件超出边界，需要调整
        comp.x = Math.min(comp.x, containerWidth - comp.width)
        comp.y = Math.min(comp.y, containerHeight - comp.height)
        comp.x = Math.max(0, comp.x)
        comp.y = Math.max(0, comp.y)
      }
    }
    return true
  }

  // 记录每列的当前高度
  const columnHeights: number[] = new Array(COLUMNS).fill(0)

  for (const comp of components) {
    // 自动填充组件尺寸到栅格（可选）
    if (!skipAutoFill) {
      autoFillComponentToGrid(comp, columnWidth, gap)
    }

    // 计算组件占用的列数
    const spanCols = Math.ceil((comp.width + gap) / (columnWidth + gap))
    const actualSpanCols = Math.min(spanCols, COLUMNS)

    // 找到最佳放置位置（高度最低的连续列）
    let bestStartCol = 0
    let minHeight = Infinity

    for (let startCol = 0; startCol <= COLUMNS - actualSpanCols; startCol++) {
      // 计算这个位置的最大高度
      let maxHeightInRange = 0
      for (let i = startCol; i < startCol + actualSpanCols; i++) {
        maxHeightInRange = Math.max(maxHeightInRange, columnHeights[i] || 0)
      }

      // 如果这个位置的高度更低，选择这个位置
      if (maxHeightInRange < minHeight) {
        minHeight = maxHeightInRange
        bestStartCol = startCol
      }
    }

    // 计算组件的实际位置
    comp.x = parseFloat((bestStartCol * (columnWidth + gap)).toFixed(2))
    comp.y = parseFloat(minHeight.toFixed(2))

    // 检查是否超出容器高度
    if (comp.y + comp.height > containerHeight) {
      console.warn('组件超出容器高度，无法完成布局')
      return false // 布局失败
    }

    // 更新占用列的高度
    const newHeight = comp.y + comp.height + gap
    for (let i = bestStartCol; i < bestStartCol + actualSpanCols; i++) {
      columnHeights[i] = newHeight
    }
  }

  return true // 布局成功
}

// 基于24列栅格系统的组件自动填充
export function autoFillComponentToGrid(
  component: ComponentItemModel,
  columnWidth: number,
  gap: number
): void {
  // 确保最小尺寸
  const minWidth = component.minWidth || columnWidth
  const minHeight = component.minHeight || 60

  component.width = Math.max(component.width, minWidth)
  component.height = Math.max(component.height, minHeight)

  // 如果组件宽度未填满栅格，则进行填充
  // 计算组件应该占用的列数
  const requiredCols = Math.ceil((component.width + gap) / (columnWidth + gap))
  const actualCols = Math.min(requiredCols, COLUMNS)

  // 计算填充后的宽度
  const filledWidth = actualCols * columnWidth + (actualCols - 1) * gap

  // 更新组件宽度为填充后的宽度
  component.width = parseFloat(filledWidth.toFixed(2))
}

// 修改组件调整大小时也支持自动填充（基于24列栅格）
export function resizeComponentWithAutoFill(
  component: ComponentItemModel,
  newSize: Size,
  gridConfig: GridConfig,
  containerWidth?: number
): Size {
  const { gap } = gridConfig

  // 计算每列的宽度（24列固定）
  const columnWidth = containerWidth ?
    (containerWidth - (COLUMNS - 1) * gap) / COLUMNS :
    gridConfig.cellWidth

  // 确保最小尺寸
  const minWidth = component.minWidth || columnWidth
  const minHeight = component.minHeight || 60

  const actualWidth = Math.max(newSize.width, minWidth)
  const actualHeight = Math.max(newSize.height, minHeight)

  // 计算组件应该占用的列数
  const requiredCols = Math.ceil((actualWidth + gap) / (columnWidth + gap))
  const actualCols = Math.min(requiredCols, COLUMNS)

  // 计算填充后的宽度
  const filledWidth = actualCols * columnWidth + (actualCols - 1) * gap

  // 确保填充后的宽度不小于最小值
  const finalWidth = Math.max(filledWidth, minWidth)
  // 高度不进行栅格填充，保持用户设置的高度
  const finalHeight = Math.max(actualHeight, minHeight)

  return {
    width: parseFloat(finalWidth.toFixed(2)),
    height: parseFloat(finalHeight.toFixed(2))
  }
}

// 检查调整大小是否会影响其他组件，并返回需要更新的组件
export function getAffectedComponents(
  components: ComponentItemModel[],
  resizingComponent: ComponentItemModel,
  newPosition: Position,
  newSize: Size,
  containerInfo: ContainerInfo,
  gridConfig: GridConfig
): { affected: ComponentItemModel[]; canResize: boolean } {
  const affected: ComponentItemModel[] = []

  // 检查是否是尺寸增加
  const sizeIncreased = newSize.width > resizingComponent.width || newSize.height > resizingComponent.height

  // 如果尺寸增加，检查是否需要触发布局调整
  let needsLayoutAdjustment = false;
  if (sizeIncreased) {
    needsLayoutAdjustment = shouldTriggerLayout(
      resizingComponent,
      newPosition,
      newSize,
      components,
      gridConfig.gap
    );
  }

  // 创建临时组件列表，用于模拟调整后的状态
  const tempComponents = components.map(comp =>
    comp.id === resizingComponent.id
      ? { ...comp, ...newPosition, ...newSize }
      : { ...comp }
  )

  // 只有在需要布局调整时才进行重新布局
  if (needsLayoutAdjustment) {
    const layoutSuccess = reorganizeLayout(tempComponents, containerInfo, gridConfig, true, false)

    if (!layoutSuccess) {
      return { affected: [], canResize: false }
    }

    // 找出位置发生变化的组件
    components.forEach(comp => {
      if (comp.id !== resizingComponent.id) {
        const tempComp = tempComponents.find(tc => tc.id === comp.id)
        if (tempComp && (tempComp.x !== comp.x || tempComp.y !== comp.y)) {
          affected.push({ ...comp, x: tempComp.x, y: tempComp.y })
        }
      }
    })
  } else {
    // 不需要布局调整，只做边界检查
    const layoutSuccess = reorganizeLayout(tempComponents, containerInfo, gridConfig, true, true)

    if (!layoutSuccess) {
      return { affected: [], canResize: false }
    }
  }

  return { affected, canResize: true }
}

// 智能验证位置（考虑动态布局）
export function validatePositionWithLayout(
  components: ComponentItemModel[],
  currentId: string,
  position: Position,
  size: Size,
  containerInfo: ContainerInfo,
  gridConfig: GridConfig
): { valid: boolean; affectedComponents: ComponentItemModel[] } {
  const { width: containerWidth, height: containerHeight } = containerInfo

  // 基础边界检查
  if (position.x < 0 ||
    position.y < 0 ||
    position.x + size.width > containerWidth ||
    position.y + size.height > containerHeight) {
    return { valid: false, affectedComponents: [] }
  }

  // 获取受影响的组件
  const currentComponent = components.find(c => c.id === currentId)
  if (!currentComponent) {
    return { valid: false, affectedComponents: [] }
  }

  const { affected, canResize } = getAffectedComponents(
    components,
    currentComponent,
    position,
    size,
    containerInfo,
    gridConfig
  )

  return { valid: canResize, affectedComponents: affected }
}