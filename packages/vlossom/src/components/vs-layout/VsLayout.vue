<template>
    <div class="vs-layout" :style="layoutStyles">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { createLayout } from '@/composables';

export default defineComponent({
    name: 'VsLayout',
    setup() {
        const { layoutStyles } = createLayout();

        return { layoutStyles };
    },
});
</script>
