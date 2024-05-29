<template>
    <div>
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
        <button type="button" class="close-button" @click="close">
            <!-- <vs-icon icon="close" /> -->
            닫기
        </button>
        <div class="menu-item" @click="clickMenu()">Getting Started</div>
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

    setup(props, { emit }) {
        // 중첩구조에서 문제가 됨. Navitaion에서는 부모(VsLayout)판단 가능, VsDrawer에서는 부모(VsLayout)판단 불가능
        // console.log('getCurrentInstance()?.parent?.type', getCurrentInstance()?.parent?.type);
        // console.log('getCurrentInstance', getCurrentInstance());

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
