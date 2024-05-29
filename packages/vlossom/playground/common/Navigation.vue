<template>
    <div class="container">
        <!-- <vs-drawer
        v-model="isDrawerOpen"
        :style-set="{ padding: '0' }"
        has-container
        :dimmed="false"
        placement="right"
        layout
    > -->
        <!-- <vs-drawer
        v-model="isDrawerOpen"
        :style-set="{ padding: '0' }"
        has-container
        :dimmed="false"
        placement="top"
        layout
    > -->
        <!-- <vs-drawer v-model="isDrawerOpen" :style-set="{ padding: '0' }" :dimmed="false" placement="bottom" layout> -->

        <div class="menu-item" @click="clickMenu()">Getting started</div>
        <div class="menu-item" @click="clickMenu()">Components</div>
        <div class="menu-item" @click="clickMenu()">Customization</div>
        <div class="menu-item" @click="clickMenu()">Plugins</div>
        <div class="menu-item" @click="clickMenu()">Utils</div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    emits: ['close'],

    setup(_, { emit }) {
        function clickMenu() {
            console.log('menu click');
        }
        function close() {
            emit('close');
        }

        return { open, close, clickMenu };
    },
});
</script>

<style lang="scss" scoped>
.container {
    padding-top: 1rem;
}

.menu-item {
    padding: 0.4rem 2rem;
    width: 100%;
    cursor: pointer;
    &:hover {
        background-color: #f0f0f0;
    }
}
</style>
