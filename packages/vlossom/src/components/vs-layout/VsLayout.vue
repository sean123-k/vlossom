<template>
    <slot />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { createLayout } from '@/composables';

export default defineComponent({
    name: 'VsLayout',
    setup() {
        createLayout();

        return {};
    },
});
</script>
