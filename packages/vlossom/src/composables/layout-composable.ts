import {
    Ref,
    reactive,
    ref,
    provide,
    inject,
    InjectionKey,
    computed,
    getCurrentInstance as _getCurrentInstance,
    shallowRef,
    onDeactivated,
    onActivated,
    onBeforeUnmount,
    VNodeChild,
    ComponentInternalInstance,
    onMounted,
} from 'vue';
import { Placement } from '@/declaration';

const ROOT_ZINDEX = 1000;

// interface LayoutProvide {}

export const LayoutKey: InjectionKey<any> = Symbol.for('vlossom:layout');
export const LayoutItemKey: InjectionKey<any> = Symbol.for('vlossom:layout-item');

interface Layer {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export function getCurrentInstance(name: string, message?: string) {
    const vm = _getCurrentInstance();

    if (!vm) {
        throw new Error(`[Vlossom] ${name} ${message || 'must be called from inside a setup function'}`);
    }

    return vm;
}

export function findChildrenWithProvide(
    key: InjectionKey<any> | symbol,
    vnode?: VNodeChild,
): ComponentInternalInstance[] {
    if (!vnode || typeof vnode !== 'object') {
        return [];
    }

    if (Array.isArray(vnode)) {
        return vnode.map((child) => findChildrenWithProvide(key, child)).flat(1);
    } else if (Array.isArray(vnode.children)) {
        return vnode.children.map((child) => findChildrenWithProvide(key, child)).flat(1);
    } else if (vnode.component) {
        if (Object.getOwnPropertySymbols(vnode.component.provides).includes(key as symbol)) {
            return [vnode.component];
        } else if (vnode.component.subTree) {
            return findChildrenWithProvide(key, vnode.component.subTree).flat(1);
        }
    }

    return [];
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
        return null;
    }

    // const id = options.id ?? `layout-item-${getUid()}`;
    const id = options.id || 'temp id';

    const vm = getCurrentInstance('useLayoutItem');

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

function generateLayers(
    layout: string[],
    positions: Map<string, Ref<Placement>>,
    layoutSizes: Map<string, Ref<number | string>>,
    activeItems: Map<string, Ref<boolean>>,
): { id: string; layer: Layer }[] {
    let previousLayer: Layer = { top: 0, left: 0, right: 0, bottom: 0 };

    const layers = [{ id: '', layer: { ...previousLayer } }];

    for (const id of layout) {
        const position = positions.get(id);
        const amount = layoutSizes.get(id);
        const active = activeItems.get(id);

        if (!position || !amount || !active) {
            continue;
        }

        const layer = {
            ...previousLayer,
            [position.value]:
                parseInt(previousLayer[position.value], 10) + (active.value ? parseInt(amount.value, 10) : 0),
        };

        layers.push({
            id,
            layer,
        });

        previousLayer = layer;
    }

    return layers;
}

export function createLayout() {
    //  parentLayout ??
    const rootZIndex = computed(() => ROOT_ZINDEX);
    const registered: Ref<string[]> = ref([]);
    const positions = reactive(new Map<string, Ref<Placement>>());
    const layoutSizes = reactive(new Map<string, Ref<number | string>>());
    const activeItems = reactive(new Map<string, Ref<boolean>>());

    // priorities, activeItems?

    const layers = computed(() => {
        const layout = [];
        return generateLayers(layout, positions, layoutSizes, activeItems);
    });

    const items = computed(() => {
        return layers.value.slice(1).map(({ id }, index) => {
            const { layer } = layers.value[index];
            const size = layoutSizes.get(id);
            const position = positions.get(id);

            return {
                id,
                ...layer,
                size: Number(size!.value),
                position: position!.value,
            };
        });
    });

    const getLayoutItem = (id: string) => {
        return items.value.find((item) => item.id === id);
    };

    const rootVm = getCurrentInstance('createLayout');

    const isMounted = shallowRef(false);
    onMounted(() => {
        isMounted.value = true;
    });

    provide(LayoutKey, {
        register: (vm: ComponentInternalInstance, { id, position, layoutSize, elementSize, active, absolute }) => {
            positions.set(id, position);
            layoutSizes.set(id, layoutSize);
            activeItems.set(id, active);

            const instances = findChildrenWithProvide(LayoutItemKey, rootVm?.vnode);
            const instanceIndex = instances.indexOf(vm);

            if (instanceIndex > -1) {
                registered.value.splice(instanceIndex, 0, id);
            } else {
                registered.value.push(id);
            }

            // const index = computed(() => items.value.findIndex((i) => i.id === id));
            const index = computed(() => 0);

            const layoutItemStyles = computed(() => {
                const isHorizontal = position.value === 'left' || position.value === 'right';
                const isOppositeHorizontal = position.value === 'right';
                const isOppositeVertical = position.value === 'bottom';

                const styles = {
                    [position.value]: 0,
                    // zIndex: zIndex.value,
                    transform: `translate${isHorizontal ? 'X' : 'Y'}(${
                        (active.value ? 0 : -110) * (isOppositeHorizontal || isOppositeVertical ? -1 : 1)
                    }%)`,

                    position: absolute.value || rootZIndex.value !== ROOT_ZINDEX ? 'absolute' : 'fixed',
                } as const;

                if (!isMounted.value) {
                    return styles;
                }

                const item = items.value[index.value];

                if (!item) {
                    throw new Error(`[Vlossom] Could not find layout item "${id}"`);
                }

                return {
                    ...styles,
                    height: isHorizontal
                        ? `calc(100% - ${item.top}px - ${item.bottom}px)`
                        : elementSize.value
                        ? `${elementSize.value}px`
                        : undefined,
                    left: isOppositeHorizontal ? undefined : `${item.left}px`,
                    right: isOppositeHorizontal ? `${item.right}px` : undefined,
                    top: position.value !== 'bottom' ? `${item.top}px` : undefined,
                    bottom: position.value !== 'top' ? `${item.bottom}px` : undefined,
                    width: !isHorizontal
                        ? `calc(100% - ${item.left}px - ${item.right}px)`
                        : elementSize.value
                        ? `${elementSize.value}px`
                        : undefined,
                };
            });

            return { layoutItemStyles };
        },
        unregister: () => {},
    });

    return {};
}
