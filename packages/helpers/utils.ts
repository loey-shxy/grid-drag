export interface LayoutItemRequired {
  w: number
  h: number
  x: number
  y: number
  i: string
}
export type LayoutItem = LayoutItemRequired & {
  minW?: number
  minH?: number
  maxW?: number
  maxH?: number
  moved?: boolean
  static?: boolean
  isDraggable?: boolean
  isResizable?: boolean
  selected?: boolean
  name?: string
}

export type Layout = Array<LayoutItem>
export type Size = {width: number; height: number}
/**
 * Return the bottom coordinate of the layout.
 *
 * @param  {Array} layout Layout array.
 * @return {Number}       Bottom coordinate.
 */
export function bottom(layout: Layout): number {
  let max = 0,
    bottomY
  for (let i = 0, len = layout.length; i < len; i++) {
    bottomY = layout[i]!.y + layout[i]!.h
    if (bottomY > max) max = bottomY
  }
  return max
}

/**
 * 计算每列的高度
 * @param layout 布局数组
 * @param cols 列数
 * @returns 每列的高度数组
 */
export function getColumnHeights(layout: Layout, cols: number): number[] {
  const columnHeights = new Array(cols).fill(0)
  
  for (const item of layout) {
    const startCol = item.x
    const endCol = Math.min(item.x + item.w, cols)
    const itemBottom = item.y + item.h
    
    // 更新该组件覆盖的所有列的高度
    for (let col = startCol; col < endCol; col++) {
      columnHeights[col] = Math.max(columnHeights[col], itemBottom)
    }
  }
  
  return columnHeights
}

/**
 * 找到可以放置组件的最佳位置
 * @param layout 当前布局
 * @param item 要放置的组件
 * @param cols 总列数
 * @param maxRows 最大行数
 * @returns 最佳位置 {x, y} 或 null（如果无法放置）
 */
export function findBestPosition(
  layout: Layout, 
  item: LayoutItem, 
  cols: number, 
  maxRows: number
): {x: number, y: number} | null {
  const columnHeights = getColumnHeights(layout, cols)
  
  // 如果组件宽度超过总列数，调整为最大列数
  const itemWidth = Math.min(item.w, cols)
  
  let bestPosition: {x: number, y: number} | null = null
  let minY = Infinity
  
  // 遍历所有可能的x位置
  for (let x = 0; x <= cols - itemWidth; x++) {
    // 计算在这个x位置放置组件需要的y坐标
    let maxHeightInRange = 0
    for (let col = x; col < x + itemWidth; col++) {
      maxHeightInRange = Math.max(maxHeightInRange, columnHeights[col])
    }
    
    const y = maxHeightInRange
    
    // 检查是否超出容器高度限制
    if (y + item.h > maxRows) {
      continue
    }
    
    // 检查是否与现有组件冲突
    const testItem = { ...item, x, y }
    if (!hasCollisionInLayout(layout, testItem)) {
      // 选择y坐标最小的位置（优先放在上方）
      if (y < minY) {
        minY = y
        bestPosition = { x, y }
      }
    }
  }
  
  return bestPosition
}

/**
 * 检查组件是否与布局中的其他组件冲突
 * @param layout 布局数组
 * @param item 要检查的组件
 * @returns 是否有冲突
 */
export function hasCollisionInLayout(layout: Layout, item: LayoutItem): boolean {
  return layout.some(layoutItem => 
    layoutItem.i !== item.i && collides(layoutItem, item)
  )
}

/**
 * 智能添加组件到布局中
 * @param layout 当前布局
 * @param newItem 新组件
 * @param cols 列数
 * @param maxRows 最大行数
 * @returns 更新后的布局，如果无法添加则返回原布局
 */
export function smartAddItem(
  layout: Layout, 
  newItem: LayoutItem, 
  cols: number, 
  maxRows: number
): {layout: Layout, success: boolean} {
  const position = findBestPosition(layout, newItem, cols, maxRows)
  
  if (position) {
    const updatedItem = { ...newItem, x: position.x, y: position.y }
    return {
      layout: [...layout, updatedItem],
      success: true
    }
  }
  
  return {
    layout,
    success: false
  }
}

export function cloneLayout(layout: Layout): Layout {
  const newLayout = Array(layout.length)
  for (let i = 0, len = layout.length; i < len; i++) {
    newLayout[i] = cloneLayoutItem(layout[i]!)
  }
  return newLayout
}

export function cloneLayoutItem(layoutItem: LayoutItem): LayoutItem {
  return JSON.parse(JSON.stringify(layoutItem))
}

/**
 * Given two layoutitems, check if they collide.
 *
 * @return {Boolean}   True if colliding.
 */
export function collides(l1: LayoutItem, l2: LayoutItem): boolean {
  if (l1 === l2) return false // same element
  if (l1.x + l1.w <= l2.x) return false // l1 is left of l2
  if (l1.x >= l2.x + l2.w) return false // l1 is right of l2
  if (l1.y + l1.h <= l2.y) return false // l1 is above l2
  if (l1.y >= l2.y + l2.h) return false // l1 is below l2
  return true // boxes overlap
}

/**
 * Given a layout, compact it. This involves going down each y coordinate and removing gaps
 * between items.
 *
 * @param  {Array} layout Layout.
 * @param  {Boolean} verticalCompact Whether or not to compact the layout
 *   vertically.
 * @param {Object} minPositions
 * @return {Array}       Compacted Layout.
 */
export function compact(layout: Layout, verticalCompact: boolean, minPositions?: any): Layout {
  // Statics go in the compareWith array right away so items flow around them.
  const compareWith = getStatics(layout)
  // We go through the items by row and column.
  const sorted = sortLayoutItemsByRowCol(layout)
  // Holding for new items.
  const out = Array(layout.length)

  for (let i = 0, len = sorted.length; i < len; i++) {
    let l = sorted[i]!

    // Don't move static elements
    if (!l.static) {
      l = compactItem(compareWith, l, verticalCompact, minPositions)

      // Add to comparison array. We only collide with items before this one.
      // Statics are already in this array.
      compareWith.push(l)
    }

    // Add to output array to make sure they still come out in the right order.
    out[layout.indexOf(l)] = l

    // Clear moved flag, if it exists.
    l.moved = false
  }

  return out
}

/**
 * Compact an item in the layout.
 */
export function compactItem(
  compareWith: Layout,
  l: LayoutItem,
  verticalCompact: boolean,
  minPositions?: any
): LayoutItem {
  if (verticalCompact) {
    // Move the element up as far as it can go without colliding.
    while (l.y > 0 && !getFirstCollision(compareWith, l)) {
      l.y--
    }
  } else if (minPositions) {
    const minY = minPositions[l.i].y
    while (l.y > minY && !getFirstCollision(compareWith, l)) {
      l.y--
    }
  }

  // Move it down, and keep moving it down if it's colliding.
  let collides
  while ((collides = getFirstCollision(compareWith, l))) {
    l.y = collides.y + collides.h
  }
  return l
}

/**
 * Given a layout, make sure all elements fit within its bounds.
 *
 * @param  {Array} layout Layout array.
 * @param  {Number} bounds Number of columns.
 */
export function correctBounds(layout: Layout, bounds: {cols: number}): Layout {
  const collidesWith = getStatics(layout)
  for (let i = 0, len = layout.length; i < len; i++) {
    const l = layout[i]!
    // Overflows right
    if (l.x + l.w > bounds.cols) l.x = bounds.cols - l.w
    // Overflows left
    if (l.x < 0) {
      l.x = 0
      l.w = bounds.cols
    }
    if (!l.static) collidesWith.push(l)
    else {
      // If this is static and collides with other statics, we must move it down.
      // We have to do something nicer than just letting them overlap.
      while (getFirstCollision(collidesWith, l)) {
        l.y++
      }
    }
  }
  return layout
}

/**
 * Get a layout item by ID. Used so we can override later on if necessary.
 *
 * @param  {Array}  layout Layout array.
 * @param  {String} id     ID
 * @return {LayoutItem}    Item at ID.
 */
export function getLayoutItem(
  layout: Layout,
  id: string | number | undefined
): LayoutItem | undefined {
  for (let i = 0, len = layout.length; i < len; i++) {
    if (layout[i]!.i === id) return layout[i]
  }
}

/**
 * Returns the first item this layout collides with.
 * It doesn't appear to matter which order we approach this from, although
 * perhaps that is the wrong thing to do.
 *
 * @param  {Object} layoutItem Layout item.
 * @return {Object|undefined}  A colliding layout item, or undefined.
 */
export function getFirstCollision(layout: Layout, layoutItem: LayoutItem): LayoutItem | undefined {
  for (let i = 0, len = layout.length; i < len; i++) {
    if (collides(layout[i]!, layoutItem)) return layout[i]
  }
}

export function getAllCollisions(layout: Layout, layoutItem: LayoutItem): Array<LayoutItem> {
  return layout.filter(l => collides(l, layoutItem))
}

/**
 * Get all static elements.
 * @param  {Array} layout Array of layout objects.
 * @return {Array}        Array of static layout items..
 */
export function getStatics(layout: Layout): Array<LayoutItem> {
  //return [];
  return layout.filter(l => l.static)
}

/**
 * Move an element. Responsible for doing cascading movements of other elements.
 *
 * @param  {Array}      layout Full layout to modify.
 * @param  {LayoutItem} l      element to move.
 * @param  {Number}     [x]    X position in grid units.
 * @param  {Number}     [y]    Y position in grid units.
 * @param  {Boolean}    [isUserAction] If true, designates that the item we're moving is
 *                                     being dragged/resized by th euser.
 */
export function moveElement(
  layout: Layout,
  l: LayoutItem,
  x: number | undefined,
  y: number | undefined,
  isUserAction?: boolean,
  preventCollision?: boolean
): Layout {
  if (l.static) return layout

  // Short-circuit if nothing to do.
  //if (l.y === y && l.x === x) return layout;

  const oldX = l.x
  const oldY = l.y

  const movingUp = y && l.y > y
  // This is quite a bit faster than extending the object
  if (typeof x === "number") l.x = x
  if (typeof y === "number") l.y = y
  l.moved = true

  // If this collides with anything, move it.
  // When doing this comparison, we have to sort the items we compare with
  // to ensure, in the case of multiple collisions, that we're getting the
  // nearest collision.
  let sorted = sortLayoutItemsByRowCol(layout)
  if (movingUp) sorted = sorted.reverse()
  const collisions = getAllCollisions(sorted, l)

  if (preventCollision && collisions.length) {
    l.x = oldX
    l.y = oldY
    l.moved = false
    return layout
  }

  // Move each item that collides away from this element.
  for (let i = 0, len = collisions.length; i < len; i++) {
    const collision = collisions[i]!
    // console.log('resolving collision between', l.i, 'at', l.y, 'and', collision.i, 'at', collision.y);

    // Short circuit so we can't infinite loop
    if (collision.moved) continue

    // This makes it feel a bit more precise by waiting to swap for just a bit when moving up.
    if (l.y > collision.y && l.y - collision.y > collision.h / 4) continue

    // Don't move static items - we have to move *this* element away
    if (collision.static) {
      layout = moveElementAwayFromCollision(layout, collision, l, isUserAction)
    } else {
      layout = moveElementAwayFromCollision(layout, l, collision, isUserAction)
    }
  }

  return layout
}

/**
 * This is where the magic needs to happen - given a collision, move an element away from the collision.
 * We attempt to move it up if there's room, otherwise it goes below.
 *
 * @param  {Array} layout            Full layout to modify.
 * @param  {LayoutItem} collidesWith Layout item we're colliding with.
 * @param  {LayoutItem} itemToMove   Layout item we're moving.
 * @param  {Boolean} [isUserAction]  If true, designates that the item we're moving is being dragged/resized
 *                                   by the user.
 */
export function moveElementAwayFromCollision(
  layout: Layout,
  collidesWith: LayoutItem,
  itemToMove: LayoutItem,
  isUserAction?: boolean
): Layout {
  const preventCollision = false // we're already colliding
  // If there is enough space above the collision to put this element, move it there.
  // We only do this on the main collision as this can get funky in cascades and cause
  // unwanted swapping behavior.
  if (isUserAction) {
    // Make a mock item so we don't modify the item here, only modify in moveElement.
    const fakeItem: LayoutItem = {
      x: itemToMove.x,
      y: itemToMove.y,
      w: itemToMove.w,
      h: itemToMove.h,
      i: "-1"
    }
    fakeItem.y = Math.max(collidesWith.y - itemToMove.h, 0)
    if (!getFirstCollision(layout, fakeItem)) {
      return moveElement(layout, itemToMove, undefined, fakeItem.y, preventCollision)
    }
  }
  /* 
  layout: Layout,
  l: LayoutItem,
  x: number,
  y: number,
  isUserAction: boolean,
  preventCollision: boolean
  */
  // Previously this was optimized to move below the collision directly, but this can cause problems
  // with cascading moves, as an item may actually leapflog a collision and cause a reversal in order.
  return moveElement(layout, itemToMove, undefined, itemToMove.y + 1, preventCollision)
}

/**
 * 检查元素是否在容器边界内
 * @param item 布局项
 * @param cols 列数
 * @param maxRows 最大行数
 * @returns 是否在边界内
 */
export function isWithinBounds(item: LayoutItem, cols: number, maxRows?: number): boolean {
  // 检查左右边界
  if (item.x < 0 || item.x + item.w > cols) {
    return false
  }
  
  // 检查上下边界
  if (item.y < 0) {
    return false
  }
  
  if (maxRows && item.y + item.h > maxRows) {
    return false
  }
  
  return true
}

/**
 * 将元素限制在容器边界内
 * @param item 布局项
 * @param cols 列数
 * @param maxRows 最大行数
 * @returns 调整后的布局项
 */
export function clampToBounds(item: LayoutItem, cols: number, maxRows?: number): LayoutItem {
  const clampedItem = { ...item }
  
  // 限制X坐标和宽度
  clampedItem.x = Math.max(0, Math.min(clampedItem.x, cols - clampedItem.w))
  if (clampedItem.x + clampedItem.w > cols) {
    clampedItem.w = cols - clampedItem.x
  }
  
  // 限制Y坐标
  clampedItem.y = Math.max(0, clampedItem.y)
  
  // 限制高度（如果有最大行数限制）
  if (maxRows && clampedItem.y + clampedItem.h > maxRows) {
    clampedItem.h = maxRows - clampedItem.y
  }
  
  return clampedItem
}

/**
 * 检查移动或调整大小操作是否会导致其他元素超出容器边界
 * @param layout 当前布局
 * @param changedItem 发生变化的元素
 * @param cols 列数
 * @param maxRows 最大行数
 * @returns 是否会导致溢出
 */
export function wouldCauseOverflow(
  layout: Layout,
  changedItem: LayoutItem,
  cols: number,
  maxRows?: number
): boolean {
  // 创建一个临时布局来模拟变化
  const tempLayout = layout.map(item => 
    item.i === changedItem.i ? { ...changedItem } : { ...item }
  )
  
  // 压缩布局，看看是否有元素会被推出边界
  const compactedLayout = compact(tempLayout, true)
  
  // 检查压缩后的布局是否有元素超出边界
  for (const item of compactedLayout) {
    if (!isWithinBounds(item, cols, maxRows)) {
      return true
    }
  }
  
  return false
}

/**
 * 安全地移动元素，如果会导致溢出则返回原始布局
 * @param layout 当前布局
 * @param l 要移动的元素
 * @param x 新的X坐标
 * @param y 新的Y坐标
 * @param cols 列数
 * @param maxRows 最大行数
 * @param isUserAction 是否为用户操作
 * @param preventCollision 是否防止碰撞
 * @returns 更新后的布局或原始布局
 */
export function safelyMoveElement(
  layout: Layout,
  l: LayoutItem,
  x: number | undefined,
  y: number | undefined,
  cols: number,
  maxRows: number | undefined,
  isUserAction?: boolean,
  preventCollision?: boolean
): Layout {
  if (l.static) return layout
  
  // 创建一个测试用的元素副本
  const testItem = { ...l }
  if (typeof x === "number") testItem.x = x
  if (typeof y === "number") testItem.y = y
  
  // 检查是否会导致溢出
  if (maxRows && wouldCauseOverflow(layout, testItem, cols, maxRows)) {
    return layout // 返回原始布局，阻止移动
  }
  
  // 如果不会溢出，执行正常的移动操作
  return moveElement(layout, l, x, y, isUserAction, preventCollision)
}

/**
 * 安全地调整元素大小，如果会导致溢出则返回false
 * @param layout 当前布局
 * @param item 要调整的元素
 * @param newW 新宽度
 * @param newH 新高度
 * @param cols 列数
 * @param maxRows 最大行数
 * @returns 是否允许调整大小
 */
export function safelyResizeElement(
  layout: Layout,
  item: LayoutItem,
  newW: number,
  newH: number,
  cols: number,
  maxRows?: number
): boolean {
  // 创建测试用的元素副本
  const testItem = { ...item, w: newW, h: newH }
  
  // 首先检查元素本身是否超出边界
  if (!isWithinBounds(testItem, cols, maxRows)) {
    return false
  }
  
  // 检查是否会导致其他元素溢出
  if (maxRows && wouldCauseOverflow(layout, testItem, cols, maxRows)) {
    return false
  }
  
  return true
}

/**
 * Helper to convert a number to a percentage string.
 *
 * @param  {Number} num Any number
 * @return {String}     That number as a percentage.
 */
export function perc(num: number): string {
  return num * 100 + "%"
}

export interface TransformStyle {
  transform: string
  WebkitTransform: string
  MozTransform: string
  msTransform: string
  OTransform: string
  width: string
  height: string
  position: "absolute" | "relative"
}

export function setTransform(
  top: number,
  left: number, 
  width: number,
  height: number
): TransformStyle {
  // Replace unitless items with px
  const translate = "translate3d(" + left + "px," + top + "px, 0)"
  return {
    transform: translate,
    WebkitTransform: translate,
    MozTransform: translate,
    msTransform: translate,
    OTransform: translate,
    width: width + "px",
    height: height + "px",
    position: "absolute"
  }
}
/**
 * Just like the setTransform method, but instead it will return a negative value of right.
 *
 * @param top
 * @param right
 * @param width
 * @param height
 * @returns {{transform: string, WebkitTransform: string, MozTransform: string, msTransform: string, OTransform: string, width: string, height: string, position: string}}
 */
export function setTransformRtl(
  top: number,
  right: number,
  width: number,
  height: number
): TransformStyle {
  // Replace unitless items with px
  const translate = "translate3d(" + right * -1 + "px," + top + "px, 0)"
  return {
    transform: translate,
    WebkitTransform: translate,
    MozTransform: translate,
    msTransform: translate,
    OTransform: translate,
    width: width + "px",
    height: height + "px",
    position: "absolute"
  }
}

export interface TopLeftStyle {
  top: string
  left: string
  width: string
  height: string
  position: "absolute"
}

export function setTopLeft(top: number, left: number, width: number, height: number): TopLeftStyle {
  return {
    top: top + "px",
    left: left + "px",
    width: width + "px",
    height: height + "px",
    position: "absolute"
  }
}
/**
 * Just like the setTopLeft method, but instead, it will return a right property instead of left.
 *
 * @param top
 * @param right
 * @param width
 * @param height
 * @returns {{top: string, right: string, width: string, height: string, position: string}}
 */

export interface TopRightStyle {
  top: string
  right: string
  width: string
  height: string
  position: string
}
export function setTopRight(
  top: number,
  right: number,
  width: number,
  height: number
): TopRightStyle {
  return {
    top: top + "px",
    right: right + "px",
    width: width + "px",
    height: height + "px",
    position: "absolute"
  }
}

/**
 * Get layout items sorted from top left to right and down.
 *
 * @return {Array} Array of layout objects.
 * @return {Array}        Layout, sorted static items first.
 */
export function sortLayoutItemsByRowCol(layout: Layout): Layout {
  const a: Array<LayoutItem> = []
  return a.concat(layout).sort(function (a, b) {
    if (a.y === b.y && a.x === b.x) {
      return 0
    }

    if (a.y > b.y || (a.y === b.y && a.x > b.x)) {
      return 1
    }

    return -1
  })
}

/**
 * Validate a layout. Throws errors.
 *
 * @param  {Array}  layout        Array of layout items.
 * @param  {String} [contextName] Context name for errors.
 * @throw  {Error}                Validation error.
 */
export function validateLayout(layout: Layout, contextName?: string): void {
  contextName = contextName || "Layout"
  const subProps = ["x", "y", "w", "h"]
  const keyArr = []
  if (!Array.isArray(layout)) throw new Error(contextName + " must be an array!")
  for (let i = 0, len = layout.length; i < len; i++) {
    const item = layout[i]!
    for (let j = 0; j < subProps.length; j++) {
      if (typeof item[subProps[j]] !== "number") {
        throw new Error(
          "VueGridLayout: " + contextName + "[" + i + "]." + subProps[j] + " must be a number!"
        )
      }
    }

    if (item.i === undefined || item.i === null) {
      throw new Error("VueGridLayout: " + contextName + "[" + i + "].i cannot be null!")
    }

    if (typeof item.i !== "number" && typeof item.i !== "string") {
      throw new Error("VueGridLayout: " + contextName + "[" + i + "].i must be a string or number!")
    }

    if (keyArr.indexOf(item.i) >= 0) {
      throw new Error("VueGridLayout: " + contextName + "[" + i + "].i must be unique!")
    }
    keyArr.push(item.i)

    if (item.static !== undefined && typeof item.static !== "boolean") {
      throw new Error("VueGridLayout: " + contextName + "[" + i + "].static must be a boolean!")
    }
  }
}

// Flow can't really figure this out, so we just use Object
export function autoBindHandlers(el: HTMLElement, fns: Array<string>): void {
  fns.forEach(key => (el[key] = el[key].bind(el)))
}

/**
 * Convert a JS object to CSS string. Similar to React's output of CSS.
 * @param obj
 * @returns {string}
 */
interface JSStyle {
  [key: string]: string
}
export function createMarkup(obj: JSStyle): string {
  const keys = Object.keys(obj)
  if (!keys.length) return ""
  let i
  const len = keys.length
  let result = ""

  for (i = 0; i < len; i++) {
    const key = keys[i]!
    const val = obj[key]!
    result += hyphenate(key) + ":" + addPx(key, val) + ";"
  }

  return result
}

/* The following list is defined in React's core */
export const IS_UNITLESS = {
  animationIterationCount: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridColumn: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  stopOpacity: true,
  strokeDashoffset: true,
  strokeOpacity: true,
  strokeWidth: true
}

/**
 * Will add px to the end of style values which are Numbers.
 * @param name
 * @param value
 * @returns {*}
 */
export function addPx(name: string, value: number | string) {
  if (typeof value === "number" && !IS_UNITLESS[name]) {
    return value + "px"
  } else {
    return value
  }
}

/**
 * Hyphenate a camelCase string.
 *
 * @param {String} str
 * @return {String}
 */

export const hyphenateRE = /([a-z\d])([A-Z])/g

export function hyphenate(str: string) {
  return str.replace(hyphenateRE, "$1-$2").toLowerCase()
}

export function findItemInArray(array: Array<any>, property: string, value: any) {
  for (let i = 0; i < array.length; i++) if (array[i][property] == value) return true

  return false
}

export function findAndRemove(array: Array<any>, property: string, value: any) {
  array.forEach(function (result, index) {
    if (result[property] === value) {
      //Remove from array
      array.splice(index, 1)
    }
  })
}
