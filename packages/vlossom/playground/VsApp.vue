<template>
    <div id="vs-app" ref="app">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, nextTick, toRefs } from 'vue';

export default defineComponent({
    props: {
        hasNav: { type: Boolean, default: false },
        isNavOpen: {
            type: Boolean,
            default: false,
            validator: (val, props) => {
                if (!props.hasNav && val) {
                    console.error('hasNav prop is false, so isNavOpen prop should be false');
                    return false;
                }
                return true;
            },
        },
    },
    setup(props) {
        const { isNavOpen } = toRefs(props);
        const app = ref<HTMLElement | null>(null);
        const header = ref<HTMLElement | null>(null);
        const footer = ref<HTMLElement | null>(null);
        const main = ref<HTMLElement | null>(null);

        onMounted(() => {
            app.value = document.getElementById('vs-app');
            header.value = document.querySelector('.vs-header');
            footer.value = document.querySelector('.vs-footer');
            main.value = document.querySelector('.vs-main');

            nextTick(() => {
                if (!app.value) {
                    return;
                }

                if (header.value) {
                    if (
                        header.value.classList.contains('vs-header-fixed') ||
                        header.value.classList.contains('vs-header-absolute')
                    ) {
                        app.value.style.paddingTop = `${Math.max(header.value.offsetHeight, 50)}px`;
                    }
                }

                if (footer.value) {
                    if (
                        footer.value.classList.contains('vs-footer-fixed') ||
                        footer.value.classList.contains('vs-footer-absolute')
                    ) {
                        app.value.style.paddingBottom = `${Math.max(footer.value.offsetHeight, 50)}px`;
                    }
                }
            });
        });

        watch(
            isNavOpen,
            () => {
                nextTick(() => {
                    const drawer = document.querySelector('.vs-drawer');
                    if (!main.value) {
                        return;
                    }

                    if (!isNavOpen.value) {
                        main.value.style.padding = '0';
                        return;
                    }

                    if (isNavOpen.value) {
                        if (!drawer) {
                            return;
                        }

                        const drawerBody: HTMLElement | null = drawer.querySelector('.dialog-body');

                        if (drawer.classList.contains('vs-drawer-left')) {
                            main.value.style.paddingLeft = `${Math.max(drawerBody?.offsetWidth || 0, 200)}px`;
                        }

                        if (drawer.classList.contains('vs-drawer-right')) {
                            main.value.style.paddingRight = `${Math.max(drawerBody?.offsetWidth || 0, 200)}px`;
                        }

                        if (drawer.classList.contains('vs-drawer-top')) {
                            let paddingSize = drawerBody?.offsetHeight || 0;

                            if (header.value) {
                                if (
                                    header.value.classList.contains('vs-header-fixed') ||
                                    header.value.classList.contains('vs-header-absolute')
                                ) {
                                    paddingSize += header.value.offsetHeight;
                                }
                            }
                            main.value.style.paddingTop = `${paddingSize}px`;
                        }

                        if (drawer.classList.contains('vs-drawer-bottom')) {
                            let paddingSize = drawerBody?.offsetHeight || 0;

                            if (footer.value) {
                                if (
                                    footer.value.classList.contains('vs-footer-fixed') ||
                                    footer.value.classList.contains('vs-footer-absolute')
                                ) {
                                    paddingSize += footer.value.offsetHeight;
                                }
                            }

                            main.value.style.paddingBottom = `${paddingSize}px`;
                        }
                    }
                });
            },
            { immediate: true },
        );
    },
});
</script>

<style lang="scss">
//  header, footer height 가 동적으로 추가되기 떄문에 js로 처리해야 함
#vs-app {
    position: relative;
    min-height: 100vh;
    // &:has(> .vs-header) {
    //     .vs-header-fixed,
    //     .vs-header-absolute {
    //         padding-top: 50px;
    //     }
    // }

    &:has(.vs-main) {
        .vs-main {
            transition: padding 0.4s;
        }
    }
}
</style>
