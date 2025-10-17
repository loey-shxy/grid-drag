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

// 计算组件应该占据的网格高度
function calculateGridHeight(pixelHeight: number, cellHeight: number, gap: number): number {
  if (pixelHeight <= 0) return 1
  
  const unitHeight = cellHeight + gap
  // 计算需要多少个完整的网格单元
  let gridCount = Math.floor(pixelHeight / unitHeight)
  
  // 如果剩余空间大于0，需要额外一个网格
  const remainder = pixelHeight % unitHeight
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

// 计算填充后的像素高度
function calculateFilledHeight(gridHeight: number, cellHeight: number, gap: number): number {
  const filledHeight = gridHeight * cellHeight + (gridHeight - 1) * gap
  return parseFloat(filledHeight.toFixed(2)) // 保留2位小数
}

// 像素坐标转网格坐标
export function pixelsToGrid(pixelPos: Position, gridConfig: GridConfig): Position {
  const { cellWidth, cellHeight, gap } = gridConfig
  const unitWidth = cellWidth + gap
  const unitHeight = cellHeight + gap
  
  return {
    x: Math.floor(pixelPos.x / unitWidth),
    y: Math.floor(pixelPos.y / unitHeight)
  }
}

// 网格坐标转像素坐标
export function gridToPixels(gridPos: Position, gridConfig: GridConfig): Position {
  const { cellWidth, cellHeight, gap } = gridConfig
  const unitWidth = cellWidth + gap
  const unitHeight = cellHeight + gap
  
  return {
    x: gridPos.x * unitWidth,
    y: gridPos.y * unitHeight
  }
}

// 计算容器需要的高度
export function calculateContainerHeight(
  components: ComponentItemModel[], 
  gridConfig: GridConfig,
  containerHeight: number
): number {
  if (components.length === 0) return containerHeight
  
  let maxBottom = 0
  components.forEach(comp => {
    const bottom = comp.y + comp.height
    if (bottom > maxBottom) {
      maxBottom = bottom
    }
  })
  
  // 不允许超出容器高度，如果超出则返回容器高度
  return Math.min(maxBottom + gridConfig.gap, containerHeight)
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

// export const calculateGridPosition = (
//   clientX: number,
//   clientY: number,
//   container: HTMLElement,
//   gridConfig: GridConfig
// ): Position => {
//   const rect = container.getBoundingClientRect()

//   const x = Math.floor((clientX - rect.left) / (gridConfig.cellSize! + gridConfig.gap))
//   const y = Math.floor((clientY - rect.top) / (gridConfig.cellSize! + gridConfig.gap))
  
//   return {
//     x: Math.max(0, Math.min(x, gridConfig.columns - 1)),
//     y: Math.max(0, Math.min(y, gridConfig.rows - 1))
//   }
// }

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

export function canPlaceComponent(
  components: ComponentItemModel[],
  targetComponent: ComponentItemModel,
  targetPosition: Position,
  containerInfo: ContainerInfo,
  gridConfig: GridConfig
): boolean {
  return validatePosition(
    components.filter(c => c.id !== targetComponent.id),
    '',
    targetPosition,
    targetComponent,
    containerInfo,
    gridConfig
  )
}

// 重新组织布局（基于像素的流式布局）
export function reorganizeLayout(
  components: ComponentItemModel[], 
  containerInfo: ContainerInfo, 
  gridConfig: GridConfig
): boolean {
  if (components.length === 0) return true
  
  const { gap, cellWidth, cellHeight } = gridConfig
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
  const { cellWidth, cellHeight, gap } = gridConfig
  
  // 确保最小尺寸
  const minWidth = component.minWidth || 100
  const minHeight = component.minHeight || 60

  component.width = Math.max(component.width, minWidth)
  component.height = Math.max(component.height, minHeight)

  // 计算当前网格数
  const currentGridWidth = calculateGridWidth(component.width, cellWidth, gap)
  const currentGridHeight = calculateGridHeight(component.height, cellHeight, gap)
  
  // 计算填充后的尺寸
  const filledWidth = calculateFilledWidth(currentGridWidth, cellWidth, gap)
  const filledHeight = calculateFilledHeight(currentGridHeight, cellHeight, gap)
  
  // 更新组件尺寸
  component.width = filledWidth
  component.height = filledHeight
}

// 修改组件调整大小时也支持自动填充
export function resizeComponentWithAutoFill(
  component: ComponentItemModel,
  newSize: Size,
  gridConfig: GridConfig
): Size {
  const { cellWidth, cellHeight, gap } = gridConfig
  
  // 确保最小尺寸
  const minWidth = component.minWidth || 100
  const minHeight = component.minHeight || 60

  const actualWidth = Math.max(newSize.width, minWidth)
  const actualHeight = Math.max(newSize.height, minHeight)

  // 计算新的网格数
  const gridWidth = calculateGridWidth(actualWidth, cellWidth, gap)
  const gridHeight = calculateGridHeight(actualHeight, cellHeight, gap)
  
  // 计算填充后的尺寸
  const filledWidth = calculateFilledWidth(gridWidth, cellWidth, gap)
  const filledHeight = calculateFilledHeight(gridHeight, cellHeight, gap)
  
  return {
    width: filledWidth,
    height: filledHeight
  }
}

// 获取当前布局信息
export function getLayoutInfo(
  components: ComponentItemModel[],
  containerInfo: ContainerInfo,
  gridConfig: GridConfig
) {
  let currentX = 0
  let currentY = 0
  let currentRowHeight = 0
  const rows: number[] = []
  
  for (const comp of components) {
    if (currentX + comp.width > containerInfo.width) {
      rows.push(currentRowHeight)
      currentY += currentRowHeight + gridConfig.gap
      currentX = 0
      currentRowHeight = 0
    }
    
    currentRowHeight = Math.max(currentRowHeight, comp.height)
    currentX += comp.width + gridConfig.gap
  }
  
  if (currentRowHeight > 0) {
    rows.push(currentRowHeight)
  }
  
  const totalHeight = rows.reduce((sum, height, index) => {
    return sum + height + (index > 0 ? gridConfig.gap : 0)
  }, 0)
  
  return {
    rows,
    totalHeight,
    willOverflow: totalHeight > containerInfo.height,
    currentPosition: { x: currentX, y: currentY },
    currentRowHeight
  }
}