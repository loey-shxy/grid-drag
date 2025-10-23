import type { ComponentItemModel } from '../types/layout';
interface Props {
    componentLibrary: ComponentItemModel[];
}
declare var __VLS_26: {
    component: ComponentItemModel;
};
type __VLS_Slots = {} & {
    component?: (props: typeof __VLS_26) => any;
};
declare const __VLS_base: import("vue").DefineComponent<Props, {
    open: () => void;
    close: () => void;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    cancel: () => any;
    confirm: (components: ComponentItemModel[]) => any;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    onCancel?: (() => any) | undefined;
    onConfirm?: ((components: ComponentItemModel[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
