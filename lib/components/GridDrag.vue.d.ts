declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: any;
    refs: {
        gridContainer: HTMLDivElement;
        addComponentRef: unknown;
    };
    rootEl: any;
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
