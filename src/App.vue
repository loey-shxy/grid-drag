<template>
  <div class="demo-container">
    <GridHeader :component-library="componentLibrary" @confirm-add="addComponents" @save="saveLayout">
      <template #component="{ component }">
        <div class="component-preview" :style="getPreviewStyle(component)">
          <div class="component-icon">
            {{ getComponentIcon(component.type) }}
          </div>
        </div>

        <div class="component-info">
          <div class="component-name">{{ component.name }}</div>
          <div class="component-size">
            {{ component.w }} × {{ component.h }}
          </div>
        </div>
      </template>
    </GridHeader>
    <div class="demo-content">
      <GridLayout ref="gridLayoutRef" :layout.sync="layout" :col-num="24" :row-height="30" :prevent-overflow="true"
        :is-bounded="true">
        <GridItem v-for="item in layout" class="component-item" :key="item.i" :x="item.x" :y="item.y" :w="item.w"
          :h="item.h" :i="item.i" :static="item.static" @remove="removeItem">
          <div class="component-item">
            <div class="component-content">
              <div class="component-header">
                <span class="component-name">{{ item.name }}</span>
              </div>
              <div class="component-body">
                {{ getComponentDescription(item.type!) }}
              </div>
            </div>
          </div>
        </GridItem>
      </GridLayout>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, useId, watch } from 'vue';
import GridLayout from '../packages/components/GridLayout.vue'
import GridItem from '../packages/components/GridItem.vue'
import GridHeader from '../packages/components/GridHeader.vue'
import {
  gridItemWidthToColNum,
  gridItemHeightToRowNum,
  type Layout,
  type LayoutItem
} from '../packages/helpers';

import '../packages/assets/style.scss'

const gridLayoutRef = ref()

type Component = LayoutItem & {
  name: string
  type: string
  icon?: string
  color?: string
  desc?: string
}
// 预定义的组件库
const componentLibrary = ref<Component[]>([
  {
    type: 'line-bar',
    name: '折线图',
    w: 400,   // 像素
    h: 300,  // 像素
    i: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'chart-bar',
    name: '柱状图',
    w: 350,   // 像素
    h: 200,  // 像素
    i: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'chart-pie',
    name: '饼图',
    w: 300,   // 像素
    h: 300,  // 像素
    i: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'table',
    name: '数据表格',
    w: 600,   // 像素
    h: 400,  // 像素
    i: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'card',
    name: '数据卡片',
    w: 300,   // 像素
    h: 300,  // 像素
    i: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'metric',
    name: '指标卡',
    w: 300,   // 像素
    h: 300,  // 像素
    i: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'text',
    name: '文本组件',
    w: 320,   // 像素
    h: 300,  // 像素
    i: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'image',
    name: '图片组件',
    w: 400,   // 像素
    h: 300,  // 像素
    i: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'progress',
    name: '进度条',
    w: 360,   // 像素
    h: 300,  // 像素
    i: useId(),
    x: 0,
    y: 0
  }
])

// 获取组件预览样式
const getPreviewStyle = (component: Component) => {
  // 计算预览的宽高比例，保持视觉一致性
  const maxPreviewSize = 120
  const aspectRatio = component.w / component.h

  let previewWidth, previewHeight

  if (aspectRatio > 1) {
    // 宽大于高
    previewWidth = Math.min(maxPreviewSize, component.w / 3)
    previewHeight = previewWidth / aspectRatio
  } else {
    // 高大于宽或正方形
    previewHeight = Math.min(maxPreviewSize, component.h / 3)
    previewWidth = previewHeight * aspectRatio
  }

  return {
    width: `${previewWidth}px`,
    height: `${previewHeight}px`,
    backgroundColor: component.color,
    aspectRatio: `${aspectRatio}`
  }
}

// 获取组件图标
const getComponentIcon = (type: string) => {
  const icons: { [key: string]: string } = {
    'chart-line': '📈',
    'chart-bar': '📊',
    'chart-pie': '🥧',
    'table': '📋',
    'card': '📄',
    'metric': '🔢',
    'text': '📝',
    'image': '🖼️',
    'progress': '📏'
  }
  return icons[type] || '◻️'
}

// 获取组件颜色
const getComponentColor = (type: string) => {
  const colors: { [key: string]: string } = {
    'chart-line': '#e3f2fd',
    'chart-bar': '#e8f5e8',
    'chart-pie': '#fff3e0',
    'table': '#f3e5f5',
    'card': '#e0f2f1',
    'metric': '#fff8e1',
    'text': '#f5f5f5',
    'image': '#e8eaf6',
    'progress': '#ffebee'
  }
  return colors[type] || '#f5f5f5'
}

// 获取组件类型描述
const getComponentTypeText = (type: string) => {
  const types: { [key: string]: string } = {
    'chart-line': '图表',
    'chart-bar': '图表',
    'chart-pie': '图表',
    'table': '表格',
    'card': '卡片',
    'metric': '指标',
    'text': '文本',
    'image': '媒体',
    'progress': '进度',
    'gauge': '图表',
    'statistic': '统计',
    'calendar': '日历'
  }
  return types[type] || '组件'
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

const layout = ref<Layout>([])
const addComponents = (components: Layout) => {
  // 转换组件尺寸为网格单位
  const convertedComponents = components.map(item => ({
    ...item,
    w: gridItemWidthToColNum(
      gridLayoutRef.value.width,
      gridLayoutRef.value.colNum,
      gridLayoutRef.value.margin[0],
      item.w
    ),
    h: gridItemHeightToRowNum(
      gridLayoutRef.value.rowHeightComputed,
      gridLayoutRef.value.margin[1],
      item.h
    )
  }))

  // 使用智能添加方法
  const result = gridLayoutRef.value.addItemsIntelligently(convertedComponents)

  layout.value = [...layout.value, ...result.addedItems]
  if (result.failedItems.length > 0) {
    console.warn(`无法添加 ${result.failedItems.length} 个组件，容器空间不足`)
    // 可以在这里添加用户提示
  }

  if (result.success) {
    console.log(`成功添加 ${result.addedItems.length} 个组件`)
  }
}

const removeItem = (id?: string) => {
  if (id) {
    const index = layout.value.findIndex(item => item.i === id)

    if (index >= 0) {
      layout.value.splice(index, 1)
    }
  }
}

/**
 * 保存布局 - 直接获取已渲染的像素值
 */
const saveLayout = () => {
  if (!gridLayoutRef.value) {
    console.error('GridLayout 引用不存在')
    return
  }

  // 获取所有GridItem组件的DOM元素
  const gridItems = gridLayoutRef.value.$el.querySelectorAll('.gridster-item')

  const pixelLayout = layout.value.map((item, index) => {
    const gridItemEl = gridItems[index]
    let pixelPosition = { x: 0, y: 0, width: 0, height: 0 }

    if (gridItemEl) {
      // 直接从DOM元素的getBoundingClientRect获取实际位置
      const rect = gridItemEl.getBoundingClientRect()
      const containerRect = gridLayoutRef.value.$el.getBoundingClientRect()

      // 计算相对于容器的位置
      pixelPosition.x = rect.left - containerRect.left
      pixelPosition.y = rect.top - containerRect.top
      pixelPosition.width = rect.width
      pixelPosition.height = rect.height

      // 减去容器的padding
      const containerStyle = window.getComputedStyle(gridLayoutRef.value.$el.querySelector('.grid-content'))
      const paddingLeft = parseFloat(containerStyle.paddingLeft) || 0
      const paddingTop = parseFloat(containerStyle.paddingTop) || 0

      pixelPosition.x -= paddingLeft
      pixelPosition.y -= paddingTop
    }

    return {
      i: item.i,
      name: item.name,
      type: (item as Component).type,
      // 从DOM获取的实际像素值
      x: pixelPosition.x,
      y: pixelPosition.y,
      w: pixelPosition.width,
      h: pixelPosition.height,
      // 保留其他属性
      static: item.static,
      minW: item.minW,
      minH: item.minH,
      maxW: item.maxW,
      maxH: item.maxH
    }
  })

  console.log('从DOM获取的像素布局:', pixelLayout)

  // 可以在这里添加其他保存逻辑，比如发送到服务器
  return pixelLayout
}

onMounted(() => {
  componentLibrary.value.forEach((item) => {
    item.icon = getComponentIcon(item.type!)
    item.color = getComponentColor(item.type!)
    item.desc = getComponentTypeText(item.type!)
  })
})
</script>

<style lang="scss" scoped>
.demo-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.demo-content {
  flex: 1;
  overflow: hidden;
  /* 确保不出现滚动条 */
}

.component-preview {
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  min-height: 80px;
  margin: 0 auto;
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
  overflow: hidden;
  text-overflow: ellipsis;
}

.component-icon {
  font-size: 24px;
}

.component-info {
  text-align: center;
}

.component-item {
  width: 100%;
  height: 100%;

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
}
</style>