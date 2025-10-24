import type { Component, App } from 'vue'
import './assets/style.scss'

// Vue插件安装函数
import GridDrag from './components/GridDrag.vue'
import GridsterItem from './components/GridsterItem.vue'
import AddComponent from './components/AddComponent.vue'

export * from './types/layout'

const components: {
  [propName: string]: Component
} = {
  GridDrag,
  GridsterItem,
  AddComponent
}

// 全局注册所有组件
const install = (app: App): void => {
  // 全局注册所有组件
  Object.entries(components).forEach(([name, component]) => {
    app.component(name, component as Component);
  });
};

// 创建默认导出
export default { install };