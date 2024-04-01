<template>
    <vs-page>
        <!--  TODO: section styleset에 height 지정? -->
        <vs-section :style="{ height: '200px' }"> This is Home </vs-section>
    </vs-page>
</template>

<script lang="ts">
import { ref } from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        const isOpen = ref(true);
        function open() {
            isOpen.value = true;
        }

        return { open };
    },
});
</script>
