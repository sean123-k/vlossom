<template>
    <vs-app has-nav :is-nav-open="isOpen">
        <vs-header height="100px" position="fixed" color-scheme="red">
            <div class="header-content">
                <button type="button" @click="open">
                    <!-- <vs-icon icon="goNext" size="20px" /> -->
                    메뉴 열기
                </button>
                <vs-theme-button />
            </div>
        </vs-header>

        <div style="position: relative">
            <!-- fixed 헤더 상태에서 has-conatiner 사용하기 위함 -->
            <navigation :is-open="isOpen" @close="close" />

            <vs-main>
                <!--  TODO: vs-main을 사용해야만 drawer기준으로 padding을 갖게 된다는 내용을 document에 설명해야 함 -->
                <router-view />
            </vs-main>
        </div>
        <vs-footer position="absolute" height="50px" color-scheme="blue">Footer</vs-footer>
    </vs-app>
</template>

<script lang="ts">
import { ref } from 'vue';
import { defineComponent } from 'vue';
import Navigation from './common/Navigation.vue';
import VsApp from './VsApp.vue';

export default defineComponent({
    components: {
        Navigation,
        VsApp,
    },
    setup() {
        const isOpen = ref(true);

        function open() {
            isOpen.value = true;
        }
        function close() {
            isOpen.value = false;
        }

        return { isOpen, open, close };
    },
});
</script>

<style lang="scss">
.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.2rem;
}

.close-button {
    padding: 1.2rem;
}

.menu-item {
    padding: 1.2rem 2rem;
    width: 100%;
    cursor: pointer;
    &:hover {
        background-color: #f0f0f0;
    }
}

// .drawer-container {
//     position: relative;
//     height: 100vh;
//     margin-top: 50px;
// }
</style>
