<template>
    <div class="vs-layout" :style="layoutStyles">
        <slot />
    </div>
</template>

<script lang="ts">
import { CssPosition, Placement } from '@/declaration';
import { computed } from 'vue';
import { defineComponent, ref, provide, reactive } from 'vue';

export interface LayoutAttrs {
    header?: { position: CssPosition; height: string };
    footer?: { position: CssPosition; height: string };
    drawer?: { placement: Placement; size: string };
}

export default defineComponent({
    name: 'VsLayout',
    setup() {
        const navOn = ref(false);
        const layoutAttrs: LayoutAttrs = reactive({});

        provide('navOn', navOn);
        provide('layoutAttrs', layoutAttrs);

        const layoutStyles = computed(() => {
            const style = {
                paddingTop: '0px',
                paddingBottom: '0px',
                paddingLeft: '0px',
                paddingRight: '0px',
            };
            if (layoutAttrs.header) {
                const { position, height } = layoutAttrs.header;
                if (position === 'fixed' || position === 'absolute') {
                    style.paddingTop = height;
                }
            }

            if (layoutAttrs.footer) {
                const { position, height } = layoutAttrs.footer;
                if (position === 'fixed' || position === 'absolute') {
                    style.paddingBottom = height;
                }
            }

            return style;
        });

        return { navOn, layoutStyles };
    },
});
</script>
