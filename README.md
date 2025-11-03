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

## Styling

The component comes with default styles, but you can customize them:

```scss
.grid-layout {
  // Your custom styles
}

.grid-item {
  // Your custom item styles
}
```

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
