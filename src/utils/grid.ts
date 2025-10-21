import type { ComponentItemModel, GridConfig, Position, Size, ContainerInfo } from "../types/layout";

// 计算组件应该占据的网格宽度
function calculateGridWidth(pixelWidth: number, cellWidth: number, gap: number): number {
  if (pixelWidth <= 0) return 1
  
  const unitWidth = cellWidth + gap
  // 计算需要多少个完整的网格单元
  let gridCount = Math.floor(pixelWidth / unitWidth)
  
  // 如果剩余空间大于0，需要额外一个网格
  const remainder = pixelWidth % unitWidth
  if (remainder > 0) {
    gridCount += 1
  }
  
  return Math.max(1, gridCount)
}

// 计算填充后的像素宽度
function calculateFilledWidth(gridWidth: number, cellWidth: number, gap: number): number {
  const filledWidth = gridWidth * cellWidth + (gridWidth - 1) * gap
  return parseFloat(filledWidth.toFixed(2)) // 保留2位小数
}

// 检查位置是否可用
export const validatePosition = (
  components: ComponentItemModel[],
  currentId: string,
  position: Position,
  size: Size,
  containerInfo: ContainerInfo,
  gridConfig: GridConfig
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

// 查找可用位置
export function findAvailablePosition(
  components: ComponentItemModel[],
  newComponent: ComponentItemModel,
  containerInfo: ContainerInfo,
  gridConfig: GridConfig
): Position | null {
  const { width: containerWidth, height: containerHeight } = containerInfo
  const { gap } = gridConfig

   // 首先对组件进行自动填充
   autoFillComponent(newComponent, gridConfig)

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

  // 查找实际的可用位置（使用流式布局算法）
  let currentX = 0
  let currentY = 0
  let currentRowHeight = 0

   // 先布局现有组件，找到最后的位置
  for (const comp of components) {
    if (currentX + comp.width > containerWidth) {
      currentY += currentRowHeight + gap
      currentX = 0
      currentRowHeight = 0
    }
    
    // 记录当前行高
    currentRowHeight = Math.max(currentRowHeight, comp.height)
    currentX += comp.width + gap
  }
  
  // 检查当前位置是否能放下新组件
  if (currentX + newComponent.width > containerWidth) {
    // 需要换行
    currentY += currentRowHeight + gap
    currentX = 0
    currentRowHeight = newComponent.height
  } else {
    // 当前行可以放下
    currentRowHeight = Math.max(currentRowHeight, newComponent.height)
  }
  
  // 检查是否超出容器高度
  if (currentY + newComponent.height > containerHeight) {
    console.warn('位置超出容器高度')
    return null
  }
  
  return { x: currentX, y: currentY }
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
  gridConfig: GridConfig
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
    x: Math.round(position.x / unitWidth) * unitWidth,
    y: Math.round(position.y / unitHeight) * unitHeight
  }
}

// 重新组织布局（基于像素的流式布局）
export function reorganizeLayout(
  components: ComponentItemModel[], 
  containerInfo: ContainerInfo, 
  gridConfig: GridConfig
): boolean {
  if (components.length === 0) return true
  
  const { gap } = gridConfig
  const containerWidth = containerInfo.width // 减去 padding
  const containerHeight = containerInfo.height
  
  let currentX = 0
  let currentY = 0
  const rowHeights: number[] = [] // 记录每行的固定高度
  
  for (const comp of components) {
     // 自动填充组件尺寸
    autoFillComponent(comp, gridConfig)
    
    // 检查当前行是否能放下组件
    if (currentX + comp.width > containerWidth) {
      // 换行，新行顶部距离上一行底部固定10px
      currentY += (rowHeights[rowHeights.length - 1] || 0) + gap
      currentX = 0
    }

     // 检查是否超出容器高度
     if (currentY + comp.height > containerHeight) {
      console.warn('组件超出容器高度，无法完成布局')
      return false // 布局失败
    }

    // 更新组件位置
    comp.x = currentX
    comp.y = currentY
    
    // 如果是当前行的第一个组件，记录行高
    if (currentX === 0) {
      rowHeights.push(comp.height)
    } else {
      // 更新当前行高为最大组件高度
      const currentRowIndex = rowHeights.length - 1
      rowHeights[currentRowIndex] = Math.max(rowHeights[currentRowIndex]!, comp.height)
    }
    
    // 更新行内位置
    currentX += comp.width + gap
  }
  
  return true // 布局成功
}

// 添加一个专门用于调整单个组件填充的函数
export function autoFillComponent(component: ComponentItemModel, gridConfig: GridConfig): void {
  const { cellWidth, gap } = gridConfig
  
  // 确保最小尺寸
  const minWidth = component.minWidth || 100
  const minHeight = component.minHeight || 60

  component.width = Math.max(component.width, minWidth)
  component.height = Math.max(component.height, minHeight)

  // 计算当前网格数
  const currentGridWidth = calculateGridWidth(component.width, cellWidth, gap)
  const filledWidth = calculateFilledWidth(currentGridWidth, cellWidth, gap)
  
  // 更新组件尺寸
  component.width = filledWidth
}

// 修改组件调整大小时也支持自动填充
export function resizeComponentWithAutoFill(
  component: ComponentItemModel,
  newSize: Size,
  gridConfig: GridConfig
): Size {
  const { cellWidth, gap } = gridConfig
  
  // 确保最小尺寸
  const minWidth = component.minWidth || 100
  const minHeight = component.minHeight || 60

  const actualWidth = Math.max(newSize.width, minWidth)
  const actualHeight = Math.max(newSize.height, minHeight)

  // 计算新的网格数
  const gridWidth = calculateGridWidth(actualWidth, cellWidth, gap)
  const filledWidth = calculateFilledWidth(gridWidth, cellWidth, gap)

  // 确保填充后的宽度不小于最小值
  const finalWidth = Math.max(filledWidth, minWidth)
  // 高度保持不变，不进行栅格填充
  const finalHeight = Math.max(actualHeight, minHeight)

  return {
    width: finalWidth,
    height: finalHeight
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
  
  // 创建临时组件列表，用于模拟调整后的状态
  const tempComponents = components.map(comp => 
    comp.id === resizingComponent.id 
      ? { ...comp, ...newPosition, ...newSize }
      : { ...comp }
  )
  
  // 重新布局临时组件
  const layoutSuccess = reorganizeLayout(tempComponents, containerInfo, gridConfig)
  
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