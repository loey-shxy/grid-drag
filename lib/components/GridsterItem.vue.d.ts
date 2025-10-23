import type { ComponentItemModel, GridConfig, Position, Size, ContainerInfo } from '../types/layout';
interface Props {
    component: ComponentItemModel;
    gridConfig: GridConfig;
    containerInfo: ContainerInfo;
    allComponents?: ComponentItemModel[];
}
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    resize: (id: string, size: Size & Partial<Position> & {
        resizeType?: string;
    }) => any;
    drag: (id: string, position: Position) => any;
    remove: (id: string) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onResize?: ((id: string, size: Size & Partial<Position> & {
        resizeType?: string;
    }) => any) | undefined;
    onDrag?: ((id: string, position: Position) => any) | undefined;
    onRemove?: ((id: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
