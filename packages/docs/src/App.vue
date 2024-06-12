<template>
    <vs-layout>
        <vs-drawer
            v-model="isOpen"
            :dimmed="true"
            :closeOnDimmedClick="true"
            position="fixed"
            style="margin-top: 70px"
            size="300px"
            :style-set="{ padding: '10' }"
        >
            <navigation @close="close" />
        </vs-drawer>

        <vs-container>
            <vs-header height="70px" position="fixed" color-scheme="red">
                <div class="header-content">
                    <button type="button" @click="isOpen = !isOpen">
                        <!-- <vs-icon icon="goNext" size="20px" /> -->
                        MENU
                    </button>
                    <vs-theme-button />
                </div>
            </vs-header>

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
</style>