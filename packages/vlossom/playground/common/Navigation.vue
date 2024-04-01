<template>
    <vs-drawer v-model="isDrawerOpen" :style-set="{ padding: '0' }" has-container :dimmed="false">
        <!-- <vs-drawer v-model="isDrawerOpen" :style-set="{ padding: '0' }" has-container :dimmed="false" placement="right"> -->
        <!-- <vs-drawer v-model="isDrawerOpen" :style-set="{ padding: '0' }" has-container :dimmed="false" placement="top"> -->
        <!-- <vs-drawer v-model="isDrawerOpen" :style-set="{ padding: '0' }" has-container :dimmed="false" placement="bottom"> -->
        <button type="button" class="close-button" @click="close">
            <!-- <vs-icon icon="close" /> -->
            닫기
        </button>
        <div class="menu-item">Getting Started</div>
        <div class="menu-item">Components</div>
        <div class="menu-item">Customization</div>
        <div class="menu-item">Plugins</div>
        <div class="menu-item">Utils</div>
    </vs-drawer>
</template>

<script lang="ts">
import { watch } from 'vue';
import { toRefs, ref } from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
    emits: ['close'],
    props: {
        isOpen: { type: Boolean, required: true },
    },
    setup(props, { emit }) {
        const { isOpen } = toRefs(props);

        const isDrawerOpen = ref(isOpen.value);

        watch(isOpen, (value) => {
            isDrawerOpen.value = value;
        });

        function close() {
            emit('close');
        }

        return { open, close, isDrawerOpen };
    },
});
</script>
