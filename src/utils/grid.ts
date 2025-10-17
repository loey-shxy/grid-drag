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
export function calculateContainerHeight(components: ComponentItemModel[], gridConfig: GridConfig): number {
  if (components.length === 0) return 600 // 默认高度
  
  let maxBottom = 0
  components.forEach(comp => {
    const bottom = comp.y + comp.height
    if (bottom > maxBottom) {
      maxBottom = bottom
    }
  })
  
  // 添加一些边距
  return Math.max(maxBottom + 100, 600)
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
  const { cellWidth, cellHeight, gap } = gridConfig

   // 首先对组件进行自动填充
   autoFillComponent(newComponent, gridConfig)

  // 从左上角开始搜索
  for (let y = 0; y < containerHeight - newComponent.height; y += cellHeight + gap) {
    for (let x = 0; x <= containerWidth - newComponent.width; x += cellWidth + gap) {
      const position = { x, y }
      // const filledSize = { width: filledWidth, height: filledHeight }
      
      if (validatePosition(components, '', position, newComponent, containerInfo, gridConfig)) {
        return position
      }
    }
  }
  
  /// 如果找不到合适位置，尝试调整组件尺寸
  const minWidth = newComponent.minWidth || 100
  const minHeight = newComponent.minHeight || 60
  
  // 计算最小网格数
  const minGridWidth = calculateGridWidth(minWidth, cellWidth, gap)
  const minGridHeight = calculateGridHeight(minHeight, cellHeight, gap)
  
  console.log('尝试调整尺寸, 最小网格:', minGridWidth, '×', minGridHeight)
  
  // 从最大网格数开始尝试，逐渐减小
  const maxGridWidth = Math.floor(containerWidth / (cellWidth + gap))
  const maxGridHeight = Math.floor(containerHeight / (cellHeight + gap))

  for (let gridH = maxGridHeight; gridH >= minGridHeight; gridH--) {
    for (let gridW = maxGridWidth; gridW >= minGridWidth; gridW--) {
      const testWidth = calculateFilledWidth(gridW, cellWidth, gap)
      const testHeight = calculateFilledHeight(gridH, cellHeight, gap)
      
      // 检查尺寸是否有效
      if (testWidth > containerWidth || testHeight > containerHeight) {
        continue
      }
      
      for (let y = 0; y <= containerHeight - testHeight; y += cellHeight + gap) {
        for (let x = 0; x <= containerWidth - testWidth; x += cellWidth + gap) {
          const position = { x, y }
          const testComponent = { ...newComponent, width: testWidth, height: testHeight }
          
          if (validatePosition(components, '', position, testComponent, containerInfo, gridConfig)) {
            console.log('调整后找到位置:', position, '尺寸:', testWidth, '×', testHeight)
            newComponent.width = testWidth
            newComponent.height = testHeight
            return position
          }
        }
      }
    }
  }

  return null
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
): void {
  if (components.length === 0) return
  
  const { gap, cellWidth, cellHeight } = gridConfig
  const containerWidth = containerInfo.width // 减去 padding
  
  let currentX = 0
  let currentY = 0
  let maxHeightInRow = 0
  
  for (const comp of components) {
     // 计算组件应该占据的网格数并填充
     const gridWidth = calculateGridWidth(comp.width, cellWidth, gap)
     const gridHeight = calculateGridHeight(comp.height, cellHeight, gap)
     
     const filledWidth = calculateFilledWidth(gridWidth, cellWidth, gap)
     const filledHeight = calculateFilledHeight(gridHeight, cellHeight, gap)
     
     // 更新组件尺寸为填充后的尺寸
     comp.width = filledWidth
     comp.height = filledHeight

    // 检查当前行是否能放下组件
    if (currentX + filledWidth > containerWidth) {
      // 换行
      currentY += maxHeightInRow + gap
      currentX = 0
      maxHeightInRow = 0
    }
    
    // 更新组件位置
    comp.x = currentX
    comp.y = currentY
    
    // 更新行信息
    currentX += filledWidth + gap
    maxHeightInRow = Math.max(maxHeightInRow, filledHeight)
  }
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
  
  console.log(`自动填充: ${actualWidth}×${actualHeight} -> ${gridWidth}×${gridHeight}网格 -> ${filledWidth}×${filledHeight}px`)

  return {
    width: filledWidth,
    height: filledHeight
  }
}