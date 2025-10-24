<template>
  <GridDrag
    :component-library="componentLibrary"
    v-model:added-components="addedComponents"
  >
    <template #item="{ itemData }">
      <div class="component-item">
        <div class="component-content">
          <div class="component-header">
            <span class="component-name">{{ itemData.name }}</span>
            <span class="component-size">
              size: {{ itemData.width }} x {{ itemData.height }}
              position: {{ itemData.x }} x {{ itemData.y }}
            </span>
          </div>
          <div class="component-body">
            {{ getComponentDescription(itemData.type!) }}
          </div>
        </div>
      </div>
    </template>
    <template #component="{ component }">
      <div class="component-preview" :style="getPreviewStyle(component)">
        <div class="component-icon">
          {{ getComponentIcon(component.type) }}
        </div>
      </div>
        
      <div class="component-info">
        <div class="component-name">{{ component.name }}</div>
        <div class="component-size">
          {{ component.width }} × {{ component.height }}
        </div>
      </div>
    </template>
  </GridDrag>
</template>
<script lang="ts" setup>
import { onMounted, ref, useId } from 'vue';
import type { ComponentItemModel } from '../packages/types/layout';
import  GridDrag from '../packages/components/GridDrag.vue'
import '../packages/assets/style.scss'

interface Component {
  icon?: string
  color?: string
  desc?: string
}
type ComponentLibrary = Component & ComponentItemModel
// 预定义的组件库
const componentLibrary = ref<ComponentLibrary[]>([
  {
    type: 'chart-line',
    name: '折线图',
    width: 400,   // 像素
    height: 300,  // 像素
    minWidth: 200,
    minHeight: 200,
    id: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'chart-bar',
    name: '柱状图',
    width: 350,   // 像素
    height: 200,  // 像素
    minWidth: 200,
    minHeight: 200,
    id: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'chart-pie',
    name: '饼图',
    width: 300,   // 像素
    height: 300,  // 像素
    minWidth: 200,
    minHeight: 200,
    id: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'table',
    name: '数据表格',
    width: 600,   // 像素
    height: 400,  // 像素
    minWidth: 200,
    minHeight: 200,
    id: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'card',
    name: '数据卡片',
    width: 300,   // 像素
    height: 300,  // 像素
    minWidth: 200,
    minHeight: 200,
    id: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'metric',
    name: '指标卡',
    width: 300,   // 像素
    height: 300,  // 像素
    minWidth: 200,
    minHeight: 200,
    id: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'text',
    name: '文本组件',
    width: 320,   // 像素
    height: 300,  // 像素
    minWidth: 200,
    minHeight: 200,
    id: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'image',
    name: '图片组件',
    width: 400,   // 像素
    height: 300,  // 像素
    minWidth: 200,
    minHeight: 200,
    id: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'progress',
    name: '进度条',
    width: 360,   // 像素
    height: 300,  // 像素
    minWidth: 200,
    minHeight: 200,
    id: useId(),
    x: 0,
    y: 0
  }
])

const addedComponents =  ref<ComponentItemModel[]>([])

// 获取组件预览样式
const getPreviewStyle = (component: ComponentLibrary) => {
  // 计算预览的宽高比例，保持视觉一致性
  const maxPreviewSize = 120
  const aspectRatio = component.width / component.height
  
  let previewWidth, previewHeight
  
  if (aspectRatio > 1) {
    // 宽大于高
    previewWidth = Math.min(maxPreviewSize, component.width / 3)
    previewHeight = previewWidth / aspectRatio
  } else {
    // 高大于宽或正方形
    previewHeight = Math.min(maxPreviewSize, component.height / 3)
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

onMounted(() => {
  componentLibrary.value.forEach((item) => {
    item.icon = getComponentIcon(item.type!)
    item.color = getComponentColor(item.type!)
    item.desc = getComponentTypeText(item.type!)
  })
})
</script>

<style lang="scss" scoped>
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