export { default as GridDrag } from './components/GridDrag.vue';
export { default as GridsterItem } from './components/GridsterItem.vue';
export { default as AddComponent } from './components/AddComponent.vue';
export type { ComponentItemModel, GridConfig, Position, Size, ContainerInfo } from './types/layout';
export { validatePositionWithLayout, validateDragPosition, findAvailablePosition, snapToColumnGridWithSmartHeight, reorganizeLayout, autoFillComponentToGrid, resizeComponentWithAutoFill, getAffectedComponents } from './utils/grid';
export { COLUMNS } from './utils/constant';
import type { App } from 'vue';
import GridDrag from './components/GridDrag.vue';
import GridsterItem from './components/GridsterItem.vue';
import AddComponent from './components/AddComponent.vue';
export declare function install(app: App): void;
export interface GridDragPlugin {
    install: (app: App) => void;
    GridDrag: typeof GridDrag;
    GridsterItem: typeof GridsterItem;
    AddComponent: typeof AddComponent;
}
declare const plugin: GridDragPlugin;
export default plugin;
