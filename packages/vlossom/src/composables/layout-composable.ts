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
import { Placement, VsComponent } from '@/declaration';

export function useLayout() {
    const ROOT_ZINDEX = 1000;

    // interface LayoutProvide {}

    const LayoutKey: InjectionKey<any> = Symbol.for('vlossom:layout');
    const LayoutItemKey: InjectionKey<any> = Symbol.for('vlossom:layout-item');

    interface Layer {
        top: number;
        bottom: number;
        left: number;
        right: number;
    }

    function getCurrentInstance(name: string = '', message?: string) {
        const vm = _getCurrentInstance();

        if (!vm) {
            throw new Error(`[Vlossom] ${name} ${message || 'must be called from inside a setup function'}`);
        }

        return vm;
    }

    function findChildrenWithProvide(key: InjectionKey<any> | symbol, vnode?: VNodeChild): ComponentInternalInstance[] {
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

    function useLayoutItem(options: {
        id: string | undefined;
        placement?: Ref<Position>;
        height?: Ref<number | string>;
        width?: Ref<number | string>;
        position?: Ref<Placement>;
    }) {
        const layout = inject(LayoutKey);
        if (!layout) {
            return null;
        }

        // const id = options.id ?? `layout-item-${getUid()}`;
        const id = options.id || 'temp id';

        const vm = getCurrentInstance('useLayoutItem');

        provide(LayoutItemKey, { id });

        const { layoutItemStyles, layoutItemScrimStyles } = layout.register(vm, {
            ...options,
            id,
        });

        onBeforeUnmount(() => layout.unregister(id));

        return { navOn: layout.navOn, layoutItemStyles, layoutRect: layout.layoutRect, layoutItemScrimStyles };
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

    function createLayout(navOn: Ref<boolean>) {
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

        const layoutStyles: Ref<{ [key: string]: any }> = ref({
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
        });

        const drawerOptions: Ref<{ [key: string]: any }> = ref({
            // navOn: null,
            placement: '',
            size: 0,
        });

        provide(LayoutKey, {
            navOn,
            register: (vm: ComponentInternalInstance, { id, placement, height, width, position }) => {
                positions.set(id, position);

                const instances = findChildrenWithProvide(LayoutItemKey, rootVm?.vnode);
                const instanceIndex = instances.indexOf(vm);

                if (instanceIndex > -1) {
                    registered.value.splice(instanceIndex, 0, id);
                } else {
                    registered.value.push(id);
                }

                const layoutItemStyles: Ref<{ [key: string]: any }> = ref({
                    paddingTop: 0,
                    paddingBottom: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                    // [placement.value]: 0,
                    // height: height + 'px',
                    // width: width + 'px',
                    // position: position.value,
                });

                const instance = getCurrentInstance();
                // const w = instance?.vnode?.el?.offsetHeight;
                // console.log('w:', w);
                // console.log(99999, instance?.vnode?.el?.offsetHeight);

                if (id === VsComponent.VsHeader) {
                    console.log('registering', id, layoutStyles.value);
                    if (position.value === 'fixed' || position.value === 'absolute') {
                        layoutStyles.value.paddingTop += Math.max(height, 50);
                        layoutStyles.value.paddingTop += 'px';
                    }
                }

                if (id === VsComponent.VsFooter) {
                    if (position.value === 'fixed' || position.value === 'absolute') {
                        layoutStyles.value.paddingBottom += Math.max(height, 50);
                        layoutStyles.value.paddingBottom += 'px';
                    }
                }

                if (id === VsComponent.VsDrawer) {
                    drawerOptions.value.placement = placement.value;
                    // drawerOptions.value.navOn = navOn;
                }

                if (id === VsComponent.VsMain) {
                    // 열고닫기 반응성
                    //  TODO: offset 너비 감지하기
                    // if (drawerOptions.value.placement === 'top') {
                    //     layoutItemStyles.value.paddingTop += drawerOptions.value.navOn.value ? 400 : 0;
                    //     layoutItemStyles.value.paddingTop += 'px';
                    // }

                    // if (drawerOptions.value.placement === 'bottom') {
                    //     layoutItemStyles.value.paddingBottom += drawerOptions.value.navOn.value ? 400 : 0;
                    //     layoutItemStyles.value.paddingBottom += 'px';
                    // }

                    if (drawerOptions.value.placement === 'left') {
                        // console.log('navon', drawerOptions.value.navOn.value);
                        // layoutItemStyles.value.paddingLeft += drawerOptions.value.navOn.value ? 400 : 0;
                        // layoutItemStyles.value.paddingLeft += 'px';
                    }

                    // if (drawerOptions.value.placement === 'right') {
                    //     layoutItemStyles.value.paddingRight += drawerOptions.value.navOn.value ? 400 : 0;
                    //     layoutItemStyles.value.paddingRight += 'px';
                    // }
                }

                console.log('registered', id, layoutStyles.value);

                return { layoutItemStyles };
            },
            unregister: () => {},
        });

        return {
            layoutStyles,
        };
    }

    return {
        createLayout,
        useLayoutItem,
    };
}
