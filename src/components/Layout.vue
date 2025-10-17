<template>
  <header class="grid-header">
    <div class="grid-header_left"></div>
    <div class="grid-header_right">
      <a-space>
        <a-button @click="openModal">添加组件</a-button>
        <a-button type="primary" @click="saveLayout">保存布局</a-button>
      </a-space>
    </div>
  </header>
  <div class="grid-container">
    <div 
      ref="gridContainer"
      class="grid-content"
      :style="gridStyle"
      @dragover="onDragOver"
      @drop="onDrop"
      @scroll="onScroll"
    >
      <!-- 网格背景 -->
      <div 
        class="grid-background"
        :style="gridBackgroundStyle"
      >
          <div 
            class="grid-cell" 
            :style="{
              width: gridConfig.cellWidth + 'px'
            }" 
            v-for="item in COLUMNS"
            :key="item"
          >
            &nbsp;
        </div>
      </div>

      <ComponentItem
        v-for="component in components"
        :key="component.id"
        :component="component"
        :grid-config="gridConfig"
        :container-info="containerInfo"
        @resize="onComponentResize"
        @drag="onComponentDrag"
        @remove="removeComponent"
      />
    </div>
  </div>

  <AddComponent 
    ref="addComponentRef"
    @confirm="addComponents"
  />
</template>
<script lang="ts" setup>
import { ref, computed, reactive, provide, nextTick, onMounted, onUnmounted, watch } from 'vue';
import type { ComponentItemModel, GridConfig, Position, Size, ContainerInfo } from '../types/layout';
import ComponentItem from './ComponentItem.vue';
import AddComponent from './AddComponent.vue';
import { COLUMNS } from '../utils/constant';
import { 
  reorganizeLayout, 
  validatePosition, 
  findAvailablePosition, 
  snapToGrid, 
  calculateAvailableSpace,
  calculateContainerHeight,
} from '../utils/grid';

const gridConfig = reactive<GridConfig>({
  gap: 10,
  cellWidth: 0, // 动态计算
  cellHeight: 80 // 固定行高
})

const containerInfo = reactive<ContainerInfo>({
  width: 0,
  height: 0,
  scrollTop: 0
})

const components = ref<ComponentItemModel[]>([])
const addComponentRef = ref()
const gridContainer = ref<HTMLElement>()

// 计算列宽（自适应）
const updateCellWidth = () => {
  if (!gridContainer.value) return
  
  const container = gridContainer.value
  containerInfo.width = container.clientWidth
  containerInfo.height = container.clientHeight
  
  const availableWidth = containerInfo.width - 20 // 减去 padding
  const totalGapWidth = (24 - 1) * gridConfig.gap // 假设最大24列
  const cellWidth = (availableWidth - totalGapWidth) / 24
  
  gridConfig.cellWidth = Math.max(cellWidth, 20) // 最小列宽20px
}

// 计算容器需要的高度
const containerHeight = computed(() => {
  return calculateContainerHeight(components.value, gridConfig)
})


// 计算网格样式
const gridStyle = computed(() => {
  const gap = gridConfig.gap
  const cols = COLUMNS
  
  return {
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(auto-fit, 100%)`,
    gap: `${gap}px`,
    width: '100%',
    minHeight: `${containerHeight.value}px`,
  }
})

// 计算网格背景样式
const gridBackgroundStyle = computed(() => {
  const gap = gridConfig.gap
  const cols = COLUMNS
  
  return {
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gap: `${gap}px`,
    gridTemplateRows: `repeat(auto-fit, 100%)`,
    width: '100%',
  }
})

const openModal = () => {
  addComponentRef.value.open()
}

// 向子组件提供布局容器信息
provide('layoutContainer', {
  value: {
    components,
    gridConfig,
    containerInfo,
    columns: COLUMNS,
    availableSpace: computed(() => calculateAvailableSpace(components.value, containerInfo, gridConfig))
  }
})


// 滚动事件
const onScroll = (e: Event) => {
  const target = e.target as HTMLElement
  containerInfo.scrollTop = target.scrollTop
}

// 监听容器宽度变化
const updateContainerInfo = () => {
  if (gridContainer.value) {
    updateCellWidth()
  }
}

// 监听容器宽度变化
// const updateContainerWidth = () => {
//   if (gridContainer.value) {
//     containerWidth.value = gridContainer.value.clientWidth
//     // containerHeight.value = gridContainer.value.clientHeight
//   }
// }

const addComponents = (selectedComponents: ComponentItemModel[]) => {
  let addedCount = 0

  selectedComponents.forEach(comp => {
    const position = findAvailablePosition(components.value, comp, containerInfo, gridConfig)
    if (position) {
       const newComponent: ComponentItemModel = {
        ...comp,
        id: `${comp.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        x: position.x,
        y: position.y
      }
      
      console.log('newComponent', newComponent)
      components.value.push(newComponent)
      addedCount++
    }
  })

  if (addedCount > 0) {
    console.log(`成功添加 ${addedCount} 个组件`)
    // 添加后重新组织布局
    nextTick(() => {
      reorganizeLayout(components.value, containerInfo, gridConfig)
    })
  }
  
  if (addedCount < selectedComponents.length) {
    console.warn('部分组件因空间不足未能添加')
  }
  
  addComponentRef.value.close()
}

// 组件调整大小
const onComponentResize = (id: string, newData: Size & Partial<Position>) => {
  const componentIndex = components.value.findIndex(c => c.id === id)
  if (componentIndex === -1) return
  
  const component = components.value[componentIndex]
  const newSize: Size = {
    width: newData.width || component!.width,
    height: newData.height || component!.height
  }
  
  const newPosition: Position = {
    x: newData.x !== undefined ? newData.x : component!.x,
    y: newData.y !== undefined ? newData.y : component!.y
  }
  
  // 验证新位置和尺寸
  if (validatePosition(components.value, id, newPosition, newSize, containerInfo, gridConfig)) {
    // 更新组件
    Object.assign({}, component, newPosition, newSize)
    
    // 重新组织布局
    reorganizeLayout(components.value, containerInfo, gridConfig)
  }
}

// 组件拖拽
const onComponentDrag = (id: string, newPosition: Position) => {
  const component = components.value.find(c => c.id === id)
  if (!component) return
  
  // 吸附到网格
  const snappedPosition = snapToGrid(newPosition, gridConfig)
  
  if (validatePosition(components.value, id, snappedPosition, component, containerInfo, gridConfig)) {
    Object.assign(component, snappedPosition)
    reorganizeLayout(components.value, containerInfo, gridConfig)
  }
}

// 移除组件
const removeComponent = (id: string) => {
  const index = components.value.findIndex(c => c.id === id)
  if (index !== -1) {
    components.value.splice(index, 1)
    console.log(`已移除组件: ${id}`)
    
    // 移除后重新组织布局
    nextTick(() => {
      reorganizeLayout(components.value, containerInfo, gridConfig)
    })
  }
}

// 拖拽放置处理
const onDragOver = (e: DragEvent) => {
  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
}

const onDrop = (e: DragEvent) => {
  e.preventDefault()
  
  if (!gridContainer.value || !e.dataTransfer) return
  
  const componentId = e.dataTransfer.getData('text/plain')
  if (!componentId) return
  
  const component = components.value.find(c => c.id === componentId)
  if (!component) return
  
  // 计算放置位置（直接使用像素坐标）
  const rect = gridContainer.value.getBoundingClientRect()
  const scrollTop = containerInfo.scrollTop || 0
  const pixelX = e.clientX - rect.left - gridConfig.gap
  const pixelY = e.clientY - rect.top - gridConfig.gap + scrollTop
    
  const newPosition = snapToGrid({ x: pixelX, y: pixelY }, gridConfig)
  
  if (validatePosition(components.value, componentId, newPosition, component, containerInfo, gridConfig)) {
    Object.assign(component, newPosition)
    reorganizeLayout(components.value, containerInfo, gridConfig)
  }
}

// 保存布局
const saveLayout = () => {
  const layoutData = {
    gridConfig: { ...gridConfig },
    components: components.value.map(comp => ({
      id: comp.id,
      type: comp.type,
      name: comp.name,
      x: comp.x,
      y: comp.y,
      width: comp.width,
      height: comp.height,
      minWidth: comp.minWidth,
      minHeight: comp.minHeight
    }))
  }
  
  try {
    localStorage.setItem('drag-layout-data', JSON.stringify(layoutData))
    console.log('布局保存成功', layoutData)
    alert('布局保存成功！')
  } catch (error) {
    console.error('保存布局失败:', error)
    alert('保存布局失败！')
  }
}

// 加载保存的布局
const loadLayout = () => {
  try {
    const saved = localStorage.getItem('drag-layout-data')
    if (saved) {
      const layoutData = JSON.parse(saved)
      
      Object.assign(gridConfig, layoutData.gridConfig)
      components.value = layoutData.components.map((comp: any) => ({
        ...comp,
        id: comp.id || `${comp.type}-${Date.now()}`
      }))
      
      console.log('布局加载成功')
    }
  } catch (error) {
    console.error('加载布局失败:', error)
  }
}

// ResizeObserver 监听容器大小变化
let resizeObserver: ResizeObserver | null = null


// 初始化
onMounted(() => {
  loadLayout()
  
  if (gridContainer.value) {
    resizeObserver = new ResizeObserver(() => {
      updateContainerInfo()
    })
    resizeObserver.observe(gridContainer.value)
  }
  
  updateContainerInfo()
  window.addEventListener('resize', updateContainerInfo)
})

// 清理
onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  window.removeEventListener('resize', updateContainerInfo)
})

</script>

<style lang="scss" scoped>
.grid-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  border-bottom: 1px solid #ddd;
  padding: 0 20px;

  &_right,
  &_left {
    display: flex;
    align-items: center;
  }

  &_right {
    justify-content: flex-end;
  }
}

.grid-container {
  display: flex;
  height: calc(100% - 60px);
  overflow-y: auto;
  padding: 10px;
  background: #ebecec;
}

.grid-content {
  height: 100%;
  width: 100%;
  position: relative;
  flex: 1;
  display: grid;
  // background: white;
  position: relative;
  overflow: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  justify-content: start;
  align-content: start;
  min-width: 0; /* 防止网格溢出 */
}

.grid-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
  background: #ebecec;
  display: grid;

  .grid-cell {
    background: white;
    height: 100%;
  }
}
</style>
