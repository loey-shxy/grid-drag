# Vue Grid Layout

A flexible and intelligent Vue 3 grid layout component with drag & drop, resize, and smart collision detection.

## Features

- 🎯 **24-column grid system** - Fixed 24-column layout for consistent design
- 🖱️ **Drag & Drop** - Smooth dragging with smart grid snapping
- 📏 **Resize** - Intelligent resizing with collision detection
- 🧠 **Smart Layout** - Automatic component arrangement and collision avoidance
- 📱 **Responsive** - Adapts to container size changes
- 🎨 **Customizable** - Flexible styling and configuration options
- 🔧 **TypeScript** - Full TypeScript support

## Installation

```bash
npm install grid-drag
```

## Usage

### Basic Usage

```vue
<template>
  <div class="demo-container">
    <GridHeader :component-library="componentLibrary" @confirm-add="addComponents" @save="saveLayout">
    </GridHeader>
    <div class="demo-content">
      <GridLayout ref="gridLayoutRef" :layout.sync="layout" :col-num="24" :row-height="30" :prevent-overflow="true"
        :is-bounded="true">
        <GridItem v-for="item in layout" class="component-item" :key="item.i" :x="item.x" :y="item.y" :w="item.w"
          :h="item.h" :i="item.i" :static="item.static" @remove="removeItem">
        </GridItem>
      </GridLayout>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { GridLayout, GridItem, GridHeader } from 'grid-drag'
import 'grid-drag/lib/style.css'
import {
  gridItemWidthToColNum,
  gridItemHeightToRowNum,
  type Layout,
  type LayoutItem
} from 'grid-drag';

const componentLibrary = ref([
  {
    type: 'line-bar',
    name: '折线图',
    w: 400,   // 像素
    h: 300,  // 像素
    i: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'chart-bar',
    name: '柱状图',
    w: 350,   // 像素
    h: 200,  // 像素
    i: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'chart-pie',
    name: '饼图',
    w: 300,   // 像素
    h: 300,  // 像素
    i: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'table',
    name: '数据表格',
    w: 600,   // 像素
    h: 400,  // 像素
    i: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'card',
    name: '数据卡片',
    w: 300,   // 像素
    h: 300,  // 像素
    i: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'metric',
    name: '指标卡',
    w: 300,   // 像素
    h: 300,  // 像素
    i: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'text',
    name: '文本组件',
    w: 320,   // 像素
    h: 300,  // 像素
    i: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'image',
    name: '图片组件',
    w: 400,   // 像素
    h: 300,  // 像素
    i: useId(),
    x: 0,
    y: 0
  },
  {
    type: 'progress',
    name: '进度条',
    w: 360,   // 像素
    h: 300,  // 像素
    i: useId(),
    x: 0,
    y: 0
  }
])

const layout = ref<Layout>([])
const addComponents = (components: Layout) => {
  // 转换组件尺寸为网格单位
  const convertedComponents = components.map(item => ({
    ...item,
    w: gridItemWidthToColNum(
      gridLayoutRef.value.width,
      gridLayoutRef.value.colNum,
      gridLayoutRef.value.margin[0],
      item.w
    ),
    h: gridItemHeightToRowNum(
      gridLayoutRef.value.rowHeightComputed,
      gridLayoutRef.value.margin[1],
      item.h
    )
  }))

  // 使用智能添加方法
  const result = gridLayoutRef.value.addItemsIntelligently(convertedComponents)

  layout.value = [...layout.value, ...result.addedItems]
  if (result.failedItems.length > 0) {
    console.warn(`无法添加 ${result.failedItems.length} 个组件，容器空间不足`)
    // 可以在这里添加用户提示
  }

  if (result.success) {
    console.log(`成功添加 ${result.addedItems.length} 个组件`)
  }
}

const removeItem = (id?: string) => {
  if (id) {
    const index = layout.value.findIndex(item => item.i === id)

    if (index >= 0) {
      layout.value.splice(index, 1)
    }
  }
}
</script>
```

### Global Registration

```js
import { createApp } from 'vue'
import GridDrag from 'grid-drag'
import 'grid-drag/lib/style.css'

const app = createApp(App)
app.use(GridDrag)
```

## API

### GridLayout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `layout` | `Layout` | `[]` | 布局数组，包含所有网格项的位置和尺寸信息 |
| `colNum` | `number` | `12` | 网格列数 |
| `rowHeight` | `number` | `0` | 行高（像素），为0时自动计算 |
| `maxRows` | `number` | `Infinity` | 最大行数 |
| `margin` | `[number, number]` | `[10, 10]` | 网格项间距 [水平, 垂直] |
| `isDraggable` | `boolean` | `true` | 是否可拖拽 |
| `isResizable` | `boolean` | `true` | 是否可调整大小 |
| `isBounded` | `boolean` | `false` | 是否限制在容器边界内 |
| `preventOverflow` | `boolean` | `true` | 是否防止溢出容器 |
| `useCssTransforms` | `boolean` | `true` | 是否使用CSS transforms进行定位 |
| `verticalCompact` | `boolean` | `true` | 是否启用垂直压缩 |
| `autoSize` | `boolean` | `true` | 是否自动调整容器大小 |
| `responsive` | `boolean` | `false` | 是否启用响应式布局 |
| `fixedHeight` | `number` | `undefined` | 固定容器高度 |
| `transformScale` | `number` | `1` | 变换缩放比例 |
| `useStyleCursor` | `boolean` | `true` | 是否使用样式光标 |

### GridItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `i` | `string \| number` | - | 网格项唯一标识符 |
| `x` | `number` | - | 网格X坐标 |
| `y` | `number` | - | 网格Y坐标 |
| `w` | `number` | - | 网格宽度（列数） |
| `h` | `number` | - | 网格高度（行数） |
| `minW` | `number` | `1` | 最小宽度 |
| `minH` | `number` | `1` | 最小高度 |
| `maxW` | `number` | `Infinity` | 最大宽度 |
| `maxH` | `number` | `Infinity` | 最大高度 |
| `static` | `boolean` | `false` | 是否为静态项（不可拖拽和调整大小） |
| `isDraggable` | `boolean` | `null` | 是否可拖拽（覆盖全局设置） |
| `isResizable` | `boolean` | `null` | 是否可调整大小（覆盖全局设置） |
| `selected` | `boolean` | `false` | 是否选中 |
| `preserveAspectRatio` | `boolean` | `false` | 是否保持宽高比 |

### GridHeader Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `componentLibrary` | `Layout` | `[]` | 组件库数组，用于添加新组件 |

### Events

#### GridLayout Events

| Event | Payload | Description |
|-------|---------|-------------|
| `layout-created` | `layout: Layout` | 布局创建时触发 |
| `layout-before-mount` | `layout: Layout` | 组件挂载前触发 |
| `layout-mounted` | `layout: Layout` | 组件挂载后触发 |
| `layout-updated` | `layout: Layout` | 布局更新时触发 |
| `layout-ready` | `layout: Layout` | 布局准备就绪时触发 |
| `update:layout` | `layout: Layout` | 布局变化时触发（用于v-model） |
| `breakpoint-changed` | `newBreakpoint: string, layout: Layout` | 响应式断点变化时触发 |
| `reset-selected` | - | 重置选中状态时触发 |
| `update-width` | `{width: number, marginX: number}` | 容器宽度变化时触发 |

#### GridItem Events

| Event | Payload | Description |
|-------|---------|-------------|
| `container-resized` | `i, h, w, height, width` | 容器大小变化时触发 |
| `resize` | `i, h, w, height, width` | 调整大小时触发 |
| `resized` | `i, h, w, height, width` | 调整大小结束时触发 |
| `move` | `i, x, y` | 移动时触发 |
| `moved` | `i, x, y` | 移动结束时触发 |
| `dragging` | `event, i` | 拖拽过程中触发 |
| `dragend` | `event, i` | 拖拽结束时触发 |
| `remove` | `i` | 移除项时触发 |

#### GridHeader Events

| Event | Payload | Description |
|-------|---------|-------------|
| `confirm-add` | `components: Layout` | 确认添加组件时触发 |
| `save` | - | 保存布局时触发 |

### Methods

#### GridLayout Methods

| Method | Parameters | Return | Description |
|--------|------------|--------|-------------|
| `addItemsIntelligently` | `newItems: LayoutItem[]` | `{addedItems: LayoutItem[], failedItems: LayoutItem[], success: boolean}` | 智能添加多个组件到布局中 |

### Types

```typescript
// 基础布局项接口
interface LayoutItemRequired {
  w: number        // 宽度（网格单位）
  h: number        // 高度（网格单位）
  x: number        // X坐标（网格单位）
  y: number        // Y坐标（网格单位）
  i: string        // 唯一标识符
}

// 完整布局项接口
interface LayoutItem extends LayoutItemRequired {
  minW?: number           // 最小宽度
  minH?: number           // 最小高度
  maxW?: number           // 最大宽度
  maxH?: number           // 最大高度
  moved?: boolean         // 是否已移动
  static?: boolean        // 是否为静态项
  isDraggable?: boolean   // 是否可拖拽
  isResizable?: boolean   // 是否可调整大小
  selected?: boolean      // 是否选中
  name?: string           // 显示名称
}

// 布局数组类型
type Layout = Array<LayoutItem>

// 事件数据接口
interface EventsData {
  eventType: string
  i: string | number
  x: number
  y: number
  h: number
  w: number
}

// 占位符接口
interface Placeholder {
  x: number
  y: number
  w: number
  h: number
  i: number | string
}

// 尺寸接口
interface Size {
  width: number
  height: number
}

// 位置接口
interface Position {
  x: number
  y: number
}

// 容器信息接口
interface ContainerInfo {
  width: number
  height: number
  scrollTop?: number
}

// 网格配置接口
interface GridConfig {
  gap: number
  cellWidth: number
}

// 组件项模型接口
interface ComponentItemModel {
  id: string
  name: string
  width: number
  height: number
  x: number
  y: number
  type?: string
  minWidth?: number
  minHeight?: number
}
```

### Utility Functions

```typescript
import {
  // 布局操作函数
  compact,
  moveElement,
  smartAddItem,
  safelyMoveElement,
  safelyResizeElement,
  
  // 碰撞检测函数
  collides,
  getAllCollisions,
  getFirstCollision,
  hasCollisionInLayout,
  
  // 位置计算函数
  findBestPosition,
  getColumnHeights,
  isWithinBounds,
  clampToBounds,
  
  // 布局工具函数
  cloneLayout,
  cloneLayoutItem,
  getLayoutItem,
  validateLayout,
  bottom,
  
  // 样式转换函数
  setTransform,
  setTransformRtl,
  setTopLeft,
  setTopRight,
  
  // 尺寸转换函数
  gridItemWidthToColNum,
  gridItemHeightToRowNum,
  calcColWidth,
  isPositionWithinBounds,
  
  // 类型定义
  type Layout,
  type LayoutItem,
  type EventsData,
  type Position,
  type Size
} from 'grid-drag'

// 使用示例

// 1. 智能添加组件
const result = smartAddItem(currentLayout, newItem, 24, maxRows)
if (result.success) {
  console.log('组件添加成功')
}

// 2. 检查碰撞
const hasCollision = collides(item1, item2)

// 3. 查找最佳位置
const position = findBestPosition(layout, newItem, 24, maxRows)

// 4. 安全移动元素
const newLayout = safelyMoveElement(layout, item, newX, newY, 24, maxRows)

// 5. 像素转网格单位
const colNum = gridItemWidthToColNum(containerWidth, 24, 10, pixelWidth)
const rowNum = gridItemHeightToRowNum(rowHeight, 10, pixelHeight)
```

## 完整示例

### 完整的Vue组件示例

```vue
<template>
  <div class="grid-demo">
    <!-- 头部工具栏 -->
    <GridHeader 
      :component-library="componentLibrary" 
      @confirm-add="handleAddComponents" 
      @save="handleSaveLayout"
    >
      <template #extra>
        <a-button @click="clearLayout">清空布局</a-button>
        <a-button @click="exportLayout">导出布局</a-button>
      </template>
    </GridHeader>

    <!-- 网格布局容器 -->
    <div class="grid-container">
      <GridLayout 
        ref="gridLayoutRef"
        v-model:layout="layout"
        :col-num="24"
        :row-height="30"
        :margin="[10, 10]"
        :prevent-overflow="true"
        :is-bounded="true"
        :fixed-height="600"
        @layout-updated="handleLayoutUpdated"
        @breakpoint-changed="handleBreakpointChanged"
      >
        <GridItem
          v-for="item in layout"
          :key="item.i"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :static="item.static"
          :min-w="2"
          :min-h="2"
          class="grid-item"
          @remove="handleRemoveItem"
        >
          <div class="item-content">
            <div class="item-header">
              <span>{{ item.name || `组件 ${item.i}` }}</span>
              <button @click="handleRemoveItem(item.i)" class="remove-btn">×</button>
            </div>
            <div class="item-body">
              <!-- 这里放置实际的组件内容 -->
              <component :is="getComponentByType(item.type)" v-bind="item.props" />
            </div>
          </div>
        </GridItem>
      </GridLayout>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { GridLayout, GridItem, GridHeader } from 'grid-drag'
import { 
  gridItemWidthToColNum, 
  gridItemHeightToRowNum,
  type Layout, 
  type LayoutItem 
} from 'grid-drag'
import 'grid-drag/lib/style.css'

// 响应式数据
const gridLayoutRef = ref()
const layout = ref<Layout>([
  { i: '1', x: 0, y: 0, w: 6, h: 4, name: '图表组件' },
  { i: '2', x: 6, y: 0, w: 6, h: 4, name: '数据表格' },
  { i: '3', x: 12, y: 0, w: 6, h: 4, name: '统计卡片' }
])

// 组件库配置
const componentLibrary = ref<Layout>([
  {
    type: 'chart',
    name: '图表组件',
    w: 400,
    h: 300,
    i: generateId(),
    x: 0,
    y: 0
  },
  {
    type: 'table',
    name: '数据表格',
    w: 600,
    h: 400,
    i: generateId(),
    x: 0,
    y: 0
  },
  {
    type: 'card',
    name: '统计卡片',
    w: 300,
    h: 200,
    i: generateId(),
    x: 0,
    y: 0
  }
])

// 工具函数
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function getComponentByType(type: string) {
  const componentMap = {
    chart: 'ChartComponent',
    table: 'TableComponent',
    card: 'CardComponent'
  }
  return componentMap[type] || 'div'
}

// 事件处理
const handleAddComponents = (components: Layout) => {
  // 转换像素尺寸为网格单位
  const convertedComponents = components.map(item => ({
    ...item,
    w: gridItemWidthToColNum(
      gridLayoutRef.value.width,
      24,
      10,
      item.w
    ),
    h: gridItemHeightToRowNum(
      gridLayoutRef.value.rowHeightComputed,
      10,
      item.h
    )
  }))

  // 智能添加组件
  const result = gridLayoutRef.value.addItemsIntelligently(convertedComponents)
  
  if (result.success) {
    layout.value = [...layout.value, ...result.addedItems]
    console.log(`成功添加 ${result.addedItems.length} 个组件`)
  }
  
  if (result.failedItems.length > 0) {
    console.warn(`${result.failedItems.length} 个组件添加失败，空间不足`)
  }
}

const handleRemoveItem = (id: string) => {
  const index = layout.value.findIndex(item => item.i === id)
  if (index >= 0) {
    layout.value.splice(index, 1)
  }
}

const handleLayoutUpdated = (newLayout: Layout) => {
  console.log('布局已更新:', newLayout)
}

const handleBreakpointChanged = (breakpoint: string, newLayout: Layout) => {
  console.log('断点变化:', breakpoint, newLayout)
}

const handleSaveLayout = () => {
  const layoutData = JSON.stringify(layout.value, null, 2)
  console.log('保存布局:', layoutData)
  // 这里可以发送到服务器保存
}

const clearLayout = () => {
  layout.value = []
}

const exportLayout = () => {
  const dataStr = JSON.stringify(layout.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'layout.json'
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.grid-demo {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.grid-container {
  flex: 1;
  overflow: hidden;
}

.grid-item {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.item-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
  font-weight: 500;
}

.item-body {
  flex: 1;
  padding: 12px;
  overflow: auto;
}

.remove-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  color: #ff4d4f;
}
</style>
```

## Advanced Features

### Smart Collision Detection

The grid layout includes intelligent collision detection that:

- Only triggers layout adjustments when components are close (within gap distance)
- Prevents overlapping during drag operations
- Automatically arranges new components without disrupting existing layout

### Responsive Behavior

- Container size changes only trigger re-layout when size increases
- Components maintain their positions when container shrinks
- Automatic boundary checking and adjustment

### Grid Snapping

- Components snap to the 24-column grid system
- Smart height snapping based on nearby components
- Maintains consistent spacing and alignment

## 配置示例

### 响应式布局配置

```vue
<template>
  <GridLayout
    v-model:layout="layout"
    :responsive="true"
    :breakpoints="{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }"
    :cols="{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }"
    :responsive-layouts="responsiveLayouts"
    @breakpoint-changed="handleBreakpointChanged"
  >
    <!-- 网格项 -->
  </GridLayout>
</template>

<script setup>
const responsiveLayouts = ref({
  lg: [
    { i: '1', x: 0, y: 0, w: 12, h: 6 },
    { i: '2', x: 12, y: 0, w: 12, h: 6 }
  ],
  md: [
    { i: '1', x: 0, y: 0, w: 10, h: 6 },
    { i: '2', x: 10, y: 0, w: 10, h: 6 }
  ],
  sm: [
    { i: '1', x: 0, y: 0, w: 12, h: 6 },
    { i: '2', x: 0, y: 6, w: 12, h: 6 }
  ]
})
</script>
```

### 固定高度容器配置

```vue
<template>
  <GridLayout
    v-model:layout="layout"
    :fixed-height="800"
    :prevent-overflow="true"
    :max-rows="20"
  >
    <!-- 网格项 -->
  </GridLayout>
</template>
```

### 自定义拖拽和调整大小选项

```vue
<template>
  <GridItem
    :drag-option="{
      cursor: 'move',
      cursorChecker: (action, interactable, element, interacting) => {
        return action.name === 'drag' ? 'grabbing' : null
      }
    }"
    :resize-option="{
      edges: { left: true, right: true, bottom: true, top: true },
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent'
        })
      ]
    }"
  >
    <!-- 内容 -->
  </GridItem>
</template>
```

## 样式自定义

组件提供了默认样式，你可以根据需要进行自定义：

```scss
// 网格容器样式
.grid-container {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
}

// 网格背景样式
.grid-background {
  .grid-cell {
    background: rgba(0, 0, 0, 0.05);
    border: 1px dashed rgba(0, 0, 0, 0.1);
  }
}

// 网格项样式
.gridster-item {
  background: #fff;
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  // 选中状态
  &.grid-item-selected {
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  // 拖拽状态
  &.draggable-dragging {
    opacity: 0.8;
    transform: rotate(2deg);
  }

  // 调整大小状态
  &.resizing {
    border-color: #52c41a;
  }

  // 静态项样式
  &.static {
    background: #f9f9f9;
    cursor: not-allowed;
  }
}

// 调整大小手柄样式
.resizable-handle {
  background: #1890ff;
  border-radius: 2px;
  
  &:hover {
    background: #40a9ff;
  }
}

// 删除按钮样式
.remove-btn {
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  
  &:hover {
    background: #ff7875;
  }
}
```

## 最佳实践

### 1. 性能优化

```javascript
// 使用 CSS transforms 提升性能
const layoutConfig = {
  useCssTransforms: true,
  transformScale: 1
}

// 合理设置更新频率
const handleLayoutUpdate = debounce((layout) => {
  // 处理布局更新
}, 100)
```

### 2. 数据持久化

```javascript
// 保存布局到 localStorage
const saveLayoutToStorage = (layout) => {
  localStorage.setItem('grid-layout', JSON.stringify(layout))
}

// 从 localStorage 恢复布局
const loadLayoutFromStorage = () => {
  const saved = localStorage.getItem('grid-layout')
  return saved ? JSON.parse(saved) : []
}
```

### 3. 错误处理

```javascript
// 验证布局数据
import { validateLayout } from 'grid-drag'

try {
  validateLayout(layout, 'MyLayout')
} catch (error) {
  console.error('布局验证失败:', error.message)
}

// 安全的组件添加
const addComponentSafely = (newComponent) => {
  try {
    const result = gridLayoutRef.value.addItemsIntelligently([newComponent])
    if (!result.success) {
      showMessage('添加失败：空间不足')
    }
  } catch (error) {
    console.error('添加组件失败:', error)
    showMessage('添加组件时发生错误')
  }
}
```

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
