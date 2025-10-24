export interface ComponentItemModel  {
  id: string;
  name: string;
  width: number;  // 栅格单位
  height: number; // 栅格单位
  x: number;      // 栅格坐标
  y: number;      // 栅格坐标
  type?: string;
  minWidth?: number;
  minHeight?: number;
}

export interface GridConfig {
  gap: number;
  cellWidth: number; // 每列的像素宽度（动态计算）
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
  width: number;  // 容器宽度
  height: number; // 容器高度
  scrollTop?: number; // 滚动位置
}