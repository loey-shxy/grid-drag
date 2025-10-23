import { defineComponent, ref, computed, resolveComponent, createElementBlock, openBlock, normalizeStyle, normalizeClass, renderSlot, createElementVNode, createVNode, createBlock, withCtx, createTextVNode, toDisplayString, createCommentVNode, Fragment, renderList, getCurrentInstance, inject, watch, onMounted, onBeforeUnmount, readonly, onUpdated, onUnmounted, TransitionGroup, isVNode, reactive, render, unref, createSlots, normalizeProps, guardReactiveProps } from "vue";
const COLUMNS = 24;
const MIN_HEIGHT = 60;
const MIN_WIDTH = 100;
function findAvailablePosition(components, newComponent, containerInfo, gridConfig) {
  const { width: containerWidth, height: containerHeight } = containerInfo;
  const { gap, cellWidth } = gridConfig;
  autoFillComponentToGrid(newComponent, gridConfig);
  console.log(`📦 填充后组件: ${newComponent.name}, 宽度: ${newComponent.width}, 高度: ${newComponent.height}`);
  if (newComponent.width > containerWidth) {
    console.warn("组件宽度超过容器宽度");
    return null;
  }
  const spanCols = Math.ceil(newComponent.width / (cellWidth + gap));
  const actualSpanCols = Math.min(spanCols, COLUMNS);
  console.log(`📏 组件占用列数: ${spanCols} -> ${actualSpanCols}`);
  const columnHeights = new Array(COLUMNS).fill(0);
  for (const comp of components) {
    const startCol = Math.floor(comp.x / (cellWidth + gap));
    const compSpanCols = Math.ceil(comp.width / (cellWidth + gap));
    const endCol = Math.min(startCol + compSpanCols, COLUMNS);
    const compBottomY = comp.y + comp.height + gap;
    console.log(`📍 现有组件: ${comp.name}, 位置: (${comp.x}, ${comp.y}), 尺寸: ${comp.width}x${comp.height}`);
    console.log(`📍 占用列: ${startCol} -> ${endCol} (${compSpanCols}列), 底部Y: ${compBottomY}`);
    for (let i = startCol; i < endCol; i++) {
      if (i >= 0 && i < COLUMNS) {
        columnHeights[i] = Math.max(columnHeights[i] || 0, compBottomY);
      }
    }
  }
  console.log(`📊 列高度数组:`, columnHeights.slice(0, 12));
  let bestStartCol = 0;
  let minHeight = Infinity;
  for (let startCol = 0; startCol <= COLUMNS - actualSpanCols; startCol++) {
    let maxHeightInRange = 0;
    for (let i = startCol; i < startCol + actualSpanCols; i++) {
      maxHeightInRange = Math.max(maxHeightInRange, columnHeights[i] || 0);
    }
    if (maxHeightInRange < minHeight) {
      minHeight = maxHeightInRange;
      bestStartCol = startCol;
    }
  }
  const newX = bestStartCol * (cellWidth + gap);
  const newY = minHeight;
  console.log(`🎯 最佳位置: 列${bestStartCol}, 高度${minHeight} -> 坐标(${newX}, ${newY})`);
  if (newY + newComponent.height > containerHeight) {
    console.warn(`❌ 位置超出容器高度: ${newY + newComponent.height} > ${containerHeight}`);
    return null;
  }
  const newPosition = { x: parseFloat(newX.toFixed(3)), y: parseFloat(newY.toFixed(3)) };
  const newSize = { width: newComponent.width, height: newComponent.height };
  for (const existingComp of components) {
    if (hasOverlap(
      newPosition,
      newSize,
      { x: existingComp.x, y: existingComp.y },
      { width: existingComp.width, height: existingComp.height }
    )) {
      console.warn("新组件位置与现有组件重叠");
      return null;
    }
  }
  return newPosition;
}
function snapToColumnGridWithSmartHeight(position, componentSize, components, currentId, containerInfo, gridConfig) {
  const { width: containerWidth, height: containerHeight } = containerInfo;
  const { gap } = gridConfig;
  const columnWidth = (containerWidth - (COLUMNS - 1) * gap) / COLUMNS;
  const unitWidth = columnWidth + gap;
  let nearestColumn = Math.round(position.x / unitWidth);
  const componentCols = Math.ceil(componentSize.width / unitWidth);
  const maxColumn = COLUMNS - componentCols;
  nearestColumn = Math.max(0, Math.min(nearestColumn, maxColumn));
  const snappedX = nearestColumn * unitWidth;
  let snappedY = position.y;
  const candidateComponents = components.filter((comp) => {
    if (comp.id === currentId) return false;
    const horizontalOverlap = snappedX < comp.x + comp.width && snappedX + componentSize.width > comp.x;
    const isAbove = comp.y + comp.height <= position.y;
    return horizontalOverlap && isAbove;
  });
  if (candidateComponents.length > 0) {
    let closestComponent = null;
    let minDistance = Infinity;
    for (const comp of candidateComponents) {
      const distance = position.y - (comp.y + comp.height);
      if (distance >= 0 && distance < minDistance) {
        minDistance = distance;
        closestComponent = comp;
      }
    }
    if (closestComponent && minDistance <= gap) {
      snappedY = closestComponent.y + closestComponent.height + gap;
      console.log(`高度吸附: 距离=${minDistance}, 吸附到Y=${snappedY}`);
    } else {
      console.log(`不进行高度吸附: 距离=${minDistance} > gap=${gap}`);
    }
  }
  if (snappedY + componentSize.height > containerHeight) {
    snappedY = containerHeight - componentSize.height;
  }
  snappedY = Math.max(0, snappedY);
  return {
    x: parseFloat(snappedX.toFixed(3)),
    y: parseFloat(snappedY.toFixed(3))
  };
}
function reorganizeLayout(components, containerInfo, gridConfig, skipAutoFill = false, onlyOnSizeIncrease = false) {
  if (components.length === 0) return true;
  const { gap } = gridConfig;
  const containerWidth = containerInfo.width;
  const containerHeight = containerInfo.height;
  const columnWidth = (containerWidth - (COLUMNS - 1) * gap) / COLUMNS;
  if (onlyOnSizeIncrease) {
    for (const comp of components) {
      if (comp.x + comp.width > containerWidth || comp.y + comp.height > containerHeight) {
        comp.x = Math.min(comp.x, containerWidth - comp.width);
        comp.y = Math.min(comp.y, containerHeight - comp.height);
        comp.x = Math.max(0, comp.x);
        comp.y = Math.max(0, comp.y);
      }
    }
    return true;
  }
  const columnHeights = new Array(COLUMNS).fill(0);
  for (const comp of components) {
    if (!skipAutoFill) {
      autoFillComponentToGrid(comp, gridConfig);
    }
    const spanCols = Math.ceil(comp.width / (columnWidth + gap));
    const actualSpanCols = Math.min(spanCols, COLUMNS);
    let bestStartCol = 0;
    let minHeight = Infinity;
    for (let startCol = 0; startCol <= COLUMNS - actualSpanCols; startCol++) {
      let maxHeightInRange = 0;
      for (let i = startCol; i < startCol + actualSpanCols; i++) {
        maxHeightInRange = Math.max(maxHeightInRange, columnHeights[i] || 0);
      }
      if (maxHeightInRange < minHeight) {
        minHeight = maxHeightInRange;
        bestStartCol = startCol;
      }
    }
    comp.x = parseFloat((bestStartCol * (columnWidth + gap)).toFixed(3));
    comp.y = parseFloat(minHeight.toFixed(3));
    if (comp.y + comp.height > containerHeight) {
      console.warn("组件超出容器高度，无法完成布局");
      return false;
    }
    const newHeight = comp.y + comp.height + gap;
    for (let i = bestStartCol; i < bestStartCol + actualSpanCols; i++) {
      columnHeights[i] = newHeight;
    }
  }
  return true;
}
function autoFillComponentToGrid(component, gridConfig) {
  const { cellWidth, gap } = gridConfig;
  const minWidth = component.minWidth || cellWidth;
  const minHeight = component.minHeight || MIN_HEIGHT;
  component.width = Math.max(component.width, minWidth);
  component.height = Math.max(component.height, minHeight);
  const requiredCols = Math.ceil(component.width / (cellWidth + gap));
  const actualCols = Math.min(requiredCols, COLUMNS);
  const filledWidth = actualCols * cellWidth + (actualCols - 1) * gap;
  component.width = parseFloat(filledWidth.toFixed(3));
}
function resizeComponentWithAutoFill(component, newSize, gridConfig) {
  const { gap, cellWidth } = gridConfig;
  const minWidth = component.minWidth || cellWidth;
  const minHeight = component.minHeight || MIN_HEIGHT;
  const actualWidth = Math.max(newSize.width, minWidth);
  const actualHeight = Math.max(newSize.height, minHeight);
  const requiredCols = Math.ceil(actualWidth / (cellWidth + gap));
  const actualCols = Math.min(requiredCols, COLUMNS);
  const filledWidth = actualCols * cellWidth + (actualCols - 1) * gap;
  const finalWidth = Math.max(filledWidth, minWidth);
  const finalHeight = Math.max(actualHeight, minHeight);
  return {
    width: parseFloat(finalWidth.toFixed(3)),
    height: parseFloat(finalHeight.toFixed(3))
  };
}
function handleRightExpansion(components, resizingComponent, newPosition, newSize, containerInfo, gridConfig) {
  const affected = [];
  const { width: containerWidth, height: containerHeight } = containerInfo;
  const { gap } = gridConfig;
  const resizedComponent = {
    ...resizingComponent,
    x: newPosition.x,
    y: newPosition.y,
    width: newSize.width,
    height: newSize.height
  };
  const rightComponents = components.filter((comp) => {
    if (comp.id === resizingComponent.id) return false;
    const verticalOverlap = !(resizedComponent.y + resizedComponent.height <= comp.y || comp.y + comp.height <= resizedComponent.y);
    const isOnRight = comp.x >= resizingComponent.x + resizingComponent.width - gap;
    return verticalOverlap && isOnRight;
  });
  if (rightComponents.length === 0) {
    return { affected: [], canResize: true };
  }
  rightComponents.sort((a, b) => a.x - b.x);
  const newRightEdge = resizedComponent.x + resizedComponent.width;
  let needsPush = false;
  let pushDistance = 0;
  for (const comp of rightComponents) {
    const requiredDistance = newRightEdge + gap - comp.x;
    if (requiredDistance > 0) {
      needsPush = true;
      pushDistance = requiredDistance;
      break;
    }
  }
  if (!needsPush) {
    return { affected: [], canResize: true };
  }
  const componentsToMove = [];
  const componentsToWrap = [];
  for (const comp of rightComponents) {
    const newX = comp.x + pushDistance;
    if (newX + comp.width > containerWidth) {
      componentsToWrap.push(comp);
    } else {
      componentsToMove.push({ ...comp, x: newX, y: comp.y });
    }
  }
  if (componentsToWrap.length > 0) {
    const allComponents = [
      ...components.filter((c) => c.id !== resizingComponent.id && !rightComponents.some((rc) => rc.id === c.id)),
      resizedComponent,
      ...componentsToMove
    ];
    componentsToWrap.sort((a, b) => a.x - b.x);
    for (const comp of componentsToWrap) {
      const newY = findPositionBelowComponent(allComponents, comp, gridConfig);
      if (newY + comp.height > containerHeight) {
        const rightmostX = containerWidth - comp.width;
        const movedComponent = { ...comp, x: rightmostX, y: comp.y };
        componentsToMove.push(movedComponent);
        allComponents.push(movedComponent);
        return { affected: [], canResize: false };
      } else {
        const movedComponent = { ...comp, x: comp.x, y: newY };
        componentsToMove.push(movedComponent);
        allComponents.push(movedComponent);
      }
    }
  }
  affected.push(...componentsToMove);
  return { affected, canResize: true };
}
function handleBottomExpansion(components, resizingComponent, newPosition, newSize, containerInfo, gridConfig) {
  const affected = [];
  const { height: containerHeight } = containerInfo;
  const { gap } = gridConfig;
  const resizedComponent = {
    ...resizingComponent,
    x: newPosition.x,
    y: newPosition.y,
    width: newSize.width,
    height: newSize.height
  };
  const bottomComponents = components.filter((comp) => {
    if (comp.id === resizingComponent.id) return false;
    const horizontalOverlap = !(resizedComponent.x + resizedComponent.width <= comp.x || comp.x + comp.width <= resizedComponent.x);
    const isBelow = comp.y >= resizingComponent.y + resizingComponent.height - gap;
    return horizontalOverlap && isBelow;
  });
  if (bottomComponents.length === 0) {
    return { affected: [], canResize: true };
  }
  bottomComponents.sort((a, b) => a.y - b.y);
  const newBottomEdge = resizedComponent.y + resizedComponent.height;
  let needsPush = false;
  let pushDistance = 0;
  for (const comp of bottomComponents) {
    const requiredDistance = newBottomEdge + gap - comp.y;
    if (requiredDistance > 0) {
      needsPush = true;
      pushDistance = requiredDistance;
      break;
    }
  }
  if (!needsPush) {
    return { affected: [], canResize: true };
  }
  for (const comp of bottomComponents) {
    const newY = comp.y + pushDistance;
    if (newY + comp.height > containerHeight) {
      return { affected: [], canResize: false };
    }
    affected.push({ ...comp, x: parseFloat(comp.x.toFixed(3)), y: parseFloat(newY.toFixed(3)) });
  }
  return { affected, canResize: true };
}
function findPositionBelowComponent(components, component, gridConfig) {
  const { gap } = gridConfig;
  let targetY = component.y + component.height + gap;
  const overlappingComponents = components.filter((comp) => {
    if (comp.id === component.id) return false;
    const horizontalOverlap = !(component.x + component.width <= comp.x || comp.x + comp.width <= component.x);
    return horizontalOverlap;
  });
  overlappingComponents.sort((a, b) => a.y - b.y);
  let foundPosition = false;
  while (!foundPosition) {
    foundPosition = true;
    for (const comp of overlappingComponents) {
      const verticalOverlap = !(targetY + component.height <= comp.y || comp.y + comp.height <= targetY);
      if (verticalOverlap) {
        targetY = comp.y + comp.height + gap;
        foundPosition = false;
        break;
      }
    }
  }
  return targetY;
}
function handleBottomRightExpansion(components, resizingComponent, newPosition, newSize, containerInfo, gridConfig) {
  const rightResult = handleRightExpansion(components, resizingComponent, newPosition, newSize, containerInfo, gridConfig);
  if (!rightResult.canResize) {
    return rightResult;
  }
  const tempComponents = components.map((comp) => {
    const affectedComp = rightResult.affected.find((ac) => ac.id === comp.id);
    return affectedComp ? { ...comp, x: affectedComp.x, y: affectedComp.y } : comp;
  });
  const bottomResult = handleBottomExpansion(tempComponents, resizingComponent, newPosition, newSize, containerInfo, gridConfig);
  if (!bottomResult.canResize) {
    return bottomResult;
  }
  const allAffected = [];
  const affectedIds = /* @__PURE__ */ new Set();
  for (const comp of rightResult.affected) {
    allAffected.push(comp);
    affectedIds.add(comp.id);
  }
  for (const comp of bottomResult.affected) {
    if (!affectedIds.has(comp.id)) {
      allAffected.push(comp);
    } else {
      const existingComp = allAffected.find((ac) => ac.id === comp.id);
      if (existingComp) {
        existingComp.y = comp.y;
      }
    }
  }
  return { affected: allAffected, canResize: true };
}
function getAffectedComponents(components, resizingComponent, newPosition, newSize, containerInfo, gridConfig, resizeType) {
  const widthIncreased = newSize.width > resizingComponent.width;
  const heightIncreased = newSize.height > resizingComponent.height;
  const positionChanged = newPosition.x !== resizingComponent.x || newPosition.y !== resizingComponent.y;
  if (positionChanged) {
    const resizedComponent = {
      ...resizingComponent,
      x: newPosition.x,
      y: newPosition.y,
      width: newSize.width,
      height: newSize.height
    };
    for (const otherComponent of components) {
      if (otherComponent.id === resizingComponent.id) continue;
      if (hasOverlap(
        { x: resizedComponent.x, y: resizedComponent.y },
        { width: resizedComponent.width, height: resizedComponent.height },
        { x: otherComponent.x, y: otherComponent.y },
        { width: otherComponent.width, height: otherComponent.height }
      )) {
        return { affected: [], canResize: false };
      }
    }
    return { affected: [], canResize: true };
  }
  if (resizeType === "bottom-right" && widthIncreased && heightIncreased) {
    return handleBottomRightExpansion(components, resizingComponent, newPosition, newSize, containerInfo, gridConfig);
  } else if (resizeType === "top-right" && widthIncreased && positionChanged) {
    if (heightIncreased) {
      return handleRightExpansion(components, resizingComponent, newPosition, newSize, containerInfo, gridConfig);
    } else {
      return { affected: [], canResize: !hasAnyOverlap(components, resizingComponent, newPosition, newSize) };
    }
  } else if (resizeType === "bottom-left" && heightIncreased && positionChanged) {
    if (widthIncreased) {
      return handleBottomExpansion(components, resizingComponent, newPosition, newSize, containerInfo, gridConfig);
    } else {
      return { affected: [], canResize: !hasAnyOverlap(components, resizingComponent, newPosition, newSize) };
    }
  } else if (resizeType === "top-left" && positionChanged) {
    return { affected: [], canResize: !hasAnyOverlap(components, resizingComponent, newPosition, newSize) };
  } else if (widthIncreased && (resizeType === "right" || resizeType?.includes("right"))) {
    return handleRightExpansion(components, resizingComponent, newPosition, newSize, containerInfo, gridConfig);
  } else if (heightIncreased && (resizeType === "bottom" || resizeType?.includes("bottom"))) {
    return handleBottomExpansion(components, resizingComponent, newPosition, newSize, containerInfo, gridConfig);
  } else {
    const resizedComponent = {
      ...resizingComponent,
      x: newPosition.x,
      y: newPosition.y,
      width: newSize.width,
      height: newSize.height
    };
    for (const otherComponent of components) {
      if (otherComponent.id === resizingComponent.id) continue;
      if (hasOverlap(
        { x: resizedComponent.x, y: resizedComponent.y },
        { width: resizedComponent.width, height: resizedComponent.height },
        { x: otherComponent.x, y: otherComponent.y },
        { width: otherComponent.width, height: otherComponent.height }
      )) {
        return { affected: [], canResize: false };
      }
    }
    return { affected: [], canResize: true };
  }
}
function validatePositionWithLayout(components, currentId, position, size, containerInfo, gridConfig, resizeType) {
  const { width: containerWidth, height: containerHeight } = containerInfo;
  if (position.x < 0 || position.y < 0 || position.x + size.width > containerWidth || position.y + size.height > containerHeight) {
    return { valid: false, affectedComponents: [] };
  }
  const currentComponent = components.find((c) => c.id === currentId);
  if (!currentComponent) {
    return { valid: false, affectedComponents: [] };
  }
  const { affected, canResize } = getAffectedComponents(
    components,
    currentComponent,
    position,
    size,
    containerInfo,
    gridConfig,
    resizeType
  );
  return { valid: canResize, affectedComponents: affected };
}
function hasOverlap(pos1, size1, pos2, size2) {
  const overlapX = pos1.x < pos2.x + size2.width && pos1.x + size1.width > pos2.x;
  const overlapY = pos1.y < pos2.y + size2.height && pos1.y + size1.height > pos2.y;
  return overlapX && overlapY;
}
function hasAnyOverlap(components, resizingComponent, newPosition, newSize) {
  const resizedComponent = {
    ...resizingComponent,
    x: newPosition.x,
    y: newPosition.y,
    width: newSize.width,
    height: newSize.height
  };
  for (const otherComponent of components) {
    if (otherComponent.id === resizingComponent.id) continue;
    if (hasOverlap(
      { x: resizedComponent.x, y: resizedComponent.y },
      { width: resizedComponent.width, height: resizedComponent.height },
      { x: otherComponent.x, y: otherComponent.y },
      { width: otherComponent.width, height: otherComponent.height }
    )) {
      return true;
    }
  }
  return false;
}
function validateDragPosition(components, currentId, newPosition, containerInfo, gridConfig) {
  const { width: containerWidth, height: containerHeight } = containerInfo;
  const currentComponent = components.find((c) => c.id === currentId);
  if (!currentComponent) {
    return { valid: false, affectedComponents: [], finalPosition: newPosition };
  }
  const currentSize = { width: currentComponent.width, height: currentComponent.height };
  const snappedPosition = snapToColumnGridWithSmartHeight(
    newPosition,
    currentSize,
    components,
    currentId,
    containerInfo,
    gridConfig
  );
  if (snappedPosition.x < 0 || snappedPosition.y < 0 || snappedPosition.x + currentSize.width > containerWidth || snappedPosition.y + currentSize.height > containerHeight) {
    return { valid: false, affectedComponents: [], finalPosition: snappedPosition };
  }
  for (const otherComponent of components) {
    if (otherComponent.id === currentId) continue;
    if (hasOverlap(
      snappedPosition,
      currentSize,
      { x: otherComponent.x, y: otherComponent.y },
      { width: otherComponent.width, height: otherComponent.height }
    )) {
      return { valid: false, affectedComponents: [], finalPosition: snappedPosition };
    }
  }
  return { valid: true, affectedComponents: [], finalPosition: snappedPosition };
}
function adaptiveLayoutOnResize(components, oldContainerInfo, newContainerInfo, oldCellWidth, newCellWidth, gridConfig) {
  if (oldContainerInfo.width === newContainerInfo.width) {
    return components;
  }
  const cellWidthRatio = newCellWidth / oldCellWidth;
  return components.map((component) => {
    let newX = component.x;
    let newY = component.y;
    let newWidth = component.width;
    let newHeight = component.height;
    if (cellWidthRatio !== 1) {
      const { gap } = gridConfig;
      const oldStartColumn = Math.round(component.x / (oldCellWidth + gap));
      const oldColumnsSpanned = Math.max(1, Math.round((component.width + gap) / (oldCellWidth + gap)));
      newX = oldStartColumn * (newCellWidth + gap);
      newWidth = oldColumnsSpanned * newCellWidth + (oldColumnsSpanned - 1) * gap;
      newWidth = Math.max(newWidth, newCellWidth);
    }
    if (newX + newWidth > newContainerInfo.width) {
      const availableWidth = newContainerInfo.width - newX;
      if (availableWidth > 0) {
        newWidth = Math.min(newWidth, availableWidth);
      } else {
        newX = Math.max(0, newContainerInfo.width - newWidth);
      }
    }
    if (newY + newHeight > newContainerInfo.height) {
      const availableHeight = newContainerInfo.height - newY;
      if (availableHeight > 0) {
        newHeight = Math.min(newHeight, availableHeight);
      }
    }
    return {
      ...component,
      x: parseFloat(newX.toFixed(3)),
      y: parseFloat(newY.toFixed(3)),
      width: parseFloat(newWidth.toFixed(3)),
      height: parseFloat(newHeight.toFixed(3))
    };
  });
}
const _hoisted_1$8 = { class: "resize-overlay" };
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "GridsterItem",
  props: {
    component: {},
    gridConfig: {},
    containerInfo: {},
    allComponents: {}
  },
  emits: ["resize", "drag", "remove"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isDragging = ref(false);
    const isResizing = ref(false);
    const currentResizeType = ref("");
    const dragStartPosition = ref({ x: 0, y: 0 });
    const dragOffset = ref({ x: 0, y: 0 });
    const componentStyle = computed(() => {
      return {
        position: "absolute",
        left: `${props.component.x}px`,
        top: `${props.component.y}px`,
        width: `${props.component.width}px`,
        height: `${props.component.height}px`,
        zIndex: isDragging.value || isResizing.value ? MIN_WIDTH : 1,
        cursor: isResizing.value ? getResizeCursor(currentResizeType.value) : "move"
      };
    });
    const getResizeCursor = (type) => {
      const cursorMap = {
        "top": "n-resize",
        "right": "e-resize",
        "bottom": "s-resize",
        "left": "w-resize",
        "top-left": "nw-resize",
        "top-right": "ne-resize",
        "bottom-left": "sw-resize",
        "bottom-right": "se-resize"
      };
      return cursorMap[type] || "move";
    };
    const onEdgeMouseDown = (edge, e) => {
      e.preventDefault();
      e.stopPropagation();
      onResizeStart(edge, e);
    };
    const onCornerMouseDown = (corner, e) => {
      e.preventDefault();
      e.stopPropagation();
      onResizeStart(corner, e);
    };
    const onDragStart = (e) => {
      isDragging.value = true;
      e.dataTransfer?.setData("text/plain", props.component.id);
      e.dataTransfer.effectAllowed = "move";
      const dragImage = e.currentTarget;
      e.dataTransfer?.setDragImage(dragImage, 0, 0);
      const rect = dragImage.getBoundingClientRect();
      dragStartPosition.value = {
        x: props.component.x,
        y: props.component.y
      };
      dragOffset.value = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    const onDrag = (e) => {
      if (!isDragging.value) return;
      const containerRect = e.currentTarget.parentElement?.getBoundingClientRect();
      if (!containerRect) return;
      const pixelX = e.clientX - containerRect.left - dragOffset.value.x;
      const pixelY = e.clientY - containerRect.top - dragOffset.value.y;
      emit("drag", props.component.id, { x: pixelX, y: pixelY });
    };
    const onDragEnd = () => {
      isDragging.value = false;
      dragStartPosition.value = { x: 0, y: 0 };
      dragOffset.value = { x: 0, y: 0 };
    };
    const getOtherComponents = () => {
      if (!props.allComponents) return [];
      return props.allComponents.filter((comp) => comp.id !== props.component.id);
    };
    const checkLeftGap = (newX) => {
      const otherComponents = getOtherComponents();
      const gap = props.gridConfig.gap;
      for (const comp of otherComponents) {
        const verticalOverlap = !(props.component.y + props.component.height <= comp.y || comp.y + comp.height <= props.component.y);
        if (verticalOverlap) {
          if (comp.x + comp.width <= props.component.x) {
            const distance = newX - (comp.x + comp.width);
            if (distance < gap) {
              return comp.x + comp.width + gap;
            }
          }
        }
      }
      return newX;
    };
    const checkTopGap = (newY) => {
      const otherComponents = getOtherComponents();
      const gap = props.gridConfig.gap;
      for (const comp of otherComponents) {
        const horizontalOverlap = !(props.component.x + props.component.width <= comp.x || comp.x + comp.width <= props.component.x);
        if (horizontalOverlap) {
          if (comp.y + comp.height <= props.component.y) {
            const distance = newY - (comp.y + comp.height);
            if (distance < gap) {
              return comp.y + comp.height + gap;
            }
          }
        }
      }
      return newY;
    };
    const onResizeStart = (type, e) => {
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = props.component.width;
      const startHeight = props.component.height;
      const startXPos = props.component.x;
      const startYPos = props.component.y;
      const containerWidth = props.containerInfo.width;
      const containerHeight = props.containerInfo.height;
      currentResizeType.value = type;
      isResizing.value = true;
      const onMouseMove = (moveEvent) => {
        if (moveEvent.buttons === 0) {
          onMouseUp();
          return;
        }
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;
        let newWidth = startWidth;
        let newHeight = startHeight;
        let newX = startXPos;
        let newY = startYPos;
        switch (type) {
          case "right":
            newWidth = Math.max(props.component.minWidth || MIN_WIDTH, startWidth + deltaX);
            break;
          case "left":
            newWidth = Math.max(props.component.minWidth || MIN_WIDTH, startWidth - deltaX);
            newX = startXPos + startWidth - newWidth;
            newX = checkLeftGap(newX);
            newWidth = startXPos + startWidth - newX;
            break;
          case "bottom":
            newHeight = Math.max(props.component.minHeight || MIN_HEIGHT, startHeight + deltaY);
            break;
          case "top":
            newHeight = Math.max(props.component.minHeight || MIN_HEIGHT, startHeight - deltaY);
            newY = startYPos + startHeight - newHeight;
            newY = checkTopGap(newY);
            newHeight = startYPos + startHeight - newY;
            break;
          case "top-right":
            newWidth = Math.max(props.component.minWidth || MIN_WIDTH, startWidth + deltaX);
            newHeight = Math.max(props.component.minHeight || MIN_HEIGHT, startHeight - deltaY);
            newY = startYPos + startHeight - newHeight;
            newY = checkTopGap(newY);
            newHeight = startYPos + startHeight - newY;
            break;
          case "top-left":
            newWidth = Math.max(props.component.minWidth || MIN_WIDTH, startWidth - deltaX);
            newHeight = Math.max(props.component.minHeight || MIN_HEIGHT, startHeight - deltaY);
            newX = startXPos + startWidth - newWidth;
            newY = startYPos + startHeight - newHeight;
            newX = checkLeftGap(newX);
            newY = checkTopGap(newY);
            newWidth = startXPos + startWidth - newX;
            newHeight = startYPos + startHeight - newY;
            break;
          case "bottom-left":
            newWidth = Math.max(props.component.minWidth || MIN_WIDTH, startWidth - deltaX);
            newHeight = Math.max(props.component.minHeight || MIN_HEIGHT, startHeight + deltaY);
            newX = startXPos + startWidth - newWidth;
            newX = checkLeftGap(newX);
            newWidth = startXPos + startWidth - newX;
            break;
          case "bottom-right":
            newWidth = Math.max(props.component.minWidth || MIN_WIDTH, startWidth + deltaX);
            newHeight = Math.max(props.component.minHeight || MIN_HEIGHT, startHeight + deltaY);
            break;
        }
        newX = Math.max(0, newX);
        newY = Math.max(0, newY);
        if (newX + newWidth > containerWidth) {
          if (type.includes("left")) {
            newX = containerWidth - newWidth;
            newX = Math.max(0, newX);
          } else {
            newWidth = containerWidth - newX;
          }
        }
        if (newY + newHeight > containerHeight) {
          if (type.includes("top")) {
            newY = containerHeight - newHeight;
            newY = Math.max(0, newY);
          } else {
            newHeight = containerHeight - newY;
          }
        }
        newWidth = Math.max(props.component.minWidth || MIN_WIDTH, newWidth);
        newHeight = Math.max(props.component.minHeight || MIN_HEIGHT, newHeight);
        let filledSize = { width: newWidth, height: newHeight };
        const isWidthResize = ["left", "right", "top-left", "top-right", "bottom-left", "bottom-right"].includes(type);
        if (isWidthResize) {
          filledSize = resizeComponentWithAutoFill(
            props.component,
            { width: newWidth, height: newHeight },
            props.gridConfig
          );
        }
        if (newX + filledSize.width > containerWidth) {
          filledSize.width = containerWidth - newX;
        }
        if (newY + filledSize.height > containerHeight) {
          filledSize.height = containerHeight - newY;
        }
        filledSize.width = Math.max(props.component.minWidth || MIN_WIDTH, filledSize.width);
        filledSize.height = Math.max(props.component.minHeight || MIN_HEIGHT, filledSize.height);
        emit("resize", props.component.id, {
          width: parseFloat(filledSize.width.toFixed(3)),
          height: parseFloat(filledSize.height.toFixed(3)),
          x: parseFloat(newX.toFixed(3)),
          y: parseFloat(newY.toFixed(3)),
          resizeType: type
        });
      };
      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.removeEventListener("mouseleave", onMouseUp);
        isResizing.value = false;
        currentResizeType.value = "";
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mouseleave", onMouseUp);
      isResizing.value = true;
      currentResizeType.value = "";
    };
    return (_ctx, _cache) => {
      const _component_icon_delete = resolveComponent("icon-delete");
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["gridster-item", { resizing: isResizing.value }]),
        style: normalizeStyle(componentStyle.value),
        draggable: "true",
        onDragstart: onDragStart,
        onDrag,
        onDragend: onDragEnd
      }, [
        renderSlot(_ctx.$slots, "default", {}, void 0, true),
        createElementVNode("div", _hoisted_1$8, [
          createElementVNode("div", {
            class: "edge top",
            onMousedown: _cache[0] || (_cache[0] = ($event) => onEdgeMouseDown("top", $event))
          }, null, 32),
          createElementVNode("div", {
            class: "edge right",
            onMousedown: _cache[1] || (_cache[1] = ($event) => onEdgeMouseDown("right", $event))
          }, null, 32),
          createElementVNode("div", {
            class: "edge bottom",
            onMousedown: _cache[2] || (_cache[2] = ($event) => onEdgeMouseDown("bottom", $event))
          }, null, 32),
          createElementVNode("div", {
            class: "edge left",
            onMousedown: _cache[3] || (_cache[3] = ($event) => onEdgeMouseDown("left", $event))
          }, null, 32),
          createElementVNode("div", {
            class: "corner top-left",
            onMousedown: _cache[4] || (_cache[4] = ($event) => onCornerMouseDown("top-left", $event))
          }, null, 32),
          createElementVNode("div", {
            class: "corner top-right",
            onMousedown: _cache[5] || (_cache[5] = ($event) => onCornerMouseDown("top-right", $event))
          }, null, 32),
          createElementVNode("div", {
            class: "corner bottom-left",
            onMousedown: _cache[6] || (_cache[6] = ($event) => onCornerMouseDown("bottom-left", $event))
          }, null, 32),
          createElementVNode("div", {
            class: "corner bottom-right",
            onMousedown: _cache[7] || (_cache[7] = ($event) => onCornerMouseDown("bottom-right", $event))
          }, null, 32)
        ]),
        createVNode(_component_icon_delete, {
          size: 16,
          class: "remove-btn",
          onClick: _cache[8] || (_cache[8] = ($event) => _ctx.$emit("remove", __props.component.id))
        })
      ], 38);
    };
  }
});
const _export_sfc$1 = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const GridsterItem = /* @__PURE__ */ _export_sfc$1(_sfc_main$a, [["__scopeId", "data-v-1e3560db"]]);
const _hoisted_1$7 = { class: "add-container" };
const _hoisted_2$1 = { class: "component-library" };
const _hoisted_3$1 = { class: "search-section" };
const _hoisted_4 = { class: "components-grid" };
const _hoisted_5 = ["onClick"];
const _hoisted_6 = {
  key: 0,
  class: "selection-indicator"
};
const _hoisted_7 = {
  key: 0,
  class: "empty-state"
};
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "AddComponent",
  props: {
    componentLibrary: {}
  },
  emits: ["confirm", "cancel"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const visible = ref(false);
    const selectedComponents = ref([]);
    const emit = __emit;
    const onComponentSelect = (component) => {
      const index = selectedComponents.value.findIndex(
        (item) => item.id === component.id
      );
      if (index > -1) {
        selectedComponents.value.splice(index, 1);
      } else {
        selectedComponents.value.push(component);
      }
    };
    const searchQuery = ref("");
    const filteredComponents = computed(() => {
      if (!searchQuery.value) {
        return props.componentLibrary;
      }
      const query = searchQuery.value.toLowerCase();
      return props.componentLibrary.filter(
        (component) => component.name.toLowerCase().includes(query)
      );
    });
    const isSelected = (component) => {
      return selectedComponents.value.some(
        (selected) => selected.id === component.id
      );
    };
    const onComponentClick = (component) => {
      const componentCopy = {
        ...component,
        x: 0,
        y: 0
      };
      onComponentSelect(componentCopy);
    };
    const handleOk = () => {
      if (selectedComponents.value.length > 0) {
        close();
        emit("confirm", selectedComponents.value);
        selectedComponents.value = [];
      }
    };
    const close = () => {
      visible.value = false;
    };
    const open = () => {
      visible.value = true;
    };
    __expose({
      open,
      close
    });
    return (_ctx, _cache) => {
      const _component_a_alert = resolveComponent("a-alert");
      const _component_a_input = resolveComponent("a-input");
      const _component_a_scrollbar = resolveComponent("a-scrollbar");
      const _component_a_modal = resolveComponent("a-modal");
      return openBlock(), createBlock(_component_a_modal, {
        visible: visible.value,
        "onUpdate:visible": _cache[1] || (_cache[1] = ($event) => visible.value = $event),
        title: "添加组件 ",
        width: "1000px",
        onOk: handleOk,
        onCancel: close
      }, {
        default: withCtx(() => [
          createElementVNode("div", _hoisted_1$7, [
            createVNode(_component_a_alert, null, {
              default: withCtx(() => [
                createTextVNode("已选择：" + toDisplayString(selectedComponents.value.length), 1)
              ]),
              _: 1
            }),
            createElementVNode("div", _hoisted_2$1, [
              createElementVNode("div", _hoisted_3$1, [
                createVNode(_component_a_input, {
                  modelValue: searchQuery.value,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => searchQuery.value = $event),
                  type: "text",
                  placeholder: "搜索组件...",
                  class: "search-input"
                }, null, 8, ["modelValue"])
              ]),
              createVNode(_component_a_scrollbar, { style: { "height": "500px", "overflow": "auto" } }, {
                default: withCtx(() => [
                  createElementVNode("div", _hoisted_4, [
                    (openBlock(true), createElementBlock(Fragment, null, renderList(filteredComponents.value, (component) => {
                      return openBlock(), createElementBlock("div", {
                        key: component.id,
                        class: normalizeClass(["component-card", {
                          "selected": isSelected(component)
                        }]),
                        onClick: ($event) => onComponentClick(component)
                      }, [
                        renderSlot(_ctx.$slots, "component", { component }, void 0, true),
                        isSelected(component) ? (openBlock(), createElementBlock("div", _hoisted_6, " ✓ ")) : createCommentVNode("", true)
                      ], 10, _hoisted_5);
                    }), 128))
                  ])
                ]),
                _: 3
              }),
              filteredComponents.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_7, " 未找到匹配的组件 ")) : createCommentVNode("", true)
            ])
          ])
        ]),
        _: 3
      }, 8, ["visible"]);
    };
  }
});
const AddComponent = /* @__PURE__ */ _export_sfc$1(_sfc_main$9, [["__scopeId", "data-v-2535082c"]]);
const opt = Object.prototype.toString;
function isString(obj) {
  return opt.call(obj) === "[object String]";
}
function isNumber(obj) {
  return opt.call(obj) === "[object Number]" && obj === obj;
}
function isUndefined(obj) {
  return obj === void 0;
}
function isFunction(obj) {
  return typeof obj === "function";
}
const configProviderInjectionKey = Symbol("ArcoConfigProvider");
const CLASS_PREFIX = "arco";
const GLOBAL_CONFIG_NAME = "$arco";
const getPrefixCls = (componentName) => {
  var _a, _b, _c;
  const instance = getCurrentInstance();
  const configProvider = inject(configProviderInjectionKey, void 0);
  const prefix = (_c = (_b = configProvider == null ? void 0 : configProvider.prefixCls) != null ? _b : (_a = instance == null ? void 0 : instance.appContext.config.globalProperties[GLOBAL_CONFIG_NAME]) == null ? void 0 : _a.classPrefix) != null ? _c : CLASS_PREFIX;
  if (componentName) {
    return `${prefix}-${componentName}`;
  }
  return prefix;
};
const getSlotFunction = (param) => {
  if (param) {
    if (isFunction(param))
      return param;
    return () => param;
  }
  return void 0;
};
(() => {
  try {
    return !(typeof window !== "undefined" && document !== void 0);
  } catch (e) {
    return true;
  }
})();
const getOverlay = (type) => {
  const popper = document.createElement("div");
  popper.setAttribute("class", `arco-overlay arco-overlay-${type}`);
  return popper;
};
var _export_sfc = (sfc, props) => {
  for (const [key, val] of props) {
    sfc[key] = val;
  }
  return sfc;
};
const _sfc_main$8 = defineComponent({
  name: "IconHover",
  props: {
    prefix: {
      type: String
    },
    size: {
      type: String,
      default: "medium"
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const prefixCls = getPrefixCls("icon-hover");
    return {
      prefixCls
    };
  }
});
function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", {
    class: normalizeClass([
      _ctx.prefixCls,
      {
        [`${_ctx.prefix}-icon-hover`]: _ctx.prefix,
        [`${_ctx.prefixCls}-size-${_ctx.size}`]: _ctx.size !== "medium",
        [`${_ctx.prefixCls}-disabled`]: _ctx.disabled
      }
    ])
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 2);
}
var IconHover = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7]]);
const _sfc_main$7 = defineComponent({
  name: "IconClose",
  props: {
    size: {
      type: [Number, String]
    },
    strokeWidth: {
      type: Number,
      default: 4
    },
    strokeLinecap: {
      type: String,
      default: "butt",
      validator: (value) => {
        return ["butt", "round", "square"].includes(value);
      }
    },
    strokeLinejoin: {
      type: String,
      default: "miter",
      validator: (value) => {
        return ["arcs", "bevel", "miter", "miter-clip", "round"].includes(value);
      }
    },
    rotate: Number,
    spin: Boolean
  },
  emits: {
    click: (ev) => true
  },
  setup(props, { emit }) {
    const prefixCls = getPrefixCls("icon");
    const cls = computed(() => [prefixCls, `${prefixCls}-close`, { [`${prefixCls}-spin`]: props.spin }]);
    const innerStyle = computed(() => {
      const styles = {};
      if (props.size) {
        styles.fontSize = isNumber(props.size) ? `${props.size}px` : props.size;
      }
      if (props.rotate) {
        styles.transform = `rotate(${props.rotate}deg)`;
      }
      return styles;
    });
    const onClick = (ev) => {
      emit("click", ev);
    };
    return {
      cls,
      innerStyle,
      onClick
    };
  }
});
const _hoisted_1$6 = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", {
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    stroke: "currentColor",
    class: normalizeClass(_ctx.cls),
    style: normalizeStyle(_ctx.innerStyle),
    "stroke-width": _ctx.strokeWidth,
    "stroke-linecap": _ctx.strokeLinecap,
    "stroke-linejoin": _ctx.strokeLinejoin,
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
  }, _cache[1] || (_cache[1] = [
    createElementVNode("path", { d: "M9.857 9.858 24 24m0 0 14.142 14.142M24 24 38.142 9.858M24 24 9.857 38.142" }, null, -1)
  ]), 14, _hoisted_1$6);
}
var _IconClose = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6]]);
const IconClose = Object.assign(_IconClose, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconClose.name, _IconClose);
  }
});
const _sfc_main$6 = defineComponent({
  name: "IconInfoCircleFill",
  props: {
    size: {
      type: [Number, String]
    },
    strokeWidth: {
      type: Number,
      default: 4
    },
    strokeLinecap: {
      type: String,
      default: "butt",
      validator: (value) => {
        return ["butt", "round", "square"].includes(value);
      }
    },
    strokeLinejoin: {
      type: String,
      default: "miter",
      validator: (value) => {
        return ["arcs", "bevel", "miter", "miter-clip", "round"].includes(value);
      }
    },
    rotate: Number,
    spin: Boolean
  },
  emits: {
    click: (ev) => true
  },
  setup(props, { emit }) {
    const prefixCls = getPrefixCls("icon");
    const cls = computed(() => [prefixCls, `${prefixCls}-info-circle-fill`, { [`${prefixCls}-spin`]: props.spin }]);
    const innerStyle = computed(() => {
      const styles = {};
      if (props.size) {
        styles.fontSize = isNumber(props.size) ? `${props.size}px` : props.size;
      }
      if (props.rotate) {
        styles.transform = `rotate(${props.rotate}deg)`;
      }
      return styles;
    });
    const onClick = (ev) => {
      emit("click", ev);
    };
    return {
      cls,
      innerStyle,
      onClick
    };
  }
});
const _hoisted_1$5 = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", {
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    stroke: "currentColor",
    class: normalizeClass(_ctx.cls),
    style: normalizeStyle(_ctx.innerStyle),
    "stroke-width": _ctx.strokeWidth,
    "stroke-linecap": _ctx.strokeLinecap,
    "stroke-linejoin": _ctx.strokeLinejoin,
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
  }, _cache[1] || (_cache[1] = [
    createElementVNode("path", {
      "fill-rule": "evenodd",
      "clip-rule": "evenodd",
      d: "M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Zm2-30a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2Zm0 17h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h1v-8a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v11Z",
      fill: "currentColor",
      stroke: "none"
    }, null, -1)
  ]), 14, _hoisted_1$5);
}
var _IconInfoCircleFill = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5]]);
const IconInfoCircleFill = Object.assign(_IconInfoCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconInfoCircleFill.name, _IconInfoCircleFill);
  }
});
const _sfc_main$5 = defineComponent({
  name: "IconCheckCircleFill",
  props: {
    size: {
      type: [Number, String]
    },
    strokeWidth: {
      type: Number,
      default: 4
    },
    strokeLinecap: {
      type: String,
      default: "butt",
      validator: (value) => {
        return ["butt", "round", "square"].includes(value);
      }
    },
    strokeLinejoin: {
      type: String,
      default: "miter",
      validator: (value) => {
        return ["arcs", "bevel", "miter", "miter-clip", "round"].includes(value);
      }
    },
    rotate: Number,
    spin: Boolean
  },
  emits: {
    click: (ev) => true
  },
  setup(props, { emit }) {
    const prefixCls = getPrefixCls("icon");
    const cls = computed(() => [prefixCls, `${prefixCls}-check-circle-fill`, { [`${prefixCls}-spin`]: props.spin }]);
    const innerStyle = computed(() => {
      const styles = {};
      if (props.size) {
        styles.fontSize = isNumber(props.size) ? `${props.size}px` : props.size;
      }
      if (props.rotate) {
        styles.transform = `rotate(${props.rotate}deg)`;
      }
      return styles;
    });
    const onClick = (ev) => {
      emit("click", ev);
    };
    return {
      cls,
      innerStyle,
      onClick
    };
  }
});
const _hoisted_1$4 = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", {
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    stroke: "currentColor",
    class: normalizeClass(_ctx.cls),
    style: normalizeStyle(_ctx.innerStyle),
    "stroke-width": _ctx.strokeWidth,
    "stroke-linecap": _ctx.strokeLinecap,
    "stroke-linejoin": _ctx.strokeLinejoin,
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
  }, _cache[1] || (_cache[1] = [
    createElementVNode("path", {
      "fill-rule": "evenodd",
      "clip-rule": "evenodd",
      d: "M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Zm10.207-24.379a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0L22 26.172l-4.878-4.88a1 1 0 0 0-1.415 0l-1.414 1.415a1 1 0 0 0 0 1.414l7 7a1 1 0 0 0 1.414 0l11.5-11.5Z",
      fill: "currentColor",
      stroke: "none"
    }, null, -1)
  ]), 14, _hoisted_1$4);
}
var _IconCheckCircleFill = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4]]);
const IconCheckCircleFill = Object.assign(_IconCheckCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconCheckCircleFill.name, _IconCheckCircleFill);
  }
});
const _sfc_main$4 = defineComponent({
  name: "IconExclamationCircleFill",
  props: {
    size: {
      type: [Number, String]
    },
    strokeWidth: {
      type: Number,
      default: 4
    },
    strokeLinecap: {
      type: String,
      default: "butt",
      validator: (value) => {
        return ["butt", "round", "square"].includes(value);
      }
    },
    strokeLinejoin: {
      type: String,
      default: "miter",
      validator: (value) => {
        return ["arcs", "bevel", "miter", "miter-clip", "round"].includes(value);
      }
    },
    rotate: Number,
    spin: Boolean
  },
  emits: {
    click: (ev) => true
  },
  setup(props, { emit }) {
    const prefixCls = getPrefixCls("icon");
    const cls = computed(() => [prefixCls, `${prefixCls}-exclamation-circle-fill`, { [`${prefixCls}-spin`]: props.spin }]);
    const innerStyle = computed(() => {
      const styles = {};
      if (props.size) {
        styles.fontSize = isNumber(props.size) ? `${props.size}px` : props.size;
      }
      if (props.rotate) {
        styles.transform = `rotate(${props.rotate}deg)`;
      }
      return styles;
    });
    const onClick = (ev) => {
      emit("click", ev);
    };
    return {
      cls,
      innerStyle,
      onClick
    };
  }
});
const _hoisted_1$3 = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", {
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    stroke: "currentColor",
    class: normalizeClass(_ctx.cls),
    style: normalizeStyle(_ctx.innerStyle),
    "stroke-width": _ctx.strokeWidth,
    "stroke-linecap": _ctx.strokeLinecap,
    "stroke-linejoin": _ctx.strokeLinejoin,
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
  }, _cache[1] || (_cache[1] = [
    createElementVNode("path", {
      "fill-rule": "evenodd",
      "clip-rule": "evenodd",
      d: "M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Zm-2-11a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2Zm4-18a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V15Z",
      fill: "currentColor",
      stroke: "none"
    }, null, -1)
  ]), 14, _hoisted_1$3);
}
var _IconExclamationCircleFill = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3]]);
const IconExclamationCircleFill = Object.assign(_IconExclamationCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconExclamationCircleFill.name, _IconExclamationCircleFill);
  }
});
const _sfc_main$3 = defineComponent({
  name: "IconCloseCircleFill",
  props: {
    size: {
      type: [Number, String]
    },
    strokeWidth: {
      type: Number,
      default: 4
    },
    strokeLinecap: {
      type: String,
      default: "butt",
      validator: (value) => {
        return ["butt", "round", "square"].includes(value);
      }
    },
    strokeLinejoin: {
      type: String,
      default: "miter",
      validator: (value) => {
        return ["arcs", "bevel", "miter", "miter-clip", "round"].includes(value);
      }
    },
    rotate: Number,
    spin: Boolean
  },
  emits: {
    click: (ev) => true
  },
  setup(props, { emit }) {
    const prefixCls = getPrefixCls("icon");
    const cls = computed(() => [prefixCls, `${prefixCls}-close-circle-fill`, { [`${prefixCls}-spin`]: props.spin }]);
    const innerStyle = computed(() => {
      const styles = {};
      if (props.size) {
        styles.fontSize = isNumber(props.size) ? `${props.size}px` : props.size;
      }
      if (props.rotate) {
        styles.transform = `rotate(${props.rotate}deg)`;
      }
      return styles;
    });
    const onClick = (ev) => {
      emit("click", ev);
    };
    return {
      cls,
      innerStyle,
      onClick
    };
  }
});
const _hoisted_1$2 = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", {
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    stroke: "currentColor",
    class: normalizeClass(_ctx.cls),
    style: normalizeStyle(_ctx.innerStyle),
    "stroke-width": _ctx.strokeWidth,
    "stroke-linecap": _ctx.strokeLinecap,
    "stroke-linejoin": _ctx.strokeLinejoin,
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
  }, _cache[1] || (_cache[1] = [
    createElementVNode("path", {
      "fill-rule": "evenodd",
      "clip-rule": "evenodd",
      d: "M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Zm4.955-27.771-4.95 4.95-4.95-4.95a1 1 0 0 0-1.414 0l-1.414 1.414a1 1 0 0 0 0 1.414l4.95 4.95-4.95 4.95a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l4.95-4.95 4.95 4.95a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-4.95-4.95 4.95-4.95a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0Z",
      fill: "currentColor",
      stroke: "none"
    }, null, -1)
  ]), 14, _hoisted_1$2);
}
var _IconCloseCircleFill = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2]]);
const IconCloseCircleFill = Object.assign(_IconCloseCircleFill, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconCloseCircleFill.name, _IconCloseCircleFill);
  }
});
const MESSAGE_TYPES = ["info", "success", "warning", "error"];
const _sfc_main$2 = defineComponent({
  name: "IconLoading",
  props: {
    size: {
      type: [Number, String]
    },
    strokeWidth: {
      type: Number,
      default: 4
    },
    strokeLinecap: {
      type: String,
      default: "butt",
      validator: (value) => {
        return ["butt", "round", "square"].includes(value);
      }
    },
    strokeLinejoin: {
      type: String,
      default: "miter",
      validator: (value) => {
        return ["arcs", "bevel", "miter", "miter-clip", "round"].includes(value);
      }
    },
    rotate: Number,
    spin: Boolean
  },
  emits: {
    click: (ev) => true
  },
  setup(props, { emit }) {
    const prefixCls = getPrefixCls("icon");
    const cls = computed(() => [prefixCls, `${prefixCls}-loading`, { [`${prefixCls}-spin`]: props.spin }]);
    const innerStyle = computed(() => {
      const styles = {};
      if (props.size) {
        styles.fontSize = isNumber(props.size) ? `${props.size}px` : props.size;
      }
      if (props.rotate) {
        styles.transform = `rotate(${props.rotate}deg)`;
      }
      return styles;
    });
    const onClick = (ev) => {
      emit("click", ev);
    };
    return {
      cls,
      innerStyle,
      onClick
    };
  }
});
const _hoisted_1$1 = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("svg", {
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    stroke: "currentColor",
    class: normalizeClass(_ctx.cls),
    style: normalizeStyle(_ctx.innerStyle),
    "stroke-width": _ctx.strokeWidth,
    "stroke-linecap": _ctx.strokeLinecap,
    "stroke-linejoin": _ctx.strokeLinejoin,
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
  }, _cache[1] || (_cache[1] = [
    createElementVNode("path", { d: "M42 24c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6" }, null, -1)
  ]), 14, _hoisted_1$1);
}
var _IconLoading = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1]]);
const IconLoading = Object.assign(_IconLoading, {
  install: (app, options) => {
    var _a;
    const iconPrefix = (_a = options == null ? void 0 : options.iconPrefix) != null ? _a : "";
    app.component(iconPrefix + _IconLoading.name, _IconLoading);
  }
});
const POPUP_BASE_Z_INDEX = 1e3;
const MESSAGE_BASE_Z_INDEX = 5e3;
const Z_INDEX_STEP = 1;
class PopupManager {
  constructor() {
    this.popupStack = {
      popup: /* @__PURE__ */ new Set(),
      dialog: /* @__PURE__ */ new Set(),
      message: /* @__PURE__ */ new Set()
    };
    this.getNextZIndex = (type) => {
      const current = type === "message" ? Array.from(this.popupStack.message).pop() || MESSAGE_BASE_Z_INDEX : Array.from(this.popupStack.popup).pop() || POPUP_BASE_Z_INDEX;
      return current + Z_INDEX_STEP;
    };
    this.add = (type) => {
      const zIndex = this.getNextZIndex(type);
      this.popupStack[type].add(zIndex);
      if (type === "dialog") {
        this.popupStack.popup.add(zIndex);
      }
      return zIndex;
    };
    this.delete = (zIndex, type) => {
      this.popupStack[type].delete(zIndex);
      if (type === "dialog") {
        this.popupStack.popup.delete(zIndex);
      }
    };
    this.isLastDialog = (zIndex) => {
      if (this.popupStack.dialog.size > 1) {
        return zIndex === Array.from(this.popupStack.dialog).pop();
      }
      return true;
    };
  }
}
const popupManager = new PopupManager();
function usePopupManager(type, {
  visible,
  runOnMounted
} = {}) {
  const zIndex = ref(0);
  const open = () => {
    zIndex.value = popupManager.add(type);
  };
  const close = () => {
    popupManager.delete(zIndex.value, type);
  };
  const isLastDialog = () => {
    return false;
  };
  watch(
    () => visible == null ? void 0 : visible.value,
    (visible2) => {
      if (visible2) {
        open();
      } else {
        close();
      }
    },
    {
      immediate: true
    }
  );
  if (runOnMounted) {
    onMounted(() => {
      open();
    });
    onBeforeUnmount(() => {
      close();
    });
  }
  return {
    zIndex: readonly(zIndex),
    open,
    close,
    isLastDialog
  };
}
const _sfc_main$1 = defineComponent({
  name: "Message",
  components: {
    AIconHover: IconHover,
    IconInfoCircleFill,
    IconCheckCircleFill,
    IconExclamationCircleFill,
    IconCloseCircleFill,
    IconClose,
    IconLoading
  },
  props: {
    type: {
      type: String,
      default: "info"
    },
    closable: {
      type: Boolean,
      default: false
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    duration: {
      type: Number,
      default: 3e3
    },
    resetOnUpdate: {
      type: Boolean,
      default: false
    },
    resetOnHover: {
      type: Boolean,
      default: false
    }
  },
  emits: ["close"],
  setup(props, { emit }) {
    const prefixCls = getPrefixCls("message");
    let timer = 0;
    const handleClose = () => {
      emit("close");
    };
    const startTimer = () => {
      if (props.duration > 0) {
        timer = window.setTimeout(handleClose, props.duration);
      }
    };
    const clearTimer = () => {
      if (timer) {
        window.clearTimeout(timer);
        timer = 0;
      }
    };
    onMounted(() => {
      startTimer();
    });
    onUpdated(() => {
      if (props.resetOnUpdate) {
        clearTimer();
        startTimer();
      }
    });
    onUnmounted(() => {
      clearTimer();
    });
    const handleMouseEnter = () => {
      if (props.resetOnHover) {
        clearTimer();
      }
    };
    const handleMouseLeave = () => {
      if (props.resetOnHover) {
        startTimer();
      }
    };
    return {
      handleMouseEnter,
      handleMouseLeave,
      prefixCls,
      handleClose
    };
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon_info_circle_fill = resolveComponent("icon-info-circle-fill");
  const _component_icon_check_circle_fill = resolveComponent("icon-check-circle-fill");
  const _component_icon_exclamation_circle_fill = resolveComponent("icon-exclamation-circle-fill");
  const _component_icon_close_circle_fill = resolveComponent("icon-close-circle-fill");
  const _component_icon_loading = resolveComponent("icon-loading");
  const _component_icon_close = resolveComponent("icon-close");
  const _component_a_icon_hover = resolveComponent("a-icon-hover");
  return openBlock(), createElementBlock("li", {
    role: "alert",
    class: normalizeClass([
      _ctx.prefixCls,
      `${_ctx.prefixCls}-${_ctx.type}`,
      { [`${_ctx.prefixCls}-closable`]: _ctx.closable }
    ]),
    onMouseenter: _cache[1] || (_cache[1] = (...args) => _ctx.handleMouseEnter && _ctx.handleMouseEnter(...args)),
    onMouseleave: _cache[2] || (_cache[2] = (...args) => _ctx.handleMouseLeave && _ctx.handleMouseLeave(...args))
  }, [
    _ctx.showIcon && !(_ctx.type === "normal" && !_ctx.$slots.icon) ? (openBlock(), createElementBlock("span", {
      key: 0,
      class: normalizeClass(`${_ctx.prefixCls}-icon`)
    }, [
      renderSlot(_ctx.$slots, "icon", {}, () => [
        _ctx.type === "info" ? (openBlock(), createBlock(_component_icon_info_circle_fill, { key: 0 })) : _ctx.type === "success" ? (openBlock(), createBlock(_component_icon_check_circle_fill, { key: 1 })) : _ctx.type === "warning" ? (openBlock(), createBlock(_component_icon_exclamation_circle_fill, { key: 2 })) : _ctx.type === "error" ? (openBlock(), createBlock(_component_icon_close_circle_fill, { key: 3 })) : _ctx.type === "loading" ? (openBlock(), createBlock(_component_icon_loading, { key: 4 })) : createCommentVNode("v-if", true)
      ])
    ], 2)) : createCommentVNode("v-if", true),
    createElementVNode("span", {
      class: normalizeClass(`${_ctx.prefixCls}-content`)
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 2),
    _ctx.closable ? (openBlock(), createElementBlock("span", {
      key: 1,
      class: normalizeClass(`${_ctx.prefixCls}-close-btn`),
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClose && _ctx.handleClose(...args))
    }, [
      createVNode(_component_a_icon_hover, null, {
        default: withCtx(() => [
          createVNode(_component_icon_close)
        ]),
        _: 1
      })
    ], 2)) : createCommentVNode("v-if", true)
  ], 34);
}
var Message$1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render]]);
function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !isVNode(s);
}
var MessageList = defineComponent({
  name: "MessageList",
  props: {
    messages: {
      type: Array,
      default: () => []
    },
    position: {
      type: String,
      default: "top"
    }
  },
  emits: ["close", "afterClose"],
  setup(props, context) {
    const prefixCls = getPrefixCls("message-list");
    const {
      zIndex
    } = usePopupManager("message", {
      runOnMounted: true
    });
    return () => {
      let _slot;
      return createVNode(TransitionGroup, {
        "class": [prefixCls, `${prefixCls}-${props.position}`],
        "name": "fade-message",
        "tag": "ul",
        "style": {
          zIndex: zIndex.value
        },
        "onAfterLeave": () => context.emit("afterClose")
      }, _isSlot(_slot = props.messages.map((item) => {
        const slots = {
          default: getSlotFunction(item.content),
          icon: getSlotFunction(item.icon)
        };
        return createVNode(Message$1, {
          "key": item.id,
          "type": item.type,
          "duration": item.duration,
          "closable": item.closable,
          "resetOnUpdate": item.resetOnUpdate,
          "resetOnHover": item.resetOnHover,
          "onClose": () => context.emit("close", item.id)
        }, slots);
      })) ? _slot : {
        default: () => [_slot]
      });
    };
  }
});
class MessageManger {
  constructor(config, appContext) {
    this.messageCount = 0;
    this.add = (config2) => {
      var _a;
      this.messageCount++;
      const id = (_a = config2.id) != null ? _a : `__arco_message_${this.messageCount}`;
      if (this.messageIds.has(id)) {
        return this.update(id, config2);
      }
      const message2 = reactive({ id, ...config2 });
      this.messages.value.push(message2);
      this.messageIds.add(id);
      return {
        close: () => this.remove(id)
      };
    };
    this.update = (id, config2) => {
      for (let i = 0; i < this.messages.value.length; i++) {
        if (this.messages.value[i].id === id) {
          const resetOnUpdate = !isUndefined(config2.duration);
          Object.assign(this.messages.value[i], { ...config2, id, resetOnUpdate });
          break;
        }
      }
      return {
        close: () => this.remove(id)
      };
    };
    this.remove = (id) => {
      for (let i = 0; i < this.messages.value.length; i++) {
        const item = this.messages.value[i];
        if (item.id === id) {
          if (isFunction(item.onClose)) {
            item.onClose(id);
          }
          this.messages.value.splice(i, 1);
          this.messageIds.delete(id);
          break;
        }
      }
    };
    this.clear = () => {
      this.messages.value.splice(0);
    };
    this.destroy = () => {
      if (this.messages.value.length === 0 && this.container) {
        render(null, this.container);
        document.body.removeChild(this.container);
        this.container = null;
        messageInstance[this.position] = void 0;
      }
    };
    const { position = "top" } = config;
    this.container = getOverlay("message");
    this.messageIds = /* @__PURE__ */ new Set();
    this.messages = ref([]);
    this.position = position;
    const vm = createVNode(MessageList, {
      messages: this.messages.value,
      position,
      onClose: this.remove,
      onAfterClose: this.destroy
    });
    if (appContext != null ? appContext : Message._context) {
      vm.appContext = appContext != null ? appContext : Message._context;
    }
    render(vm, this.container);
    document.body.appendChild(this.container);
  }
}
const messageInstance = {};
const types = [...MESSAGE_TYPES, "loading", "normal"];
const message = types.reduce((pre, value) => {
  pre[value] = (config, appContext) => {
    if (isString(config)) {
      config = { content: config };
    }
    const _config = { type: value, ...config };
    const { position = "top" } = _config;
    if (!messageInstance[position]) {
      messageInstance[position] = new MessageManger(_config, appContext);
    }
    return messageInstance[position].add(_config);
  };
  return pre;
}, {});
message.clear = (position) => {
  var _a;
  if (position) {
    (_a = messageInstance[position]) == null ? void 0 : _a.clear();
  } else {
    Object.values(messageInstance).forEach((item) => item == null ? void 0 : item.clear());
  }
};
const Message = {
  ...message,
  install: (app) => {
    const _message = {
      clear: message.clear
    };
    for (const key of types) {
      _message[key] = (config, appContext = app._context) => message[key](config, appContext);
    }
    app.config.globalProperties.$message = _message;
  },
  _context: null
};
const _hoisted_1 = { class: "grid-header" };
const _hoisted_2 = { class: "grid-header_right" };
const _hoisted_3 = { class: "grid-container" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "GridDrag",
  props: {
    componentLibrary: {},
    addedComponents: {}
  },
  emits: [
    "get-container-size",
    "add-component",
    "update:added-components"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const components = computed({
      get: () => {
        return props.addedComponents ? props.addedComponents : [];
      },
      set: (val) => {
        emit("update:added-components", val);
      }
    });
    const gridConfig = reactive({
      gap: 10,
      cellWidth: 0
      // 动态计算
    });
    const containerInfo = reactive({
      width: 0,
      height: 0,
      scrollTop: 0
    });
    const gridContainer = ref();
    const containerHeight = computed(() => {
      return containerInfo.height;
    });
    const updateCellWidth = () => {
      if (!gridContainer.value) return;
      const container = gridContainer.value;
      containerInfo.width = container.clientWidth;
      containerInfo.height = container.clientHeight;
      const totalGapWidth = 23 * gridConfig.gap;
      const cellWidth = (containerInfo.width - totalGapWidth) / 24;
      gridConfig.cellWidth = Math.max(parseFloat(cellWidth.toFixed(3)), 20);
    };
    const gridStyle = computed(() => {
      const gap = gridConfig.gap;
      const cols = COLUMNS;
      return {
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(auto-fit, 100%)`,
        gap: `${gap}px`,
        width: "100%",
        minHeight: `${containerHeight.value}px`
      };
    });
    const gridBackgroundStyle = computed(() => {
      const gap = gridConfig.gap;
      const cols = COLUMNS;
      return {
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: `${gap}px`,
        gridTemplateRows: `repeat(auto-fit, 100%)`,
        width: "100%"
      };
    });
    const updateContainerInfo = () => {
      if (!gridContainer.value) return;
      const container = gridContainer.value;
      const oldWidth = containerInfo.width;
      const oldHeight = containerInfo.height;
      const oldCellWidth = gridConfig.cellWidth;
      const oldContainerInfo = {
        width: oldWidth
      };
      containerInfo.width = container.clientWidth;
      containerInfo.height = container.clientHeight;
      updateCellWidth();
      const newCellWidth = gridConfig.cellWidth;
      if (oldWidth !== containerInfo.width || oldHeight !== containerInfo.height) {
        console.log("容器尺寸变化，进行自适应调整", {
          oldSize: { width: oldWidth, height: oldHeight },
          newSize: { width: containerInfo.width, height: containerInfo.height },
          oldCellWidth,
          newCellWidth,
          cellWidthRatio: newCellWidth / oldCellWidth
        });
        const beforeAdjustment = components.value.map((c) => ({
          id: c.id,
          x: c.x,
          width: c.width
        }));
        components.value = adaptiveLayoutOnResize(
          components.value,
          oldContainerInfo,
          containerInfo,
          oldCellWidth,
          newCellWidth,
          gridConfig
        );
        const afterAdjustment = components.value.map((c) => ({
          id: c.id,
          x: c.x,
          width: c.width
        }));
        console.log("组件自适应调整结果", {
          before: beforeAdjustment,
          after: afterAdjustment
        });
      }
    };
    const onComponentResize = (id, newData) => {
      const componentIndex = components.value.findIndex((c) => c.id === id);
      if (componentIndex === -1) return;
      const component = components.value[componentIndex];
      const newSize = {
        width: newData.width || component.width,
        height: newData.height || component.height
      };
      const newPosition = {
        x: newData.x !== void 0 ? newData.x : component.x,
        y: newData.y !== void 0 ? newData.y : component.y
      };
      let filledSize = newSize;
      const resizeType = newData.resizeType || "";
      const isWidthResize = ["left", "right", "top-left", "top-right", "bottom-left", "bottom-right"].includes(resizeType);
      if (isWidthResize) {
        filledSize = resizeComponentWithAutoFill(component, newSize, gridConfig);
      }
      const validationResult = validatePositionWithLayout(
        components.value,
        id,
        newPosition,
        filledSize,
        containerInfo,
        gridConfig,
        resizeType
      );
      if (validationResult.valid) {
        component.x = newPosition.x;
        component.y = newPosition.y;
        component.width = filledSize.width;
        component.height = filledSize.height;
        if (validationResult.affectedComponents.length > 0) {
          validationResult.affectedComponents.forEach((affectedComp) => {
            const targetComp = components.value.find((c) => c.id === affectedComp.id);
            if (targetComp) {
              targetComp.x = affectedComp.x;
              targetComp.y = affectedComp.y;
            }
          });
        }
      } else {
        const fallbackResult = validatePositionWithLayout(
          components.value,
          id,
          { x: component.x, y: component.y },
          // 保持原位置
          filledSize,
          // 使用填充后的尺寸
          containerInfo,
          gridConfig,
          resizeType
        );
        if (fallbackResult.valid) {
          component.width = filledSize.width;
          component.height = filledSize.height;
          if (fallbackResult.affectedComponents.length > 0) {
            fallbackResult.affectedComponents.forEach((affectedComp) => {
              const targetComp = components.value.find((c) => c.id === affectedComp.id);
              if (targetComp) {
                targetComp.x = affectedComp.x;
                targetComp.y = affectedComp.y;
              }
            });
          }
        }
      }
    };
    const onComponentDrag = (id, newPosition) => {
      const component = components.value.find((c) => c.id === id);
      if (!component) return;
      const dragResult = validateDragPosition(
        components.value,
        id,
        newPosition,
        containerInfo,
        gridConfig
      );
      if (dragResult.valid) {
        component.x = dragResult.finalPosition.x;
        component.y = dragResult.finalPosition.y;
        if (dragResult.affectedComponents.length > 0) {
          dragResult.affectedComponents.forEach((affectedComp) => {
            const targetComp = components.value.find((c) => c.id === affectedComp.id);
            if (targetComp) {
              targetComp.x = affectedComp.x;
              targetComp.y = affectedComp.y;
            }
          });
        }
      }
    };
    const removeComponent = (id) => {
      const index = components.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        components.value.splice(index, 1);
      }
    };
    const onDragOver = (e) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = "move";
      }
    };
    let resizeObserver = null;
    onMounted(() => {
      if (gridContainer.value) {
        resizeObserver = new ResizeObserver(() => {
          updateContainerInfo();
        });
        resizeObserver.observe(gridContainer.value);
      }
      updateContainerInfo();
      window.addEventListener("resize", updateContainerInfo);
    });
    onUnmounted(() => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener("resize", updateContainerInfo);
    });
    watch(
      () => containerInfo,
      () => emit("get-container-size", containerInfo),
      { deep: true }
    );
    const addComponentRef = ref();
    const openModal = () => {
      addComponentRef.value.open();
    };
    const addComponents = (selectedComponents) => {
      let addedCount = 0;
      const failedComponents = [];
      selectedComponents.forEach((comp) => {
        const position = findAvailablePosition(components.value, comp, containerInfo, gridConfig);
        if (position) {
          const newComponent = {
            ...comp,
            id: `${comp.id}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
            x: position.x,
            y: position.y
          };
          autoFillComponentToGrid(newComponent, gridConfig);
          components.value.push(newComponent);
          addedCount++;
          console.log(`✓ 成功添加: ${comp.name} 位置: (${position.x}, ${position.y})`);
        } else {
          console.warn(`✗ 找不到合适位置: ${comp.name}`);
          failedComponents.push(comp.name);
        }
      });
      if (failedComponents.length > 0) {
        Message.warning(`以下组件无法添加（空间不足）：
${failedComponents.join("\n")}`);
        return;
      }
      if (addedCount > 0) {
        console.log(`成功添加 ${addedCount} 个组件`);
      }
      addComponentRef.value.close();
    };
    return (_ctx, _cache) => {
      const _component_a_button = resolveComponent("a-button");
      const _component_a_space = resolveComponent("a-space");
      return openBlock(), createElementBlock(Fragment, null, [
        createElementVNode("header", _hoisted_1, [
          _cache[1] || (_cache[1] = createElementVNode("div", { class: "grid-header_left" }, null, -1)),
          createElementVNode("div", _hoisted_2, [
            createVNode(_component_a_space, null, {
              default: withCtx(() => [
                createVNode(_component_a_button, {
                  type: "primary",
                  onClick: openModal
                }, {
                  default: withCtx(() => [..._cache[0] || (_cache[0] = [
                    createTextVNode("添加组件", -1)
                  ])]),
                  _: 1
                }),
                renderSlot(_ctx.$slots, "extra", {}, void 0, true)
              ]),
              _: 3
            })
          ])
        ]),
        createElementVNode("div", _hoisted_3, [
          createElementVNode("div", {
            ref_key: "gridContainer",
            ref: gridContainer,
            class: "grid-content",
            style: normalizeStyle(gridStyle.value),
            onDragover: onDragOver
          }, [
            createElementVNode("div", {
              class: "grid-background",
              style: normalizeStyle(gridBackgroundStyle.value)
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(COLUMNS), (item) => {
                return openBlock(), createElementBlock("div", {
                  class: "grid-cell",
                  key: item
                });
              }), 128))
            ], 4),
            (openBlock(true), createElementBlock(Fragment, null, renderList(__props.addedComponents, (component) => {
              return openBlock(), createBlock(GridsterItem, {
                key: component.id,
                component,
                "grid-config": gridConfig,
                "container-info": containerInfo,
                "all-components": __props.addedComponents,
                onResize: onComponentResize,
                onDrag: onComponentDrag,
                onRemove: removeComponent
              }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "item", { itemData: component }, void 0, true)
                ]),
                _: 2
              }, 1032, ["component", "grid-config", "container-info", "all-components"]);
            }), 128))
          ], 36)
        ]),
        createVNode(AddComponent, {
          ref_key: "addComponentRef",
          ref: addComponentRef,
          onConfirm: addComponents,
          "component-library": props.componentLibrary
        }, createSlots({ _: 2 }, [
          renderList(Object.keys(_ctx.$slots), (slot) => {
            return {
              name: slot,
              fn: withCtx((slotProps) => [
                renderSlot(_ctx.$slots, slot, normalizeProps(guardReactiveProps(slotProps || {})), void 0, true)
              ])
            };
          })
        ]), 1032, ["component-library"])
      ], 64);
    };
  }
});
const GridDrag = /* @__PURE__ */ _export_sfc$1(_sfc_main, [["__scopeId", "data-v-898c9606"]]);
function install(app) {
  app.component("GridDrag", GridDrag);
  app.component("GridsterItem", GridsterItem);
  app.component("AddComponent", AddComponent);
}
const plugin = {
  install,
  GridDrag,
  GridsterItem,
  AddComponent
};
export {
  AddComponent,
  COLUMNS,
  GridDrag,
  GridsterItem,
  autoFillComponentToGrid,
  plugin as default,
  findAvailablePosition,
  getAffectedComponents,
  install,
  reorganizeLayout,
  resizeComponentWithAutoFill,
  snapToColumnGridWithSmartHeight,
  validateDragPosition,
  validatePositionWithLayout
};
//# sourceMappingURL=index.es.js.map
