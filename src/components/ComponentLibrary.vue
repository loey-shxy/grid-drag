<template>
  <div class="component-library">
    <div class="search-section">
      <a-input
        v-model="searchQuery"
        type="text"
        placeholder="搜索组件..."
        class="search-input"
      />
    </div>
    
    <a-scrollbar style="height: 500px;overflow: auto;">
      <div class="components-grid">
        <div
          v-for="component in filteredComponents"
          :key="component.type"
          class="component-card"
          :class="{
            'selected': isSelected(component),
            'disabled': !canAddComponent(component)
          }"
          @click="onComponentClick(component)"
        >
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
          
          <div class="selection-indicator" v-if="isSelected(component)">
            ✓
          </div>
          
          <div class="disabled-overlay" v-if="!canAddComponent(component)">
            空间不足
          </div>
        </div>
      </div>
    </a-scrollbar>
    <div class="empty-state" v-if="filteredComponents.length === 0">
      未找到匹配的组件
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, onMounted, useId } from 'vue'
import type { ComponentItemModel, GridConfig } from '../types/layout'

interface Props {
  selectedComponents: ComponentItemModel[]
}

const props = defineProps<Props>()

interface Emits {
  (e: 'select', component: ComponentItemModel): void
}

const emit = defineEmits<Emits>()

// 从父组件获取布局容器信息
const layoutContainer = inject('layoutContainer') as any

// 预定义的组件库
const componentLibrary = ref<ComponentItemModel[]>([
  {
    type: 'chart-line',
    name: '折线图',
    width: 4,
    height: 3,
    minWidth: 2,
    minHeight: 2,
    id: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'chart-bar',
    name: '柱状图',
    width: 3,
    height: 3,
    minWidth: 2,
    minHeight: 2,
    id: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'chart-pie',
    name: '饼图',
    width: 2,
    height: 2,
    minWidth: 2,
    minHeight: 2,
    id: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'table',
    name: '数据表格',
    width: 6,
    height: 4,
    minWidth: 3,
    minHeight: 2,
    id: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'card',
    name: '数据卡片',
    width: 2,
    height: 2,
    minWidth: 1,
    minHeight: 1,
    id: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'metric',
    name: '指标卡',
    width: 2,
    height: 1,
    minWidth: 1,
    minHeight: 1,
    id: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'text',
    name: '文本组件',
    width: 3,
    height: 2,
    minWidth: 1,
    minHeight: 1,
    id: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'image',
    name: '图片组件',
    width: 4,
    height: 3,
    minWidth: 2,
    minHeight: 2,
    id: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'progress',
    name: '进度条',
    width: 2,
    height: 1,
    minWidth: 2,
    minHeight: 1,
    id: useId(),
    x: 0,
    y: 0
  }
])

const searchQuery = ref('')

// 过滤组件列表
const filteredComponents = computed(() => {
  if (!searchQuery.value) {
    return componentLibrary.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return componentLibrary.value.filter(component =>
    component.name.toLowerCase().includes(query) ||
    component.type.toLowerCase().includes(query)
  )
})

// 检查组件是否被选中
const isSelected = (component: ComponentItemModel) => {
  return props.selectedComponents.some(
    selected => selected.id === component.id
  )
}

// 检查是否可以添加组件（空间是否足够）
const canAddComponent = (component: ComponentItemModel) => {
  if (!layoutContainer?.value) return true
  
  // 这里需要实现空间检查逻辑
  // 暂时返回 true，实际项目中需要根据剩余空间判断
  return true
}

// 获取组件预览样式
const getPreviewStyle = (component: ComponentItemModel) => {
  const aspectRatio = component.width / component.height
  return {
    aspectRatio: `${aspectRatio}`,
    backgroundColor: getComponentColor(component.type)
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

const onComponentClick = (component: ComponentItemModel) => {
  if (!canAddComponent(component)) {
    return
  }
  emit('select', { ...component })
}

// 初始化时给组件添加 id
onMounted(() => {
  componentLibrary.value = componentLibrary.value.map(comp => ({
    ...comp,
    id: comp.type, // 临时 id，实际添加时会重新生成
    x: 0,
    y: 0
  }))
})
</script>

<style scoped>
.component-library {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search-section {
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.components-grid {
  flex: 1;
  padding: 16px 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  overflow-y: auto;
}

.component-card {
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  background: white;
}

.component-card:hover {
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.component-card.selected {
  border-color: #007bff;
  background: #f0f8ff;
}

.component-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.component-card.disabled:hover {
  border-color: #e8e8e8;
  transform: none;
  box-shadow: none;
}

.component-preview {
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  min-height: 80px;
}

.component-icon {
  font-size: 24px;
}

.component-info {
  text-align: center;
}

.component-name {
  font-weight: 500;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.component-size {
  font-size: 12px;
  color: #666;
}

.selection-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: #007bff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.disabled-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 12px;
  color: #ff4444;
  font-weight: 500;
}

.empty-state {
  padding: 40px 24px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

/* 滚动条样式 */
.components-grid::-webkit-scrollbar {
  width: 6px;
}

.components-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.components-grid::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.components-grid::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>