// 导出组件
export { default as GridDrag } from './components/GridDrag.vue'
export { default as GridsterItem } from './components/GridsterItem.vue'
export { default as AddComponent } from './components/AddComponent.vue'

// 导出类型
export type {
  ComponentItemModel,
  GridConfig,
  Position,
  Size,
  ContainerInfo
} from './types/layout'

// 导出工具函数
export {
  validatePositionWithLayout,
  validateDragPosition,
  findAvailablePosition,
  snapToColumnGridWithSmartHeight,
  reorganizeLayout,
  autoFillComponentToGrid,
  resizeComponentWithAutoFill,
  getAffectedComponents
} from './utils/grid'

// 导出常量
export { COLUMNS } from './utils/constant'

// Vue插件安装函数
import type { App } from 'vue'
import GridDrag from './components/GridDrag.vue'
import GridsterItem from './components/GridsterItem.vue'
import AddComponent from './components/AddComponent.vue'

export function install(app: App): void {
  app.component('GridDrag', GridDrag)
  app.component('GridsterItem', GridsterItem)
  app.component('AddComponent', AddComponent)
}

// 插件对象
export interface GridDragPlugin {
  install: (app: App) => void
  GridDrag: typeof GridDrag
  GridsterItem: typeof GridsterItem
  AddComponent: typeof AddComponent
}

// 默认导出
const plugin: GridDragPlugin = {
  install,
  GridDrag,
  GridsterItem,
  AddComponent
}

export default plugin