<template>
    <main class="vs-main" :style="layoutStyle">
        <slot />
    </main>
</template>

<script lang="ts">
import { defineComponent, ref, toRef } from 'vue';
import { VsComponent } from '@/declaration';
import { useLayout } from '@/composables';

const name = VsComponent.VsMain;
export default defineComponent({
    name,
    setup() {
        const layoutStyle = ref({});

        const layoutOptions = useLayout().useLayoutItem({
            id: VsComponent.VsMain,
            placement: toRef('top'),
            position: toRef('relative'),
        });

        if (layoutOptions) {
            // app bar
            console.log(name, layoutOptions.layoutItemStyles.value);
            layoutStyle.value = layoutOptions.layoutItemStyles.value;
        } else {
            // 일반 헤더
        }

        return {
            layoutStyle,
        };
    },
});
</script>

<style lang="scss" scoped src="./VsMain.scss" />
