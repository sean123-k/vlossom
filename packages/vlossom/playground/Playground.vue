<template>
    <vs-layout>
        <!-- /중첩구조에서 문제가 됨. Navitaion에서는 부모(VsLayout)판단 가능, VsDrawer에서는 부모(VsLayout)판단 불가능 -->
        <!-- <navigation :is-open="isOpen" @close="close" /> -->
        <vs-drawer
            v-model="isOpen"
            :dimmed="true"
            :closeOnDimmedClick="true"
            position="fixed"
            style="margin-top: 100px"
        >
            <navigation @close="close" />
        </vs-drawer>

        <vs-container>
            <vs-header height="100px" position="fixed" color-scheme="red">
                <div class="header-content">
                    <button type="button" @click="isOpen = !isOpen">
                        <!-- <vs-icon icon="goNext" size="20px" /> -->
                        MENU
                    </button>
                    <vs-theme-button />
                </div>
            </vs-header>

            <!--  TODO: vs-main을 사용해야만 drawer기준으로 padding을 갖게 된다는 내용을 document에 설명해야 함 -->
            <router-view />

            <vs-footer position="absolute" height="50px" color-scheme="blue">Footer</vs-footer>
        </vs-container>
    </vs-layout>
</template>

<script lang="ts">
import { ref } from 'vue';
import { defineComponent } from 'vue';
import Navigation from './common/Navigation.vue';

export default defineComponent({
    components: {
        Navigation,
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
