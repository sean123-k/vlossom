<template>
    <div class="vs-layout" :style="layoutStyles">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useLayout } from '@/composables';

export default defineComponent({
    name: 'VsLayout',
    setup() {
        const navOn = ref(false);
        const { layoutStyles } = useLayout().createLayout(navOn);

        return { layoutStyles };
    },
});
</script>
