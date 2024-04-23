<template>
    {{ layoutStyle }}
    <div :class="['vs-bar-node', `vs-${colorScheme}`, { ...classObj }]" :style="{ ...computedStyle, ...layoutStyle }">
        <div class="vs-bar-node-content">
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed, toRef, shallowRef, ref, type PropType } from 'vue';
import { useLayoutItem } from '@/composables';
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

        const layoutStyle = ref({});

        const layoutPosition = compoonentName.value === 'VsHeader' ? 'top' : 'bottom';

        const layoutOptions = useLayoutItem({
            id: compoonentName.value,
            position: toRef(layoutPosition),
            layoutSize: computedStyle.value['--vs-bar-node-height'],
            elementSize: shallowRef(undefined),
            active: toRef(true),
            absolute: toRef(computedStyle.value['--vs-bar-node-height'] === 'absolute'),
        });

        if (layoutOptions) {
            // app bar
            console.log(layoutOptions.layoutItemStyles.value);
            layoutStyle.value = layoutOptions.layoutItemStyles.value;
        } else {
            // 일반 헤더
        }

        return {
            computedStyle,
            layoutStyle,
            classObj,
        };
    },
});
</script>

<style lang="scss" scoped src="./VsBarNode.scss" />
