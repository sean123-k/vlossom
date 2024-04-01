<template>
    <vs-page>
        <!--  TODO: section styleset에 height 지정할지 고민 -->
        <!-- TODO: section overflow:auto 추가 -->
        <vs-section color-scheme="green" :style="{ height: '2000px' }">
            <h1 v-for="index in 50" style="background-color: beige">{{ LOREM_IPSUM }}</h1>
        </vs-section>
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

        const LOREM_IPSUM = `
    Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
    Aenean commodo ligula eget dolor. Aenean massa.
    Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
    Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.
    Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.
    In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.
    Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus.`;

        return { open, LOREM_IPSUM };
    },
});
</script>
