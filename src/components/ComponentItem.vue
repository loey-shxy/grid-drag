<template>
  <div
    class="component-item"
    :style="componentStyle"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div class="component-content">
      <div class="component-header">
        <span class="component-name">{{ component.name }}</span>
        <span class="component-size">{{ component.width }}×{{ component.height }}</span>
      </div>
      <div class="component-body">
        {{ getComponentDescription(component.type) }}
      </div>
    </div>
    
    <!-- 调整手柄 -->
    <div
      v-for="handle in enabledResizeHandles"
      :key="handle.position"
      class="resize-handle"
      :class="`handle-${handle.position}`"
      @mousedown="onResizeStart(handle.position, $event)"
    />
    <icon-delete :size="16" class="remove-btn" @click="$emit('remove', component.id)" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ComponentItemModel, GridConfig, Position, Size, ContainerInfo } from '../types/layout';

interface Props {
  component: ComponentItemModel
  gridConfig: GridConfig
  containerInfo: ContainerInfo
}

const props = defineProps<Props>()
const emit = defineEmits<{
  resize: [id: string, size: Size & Partial<Position>]
  drag: [id: string, position: Position]
  remove: [id: string]
}>()

const isDragging = ref(false)
const isResizing = ref(false)

// 计算组件样式
const componentStyle = computed(() => {
  // const pos = gridPosition.value
  // const size = gridSize.value
  
  // return {
  //   gridColumn: `${pos.x + 1} / span ${size.width}`,
  //   gridRow: `${pos.y + 1} / span ${size.height}`,
  //   transform: isDragging.value ? 'scale(1.02)' : 'none',
  //   zIndex: isDragging.value || isResizing.value ? 100 : 1
  // }
  return {
    position: 'absolute',
    left: `${props.component.x}px`,
    top: `${props.component.y}px`,
    width: `${props.component.width}px`,
    height: `${props.component.height}px`,
    transform: isDragging.value ? 'scale(1.02)' : 'none',
    zIndex: isDragging.value || isResizing.value ? 100 : 1
  }
})

const resizeHandles = [
  { position: 'top-left' }, { position: 'top-right' },
  { position: 'bottom-left' }, { position: 'bottom-right' },
  { position: 'top' }, { position: 'right' },
  { position: 'bottom' }, { position: 'left' }
]

// 计算可用的调整手柄（基于像素边界）
const enabledResizeHandles = computed(() => {
  const { x, y, width, height } = props.component
  const containerWidth = props.containerInfo.width
  const containerHeight = props.containerInfo.height
  
  return resizeHandles.filter(handle => {
    switch (handle.position) {
      case 'left':
        return x > 0
      case 'right':
        return x + width < containerWidth
      case 'top':
        return y > 0
      case 'bottom':
        return y + height < containerHeight
      case 'top-left':
        return x > 0 && y > 0
      case 'top-right':
        return x + width < containerWidth && y > 0
      case 'bottom-left':
        return x > 0 && y + height < containerHeight
      case 'bottom-right':
        return x + width < containerWidth && y + height < containerHeight
      default:
        return true
    }
  })
})

const onDragStart = (e: DragEvent) => {
  isDragging.value = true;

  e.dataTransfer?.setData('text/plain', props.component.id);
  e.dataTransfer!.effectAllowed = 'move'

  // 设置拖拽预览
  const dragImage = e.currentTarget as HTMLElement
  e.dataTransfer?.setDragImage(dragImage, 0, 0)
}

const onDragEnd = () => {
  isDragging.value = false
}

// 调整大小（像素计算）
const onResizeStart = (position: string, e: MouseEvent) => {
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
    switch (position) {
      case 'right':
        newWidth = Math.max(props.component.minWidth || 100, startWidth + deltaX)
        // 右边界检查
        if (newX + newWidth > containerWidth) {
          newWidth = containerWidth - newX
        }
        break
        
      case 'left':
        newWidth = Math.max(props.component.minWidth || 100, startWidth - deltaX)
        newX = Math.max(0, startXPos + deltaX)
        break
        
      case 'bottom':
        newHeight = Math.max(props.component.minHeight || 60, startHeight + deltaY)
        // 下边界检查
        if (newY + newHeight > containerHeight) {
          newHeight = containerHeight - newY
        }
        break
        
      case 'top':
        newHeight = Math.max(props.component.minHeight || 60, startHeight - deltaY)
        newY = Math.max(0, startYPos + deltaY)
        break
        
      case 'top-right':
        newWidth = Math.max(props.component.minWidth || 100, startWidth + deltaX)
        newHeight = Math.max(props.component.minHeight || 60, startHeight - deltaY)
        newY = Math.max(0, startYPos + deltaY)
        // 边界检查
        if (newX + newWidth > containerWidth) {
          newWidth = containerWidth - newX
        }
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
        // 边界检查
        if (newY + newHeight > containerHeight) {
          newHeight = containerHeight - newY
        }
        break
        
      case 'bottom-right':
        newWidth = Math.max(props.component.minWidth || 100, startWidth + deltaX)
        newHeight = Math.max(props.component.minHeight || 60, startHeight + deltaY)
        // 边界检查
        if (newX + newWidth > containerWidth) {
          newWidth = containerWidth - newX
        }
        if (newY + newHeight > containerHeight) {
          newHeight = containerHeight - newY
        }
        break
    }
    
    // 确保最小尺寸
    newWidth = Math.max(props.component.minWidth || 100, newWidth)
    newHeight = Math.max(props.component.minHeight || 60, newHeight)
    
    // 发射 resize 事件
    emit('resize', props.component.id, {
      width: Math.round(newWidth),
      height: Math.round(newHeight),
      x: Math.round(newX),
      y: Math.round(newY)
    })
  }
  
  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    isResizing.value = false
  }
  
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
  isResizing.value = true
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
  border: 2px solid #e9ecef;
  border-radius: 8px;
  position: relative;
  cursor: move;
  transition: all 0.2s ease;
  min-height: 0; /* 允许收缩 */
  min-width: 0;  /* 允许收缩 */
  
  &:hover {
    border-color: #007bff;
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
    transform: translateY(-1px);
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

.resize-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #007bff;
  border: 2px solid white;
  border-radius: 50%;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s;
  
  // 角部手柄
  &.handle-top-left {
    top: -5px;
    left: -5px;
    cursor: nw-resize;
  }
  
  &.handle-top-right {
    top: -5px;
    right: -5px;
    cursor: ne-resize;
  }
  
  &.handle-bottom-left {
    bottom: -5px;
    left: -5px;
    cursor: sw-resize;
  }
  
  &.handle-bottom-right {
    bottom: -5px;
    right: -5px;
    cursor: se-resize;
  }
  
  // 边缘手柄
  &.handle-top {
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    cursor: n-resize;
  }
  
  &.handle-bottom {
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    cursor: s-resize;
  }
  
  &.handle-left {
    left: -5px;
    top: 50%;
    transform: translateY(-50%);
    cursor: w-resize;
  }
  
  &.handle-right {
    right: -5px;
    top: 50%;
    transform: translateY(-50%);
    cursor: e-resize;
  }
  
  // 禁用状态
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  &:hover {
    background: #0056b3;
  }
}

.component-item:hover .remove-btn,
.component-item:hover .resize-handle {
  opacity: 1;
}

</style>