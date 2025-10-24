<template>
  <div class="gridster-item" :class="{ resizing: isResizing }" :style="componentStyle" draggable="true"
    @dragstart="onDragStart" @drag="onDrag" @dragend="onDragEnd">

    <slot></slot>

    <!-- 调整手柄 -->
    <div class="resize-overlay">
      <div class="edge top" @mousedown="onEdgeMouseDown('top', $event)"></div>
      <div class="edge right" @mousedown="onEdgeMouseDown('right', $event)"></div>
      <div class="edge bottom" @mousedown="onEdgeMouseDown('bottom', $event)"></div>
      <div class="edge left" @mousedown="onEdgeMouseDown('left', $event)"></div>
      <div class="corner top-left" @mousedown="onCornerMouseDown('top-left', $event)"></div>
      <div class="corner top-right" @mousedown="onCornerMouseDown('top-right', $event)"></div>
      <div class="corner bottom-left" @mousedown="onCornerMouseDown('bottom-left', $event)"></div>
      <div class="corner bottom-right" @mousedown="onCornerMouseDown('bottom-right', $event)"></div>
    </div>

    <icon-delete :size="16" class="remove-btn" @click="$emit('remove', component.id)" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ComponentItemModel, GridConfig, Position, Size, ContainerInfo } from '../types/layout';
import { resizeComponentWithAutoFill, handleLeftResize } from '../utils/grid'
import { MIN_HEIGHT, MIN_WIDTH } from '../utils/constant';

interface Props {
  component: ComponentItemModel
  gridConfig: GridConfig
  containerInfo: ContainerInfo
  allComponents?: ComponentItemModel[] // 添加所有组件列表
}

const props = defineProps<Props>()
const emit = defineEmits<{
  resize: [id: string, size: Size & Partial<Position> & { resizeType?: string }]
  drag: [id: string, position: Position]
  remove: [id: string]
}>()

const isDragging = ref(false)
const isResizing = ref(false)
const currentResizeType = ref<string>('') // 'edge' or 'corner' + direction
const dragStartPosition = ref<Position>({ x: 0, y: 0 })
const dragOffset = ref<Position>({ x: 0, y: 0 })

// 计算组件样式
const componentStyle = computed((): any => {
  return {
    position: 'absolute',
    left: `${props.component.x}px`,
    top: `${props.component.y}px`,
    width: `${props.component.width}px`,
    height: `${props.component.height}px`,
    zIndex: isDragging.value || isResizing.value ? MIN_WIDTH : 1,
    cursor: isResizing.value ? getResizeCursor(currentResizeType.value) : 'move'
  }
})

// 获取调整时的光标样式
const getResizeCursor = (type: string) => {
  const cursorMap: { [key: string]: string } = {
    'top': 'n-resize',
    'right': 'e-resize',
    'bottom': 's-resize',
    'left': 'w-resize',
    'top-left': 'nw-resize',
    'top-right': 'ne-resize',
    'bottom-left': 'sw-resize',
    'bottom-right': 'se-resize'
  }
  return cursorMap[type] || 'move'
}

// 边缘拖拽调整
const onEdgeMouseDown = (edge: string, e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()

  onResizeStart(edge, e)
}

// 角落拖拽调整
const onCornerMouseDown = (corner: string, e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()

  onResizeStart(corner, e)
}

const onDragStart = (e: DragEvent) => {
  isDragging.value = true;

  e.dataTransfer?.setData('text/plain', props.component.id);
  e.dataTransfer!.effectAllowed = 'move'

  // 设置拖拽预览
  const dragImage = e.currentTarget as HTMLElement
  e.dataTransfer?.setDragImage(dragImage, 0, 0)


  // 记录拖拽起始位置和鼠标偏移
  const rect = dragImage.getBoundingClientRect()
  dragStartPosition.value = {
    x: props.component.x,
    y: props.component.y
  }
  dragOffset.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
}

// 添加拖拽过程中的实时位置更新
const onDrag = (e: DragEvent) => {
  if (!isDragging.value) return

  // 计算实时拖拽位置
  const containerRect = (e.currentTarget as HTMLElement).parentElement?.getBoundingClientRect()

  if (!containerRect) return

  // 计算在容器内的位置
  const pixelX = e.clientX - containerRect.left - dragOffset.value.x
  const pixelY = e.clientY - containerRect.top - dragOffset.value.y

  // 发射 drag 事件，让父组件处理位置更新
  emit('drag', props.component.id, { x: pixelX, y: pixelY })
}


const onDragEnd = () => {
  isDragging.value = false
  dragStartPosition.value = { x: 0, y: 0 }
  dragOffset.value = { x: 0, y: 0 }
}

// 获取其他组件列表（排除当前组件）
const getOtherComponents = () => {
  if (!props.allComponents) return []
  return props.allComponents.filter(comp => comp.id !== props.component.id)
}

// 检查与左侧组件的距离，并确保栅格对齐
const checkLeftGap = (newX: number) => {
  const otherComponents = getOtherComponents()
  const { gap, cellWidth } = props.gridConfig
  const unitWidth = cellWidth + gap

  let adjustedX = newX

  for (const comp of otherComponents) {
    // 检查是否在垂直方向有重叠
    const verticalOverlap = !(props.component.y + props.component.height <= comp.y || comp.y + comp.height <= props.component.y)

    if (verticalOverlap) {
      // 检查是否在左侧
      if (comp.x + comp.width <= props.component.x) {
        const distance = adjustedX - (comp.x + comp.width)
        if (distance < gap) {
          // 计算需要的最小X坐标
          const minRequiredX = comp.x + comp.width + gap
          // 将最小X坐标对齐到栅格
          const minColumn = Math.ceil(minRequiredX / unitWidth)
          adjustedX = Math.max(adjustedX, minColumn * unitWidth)
        }
      }
    }
  }
  
  return adjustedX
}

// 检查与上方组件的距离
const checkTopGap = (newY: number) => {
  const otherComponents = getOtherComponents()
  const gap = props.gridConfig.gap

  for (const comp of otherComponents) {
    // 检查是否在水平方向有重叠
    const horizontalOverlap = !(props.component.x + props.component.width <= comp.x || comp.x + comp.width <= props.component.x)

    if (horizontalOverlap) {
      // 检查是否在上方
      if (comp.y + comp.height <= props.component.y) {
        const distance = newY - (comp.y + comp.height)
        if (distance < gap) {
          return comp.y + comp.height + gap // 返回最小允许的Y坐标
        }
      }
    }
  }
  return newY // 没有冲突，返回原值
}

// 调整大小（像素计算）
const onResizeStart = (type: string, e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()

  const startX = e.clientX
  const startY = e.clientY
  const startWidth = props.component.width
  const startHeight = props.component.height
  const startXPos = props.component.x
  const startYPos = props.component.y

  const containerWidth = props.containerInfo.width
  const containerHeight = props.containerInfo.height

  currentResizeType.value = type
  isResizing.value = true

  const onMouseMove = (moveEvent: MouseEvent) => {
    if (moveEvent.buttons === 0) {
      // 鼠标按钮释放，结束调整
      onMouseUp()
      return
    }

    const deltaX = moveEvent.clientX - startX
    const deltaY = moveEvent.clientY - startY

    let newWidth = startWidth
    let newHeight = startHeight
    let newX = startXPos
    let newY = startYPos

    // 根据手柄位置计算新的像素尺寸（简化逻辑，边缘调整不改变位置）
    switch (type) {
      case 'right':
        // 右边缘：只改变宽度，从右侧扩展，左边缘保持不变
        newWidth = Math.max(props.component.minWidth || MIN_WIDTH, startWidth + deltaX)
        // 位置不变
        break

      case 'left':
        // 左边缘：改变宽度，从左侧变化，右边缘保持不变
        const tentativeWidth = Math.max(props.component.minWidth || MIN_WIDTH, startWidth - deltaX)
        
        // 使用专门的左侧延展处理函数
        const leftResizeResult = handleLeftResize(
          props.component,
          tentativeWidth,
          props.allComponents || [],
          props.gridConfig,
          props.containerInfo
        )
        
        if (leftResizeResult.valid) {
          newX = leftResizeResult.x
          newWidth = leftResizeResult.width
        } else {
          // 如果无法调整，保持原始尺寸
          newX = startXPos
          newWidth = startWidth
        }
        break

      case 'bottom':
        // 下边缘：只改变高度，从下侧扩展，上边缘保持不变
        newHeight = Math.max(props.component.minHeight || MIN_HEIGHT, startHeight + deltaY)
        // 位置不变
        break

      case 'top':
        // 上边缘：改变高度，从上侧变化，下边缘保持不变
        newHeight = Math.max(props.component.minHeight || MIN_HEIGHT, startHeight - deltaY)
        // 调整位置以保持下边缘不变
        newY = startYPos + startHeight - newHeight
        // 检查与上方组件的gap距离
        newY = checkTopGap(newY)
        // 根据调整后的Y重新计算高度
        newHeight = startYPos + startHeight - newY
        break

      case 'top-right':
        // 右上角：左侧和底部不变
        newWidth = Math.max(props.component.minWidth || MIN_WIDTH, startWidth + deltaX)
        newHeight = Math.max(props.component.minHeight || MIN_HEIGHT, startHeight - deltaY)
        // 调整Y位置以保持底部不变
        newY = startYPos + startHeight - newHeight
        // 检查与上方组件的gap距离
        newY = checkTopGap(newY)
        // 根据调整后的Y重新计算高度
        newHeight = startYPos + startHeight - newY
        // X位置不变（左侧不变）
        break

      case 'top-left':
        // 左上角：右侧和底部不变
        const tentativeWidthTL = Math.max(props.component.minWidth || MIN_WIDTH, startWidth - deltaX)
        const tentativeHeightTL = Math.max(props.component.minHeight || MIN_HEIGHT, startHeight - deltaY)
        
        // 处理左侧宽度调整
        const leftResizeResultTL = handleLeftResize(
          props.component,
          tentativeWidthTL,
          props.allComponents || [],
          props.gridConfig,
          props.containerInfo
        )
        
        // 处理上侧高度调整
        let tentativeYTL = startYPos + startHeight - tentativeHeightTL
        const checkedYTL = checkTopGap(tentativeYTL)
        
        if (leftResizeResultTL.valid) {
          newX = leftResizeResultTL.x
          newWidth = leftResizeResultTL.width
          newY = checkedYTL
          newHeight = startYPos + startHeight - newY
          
          // 确保高度不小于最小值
          if (newHeight < (props.component.minHeight || MIN_HEIGHT)) {
            newHeight = props.component.minHeight || MIN_HEIGHT
            newY = startYPos + startHeight - newHeight
          }
        } else {
          // 如果左侧调整失败，保持原始位置和尺寸
          newX = startXPos
          newY = startYPos
          newWidth = startWidth
          newHeight = startHeight
        }
        break

      case 'bottom-left':
        // 左下角：右侧和上侧不变
        const tentativeWidthBL = Math.max(props.component.minWidth || MIN_WIDTH, startWidth - deltaX)
        newHeight = Math.max(props.component.minHeight || MIN_HEIGHT, startHeight + deltaY)
        
        // 使用专门的左侧延展处理函数
        const leftResizeResultBL = handleLeftResize(
          props.component,
          tentativeWidthBL,
          props.allComponents || [],
          props.gridConfig,
          props.containerInfo
        )
        
        if (leftResizeResultBL.valid) {
          newX = leftResizeResultBL.x
          newWidth = leftResizeResultBL.width
        } else {
          // 如果左侧调整失败，保持原始X位置和宽度
          newX = startXPos
          newWidth = startWidth
        }
        // Y位置不变（上侧不变）
        break

      case 'bottom-right':
        // 右下角：左侧和上侧不变
        newWidth = Math.max(props.component.minWidth || MIN_WIDTH, startWidth + deltaX)
        newHeight = Math.max(props.component.minHeight || MIN_HEIGHT, startHeight + deltaY)
        // 位置不变（左侧和上侧不变）
        break
    }

    // 边界检查：确保组件不超出容器
    // 确保位置不为负数
    newX = Math.max(0, newX)
    newY = Math.max(0, newY)

    // 确保组件不超出容器右边界和下边界
    if (newX + newWidth > containerWidth) {
      if (type.includes('left')) {
        // 如果是从左侧调整，调整位置而不是宽度
        newX = containerWidth - newWidth
        newX = Math.max(0, newX)
      } else {
        // 如果是从右侧调整，调整宽度
        newWidth = containerWidth - newX
      }
    }

    if (newY + newHeight > containerHeight) {
      if (type.includes('top')) {
        // 如果是从上侧调整，调整位置而不是高度
        newY = containerHeight - newHeight
        newY = Math.max(0, newY)
      } else {
        // 如果是从下侧调整，调整高度
        newHeight = containerHeight - newY
      }
    }

    // 确保最小尺寸
    newWidth = Math.max(props.component.minWidth || MIN_WIDTH, newWidth)
    newHeight = Math.max(props.component.minHeight || MIN_HEIGHT, newHeight)

    // 根据调整类型决定是否应用自动填充
    let filledSize = { width: newWidth, height: newHeight }

    // 只有在调整宽度相关的操作时才进行栅格填充
    const isWidthResize = ['left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(type)

    if (isWidthResize) {
      // 应用自动填充（只对宽度）
      filledSize = resizeComponentWithAutoFill(
        props.component,
        { width: newWidth, height: newHeight },
        props.gridConfig
      )
      
      // 对于左侧调整，需要重新计算X位置以保持右边缘不变
      if (type.includes('left')) {
        const rightEdge = newX + newWidth // 原始右边缘位置
        newX = rightEdge - filledSize.width // 根据填充后的宽度重新计算X位置
        newX = Math.max(0, newX) // 确保不超出左边界
      }
    }

    // 填充后的边界检查
    if (newX + filledSize.width > containerWidth) {
      filledSize.width = containerWidth - newX
    }

    // 高度边界检查（填充不会改变高度）
    if (newY + filledSize.height > containerHeight) {
      filledSize.height = containerHeight - newY
    }

    // 确保最终尺寸不小于最小值
    filledSize.width = Math.max(props.component.minWidth || MIN_WIDTH, filledSize.width)
    filledSize.height = Math.max(props.component.minHeight || MIN_HEIGHT, filledSize.height)

    // 发射 resize 事件
    emit('resize', props.component.id, {
      width: parseFloat(filledSize.width.toFixed(3)),
      height: parseFloat(filledSize.height.toFixed(3)),
      x: parseFloat(newX.toFixed(3)),
      y: parseFloat(newY.toFixed(3)),
      resizeType: type
    })
  }

  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.removeEventListener('mouseleave', onMouseUp) // 添加鼠标离开监听
    isResizing.value = false
    currentResizeType.value = ''
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
  document.addEventListener('mouseleave', onMouseUp) // 鼠标离开窗口时也结束
  isResizing.value = true
  currentResizeType.value = ''
}

</script>

<style lang="scss" scoped>
.gridster-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  position: relative;
  cursor: move;
  transition: all 0.2s ease;
  min-height: 0;
  /* 允许收缩 */
  min-width: 0;
  /* 允许收缩 */

  &:hover {
    border-color: #007bff;
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
  }

  &:active {
    transform: scale(0.98);
  }

  .remove-btn {
    position: absolute;
    top: 2px;
    right: 2px;
    opacity: 0;
    transition: opacity 0.2s;
    cursor: pointer;
    color: red;
  }
}

.resize-overlay {
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  pointer-events: none;
}

.gridster-item:hover .resize-overlay {
  pointer-events: auto;
}


.edge {
  position: absolute;
  background: transparent;
  opacity: 0;
  transition: opacity 0.2s;
}

.edge:hover {
  opacity: 1;
}

.edge.top {
  top: 0;
  left: 6px;
  right: 6px;
  height: 6px;
  cursor: n-resize;
}

.edge.right {
  top: 6px;
  right: 0;
  bottom: 6px;
  width: 6px;
  cursor: e-resize;
}

.edge.bottom {
  bottom: 0;
  left: 6px;
  right: 6px;
  height: 6px;
  cursor: s-resize;
}

.edge.left {
  top: 6px;
  left: 0;
  bottom: 6px;
  width: 6px;
  cursor: w-resize;
}

.corner {
  position: absolute;
  background: transparent;
  width: 12px;
  height: 12px;
  opacity: 0;
  transition: opacity 0.2s;
}

.corner:hover {
  opacity: 1;
}

.corner.top-left {
  top: 0;
  left: 0;
  cursor: nw-resize;
}

.corner.top-right {
  top: 0;
  right: 0;
  cursor: ne-resize;
}

.corner.bottom-left {
  bottom: 0;
  left: 0;
  cursor: sw-resize;
}

.corner.bottom-right {
  bottom: 0;
  right: 0;
  cursor: se-resize;
}

.gridster-item:hover .remove-btn {
  opacity: 1;
}
</style>