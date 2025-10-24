import { ComponentItemModel, GridConfig, Position, Size, ContainerInfo } from '../types/layout';
export declare function findAvailablePosition(components: ComponentItemModel[], newComponent: ComponentItemModel, containerInfo: ContainerInfo, gridConfig: GridConfig): Position | null;
export declare function snapToColumnGridWithSmartHeight(position: Position, componentSize: Size, components: ComponentItemModel[], currentId: string, containerInfo: ContainerInfo, gridConfig: GridConfig): Position;
export declare function reorganizeLayout(components: ComponentItemModel[], containerInfo: ContainerInfo, gridConfig: GridConfig, skipAutoFill?: boolean, onlyOnSizeIncrease?: boolean): boolean;
export declare function autoFillComponentToGrid(component: ComponentItemModel, gridConfig: GridConfig): void;
export declare function resizeComponentWithAutoFill(component: ComponentItemModel, newSize: Size, gridConfig: GridConfig): Size;
export declare function getAffectedComponents(components: ComponentItemModel[], resizingComponent: ComponentItemModel, newPosition: Position, newSize: Size, containerInfo: ContainerInfo, gridConfig: GridConfig, resizeType?: string): {
    affected: ComponentItemModel[];
    canResize: boolean;
};
export declare function validatePositionWithLayout(components: ComponentItemModel[], currentId: string, position: Position, size: Size, containerInfo: ContainerInfo, gridConfig: GridConfig, resizeType?: string): {
    valid: boolean;
    affectedComponents: ComponentItemModel[];
};
export declare function validateDragPosition(components: ComponentItemModel[], currentId: string, newPosition: Position, containerInfo: ContainerInfo, gridConfig: GridConfig): {
    valid: boolean;
    affectedComponents: ComponentItemModel[];
    finalPosition: Position;
};
export declare function adaptiveLayoutResize(components: ComponentItemModel[], oldCellWidth: number, newCellWidth: number, containerInfo: ContainerInfo): ComponentItemModel[];
export declare function adaptiveLayoutOnResize(components: ComponentItemModel[], oldContainerInfo: ContainerInfo, newContainerInfo: ContainerInfo, oldCellWidth: number, newCellWidth: number, gridConfig: GridConfig): ComponentItemModel[];
