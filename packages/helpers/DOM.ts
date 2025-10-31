export type Direction = "ltr" | "rtl" | "auto"

let currentDir: Direction = "auto"

function hasDocument(): boolean {
  return typeof document !== "undefined"
}

function hasWindow(): boolean {
  return typeof window !== "undefined"
}

export function getDocumentDir(): Direction | string {
  if (!hasDocument()) {
    return currentDir
  }
  const direction =
    typeof document.dir !== "undefined"
      ? document.dir
      : document.getElementsByTagName("html")[0]!.getAttribute("dir") || "auto"
  return direction
}

export function setDocumentDir(dir: Direction): boolean {
  // export function setDocumentDir(dir){
  if (!hasDocument) {
    currentDir = dir
    return false
  }

  const html = document.getElementsByTagName("html")[0]!
  html.setAttribute("dir", dir)
  return true
}

export function addWindowEventListener(event: string, callback: () => any): boolean {
  if (!hasWindow) {
    callback()
    return false
  }
  window.addEventListener(event, callback)
  return true
}

export function removeWindowEventListener(event: string, callback: () => any) {
  if (!hasWindow) {
    return
  }
  window.removeEventListener(event, callback)
}

export interface EventsData {
  eventType: string | symbol
  i: string | number
  x: number
  y: number
  h: number
  w: number
}

export function gridItemWidthToColNum(
  containerWidth: number,
  colNum: number,
  gap: number,
  width: number
) {
  // 计算单个栅格列的宽度
  const colWidth = calcColWidth(containerWidth, colNum, gap)
  console.log(colWidth)
  const colsNeeded = Math.round((width + gap) / (colWidth + gap));

  // 确保结果在合理范围内
  return Math.max(1, Math.min(colsNeeded, colNum));
}

export function gridItemHeightToRowNum(
  rowHeight: number,
  gap: number,
  height: number
) {
  return Math.round((height + gap) / (rowHeight + gap));
}

export const calcColWidth = (containerWidth: number, cols: number, gap: number) => {
  const totalGapWidth = (cols - 1) * gap
  const cellWidth = (containerWidth - totalGapWidth - gap * 2) / cols

  return cellWidth
}

/**
 * 检查位置是否在容器边界内
 * @param x X坐标
 * @param y Y坐标
 * @param w 宽度
 * @param h 高度
 * @param containerWidth 容器宽度
 * @param containerHeight 容器高度
 * @param cols 列数
 * @param rowHeight 行高
 * @param gap 间距
 * @returns 是否在边界内
 */
export function isPositionWithinBounds(
  x: number,
  y: number,
  w: number,
  h: number,
  containerWidth: number,
  containerHeight: number,
  cols: number,
  rowHeight: number,
  gap: number
): boolean {
  // 检查是否超出列边界
  if (x < 0 || x + w > cols) {
    return false
  }

  // 检查是否超出行边界
  const itemBottom = (y + h) * (rowHeight + gap) + gap
  if (y < 0 || itemBottom > containerHeight) {
    return false
  }

  return true
}