# 发布指南

## 准备工作

1. 确保你已经登录npm：
```bash
npm login
```

2. 确保所有更改都已提交到git

## 发布步骤

### 1. 更新版本号

根据更改类型选择合适的版本更新：

```bash
# 补丁版本 (1.0.0 -> 1.0.1) - 修复bug
npm run version:patch

# 次要版本 (1.0.0 -> 1.1.0) - 新功能
npm run version:minor

# 主要版本 (1.0.0 -> 2.0.0) - 破坏性更改
npm run version:major
```

### 2. 发布到npm

```bash
npm run publish:npm
```

或者手动发布：

```bash
npm run build
npm publish --access public
```

## 发布前检查清单

- [ ] 所有测试通过
- [ ] 文档已更新
- [ ] CHANGELOG已更新
- [ ] 版本号已正确更新
- [ ] 所有更改已提交到git

## 包信息

- **包名**: `grid-drag`
- **当前版本**: 1.0.0
- **访问权限**: public

## 使用示例

发布后，用户可以这样安装和使用：

```bash
npm install grid-drag
```

```vue
<template>
  <GridDrag
    :component-library="componentLibrary"
    v-model:added-components="addedComponents"
  >
    <template #item="{ itemData }">
      <div>{{ itemData.name }}</div>
    </template>
  </GridDrag>
</template>

<script setup>
import { GridDrag } from 'grid-drag'
import 'grid-drag/lib/style.css'
</script>
```

## 注意事项

1. 确保包名 `grid-drag` 在npm上可用
2. 如果是第一次发布，可能需要创建组织或更改包名
3. 确保你有发布权限