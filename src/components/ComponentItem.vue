<template>
  <div class="component-item" :class="{ resizing: isResizing }" :style="componentStyle" draggable="true"
    @dragstart="onDragStart" @drag="onDrag" @dragend="onDragEnd">
    <div class="component-content">
      <div class="component-header">
        <span class="component-name">{{ component.name }}</span>
        <span class="component-size">{{ component.width }}×{{ component.height }}</span>
      </div>
      <div class="component-body">
        {{ getComponentDescription(component.type) }}
      </div>
    </div>
    <icon-delete :size="16" class="remove-btn" @click="$emit('remove', component.id)" />

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
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ComponentItemModel, GridConfig, Position, Size, ContainerInfo } from '../types/layout';
import { resizeComponentWithAutoFill } from '../utils/grid'

interface Props {
  component: ComponentItemModel
  gridConfig: GridConfig
  containerInfo: ContainerInfo
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
    zIndex: isDragging.value || isResizing.value ? 100 : 1,
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
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
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

    // 根据手柄位置计算新的像素尺寸
    switch (type) {
      case 'right':
        newWidth = Math.max(props.component.minWidth || 100, startWidth + deltaX)
        break

      case 'left':
        newWidth = Math.max(props.component.minWidth || 100, startWidth - deltaX)
        newX = Math.max(0, startXPos + deltaX)
        break

      case 'bottom':
        newHeight = Math.max(props.component.minHeight || 60, startHeight + deltaY)
        break

      case 'top':
        newHeight = Math.max(props.component.minHeight || 60, startHeight - deltaY)
        newY = Math.max(0, startYPos + deltaY)
        break

      case 'top-right':
        newWidth = Math.max(props.component.minWidth || 100, startWidth + deltaX)
        newHeight = Math.max(props.component.minHeight || 60, startHeight - deltaY)
        newY = Math.max(0, startYPos + deltaY)
        break

      case 'top-left':
        newWidth = Math.max(props.component.minWidth || 100, startWidth - deltaX)
        newHeight = Math.max(props.component.minHeight || 60, startHeight - deltaY)
        newX = Math.max(0, startXPos + deltaX)
        newY = Math.max(0, startYPos + deltaY)
        break

      case 'bottom-left':
        newWidth = Math.max(props.component.minWidth || 100, startWidth - deltaX)
        newHeight = Math.max(props.component.minHeight || 60, startHeight + deltaY)
        newX = Math.max(0, startXPos + deltaX)

        // 允许调整到容器底部
        if (newY + newHeight > containerHeight) {
          newHeight = containerHeight - newY
        }

        break

      case 'bottom-right':
        newWidth = Math.max(props.component.minWidth || 100, startWidth + deltaX)
        newHeight = Math.max(props.component.minHeight || 60, startHeight + deltaY)

        // 允许调整到容器底部
        if (newY + newHeight > containerHeight) {
          newHeight = containerHeight - newY
        }
        break
    }

    // 边界检查
    if (newX + newWidth > containerWidth) {
      newWidth = containerWidth - newX
    }
    // 边界检查 - 高度（顶部调整已经在switch中处理）
    if (type !== 'top' && type !== 'top-left' && type !== 'top-right') {
      if (newY + newHeight > containerHeight) {
        newHeight = containerHeight - newY
      }
    }

    // 确保最小尺寸
    newWidth = Math.max(props.component.minWidth || 100, newWidth)
    newHeight = Math.max(props.component.minHeight || 60, newHeight)

    console.log(`调整后原始尺寸: ${newWidth.toFixed(1)}×${newHeight.toFixed(1)}`)

    // 根据调整类型决定是否应用自动填充
    let filledSize = { width: newWidth, height: newHeight }

    // 只有在调整宽度相关的操作时才进行栅格填充
    const isWidthResize = ['left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(type)

    if (isWidthResize) {
      // 应用自动填充（只对宽度）
      filledSize = resizeComponentWithAutoFill(
        props.component,
        { width: newWidth, height: newHeight },
        props.gridConfig,
        props.containerInfo.width
      )
    }

    // 边界检查（填充后）- 只检查宽度
    if (newX + filledSize.width > containerWidth) {
      filledSize.width = containerWidth - newX
      console.log(`填充后右边界限制: 宽度调整为 ${filledSize.width.toFixed(1)}`)
    }

    // 高度边界检查（填充不会改变高度，所以使用原始高度）
    if (newY + filledSize.height > containerHeight) {
      filledSize.height = containerHeight - newY
      console.log(`高度边界限制: 高度调整为 ${filledSize.height.toFixed(1)}`)
    }

    // 确保最终尺寸不小于最小值
    filledSize.width = Math.max(props.component.minWidth || 100, filledSize.width)
    filledSize.height = Math.max(props.component.minHeight || 60, filledSize.height)

    console.log(`最终尺寸: ${filledSize.width.toFixed(1)}×${filledSize.height.toFixed(1)}`)
    console.log(`最终位置: (${newX.toFixed(1)}, ${newY.toFixed(1)})`)

    // 发射 resize 事件
    emit('resize', props.component.id, {
      width: parseFloat(filledSize.width.toFixed(2)),
      height: parseFloat(filledSize.height.toFixed(2)),
      x: parseFloat(newX.toFixed(2)),
      y: parseFloat(newY.toFixed(2)),
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

// 获取组件描述
const getComponentDescription = (type: string) => {
  const descriptions: { [key: string]: string } = {
    'chart-line': '显示数据趋势的折线图',
    'chart-bar': '比较数据大小的柱状图',
    'chart-pie': '显示占比的饼图',
    'table': '展示结构化数据的表格',
    'card': '信息展示卡片',
    'metric': '关键指标显示',
    'text': '文本内容展示',
    'image': '图片展示',
    'progress': '进度条显示'
  }
  return descriptions[type] || '组件内容'
}
</script>

<style lang="scss" scoped>
.component-item {
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

  .component-content {
    padding: 12px;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .component-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .component-name {
    font-weight: 600;
    font-size: 14px;
    color: #333;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .component-size {
    font-size: 12px;
    color: #666;
    background: #f8f9fa;
    padding: 2px 6px;
    border-radius: 4px;
    white-space: nowrap;
  }

  .component-body {
    flex: 1;
    font-size: 12px;
    color: #666;
    line-height: 1.4;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: #f8f9fa;
    border-radius: 4px;
    padding: 8px;
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

.component-item:hover .resize-overlay {
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

.component-item:hover .remove-btn {
  opacity: 1;
}
</style>