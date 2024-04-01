<template>Playground에서 테스트 후에, 일부 컴포넌트 수정 후 docs 에 작업하기</template>

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
