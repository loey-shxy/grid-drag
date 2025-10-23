import type { ComponentItemModel } from '../types/layout';
interface Props {
    componentLibrary: ComponentItemModel[];
    addedComponents: ComponentItemModel[];
}
declare var __VLS_14: {}, __VLS_25: {
    itemData: ComponentItemModel;
}, __VLS_38: string, __VLS_39: any;
type __VLS_Slots = {} & {
    [K in NonNullable<typeof __VLS_38>]?: (props: typeof __VLS_39) => any;
} & {
    extra?: (props: typeof __VLS_14) => any;
} & {
    item?: (props: typeof __VLS_25) => any;
};
declare const __VLS_base: import("vue").DefineComponent<Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "get-container-size": (...args: any[]) => void;
    "add-component": (...args: any[]) => void;
    "update:added-components": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{
    "onGet-container-size"?: ((...args: any[]) => any) | undefined;
    "onAdd-component"?: ((...args: any[]) => any) | undefined;
    "onUpdate:added-components"?: ((...args: any[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
