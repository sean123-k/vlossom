import {
    Ref,
    reactive,
    ref,
    provide,
    inject,
    InjectionKey,
    computed,
    getCurrentInstance,
    shallowRef,
    onDeactivated,
    onActivated,
    onBeforeUnmount,
} from 'vue';
import { Placement } from '@/declaration';

const ROOT_ZINDEX = 1000;

// interface LayoutProvide {}

export const LayoutKey: InjectionKey<any> = Symbol.for('vlossom:layout');
export const LayoutItemKey: InjectionKey<any> = Symbol.for('vlossom:layout-item');

export function createLayout() {
    //  parentLayout ??
    const rootZIndex = ROOT_ZINDEX;
    const registered: Ref<string[]> = ref([]);
    const positions = reactive(new Map<string, Ref<Placement>>());
    const layoutSizes = reactive(new Map<string, Ref<number | string>>());

    // priorities, activeItems?

    provide(LayoutKey, {
        register: () => {
            const layoutItemStyles = computed(() => {});

            return { layoutItemStyles };
        },
        unregister: () => {},
    });

    return {};
}

export function useLayoutItem(options: {
    id: string | undefined;
    position: Ref<Placement>;
    layoutSize: Ref<number | string>;
    elementSize: Ref<number | string | undefined>;
    active: Ref<boolean>;
    disableTransitions?: Ref<boolean>;
    absolute: Ref<boolean | undefined>;
}) {
    const layout = inject(LayoutKey);

    if (!layout) {
        throw new Error(' Could not find injected layout');
    }

    // const id = options.id ?? `layout-item-${getUid()}`;
    const id = options.id || 'temp id';

    const vm = getCurrentInstance();

    if (!vm) {
        throw new Error('must be called from inside a setup function');
    }

    provide(LayoutItemKey, { id });

    const isKeptAlive = shallowRef(false);
    onDeactivated(() => (isKeptAlive.value = true));
    onActivated(() => (isKeptAlive.value = false));

    const { layoutItemStyles, layoutItemScrimStyles } = layout.register(vm, {
        ...options,
        active: computed(() => (isKeptAlive.value ? false : options.active.value)),
        id,
    });

    onBeforeUnmount(() => layout.unregister(id));

    return { layoutItemStyles, layoutRect: layout.layoutRect, layoutItemScrimStyles };
}
