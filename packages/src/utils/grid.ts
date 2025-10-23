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

// 查找可用位置（不重新布局，自动向后排列）
export function findAvailablePosition(
  components: ComponentItemModel[],
  newComponent: ComponentItemModel,
  containerInfo: ContainerInfo,
  gridConfig: GridConfig
): Position | null {
  const { width: containerWidth, height: containerHeight } = containerInfo
  const { gap, cellWidth } = gridConfig


  console.log(`🔍 查找位置 - 容器宽度: ${containerWidth}, 列宽: ${cellWidth}, 间距: ${gap}`)
  console.log(`📦 原始组件: ${newComponent.name}, 宽度: ${newComponent.width}, 高度: ${newComponent.height}`)

  // 首先对组件进行自动填充
  autoFillComponentToGrid(newComponent, gridConfig)

  console.log(`📦 填充后组件: ${newComponent.name}, 宽度: ${newComponent.width}, 高度: ${newComponent.height}`)

  // 如果组件宽度超过容器宽度，无法放置
  if (newComponent.width > containerWidth) {
    console.warn('组件宽度超过容器宽度')
    return null
  }

  // 计算组件占用的列数（组件宽度已经包含了间距，不需要再加gap）
  const spanCols = Math.ceil(newComponent.width / (cellWidth + gap))
  const actualSpanCols = Math.min(spanCols, COLUMNS)

  console.log(`📏 组件占用列数: ${spanCols} -> ${actualSpanCols}`)

  // 计算每列的当前高度
  const columnHeights: number[] = new Array(COLUMNS).fill(0)

  // 根据现有组件更新列高度
  for (const comp of components) {
    // 计算组件起始列：x坐标除以(列宽+间距)
    const startCol = Math.floor(comp.x / (cellWidth + gap))
    // 计算组件占用的列数（组件宽度已经包含了间距）
    const compSpanCols = Math.ceil(comp.width / (cellWidth + gap))
    const endCol = Math.min(startCol + compSpanCols, COLUMNS)
    const compBottomY = comp.y + comp.height + gap

    console.log(`📍 现有组件: ${comp.name}, 位置: (${comp.x}, ${comp.y}), 尺寸: ${comp.width}x${comp.height}`)
    console.log(`📍 占用列: ${startCol} -> ${endCol} (${compSpanCols}列), 底部Y: ${compBottomY}`)

    for (let i = startCol; i < endCol; i++) {
      if (i >= 0 && i < COLUMNS) {
        columnHeights[i] = Math.max(columnHeights[i] || 0, compBottomY)
      }
    }
  }

  console.log(`📊 列高度数组:`, columnHeights.slice(0, 12)) // 只显示前12列

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

  // 计算实际位置：列索引 * (列宽 + 间距)
  const newX = bestStartCol * (cellWidth + gap)
  const newY = minHeight

  console.log(`🎯 最佳位置: 列${bestStartCol}, 高度${minHeight} -> 坐标(${newX}, ${newY})`)

  // 检查是否超出容器高度
  if (newY + newComponent.height > containerHeight) {
    console.warn(`❌ 位置超出容器高度: ${newY + newComponent.height} > ${containerHeight}`)
    return null
  }

  // 验证新位置不与现有组件重叠
  const newPosition = { x: parseFloat(newX.toFixed(2)), y: parseFloat(newY.toFixed(2)) }
  const newSize = { width: newComponent.width, height: newComponent.height }

  for (const existingComp of components) {
    if (hasOverlap(
      newPosition,
      newSize,
      { x: existingComp.x, y: existingComp.y },
      { width: existingComp.width, height: existingComp.height }
    )) {
      console.warn('新组件位置与现有组件重叠')
      return null
    }
  }

  return newPosition
}

// 智能高度吸附（只在与上面紧邻组件距离小于等于gap时才吸附）
export function snapToColumnGridWithSmartHeight(
  position: Position,
  componentSize: Size,
  components: ComponentItemModel[],
  currentId: string,
  containerInfo: ContainerInfo,
  gridConfig: GridConfig
): Position {
  const { width: containerWidth, height: containerHeight } = containerInfo
  const { gap } = gridConfig

  // 计算每列的宽度（24列固定）
  const columnWidth = (containerWidth - (COLUMNS - 1) * gap) / COLUMNS
  const unitWidth = columnWidth + gap

  // 计算最近的列位置
  let nearestColumn = Math.round(position.x / unitWidth)

  // 计算组件占用的列数（组件宽度已经包含了间距）
  const componentCols = Math.ceil(componentSize.width / unitWidth)

  // 确保组件不会超出右边界
  const maxColumn = COLUMNS - componentCols
  nearestColumn = Math.max(0, Math.min(nearestColumn, maxColumn))

  // 计算吸附后的X坐标：列索引 * (列宽 + 间距)
  const snappedX = nearestColumn * unitWidth

  // 智能Y坐标处理
  let snappedY = position.y

  // 查找在当前组件上方且有水平重叠的组件
  const candidateComponents = components.filter(comp => {
    if (comp.id === currentId) return false

    // 检查水平重叠（使用吸附后的X坐标）
    const horizontalOverlap = snappedX < comp.x + comp.width && snappedX + componentSize.width > comp.x

    // 检查是否在上方（组件底部在当前位置上方）
    const isAbove = comp.y + comp.height <= position.y

    return horizontalOverlap && isAbove
  })

  if (candidateComponents.length > 0) {
    // 找到最接近的上方组件（距离当前位置最近的）
    let closestComponent: ComponentItemModel | null = null
    let minDistance = Infinity

    for (const comp of candidateComponents) {
      const distance = position.y - (comp.y + comp.height)
      if (distance >= 0 && distance < minDistance) {
        minDistance = distance
        closestComponent = comp
      }
    }

    // 如果距离小于等于gap，则吸附到该组件下方并留出gap距离
    if (closestComponent && minDistance <= gap) {
      snappedY = closestComponent.y + closestComponent.height + gap
      console.log(`高度吸附: 距离=${minDistance}, 吸附到Y=${snappedY}`)
    } else {
      console.log(`不进行高度吸附: 距离=${minDistance} > gap=${gap}`)
    }
  }

  // 确保组件不会超出下边界
  if (snappedY + componentSize.height > containerHeight) {
    snappedY = containerHeight - componentSize.height
  }

  // 确保Y坐标不为负数
  snappedY = Math.max(0, snappedY)

  return {
    x: parseFloat(snappedX.toFixed(2)),
    y: parseFloat(snappedY.toFixed(2))
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
      autoFillComponentToGrid(comp, gridConfig)
    }

    // 计算组件占用的列数（组件宽度已经包含了间距）
    const spanCols = Math.ceil(comp.width / (columnWidth + gap))
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

    // 计算组件的实际位置：列索引 * (列宽 + 间距)
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
  gridConfig: GridConfig
): void {
  // 确保最小尺寸
  const { cellWidth, gap } = gridConfig
  const minWidth = component.minWidth || cellWidth
  const minHeight = component.minHeight || 60

  component.width = Math.max(component.width, minWidth)
  component.height = Math.max(component.height, minHeight)

  // 如果组件宽度未填满栅格，则进行填充
  // 计算组件应该占用的列数
  const requiredCols = Math.ceil(component.width / (cellWidth + gap))
  const actualCols = Math.min(requiredCols, COLUMNS)

  // 计算填充后的宽度
  const filledWidth = actualCols * cellWidth + (actualCols - 1) * gap

  // 更新组件宽度为填充后的宽度
  component.width = parseFloat(filledWidth.toFixed(2))
}

// 修改组件调整大小时也支持自动填充（基于24列栅格）
export function resizeComponentWithAutoFill(
  component: ComponentItemModel,
  newSize: Size,
  gridConfig: GridConfig,
): Size {
  const { gap, cellWidth } = gridConfig

  // 确保最小尺寸
  const minWidth = component.minWidth || cellWidth
  const minHeight = component.minHeight || 60

  const actualWidth = Math.max(newSize.width, minWidth)
  const actualHeight = Math.max(newSize.height, minHeight)

  // 计算组件应该占用的列数
  const requiredCols = Math.ceil(actualWidth / (cellWidth + gap))
  const actualCols = Math.min(requiredCols, COLUMNS)

  // 计算填充后的宽度
  const filledWidth = actualCols * cellWidth + (actualCols - 1) * gap

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

// 严格检查组件重叠
function hasOverlap(
  pos1: Position,
  size1: Size,
  pos2: Position,
  size2: Size
): boolean {
  const overlapX = pos1.x < pos2.x + size2.width && pos1.x + size1.width > pos2.x
  const overlapY = pos1.y < pos2.y + size2.height && pos1.y + size1.height > pos2.y
  return overlapX && overlapY
}

// 智能验证拖拽位置（严格防止重叠）
export function validateDragPosition(
  components: ComponentItemModel[],
  currentId: string,
  newPosition: Position,
  containerInfo: ContainerInfo,
  gridConfig: GridConfig
): { valid: boolean; affectedComponents: ComponentItemModel[]; finalPosition: Position } {
  const { width: containerWidth, height: containerHeight } = containerInfo

  // 获取当前组件
  const currentComponent = components.find(c => c.id === currentId)
  if (!currentComponent) {
    return { valid: false, affectedComponents: [], finalPosition: newPosition }
  }

  const currentSize = { width: currentComponent.width, height: currentComponent.height }

  // 使用智能高度吸附，只在与上面紧邻组件距离小于等于gap时才吸附
  const snappedPosition = snapToColumnGridWithSmartHeight(
    newPosition,
    currentSize,
    components,
    currentId,
    containerInfo,
    gridConfig
  )

  // 基础边界检查
  if (snappedPosition.x < 0 ||
    snappedPosition.y < 0 ||
    snappedPosition.x + currentSize.width > containerWidth ||
    snappedPosition.y + currentSize.height > containerHeight) {
    return { valid: false, affectedComponents: [], finalPosition: snappedPosition }
  }

  // 严格检查是否与其他组件重叠
  for (const otherComponent of components) {
    if (otherComponent.id === currentId) continue

    if (hasOverlap(
      snappedPosition,
      currentSize,
      { x: otherComponent.x, y: otherComponent.y },
      { width: otherComponent.width, height: otherComponent.height }
    )) {
      // 发现重叠，拒绝此位置
      return { valid: false, affectedComponents: [], finalPosition: snappedPosition }
    }
  }

  // 检查是否需要触发布局调整（仅当距离很近时）
  const needsLayoutAdjustment = shouldTriggerLayout(
    currentComponent,
    snappedPosition,
    currentSize,
    components,
    gridConfig.gap
  )

  if (!needsLayoutAdjustment) {
    // 没有重叠且不需要布局调整，可以自由拖拽
    return { valid: true, affectedComponents: [], finalPosition: snappedPosition }
  }

  // 需要布局调整，但要确保调整后不会产生重叠
  const draggedComponent = {
    ...currentComponent,
    x: snappedPosition.x,
    y: snappedPosition.y
  }

  const tempComponents = components.map(comp =>
    comp.id === currentId ? draggedComponent : { ...comp }
  )

  const layoutSuccess = reorganizeLayout(tempComponents, containerInfo, gridConfig, true, false)

  if (!layoutSuccess) {
    return { valid: false, affectedComponents: [], finalPosition: snappedPosition }
  }

  // 验证布局后是否有重叠
  for (let i = 0; i < tempComponents.length; i++) {
    for (let j = i + 1; j < tempComponents.length; j++) {
      const comp1 = tempComponents[i]
      const comp2 = tempComponents[j]

      if (comp1 && comp2 && hasOverlap(
        { x: comp1.x, y: comp1.y },
        { width: comp1.width, height: comp1.height },
        { x: comp2.x, y: comp2.y },
        { width: comp2.width, height: comp2.height }
      )) {
        // 布局后仍有重叠，拒绝此操作
        return { valid: false, affectedComponents: [], finalPosition: snappedPosition }
      }
    }
  }

  // 找出位置发生变化的组件
  const affected: ComponentItemModel[] = []
  components.forEach(comp => {
    if (comp.id !== currentId) {
      const tempComp = tempComponents.find(tc => tc.id === comp.id)
      if (tempComp && (tempComp.x !== comp.x || tempComp.y !== comp.y)) {
        affected.push({ ...comp, x: tempComp.x, y: tempComp.y })
      }
    }
  })

  return { valid: true, affectedComponents: affected, finalPosition: snappedPosition }
}