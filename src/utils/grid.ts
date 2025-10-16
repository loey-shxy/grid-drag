import type { ComponentItemModel, GridConfig, Position, Size, ContainerInfo } from "../types/layout";

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

    if (position.x < comp.x + comp.width 
      && position.x + size.width > comp.x 
      && position.y < comp.y + comp.height 
      && position.y + size.height > comp.y) {
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
  const { width: containerWidth } = containerInfo
  const { cellWidth, cellHeight, gap } = gridConfig

    // 从左上角开始搜索
    for (let y = 0; y < containerInfo.height; y += cellHeight + gap) {
      for (let x = 0; x <= containerWidth - newComponent.width; x += cellWidth + gap) {
        const position = { x, y }
        
        if (validatePosition(components, '', position, newComponent, containerInfo, gridConfig)) {
          return position
        }
      }
    }
  
    // 如果找不到，尝试紧凑搜索
  for (let y = 0; y < containerInfo.height; y += 10) {
    for (let x = 0; x <= containerWidth - newComponent.width; x += 10) {
      const position = { x, y }
      
      if (validatePosition(components, '', position, newComponent, containerInfo, gridConfig)) {
        return position
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
  
  const sortedComponents = [...components].sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y
    return a.x - b.x
  })
  
  const { cellWidth, gap } = gridConfig
  const containerWidth = containerInfo.width - gap * 2 // 减去 padding
  
  let currentX = gap
  let currentY = gap
  let maxHeightInRow = 0
  
  for (const comp of sortedComponents) {
    // 检查当前行是否能放下组件
    if (currentX + comp.width > containerWidth) {
      // 换行
      currentY += maxHeightInRow + gap
      currentX = gap
      maxHeightInRow = 0
    }
    
    // 更新组件位置
    comp.x = currentX
    comp.y = currentY
    
    // 更新行信息
    currentX += comp.width + gap
    maxHeightInRow = Math.max(maxHeightInRow, comp.height)
  }
}