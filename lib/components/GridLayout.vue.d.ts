import { default as elementResizeDetectorMaker } from 'element-resize-detector';
import { Layout, LayoutItem } from '../helpers';
export interface Placeholder {
    x: number;
    y: number;
    w: number;
    h: number;
    i: number | string;
}
export interface Props {
    autoSize?: boolean;
    colNum?: number;
    rowHeight?: number;
    maxRows?: number;
    margin?: Array<number>;
    isDraggable?: boolean;
    isResizable?: boolean;
    isMirrored?: boolean;
    isBounded?: boolean;
    useCssTransforms?: boolean;
    verticalCompact?: boolean;
    restoreOnDrag?: boolean;
    layout: Layout;
    responsive?: boolean;
    keepAspectRatio?: boolean;
    responsiveLayouts?: {
        [key: string]: any;
    };
    transformScale?: number;
    breakpoints?: {
        lg: number;
        md: number;
        sm: number;
        xs: number;
        xxs: number;
    };
    cols?: {
        lg: number;
        md: number;
        sm: number;
        xs: number;
        xxs: number;
    };
    preventCollision?: boolean | (({ layout, layoutItem }: {
        layout: Layout;
        layoutItem: LayoutItem;
    }) => boolean);
    useStyleCursor?: boolean;
    fixedHeight?: number;
    preventOverflow?: boolean;
}
export interface LayoutData {
    width: number | null;
    mergeStyle: {
        [key: string]: string;
    };
    lastLayoutLength: number;
    isDragging: boolean;
    placeholder: Placeholder;
    layouts: {
        [key: string]: Layout | any;
    };
    lastBreakpoint: string | null;
    originalLayout: Layout;
    erd: elementResizeDetectorMaker.Erd | null;
    positionsBeforeDrag: {
        [key: string]: string;
    };
    layoutRef: HTMLElement;
}
declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        default?(_: {}): any;
    };
    refs: {
        layoutRef: HTMLDivElement;
    };
    rootEl: HTMLDivElement;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: any;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
