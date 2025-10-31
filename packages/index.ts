import type { Component, App } from 'vue'
import './assets/style.scss'

// Vue插件安装函数
import GridLayout from './components/GridLayout.vue'
import GridItem from './components/GridItem.vue'
import GridHeader from './components/GridHeader.vue'

export * from './helpers'

const components: {
  [propName: string]: Component
} = {
  GridLayout,
  GridItem,
  GridHeader
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