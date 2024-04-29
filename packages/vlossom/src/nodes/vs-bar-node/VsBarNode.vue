<template>
    <div :class="['vs-bar-node', `vs-${colorScheme}`, { ...classObj }]" :style="computedStyle">
        <div class="vs-bar-node-content">
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed, toRef, ref, type PropType } from 'vue';
import { useLayout } from '@/composables';
import type { Align, ColorScheme, CssPosition } from '@/declaration';

export default defineComponent({
    props: {
        compoonentName: { type: String, required: true },
        colorScheme: { type: String as PropType<'default' | ColorScheme>, required: true },
        styleSet: { type: Object as PropType<{ [key: string]: any }>, default: () => ({}) },
        height: { type: String, default: '' },
        position: { type: String as PropType<CssPosition>, default: '' },
        primary: { type: Boolean, default: false },
        verticalAlign: { type: String as PropType<Align>, default: '' },
    },
    setup(props) {
        const { compoonentName, styleSet, height, position, primary, verticalAlign } = toRefs(props);

        const convertedStyleSet = computed(() => {
            return Object.entries(styleSet.value).reduce((acc, [key, value]) => {
                const propName = key.split('-').pop();
                acc[`--vs-bar-node-${propName}`] = value;
                return acc;
            }, {} as { [key: string]: any });
        });

        const classObj = computed(() => ({
            primary: primary.value,
        }));

        const layoutStyle = ref({});

        const layoutPosition = compoonentName.value === 'VsHeader' ? 'top' : 'bottom';

        // TODO: parseUnit
        const layoutOptions = useLayout().useLayoutItem({
            id: compoonentName.value,
            placement: toRef(layoutPosition),
            height: isNaN(Number(height.value)) ? Number(height.value.split('px')[0]) : Number(height.value),
            position,
        });

        if (layoutOptions) {
            // app bar
            console.log(compoonentName.value, layoutOptions.layoutItemStyles.value);
            layoutStyle.value = layoutOptions.layoutItemStyles.value;
        } else {
            // 일반 헤더
        }

        const computedStyle = computed(() => {
            const style = { ...convertedStyleSet.value };
            if (height.value) {
                style['--vs-bar-node-height'] = height.value;
            }
            if (position.value) {
                style['--vs-bar-node-position'] = position.value;
            }

            if (verticalAlign.value === 'start') {
                style.alignItems = 'flex-start';
            } else if (verticalAlign.value === 'end') {
                style.alignItems = 'flex-end';
            } else {
                style.alignItems = 'center';
            }

            return style;
        });

        return {
            computedStyle,
            classObj,
        };
    },
});
</script>

<style lang="scss" scoped src="./VsBarNode.scss" />
