export interface LayoutItemRequired {
    w: number;
    h: number;
    x: number;
    y: number;
    i: string;
}
export type LayoutItem = LayoutItemRequired & {
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    moved?: boolean;
    static?: boolean;
    isDraggable?: boolean;
    isResizable?: boolean;
    selected?: boolean;
    name?: string;
};
export type Layout = Array<LayoutItem>;
export type Size = {
    width: number;
    height: number;
};
/**
 * Return the bottom coordinate of the layout.
 *
 * @param  {Array} layout Layout array.
 * @return {Number}       Bottom coordinate.
 */
export declare function bottom(layout: Layout): number;
/**
 * 计算每列的高度
 * @param layout 布局数组
 * @param cols 列数
 * @returns 每列的高度数组
 */
export declare function getColumnHeights(layout: Layout, cols: number): number[];
/**
 * 找到可以放置组件的最佳位置
 * @param layout 当前布局
 * @param item 要放置的组件
 * @param cols 总列数
 * @param maxRows 最大行数
 * @returns 最佳位置 {x, y} 或 null（如果无法放置）
 */
export declare function findBestPosition(layout: Layout, item: LayoutItem, cols: number, maxRows: number): {
    x: number;
    y: number;
} | null;
/**
 * 检查组件是否与布局中的其他组件冲突
 * @param layout 布局数组
 * @param item 要检查的组件
 * @returns 是否有冲突
 */
export declare function hasCollisionInLayout(layout: Layout, item: LayoutItem): boolean;
/**
 * 智能添加组件到布局中
 * @param layout 当前布局
 * @param newItem 新组件
 * @param cols 列数
 * @param maxRows 最大行数
 * @returns 更新后的布局，如果无法添加则返回原布局
 */
export declare function smartAddItem(layout: Layout, newItem: LayoutItem, cols: number, maxRows: number): {
    layout: Layout;
    success: boolean;
};
export declare function cloneLayout(layout: Layout): Layout;
export declare function cloneLayoutItem(layoutItem: LayoutItem): LayoutItem;
/**
 * Given two layoutitems, check if they collide.
 *
 * @return {Boolean}   True if colliding.
 */
export declare function collides(l1: LayoutItem, l2: LayoutItem): boolean;
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
export declare function compact(layout: Layout, verticalCompact: boolean, minPositions?: any): Layout;
/**
 * Compact an item in the layout.
 */
export declare function compactItem(compareWith: Layout, l: LayoutItem, verticalCompact: boolean, minPositions?: any): LayoutItem;
/**
 * Given a layout, make sure all elements fit within its bounds.
 *
 * @param  {Array} layout Layout array.
 * @param  {Number} bounds Number of columns.
 */
export declare function correctBounds(layout: Layout, bounds: {
    cols: number;
}): Layout;
/**
 * Get a layout item by ID. Used so we can override later on if necessary.
 *
 * @param  {Array}  layout Layout array.
 * @param  {String} id     ID
 * @return {LayoutItem}    Item at ID.
 */
export declare function getLayoutItem(layout: Layout, id: string | number | undefined): LayoutItem | undefined;
/**
 * Returns the first item this layout collides with.
 * It doesn't appear to matter which order we approach this from, although
 * perhaps that is the wrong thing to do.
 *
 * @param  {Object} layoutItem Layout item.
 * @return {Object|undefined}  A colliding layout item, or undefined.
 */
export declare function getFirstCollision(layout: Layout, layoutItem: LayoutItem): LayoutItem | undefined;
export declare function getAllCollisions(layout: Layout, layoutItem: LayoutItem): Array<LayoutItem>;
/**
 * Get all static elements.
 * @param  {Array} layout Array of layout objects.
 * @return {Array}        Array of static layout items..
 */
export declare function getStatics(layout: Layout): Array<LayoutItem>;
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
export declare function moveElement(layout: Layout, l: LayoutItem, x: number | undefined, y: number | undefined, isUserAction?: boolean, preventCollision?: boolean): Layout;
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
export declare function moveElementAwayFromCollision(layout: Layout, collidesWith: LayoutItem, itemToMove: LayoutItem, isUserAction?: boolean): Layout;
/**
 * 检查元素是否在容器边界内
 * @param item 布局项
 * @param cols 列数
 * @param maxRows 最大行数
 * @returns 是否在边界内
 */
export declare function isWithinBounds(item: LayoutItem, cols: number, maxRows?: number): boolean;
/**
 * 将元素限制在容器边界内
 * @param item 布局项
 * @param cols 列数
 * @param maxRows 最大行数
 * @returns 调整后的布局项
 */
export declare function clampToBounds(item: LayoutItem, cols: number, maxRows?: number): LayoutItem;
/**
 * 检查移动或调整大小操作是否会导致其他元素超出容器边界
 * @param layout 当前布局
 * @param changedItem 发生变化的元素
 * @param cols 列数
 * @param maxRows 最大行数
 * @returns 是否会导致溢出
 */
export declare function wouldCauseOverflow(layout: Layout, changedItem: LayoutItem, cols: number, maxRows?: number): boolean;
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
export declare function safelyMoveElement(layout: Layout, l: LayoutItem, x: number | undefined, y: number | undefined, cols: number, maxRows: number | undefined, isUserAction?: boolean, preventCollision?: boolean): Layout;
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
export declare function safelyResizeElement(layout: Layout, item: LayoutItem, newW: number, newH: number, cols: number, maxRows?: number): boolean;
/**
 * Helper to convert a number to a percentage string.
 *
 * @param  {Number} num Any number
 * @return {String}     That number as a percentage.
 */
export declare function perc(num: number): string;
export interface TransformStyle {
    transform: string;
    WebkitTransform: string;
    MozTransform: string;
    msTransform: string;
    OTransform: string;
    width: string;
    height: string;
    position: "absolute" | "relative";
}
export declare function setTransform(top: number, left: number, width: number, height: number): TransformStyle;
/**
 * Just like the setTransform method, but instead it will return a negative value of right.
 *
 * @param top
 * @param right
 * @param width
 * @param height
 * @returns {{transform: string, WebkitTransform: string, MozTransform: string, msTransform: string, OTransform: string, width: string, height: string, position: string}}
 */
export declare function setTransformRtl(top: number, right: number, width: number, height: number): TransformStyle;
export interface TopLeftStyle {
    top: string;
    left: string;
    width: string;
    height: string;
    position: "absolute";
}
export declare function setTopLeft(top: number, left: number, width: number, height: number): TopLeftStyle;
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
    top: string;
    right: string;
    width: string;
    height: string;
    position: string;
}
export declare function setTopRight(top: number, right: number, width: number, height: number): TopRightStyle;
/**
 * Get layout items sorted from top left to right and down.
 *
 * @return {Array} Array of layout objects.
 * @return {Array}        Layout, sorted static items first.
 */
export declare function sortLayoutItemsByRowCol(layout: Layout): Layout;
/**
 * Validate a layout. Throws errors.
 *
 * @param  {Array}  layout        Array of layout items.
 * @param  {String} [contextName] Context name for errors.
 * @throw  {Error}                Validation error.
 */
export declare function validateLayout(layout: Layout, contextName?: string): void;
export declare function autoBindHandlers(el: HTMLElement, fns: Array<string>): void;
/**
 * Convert a JS object to CSS string. Similar to React's output of CSS.
 * @param obj
 * @returns {string}
 */
interface JSStyle {
    [key: string]: string;
}
export declare function createMarkup(obj: JSStyle): string;
export declare const IS_UNITLESS: {
    animationIterationCount: boolean;
    boxFlex: boolean;
    boxFlexGroup: boolean;
    boxOrdinalGroup: boolean;
    columnCount: boolean;
    flex: boolean;
    flexGrow: boolean;
    flexPositive: boolean;
    flexShrink: boolean;
    flexNegative: boolean;
    flexOrder: boolean;
    gridRow: boolean;
    gridColumn: boolean;
    fontWeight: boolean;
    lineClamp: boolean;
    lineHeight: boolean;
    opacity: boolean;
    order: boolean;
    orphans: boolean;
    tabSize: boolean;
    widows: boolean;
    zIndex: boolean;
    zoom: boolean;
    fillOpacity: boolean;
    stopOpacity: boolean;
    strokeDashoffset: boolean;
    strokeOpacity: boolean;
    strokeWidth: boolean;
};
/**
 * Will add px to the end of style values which are Numbers.
 * @param name
 * @param value
 * @returns {*}
 */
export declare function addPx(name: string, value: number | string): string | number;
/**
 * Hyphenate a camelCase string.
 *
 * @param {String} str
 * @return {String}
 */
export declare const hyphenateRE: RegExp;
export declare function hyphenate(str: string): string;
export declare function findItemInArray(array: Array<any>, property: string, value: any): boolean;
export declare function findAndRemove(array: Array<any>, property: string, value: any): void;
export {};
