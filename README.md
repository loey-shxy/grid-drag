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
  <GridDrag
    :component-library="componentLibrary"
    v-model:added-components="addedComponents"
  >
    <template #item="{ itemData }">
      <div class="your-component">
        {{ itemData.name }}
      </div>
    </template>
  </GridDrag>
</template>

<script setup>
import { ref } from 'vue'
import { GridDrag } from 'grid-drag'
import 'grid-drag/lib/style.css'

const componentLibrary = ref([
  {
    id: '1',
    type: 'chart',
    name: 'Chart Component',
    width: 400,
    height: 300,
    x: 0,
    y: 0
  }
])

const addedComponents = ref([])
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

### GridDrag Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `component-library` | `ComponentItemModel[]` | `[]` | Available components for adding |
| `added-components` | `ComponentItemModel[]` | `[]` | Currently added components (v-model) |

### GridDrag Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:added-components` | `ComponentItemModel[]` | Emitted when components change |

### Types

```typescript
interface ComponentItemModel {
  id: string
  type: string
  name: string
  width: number
  height: number
  x: number
  y: number
  minWidth?: number
  minHeight?: number
}

interface GridConfig {
  gap: number
  cellWidth: number
}

interface Position {
  x: number
  y: number
}

interface Size {
  width: number
  height: number
}
```

### Utility Functions

```typescript
import {
  validatePosition,
  findAvailablePosition,
  snapToGrid,
  reorganizeLayout
} from 'grid-drag'
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
