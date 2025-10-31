<template>
  <a-modal 
    v-model:visible="visible" 
    title="添加组件 "
    width="1000px"
    @ok="handleOk" 
    @cancel="close"
  >
    <div class="add-container">
      <a-alert>已选择：{{ selectedComponents .length }}</a-alert>
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
              :key="component.i"
              class="component-card"
              :class="{
                'selected': isSelected(component),
              }"
              @click="onComponentClick(component)"
            >
              <slot name="component" :component="component"></slot>
              <div class="selection-indicator" v-if="isSelected(component)">
                ✓
              </div>
            </div>
          </div>
        </a-scrollbar>
        <div class="empty-state" v-if="filteredComponents.length === 0">
          未找到匹配的组件
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { type Layout, type LayoutItem } from '../helpers/utils';

interface Props {
  componentLibrary: Layout
}
const props = defineProps<Props>()
const visible = ref(false)
const selectedComponents  = ref<Layout>([])

interface Emits {
  (e: 'confirm', components: Layout): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

const onComponentSelect = (component: LayoutItem) => {
  const index = selectedComponents.value.findIndex(
    item => item.i === component.i
  )
  
  if (index > -1) {
    // 如果已存在，则移除
    selectedComponents.value.splice(index, 1)
  } else {
    // 如果不存在，则添加
    selectedComponents.value.push(component)
  }
}

const searchQuery = ref('')

// 过滤组件列表
const filteredComponents = computed(() => {
  if (!searchQuery.value) {
    return props.componentLibrary
  }
  
  const query = searchQuery.value.toLowerCase()
  return props.componentLibrary.filter(component =>
    component.name!.toLowerCase().includes(query)
  )
})

// 检查组件是否被选中
const isSelected = (component: LayoutItem) => {
  return selectedComponents.value.some(
    selected => selected.i === component.i
  )
}

const onComponentClick = (component: LayoutItem) => {
    // 创建组件副本，确保每次添加都是新的实例
    const componentCopy: LayoutItem = {
    ...component,
    x: 0,
    y: 0
  }
  onComponentSelect(componentCopy)
}

const handleOk = () => {
  if (selectedComponents.value.length > 0) {
    close()
    emit('confirm', selectedComponents.value)
    // 重置选择状态
    selectedComponents.value = []
  }
}

const close = () => {
  visible.value = false
}

const open = () => {
  visible.value = true
}

defineExpose({
  open,
  close
})
</script>

<style lang="scss" scoped>
.add-container {

  :deep(.arco-alert) {
    margin: 10px 0;
  }

  .component-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    .component-item {
      flex: 1;
    }
  }
}

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