<template>
  <header class="grid-header">
    <div class="grid-header_left"></div>
    <div class="grid-header_right">
      <a-space>
        <a-button type="primary" @click="openModal">添加组件</a-button>
        <slot name="extra"></slot>
      </a-space>
    </div>
  </header>
  <div class="grid-container">
    <div ref="gridContainer" class="grid-content" :style="gridStyle" @dragover="onDragOver">
      <!-- 网格背景 -->
      <div class="grid-background" :style="gridBackgroundStyle">
        <div class="grid-cell" v-for="item in COLUMNS" :key="item">
        </div>
      </div>
      <GridsterItem v-for="component in addedComponents" :key="component.id" :component="component"
        :grid-config="gridConfig" :container-info="containerInfo" :all-components="addedComponents"
        @resize="onComponentResize" @drag="onComponentDrag" @remove="removeComponent">
        <slot name="item" :itemData="component"></slot>
      </GridsterItem>
    </div>
  </div>
  <AddComponent ref="addComponentRef" @confirm="addComponents" :component-library="props.componentLibrary">
    <template v-for="slot in Object.keys($slots)" :key="slot" #[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps || {}"></slot>
    </template>
  </AddComponent>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted, watch } from 'vue';
import type { ComponentItemModel, GridConfig, Position, Size, ContainerInfo } from '../types/layout';
import { COLUMNS } from '../utils/constant';
import GridsterItem from './GridsterItem.vue';
import AddComponent from './AddComponent.vue';
import { Message } from '@arco-design/web-vue';

import {
  resizeComponentWithAutoFill,
  validatePositionWithLayout,
  validateDragPosition,
  findAvailablePosition,
  autoFillComponentToGrid,
  adaptiveLayoutOnResize,
} from '../utils/grid';

interface Props {
  componentLibrary: ComponentItemModel[]
  addedComponents: ComponentItemModel[]
}
const props = defineProps<Props>()
const emit = defineEmits([
  'get-container-size',
  'add-component',
  'update:added-components'
])

const components = computed({
  get: () => {
    return props.addedComponents ? props.addedComponents : [];
  },
  set: (val: ComponentItemModel[]) => {
    emit('update:added-components', val);
  },
})

const gridConfig = reactive<GridConfig>({
  gap: 10,
  cellWidth: 0, // 动态计算
})

const containerInfo = reactive<ContainerInfo>({
  width: 0,
  height: 0,
  scrollTop: 0
})
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
  gridConfig.cellWidth = Math.max(parseFloat(cellWidth.toFixed(3)), 20)
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


// 在容器大小变化时进行自适应处理
const updateContainerInfo = () => {
  if (!gridContainer.value) return

  const container = gridContainer.value
  const oldWidth = containerInfo.width
  const oldHeight = containerInfo.height
  const oldCellWidth = gridConfig.cellWidth

  // 保存旧的容器信息
  const oldContainerInfo = {
    width: oldWidth,
    height: oldHeight
  }

  // 更新容器信息
  containerInfo.width = container.clientWidth
  containerInfo.height = container.clientHeight

  // 更新列宽
  updateCellWidth()
  const newCellWidth = gridConfig.cellWidth

  // 如果容器尺寸发生变化，进行自适应调整
  if (oldWidth !== containerInfo.width || oldHeight !== containerInfo.height) {
    console.log('容器尺寸变化，进行自适应调整', {
      oldSize: { width: oldWidth, height: oldHeight },
      newSize: { width: containerInfo.width, height: containerInfo.height },
      oldCellWidth,
      newCellWidth,
      cellWidthRatio: newCellWidth / oldCellWidth
    })

    // 记录调整前的组件状态
    const beforeAdjustment = components.value.map(c => ({
      id: c.id,
      x: c.x,
      width: c.width
    }))

    // 使用自适应布局调整组件
    components.value = adaptiveLayoutOnResize(
      components.value,
      oldContainerInfo,
      containerInfo,
      oldCellWidth,
      newCellWidth,
      gridConfig
    )

    // 记录调整后的组件状态
    const afterAdjustment = components.value.map(c => ({
      id: c.id,
      x: c.x,
      width: c.width
    }))

    console.log('组件自适应调整结果', {
      before: beforeAdjustment,
      after: afterAdjustment
    })
  }
}

const onComponentResize = (id: string, newData: Size & Partial<Position> & { resizeType?: string }) => {
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

  // 根据调整类型决定是否应用自动填充
  let filledSize = newSize
  const resizeType = newData.resizeType || ''
  const isWidthResize = ['left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(resizeType)

  if (isWidthResize) {
    // 只有在调整宽度相关的操作时才进行栅格填充
    filledSize = resizeComponentWithAutoFill(component, newSize, gridConfig)
  }

  // 使用智能验证（考虑动态布局）
  const validationResult = validatePositionWithLayout(
    components.value,
    id,
    newPosition,
    filledSize,
    containerInfo,
    gridConfig,
    resizeType
  )

  if (validationResult.valid) {
    component.x = newPosition.x
    component.y = newPosition.y
    component.width = filledSize.width
    component.height = filledSize.height

    // 更新受影响的组件
    if (validationResult.affectedComponents.length > 0) {
      validationResult.affectedComponents.forEach(affectedComp => {
        const targetComp = components.value.find(c => c.id === affectedComp.id)
        if (targetComp) {
          targetComp.x = affectedComp.x
          targetComp.y = affectedComp.y
        }
      })
    }

    // 新的碰撞检测逻辑已经在validatePositionWithLayout中处理了布局调整
    // 不需要额外的reorganizeLayout调用
  } else {
    // 可以尝试只调整尺寸不调整位置
    const fallbackResult = validatePositionWithLayout(
      components.value,
      id,
      { x: component.x, y: component.y }, // 保持原位置
      filledSize, // 使用填充后的尺寸
      containerInfo,
      gridConfig,
      resizeType
    )

    if (fallbackResult.valid) {
      component.width = filledSize.width
      component.height = filledSize.height

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
    }
  }
}

// 组件拖拽
const onComponentDrag = (id: string, newPosition: Position) => {
  const component = components.value.find(c => c.id === id)
  if (!component) return

  // 使用智能拖拽验证（内部包含智能吸附逻辑）
  const dragResult = validateDragPosition(
    components.value,
    id,
    newPosition,
    containerInfo,
    gridConfig
  )

  if (dragResult.valid) {
    // 使用经过智能吸附处理的最终位置
    component.x = dragResult.finalPosition.x
    component.y = dragResult.finalPosition.y

    // 更新受影响的组件
    if (dragResult.affectedComponents.length > 0) {
      dragResult.affectedComponents.forEach(affectedComp => {
        const targetComp = components.value.find(c => c.id === affectedComp.id)
        if (targetComp) {
          targetComp.x = affectedComp.x
          targetComp.y = affectedComp.y
        }
      })
    }
  }
}

// 移除组件
const removeComponent = (id: string) => {
  const index = components.value.findIndex(c => c.id === id)
  if (index !== -1) {
    components.value.splice(index, 1)
  }
}

// 拖拽放置处理
const onDragOver = (e: DragEvent) => {
  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
}



// ResizeObserver 监听容器大小变化
let resizeObserver: ResizeObserver | null = null

// 初始化
onMounted(() => {
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

watch(
  () => containerInfo,
  () => emit('get-container-size', containerInfo),
  { deep: true }
)

const addComponentRef = ref()

const openModal = () => {
  addComponentRef.value.open()
}

// 添加组件时的优化逻辑（自动向后排列，不重新布局）
const addComponents = (selectedComponents: ComponentItemModel[]) => {
  let addedCount = 0
  const failedComponents: string[] = []

  selectedComponents.forEach(comp => {
    const position = findAvailablePosition(components.value, comp, containerInfo, gridConfig)
    if (position) {
      const newComponent: ComponentItemModel = {
        ...comp,
        id: `${comp.id}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        x: position.x,
        y: position.y
      }

      // 确保组件尺寸正确
      autoFillComponentToGrid(newComponent, gridConfig)

      // 直接添加组件，不重新布局
      components.value.push(newComponent)
      addedCount++
      console.log(`✓ 成功添加: ${comp.name} 位置: (${position.x}, ${position.y})`)
    } else {
      console.warn(`✗ 找不到合适位置: ${comp.name}`)
      failedComponents.push(comp.name)
    }
  })

  if (failedComponents.length > 0) {
    Message.warning(`以下组件无法添加（空间不足）：\n${failedComponents.join('\n')}`)
    return
  }

  if (addedCount > 0) {
    console.log(`成功添加 ${addedCount} 个组件`)
  }

  addComponentRef.value.close()
}


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
  min-width: 0;
  /* 防止网格溢出 */
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
