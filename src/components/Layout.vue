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
            v-for="item in COLUMNS"
            :key="item"
          >
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
  canAddComponent,
  autoFillComponent,
  resizeComponentWithAutoFill,
  validatePositionWithLayout,
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

// 计算容器高度 - 不允许超出容器高度
const containerHeight = computed(() => {
  return containerInfo.height // 直接使用容器高度，不允许滚动
})


// 计算列宽（自适应）
const updateCellWidth = () => {
  if (!gridContainer.value) return
  
  const container = gridContainer.value
  containerInfo.width = container.clientWidth
  containerInfo.height = container.clientHeight
  
  // 固定24列，直接计算列宽
  const totalGapWidth = 23 * gridConfig.gap
  const cellWidth = (containerInfo.width - totalGapWidth) / 24
  
  // 保留2位小数，设置最小列宽
  gridConfig.cellWidth = Math.max(parseFloat(cellWidth.toFixed(2)), 20)
}


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
    components: components.value,
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

// const addComponents = (selectedComponents: ComponentItemModel[]) => {
//   let addedCount = 0
//   const failedComponents: string[] = []

//   selectedComponents.forEach(comp => {
//     const position = findAvailablePosition(components.value, comp, containerInfo, gridConfig)
//     if (position) {
//        const newComponent: ComponentItemModel = {
//         ...comp,
//         id: `${comp.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//         x: position.x,
//         y: position.y
//       }
      
//       autoFillComponent(newComponent, gridConfig)

//       components.value.push(newComponent)
//       addedCount++
//     }
//   })

//   if (addedCount > 0) {
//     console.log(`成功添加 ${addedCount} 个组件`)
//     // 添加后重新组织布局
//     nextTick(() => {
//       reorganizeLayout(components.value, containerInfo, gridConfig)
//     })
//   }
  
//   if (addedCount < selectedComponents.length) {
//     console.warn('部分组件因空间不足未能添加')
//   }
  
//   addComponentRef.value.close()
// }

// 组件调整大小

// 添加组件时的优化逻辑
const addComponents = (selectedComponents: ComponentItemModel[]) => {
  let addedCount = 0
  const failedComponents: string[] = []
  
  console.log('=== 开始添加组件 ===')
  console.log('容器尺寸:', containerInfo.width, '×', containerInfo.height)
  
  selectedComponents.forEach(comp => {
    console.log(`尝试添加组件: ${comp.name} (${comp.width}×${comp.height})`)
    
    // 提前检查是否可以添加
    if (!canAddComponent(components.value, comp, containerInfo, gridConfig)) {
      console.warn(`组件 ${comp.name} 无法添加，会导致布局超出容器`)
      failedComponents.push(comp.name)
      return
    }
    
    const position = findAvailablePosition(components.value, comp, containerInfo, gridConfig)
    if (position) {
      const newComponent: ComponentItemModel = {
        ...comp,
        id: `${comp.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        x: position.x,
        y: position.y
      }
      
      // 确保组件尺寸正确
      autoFillComponent(newComponent, gridConfig)
      
      // 临时添加并重新布局
      const tempComponents = [...components.value, newComponent]
      const layoutSuccess = reorganizeLayout(tempComponents, containerInfo, gridConfig)
      
      if (layoutSuccess) {
        components.value.push(newComponent)
        addedCount++
        console.log(`✓ 成功添加: ${comp.name} 位置: (${position.x}, ${position.y})`)
      } else {
        console.warn(`✗ 布局失败: ${comp.name}`)
        failedComponents.push(comp.name)
      }
    } else {
      console.warn(`✗ 找不到合适位置: ${comp.name}`)
      failedComponents.push(comp.name)
    }
  })
  
  console.log(`添加结果: 成功 ${addedCount} 个, 失败 ${failedComponents.length} 个`)
  
  if (failedComponents.length > 0) {
    alert(`以下组件无法添加（空间不足）：\n${failedComponents.join('\n')}`)
  }
  
  if (addedCount > 0) {
    // 最终重新布局确保所有组件位置正确
    reorganizeLayout(components.value, containerInfo, gridConfig)
  }
  
  addComponentRef.value.open()
}

// 在容器大小变化时重新布局
const updateContainerInfo = () => {
  if (!gridContainer.value) return
  
  const container = gridContainer.value
  const oldWidth = containerInfo.width
  const oldHeight = containerInfo.height
  
  containerInfo.width = container.clientWidth
  containerInfo.height = container.clientHeight
  
  updateCellWidth()
  
  // 如果容器尺寸发生变化，重新布局
  if (oldWidth !== containerInfo.width || oldHeight !== containerInfo.height) {
    console.log('容器尺寸变化，重新布局')
    reorganizeLayout(components.value, containerInfo, gridConfig)
  }
}

const onComponentResize = (id: string, newData: Size & Partial<Position>) => {
  const componentIndex = components.value.findIndex(c => c.id === id)
  if (componentIndex === -1) return
  
  const component = components.value[componentIndex]!
  const newSize: Size = {
    width: newData.width || component!.width,
    height: newData.height || component!.height
  }
  
  const newPosition: Position = {
    x: newData.x !== undefined ? newData.x : component!.x,
    y: newData.y !== undefined ? newData.y : component!.y
  }
  
  // 应用自动填充
  const filledSize = resizeComponentWithAutoFill(component, newSize, gridConfig)
  
    // 使用智能验证（考虑动态布局）
  const validationResult = validatePositionWithLayout(
    components.value,
    id,
    newPosition,
    filledSize,
    containerInfo,
    gridConfig
  )

  // 验证新位置和尺寸
  // if (validatePosition(components.value, id, newPosition, filledSize, containerInfo, gridConfig)) {// 直接更新组件属性
  //   component.x = newPosition.x
  //   component.y = newPosition.y
  //   component.width = newSize.width
  //   component.height = newSize.height
  //   reorganizeLayout(components.value, containerInfo, gridConfig)
  // }

  if (validationResult.valid) {
    component.x = newPosition.x
    component.y = newPosition.y
    component.width = filledSize.width
    component.height = filledSize.height

    // 更新受影响的组件
    if (validationResult.affectedComponents.length > 0) {
      console.log(`需要更新 ${validationResult.affectedComponents.length} 个受影响组件`)
      validationResult.affectedComponents.forEach(affectedComp => {
        const targetComp = components.value.find(c => c.id === affectedComp.id)
        if (targetComp) {
          console.log(`更新受影响组件 ${targetComp.name}: 位置(${affectedComp.x}, ${affectedComp.y})`)
          targetComp.x = affectedComp.x
          targetComp.y = affectedComp.y
        }
      })
    }

    // 最终重新布局确保一切正确
    reorganizeLayout(components.value, containerInfo, gridConfig)
  } else {
     // 可以尝试只调整尺寸不调整位置
    const fallbackResult = validatePositionWithLayout(
      components.value,
      id,
      { x: component.x, y: component.y }, // 保持原位置
      newSize, // 只调整尺寸
      containerInfo,
      gridConfig
    )

    if (fallbackResult.valid) {
      console.log('✓ 回退方案：只调整尺寸，位置保持不变')
      component.width = newSize.width
      component.height = newSize.height
      
      // 更新受影响的组件
      if (fallbackResult.affectedComponents.length > 0) {
        fallbackResult.affectedComponents.forEach(affectedComp => {
          const targetComp = components.value.find(c => c.id === affectedComp.id)
          if (targetComp) {
            targetComp.x = affectedComp.x
            targetComp.y = affectedComp.y
          }
        })
      }
      
      reorganizeLayout(components.value, containerInfo, gridConfig)
    }
  }
}

// 组件拖拽
const onComponentDrag = (id: string, newPosition: Position) => {
  const component = components.value.find(c => c.id === id)
  if (!component) return
  
  // 吸附到网格
  const snappedPosition = snapToGrid(newPosition, gridConfig)
  
  if (validatePosition(components.value, id, snappedPosition, component, containerInfo, gridConfig)) {
    component.x = snappedPosition.x
    component.y = snappedPosition.y
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
  overflow: hidden;
  padding: 10px;
  background: #fff;
}

.grid-content {
  height: 100%;
  width: 100%;
  position: relative;
  flex: 1;
  display: grid;
  // background: white;
  position: relative;
  overflow: hidden;
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
  background: #fff;
  display: grid;

  .grid-cell {
    background: #f0f5f5;
    height: 100%;
  }
}
</style>
