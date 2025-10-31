<template>
  <header class="grid-header">
    <div class="grid-header_left"></div>
    <div class="grid-header_right">
      <a-space>
        <a-button type="primary" @click="openModal">添加组件</a-button>
        <a-button type="primary" @click="saveLayout">保存布局</a-button>
        <slot name="extra"></slot>
      </a-space>
    </div>
  </header>

  <AddComponent 
    ref="addComponentRef" 
    @confirm="confirmAdd" 
    :component-library="props.componentLibrary"
  >
    <template v-for="slot in Object.keys($slots)" :key="slot" #[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps || {}"></slot>
    </template>
  </AddComponent>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import AddComponent from './AddComponent.vue';
import { type Layout } from '../helpers';

const addComponentRef = ref()

const props = withDefaults(defineProps<{
  componentLibrary: Layout
}>(), {
  componentLibrary: () => []
})

const emits = defineEmits(['confirm-add', 'save'])

const confirmAdd = (components: Layout) => {
  emits('confirm-add', components)
}

const openModal = () => {
  addComponentRef.value.open()
}

const saveLayout = () => {
  emits('save')
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

</style>