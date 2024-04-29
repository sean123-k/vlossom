<template>
    <main class="vs-main" :style="layoutStyle">
        <slot />
    </main>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { Placement, VsComponent } from '@/declaration';
import { LayoutAttrs } from '../vs-layout/VsLayout.vue';
import { computed } from 'vue';

const name = VsComponent.VsMain;
export default defineComponent({
    name,
    setup() {
        const navOn = inject('navOn');
        const layoutAttrs: LayoutAttrs | undefined = inject('layoutAttrs');

        function convertSizeToPadding(placement: Placement, size: string, isNavOn: boolean) {
            const style: {
                paddingTop: number | string;
                paddingBottom: number | string;
                paddingLeft: number | string;
                paddingRight: number | string;
            } = {
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
            };

            switch (size) {
                case 'xs':
                    if (placement === 'top' || placement === 'bottom') {
                        style.paddingTop = isNavOn ? '12%' : 0;
                    } else {
                        style.paddingLeft = isNavOn ? '10%' : 0;
                    }
                    break;
                case 'sm':
                    if (placement === 'top' || placement === 'bottom') {
                        style.paddingTop = isNavOn ? '20%' : 0;
                    } else {
                        style.paddingLeft = isNavOn ? '16%' : 0;
                    }
                    break;
                case 'md':
                    if (placement === 'top' || placement === 'bottom') {
                        style.paddingTop = isNavOn ? '32%' : 0;
                    } else {
                        style.paddingLeft = isNavOn ? '32%' : 0;
                    }
                    break;
                case 'lg':
                    if (placement === 'top' || placement === 'bottom') {
                        style.paddingTop = isNavOn ? '60%' : 0;
                    } else {
                        style.paddingLeft = isNavOn ? '60%' : 0;
                    }
                    break;
                case 'xl':
                    if (placement === 'top' || placement === 'bottom') {
                        style.paddingTop = isNavOn ? '80%' : 0;
                    } else {
                        style.paddingLeft = isNavOn ? '80%' : 0;
                    }
                    break;
                default:
                    if (placement === 'top' || placement === 'bottom') {
                        style.paddingTop = isNavOn ? '20%' : 0;
                    } else {
                        style.paddingLeft = isNavOn ? '16%' : 0;
                    }
                    break;
            }

            return style;
        }

        const layoutStyle = computed(() => {
            if (!layoutAttrs?.drawer) {
                return {};
            }

            const { placement, size } = layoutAttrs.drawer;

            const isNavOn = typeof navOn === 'object' && navOn !== null && 'value' in navOn && !!navOn.value;
            return convertSizeToPadding(placement, size, isNavOn);
        });

        return {
            layoutStyle,
        };
    },
});
</script>

<style lang="scss" scoped src="./VsMain.scss" />
