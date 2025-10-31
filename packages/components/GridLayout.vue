<template>
  <div class="grid-container">
    <div 
      ref="layoutRef" 
      class="grid-content" 
      :style="{
        padding: `${props.margin[1]}px ${props.margin[0]}px`,
      }"
    >
      <!-- 网格背景 -->
      <div class="grid-background" :style="gridBackgroundStyle">
        <div class="grid-cell" v-for="item in props.colNum" :key="item">
        </div>
      </div>
    
      <slot></slot>
      <GridItem
        class="grid-placeholder"
        v-show="isDragging"
        :x="placeholder.x"
        :y="placeholder.y"
        :w="placeholder.w"
        :h="placeholder.h"
        :i="placeholder.i"
      />
    </div>
  </div>
</template>

<script lang="ts" setup name="GridLayout">
export interface Placeholder {
  x: number
  y: number
  w: number
  h: number
  i: number | string
}

export interface Props {
  autoSize?: boolean
  colNum?: number
  rowHeight?: number
  maxRows?: number
  margin?: Array<number>
  isDraggable?: boolean
  isResizable?: boolean
  isMirrored?: boolean
  isBounded?: boolean
  useCssTransforms?: boolean
  verticalCompact?: boolean
  restoreOnDrag?: boolean
  layout: Layout
  responsive?: boolean
  keepAspectRatio?: boolean
  responsiveLayouts?: {[key: string]: any}
  transformScale?: number
  breakpoints?: {lg: number; md: number; sm: number; xs: number; xxs: number}
  cols?: {lg: number; md: number; sm: number; xs: number; xxs: number}
  preventCollision?:
    | boolean
    | (({layout, layoutItem}: {layout: Layout; layoutItem: LayoutItem}) => boolean)
  useStyleCursor?: boolean
  fixedHeight?: number // 新增：固定容器高度
  preventOverflow?: boolean // 新增：防止子元素溢出容器
}

export interface LayoutData {
  width: number | null
  mergeStyle: {[key: string]: string}
  lastLayoutLength: number
  isDragging: boolean
  placeholder: Placeholder
  layouts: {[key: string]: Layout | any}
  lastBreakpoint: string | null
  originalLayout: Layout
  erd: elementResizeDetectorMaker.Erd | null
  positionsBeforeDrag: {[key: string]: string}
  layoutRef: HTMLElement
}

import { ref, computed, onMounted, onBeforeUnmount, provide, onBeforeMount, nextTick, watch } from 'vue'
import mitt, { Emitter, EventType } from 'mitt'
import elementResizeDetectorMaker from 'element-resize-detector'

import GridItem from './GridItem.vue'

import {
  bottom,
  compact,
  getLayoutItem,
  moveElement,
  validateLayout,
  cloneLayout,
  getAllCollisions,
  getBreakpointFromWidth,
  getColsFromBreakpoint,
  findOrGenerateResponsiveLayout,
  addWindowEventListener, 
  removeWindowEventListener,
  smartAddItem,
  safelyMoveElement,
  safelyResizeElement,
  type Layout,
  type LayoutItem,
  type EventsData
} from '../helpers'

// Props Data
const props = withDefaults(defineProps<Props>(), {
  autoSize: true,
  colNum: 12,
  rowHeight: 0,
  keepAspectRatio: false,
  maxRows: Infinity,
  margin: () => [10, 10],
  isDraggable: true,
  isResizable: true,
  isMirrored: false,
  isBounded: false,
  useCssTransforms: true,
  verticalCompact: true,
  restoreOnDrag: false,
  responsive: false,
  responsiveLayouts: () => ({}),
  transformScale: 1,
  breakpoints: () => ({lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}),
  cols: () => ({lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}),
  preventCollision: false,
  useStyleCursor: true,
  fixedHeight: undefined,
  preventOverflow: true
})

const width = ref<number | null>(null)
const height = ref<number | null>(null)
const mergeStyle = ref<{[key: string]: string}>({})
const maxRows = ref<number>(0)
// console.log(mergeStyle)

const lastLayoutLength = ref<number>(0)
const isDragging = ref<boolean>(false)
const placeholder = ref<Placeholder>({x: 0, y: 0, w: 0, h: 0, i: -1})
const layouts = ref<{[key: string]: Layout | any}>({}) // array to store all layouts from different breakpoints
const lastBreakpoint = ref<string | null>(null) // store last active breakpoint
const originalLayout = ref<Layout>([])
const erd = ref<elementResizeDetectorMaker.Erd | null>(null)
const positionsBeforeDrag = ref<{[key: string]: string}>()
// layout dom
const layoutRef = ref<HTMLElement>({} as HTMLElement)
// default grid item
const defaultGridItem = ref()
const eventBus: Emitter<{
  resizeEvent?: EventsData
  dragEvent?: EventsData
  updateWidth: number | null
  setColNum: number
  setRowHeight: number
  setDraggable: boolean
  setResizable: boolean
  setBounded: boolean
  setTransformScale: number
  setMaxRows: number
  compact: void
}> = mitt()

const rowHeightComputed = computed(() => {
  if (!props.rowHeight && width.value && props.keepAspectRatio) {
    const colWidth = (width.value - props.margin[0]! * (props.colNum + 1)) / props.colNum
    return colWidth
  }
  return props.rowHeight || 100
})

provide("eventBus", eventBus)

const emit = defineEmits<{
  (e: "layout-created", layout: Layout): void
  (e: "layout-before-mount", layout: Layout): void
  (e: "layout-mounted", layout: Layout): void
  (e: "layout-updated", layout: Layout): void
  (e: "layout-ready", layout: Layout): void
  (e: "update:layout", layout: Layout): void
  (e: "breakpoint-changed", newBreakpoint: string, layout: Layout): void
  (e: "reset-selected"): void,
  (e: "update-width", {width, marginX}: {width: number; marginX: number}): void
}>()

const gridBackgroundStyle = computed(() => ({
    gridTemplateColumns: `repeat(${props.colNum}, minmax(0, 1fr))`,
    gap: `${props.margin[0]}px`,
    gridTemplateRows: `repeat(auto-fit, 100%)`,
    width: '100%',
    padding: `${props.margin[1]}px ${props.margin[0]}px`
}))

const resizeEventHandler = (data?: EventsData) => {
  if (!data) {
    resizeEvent()
  } else {
    const {eventType, i, x, y, h, w} = data
    resizeEvent(eventType, i, x, y, h, w)
  }
}

const dragEventHandler = (data?: EventsData) => {
  if (!data) {
    dragEvent()
  } else {
    const {eventType, i, x, y, h, w} = data
    dragEvent(eventType, i, x, y, h, w)
  }
}

eventBus.on("resizeEvent", resizeEventHandler)
eventBus.on("dragEvent", dragEventHandler)
emit("layout-created", props.layout)

onBeforeUnmount(() => {
  eventBus.off("resizeEvent", resizeEventHandler)
  eventBus.off("dragEvent", dragEventHandler)
  removeWindowEventListener("resize", onWindowResize)
  if (erd.value) {
    erd.value.uninstall(layoutRef.value)
  }
})

onBeforeMount(() => {
  emit("layout-before-mount", props.layout)
})

onMounted(() => {
  emit("layout-mounted", props.layout)
  nextTick(function () {
    validateLayout(props.layout)

    originalLayout.value = props.layout
    nextTick(() => {
      initResponsiveFeatures()

      onWindowResize()

      addWindowEventListener("resize", onWindowResize)

      compact(props.layout, props.verticalCompact)

      emit("layout-updated", props.layout)

      updateHeight()
      nextTick(() => {
        erd.value = elementResizeDetectorMaker({
          strategy: "scroll",
          callOnAdd: false
        })
        erd.value.listenTo(layoutRef.value, function () {
          onWindowResize()
        })
      })
    })
  })
})

watch(width, (newVal, oldVal) => {
  nextTick(() => {
    eventBus.emit("updateWidth", newVal)
    if (newVal != null) {
      emit("update-width", {
        width: newVal,
        marginX: props.margin[0]!
      })
    }
    if (oldVal === null) {
      nextTick(() => {
        emit("layout-ready", props.layout)
      })
    }
    updateHeight()
  })
})

watch(
  () => [props.layout, width.value],
  () => {
    layoutUpdate()
  }
)

watch(
  () => props.colNum,
  val => {
    eventBus.emit("setColNum", val)
  }
)
watch(
  () => rowHeightComputed.value,
  val => {
    eventBus.emit("setRowHeight", val)
  }
)
watch(
  () => props.isDraggable,
  val => {
    eventBus.emit("setDraggable", val)
  }
)
watch(
  () => props.isResizable,
  val => {
    eventBus.emit("setResizable", val)
  }
)
watch(
  () => props.isBounded,
  val => {
    eventBus.emit("setBounded", val)
  }
)

watch(
  () => props.transformScale,
  val => {
    eventBus.emit("setTransformScale", val)
  }
)
watch(
  () => props.responsive,
  val => {
    if (!val) {
      emit("update:layout", originalLayout.value || [])
      eventBus.emit("setColNum", props.colNum)
    }
    onWindowResize()
  }
)
watch(
  () => props.maxRows,
  val => {
    eventBus.emit("setMaxRows", val)
  }
)

watch(
  () => [height.value, props.rowHeight, props.fixedHeight],
  () => {
    const containerHeight = props.fixedHeight || height.value
    if (containerHeight && rowHeightComputed.value) {
      const rows = Math.floor((containerHeight - props.margin[1]!) / (rowHeightComputed.value + props.margin[1]!));
      maxRows.value = rows
      eventBus.emit("setMaxRows", maxRows.value)
    }
  },
  { immediate: true }
)

watch(
  () => props.margin,
  () => {
    updateHeight()
  }
)

const layoutUpdate = () => {
  if (props.layout !== undefined && originalLayout.value !== null) {
    if (props.layout.length !== originalLayout.value.length) {

      let diff = findDifference(props.layout, originalLayout.value)
      if (diff.length > 0) {
        if (props.layout.length > originalLayout.value.length) {
          originalLayout.value = originalLayout.value.concat(diff)
        } else {
          originalLayout.value = originalLayout.value.filter(obj => {
            return !diff.some(obj2 => {
              return obj.i === obj2.i
            })
          })
        }
      }

      lastLayoutLength.value = props.layout.length
      initResponsiveFeatures()
    }

    compact(props.layout, props.verticalCompact)
    eventBus.emit("updateWidth", width.value)
    updateHeight()
    emit("layout-updated", props.layout)
  }
}

const updateHeight = () => {
  mergeStyle.value = {
    height: containerHeight()
  }
}

const onWindowResize = () => {
  if (layoutRef.value !== null && layoutRef.value !== undefined) {
    width.value = layoutRef.value.offsetWidth
    height.value = layoutRef.value.offsetHeight
  }
  eventBus.emit("resizeEvent")
}

const containerHeight = () => {
  if (!props.autoSize) return ""
  
  // 如果设置了固定高度，使用固定高度
  if (props.fixedHeight) {
    return props.fixedHeight + "px"
  }
  
  // 如果设置了容器高度限制，使用容器高度
  if (height.value && props.maxRows !== Infinity) {
    return height.value + "px"
  }
  
  const containerHeight =
    bottom(props.layout) * (rowHeightComputed.value + props.margin[1]!) + props.margin[1]! + "px"
  return containerHeight
}

const layoutBottom = computed(() => bottom(props.layout))

const dragEvent = (
  eventName?: EventType,
  id?: string | number,
  x?: number,
  y?: number,
  h?: number,
  w?: number
) => {
  let l = getLayoutItem(props.layout, id)
  if (!l?.selected) {
    emit("reset-selected")
  }

  if (l === undefined || l === null) {
    l = {x: 0, y: 0} as LayoutItem
  }

  if (eventName === "dragstart" && !props.verticalCompact) {
    positionsBeforeDrag.value = props.layout.reduce(
      (result, {i, x, y}) => ({
        ...result,
        [i]: {x, y}
      }),
      {}
    )
  }

  if (eventName === "dragmove" || eventName === "dragstart") {
    nextTick(function () {
      isDragging.value = true
    })
    eventBus.emit("updateWidth", width.value)
  } else {
    nextTick(function () {
      isDragging.value = false
    })
  }

  const preventCollision = getPreventCollisionValue(l)
  
  // 如果启用了防溢出，使用安全移动函数
  let layout: Layout
  if (props.preventOverflow && maxRows.value !== Infinity) {
    layout = safelyMoveElement(props.layout, l, x, y, props.colNum, maxRows.value, true, preventCollision)
  } else {
    layout = moveElement(props.layout, l, x, y, true, preventCollision)
  }
  
  emit("update:layout", layout)

  if (props.restoreOnDrag) {
    l.static = true
    compact(props.layout, props.verticalCompact, positionsBeforeDrag.value)
    l.static = false
  } else {
    compact(props.layout, props.verticalCompact)
  }

  eventBus.emit("compact")
  updateHeight()
  if (eventName === "dragend") {
    positionsBeforeDrag.value = undefined
    emit("layout-updated", layout)
  }
}

const getPreventCollisionValue = (layoutItem: LayoutItem) => {
  if (typeof props.preventCollision === "function") {
    return props.preventCollision({
      layout: props.layout,
      layoutItem: layoutItem
    })
  }
  return props.preventCollision
}

const resizeEvent = (
  eventName?: EventType,
  id?: string | number,
  x?: number,
  y?: number,
  h?: number,
  w?: number
) => {
  let l = getLayoutItem(props.layout, id)

  if (l === undefined || l === null) {
    l = {h: 0, w: 0} as LayoutItem
  }
  w = Number(w)
  h = Number(h)
  let hasCollisions
  const preventCollision = getPreventCollisionValue(l)

  if (preventCollision) {
    const collisions = getAllCollisions(props.layout, {...l, w, h}).filter(
      layoutItem => layoutItem.i !== l?.i
    )
    hasCollisions = collisions.length > 0

    if (hasCollisions) {
      let leastX = Infinity,
        leastY = Infinity
      collisions.forEach(layoutItem => {
        if (layoutItem.x > Number(l?.x)) leastX = Math.min(leastX, layoutItem.x)
        if (layoutItem.y > Number(l?.y)) leastY = Math.min(leastY, layoutItem.y)
      })

      if (Number.isFinite(leastX)) l.w = leastX - l.x
      if (Number.isFinite(leastY)) l.h = leastY - l.y
    }
  }

  if (!hasCollisions) {
    // 如果启用了防溢出，检查调整大小是否安全
    if (props.preventOverflow && maxRows.value !== Infinity) {
      const isSafe = safelyResizeElement(props.layout, l, w, h, props.colNum, maxRows.value)
      if (isSafe) {
        l.w = w
        l.h = h
      }
      // 如果不安全，保持原始尺寸，不进行调整
    } else {
      l.w = w
      l.h = h
    }
  }

  if (eventName === "resizestart" || eventName === "resizemove") {
    placeholder.value.i = id as string | number
    placeholder.value.x = x as number
    placeholder.value.y = y as number
    placeholder.value.w = l.w as number
    placeholder.value.h = l.h as number
    nextTick(function () {
      isDragging.value = true
    })
    eventBus.emit("updateWidth", width.value)
  } else {
    nextTick(function () {
      isDragging.value = false
    })
  }

  if (props.responsive) responsiveGridLayout()

  compact(props.layout, props.verticalCompact)
  eventBus.emit("compact")
  updateHeight()

  if (eventName === "resizeend") emit("layout-updated", props.layout)
}

const responsiveGridLayout = () => {
  let newBreakpoint = getBreakpointFromWidth(props.breakpoints, width.value as number)
  let newCols = getColsFromBreakpoint(newBreakpoint, props.cols)

  // save actual layout in layouts
  if (lastBreakpoint.value != null && !layouts.value[lastBreakpoint.value])
    layouts.value[lastBreakpoint.value] = cloneLayout(props.layout)

  // Find or generate a new layout.
  let layout = findOrGenerateResponsiveLayout(
    originalLayout.value as Layout,
    layouts.value,
    props.breakpoints,
    newBreakpoint,
    lastBreakpoint.value as string,
    newCols,
    props.verticalCompact
  )

  // Store the new layout.
  layouts.value[newBreakpoint] = layout

  if (lastBreakpoint.value !== newBreakpoint) {
    emit("breakpoint-changed", newBreakpoint, layout)
  }

  // new prop sync
  emit("update:layout", layout)

  lastBreakpoint.value = newBreakpoint
  eventBus.emit("setColNum", getColsFromBreakpoint(newBreakpoint, props.cols))
}

const initResponsiveFeatures = () => {
  layouts.value = Object.assign({}, props.responsiveLayouts)
}

const findDifference = (layout: Layout, originalLayout: Layout) => {
  let uniqueResultOne = layout.filter(function (obj) {
    return !originalLayout.some(function (obj2) {
      return obj.i === obj2.i
    })
  })

  let uniqueResultTwo = originalLayout.filter(function (obj) {
    return !layout.some(function (obj2) {
      return obj.i === obj2.i
    })
  })

  return uniqueResultOne.concat(uniqueResultTwo)
}

/**
 * 智能添加组件的方法
 * @param newItems 要添加的组件数组
 * @returns 添加结果
 */
const addItemsIntelligently = (newItems: LayoutItem[]) => {
  let currentLayout = [...props.layout]
  const addedItems: LayoutItem[] = []
  const failedItems: LayoutItem[] = []
  
  for (const item of newItems) {
    const result = smartAddItem(currentLayout, item, props.colNum, maxRows.value)
    if (result.success) {
      currentLayout = result.layout
      addedItems.push(currentLayout[currentLayout.length - 1]!)
    } else {
      failedItems.push(item)
    }
  }
  
  if (addedItems.length > 0) {
    emit("update:layout", currentLayout)
    compact(currentLayout, props.verticalCompact)
    updateHeight()
    emit("layout-updated", currentLayout)
  }
  
  return {
    addedItems,
    failedItems,
    success: addedItems.length > 0
  }
}

defineExpose({
  ...props,
  width,
  height,
  mergeStyle,
  lastLayoutLength,
  isDragging,
  placeholder,
  layouts,
  lastBreakpoint,
  originalLayout,
  erd,
  defaultGridItem,
  dragEvent,
  rowHeightComputed,
  layoutBottom,
  addItemsIntelligently,
  colNum: props.colNum,
  maxRows
})

</script>

<style lang="scss" scoped>
.grid-placeholder {
  display: none !important;
}

.grid-container {
  display: flex;
  height: 100%;
  min-height: 100px;
  overflow: hidden;
  background: #fff;
}

.grid-content {
  height: 100%;
  width: 100%;
  position: relative;
  flex: 1;
  display: grid;
  position: relative;
  overflow: hidden; /* 防止出现滚动条 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  justify-content: start;
  align-content: start;
  min-width: 0;
}

.grid-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
  background: #fff;
  display: grid;
  overflow: hidden;

  .grid-cell {
    background: #f0f5f5;
    height: 100%;
  }
}
</style>
