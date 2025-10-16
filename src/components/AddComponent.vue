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
      <ComponentLibrary
        :selectedComponents="selectedComponents"
        @select="onComponentSelect"
      />
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ComponentItemModel } from '../types/layout';
import ComponentLibrary from './ComponentLibrary.vue';

const visible = ref(false)
const selectedComponents  = ref<ComponentItemModel[]>([])

interface Emits {
  (e: 'confirm', components: ComponentItemModel[]): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

const onComponentSelect = (component: ComponentItemModel) => {
  const index = selectedComponents.value.findIndex(
    item => item.type === component.type
  )
  
  if (index > -1) {
    // 如果已存在，则移除
    selectedComponents.value.splice(index, 1)
  } else {
    // 如果不存在，则添加
    selectedComponents.value.push(component)
  }
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
</style>