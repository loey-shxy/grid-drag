export interface ComponentItemModel {
    id: string;
    name: string;
    width: number;
    height: number;
    x: number;
    y: number;
    type?: string;
    minWidth?: number;
    minHeight?: number;
}
export interface GridConfig {
    gap: number;
    cellWidth: number;
}
export interface Position {
    x: number;
    y: number;
}
export interface Size {
    width: number;
    height: number;
}
export interface ContainerInfo {
    width: number;
    height: number;
    scrollTop?: number;
}
