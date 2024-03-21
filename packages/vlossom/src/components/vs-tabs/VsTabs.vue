<template>
    <vs-wrapper :width="width" :grid="grid">
        <div :class="['vs-tabs', `vs-${computedColorScheme}`, { dense }]" :style="computedStyleSet">
            <button
                v-if="showScrollButtons"
                type="button"
                class="scroll-button"
                aria-label="scroll to the left"
                :disabled="currentFocusedTab <= 0"
                @click="scrollLeft"
            >
                <vs-icon icon="goPrev" size="1.2rem" />
            </button>
            <ul role="tablist" ref="tabsContainerRef" :class="{ bottomLine }">
                <li
                    v-for="(tab, index) in tabs"
                    ref="tabRefs"
                    :key="tab"
                    :class="['tab', { primary: isSelected(index), disabled: isDisabled(index) }]"
                    role="tab"
                    :aria-selected="isSelected(index)"
                    :aria-disabled="isDisabled(index)"
                    :tabindex="isSelected(index) ? 0 : -1"
                    @click.stop="selectTab(index)"
                    @keydown.stop="handleKeydown"
                >
                    <slot :name="tab" :index="index">
                        {{ tab }}
                    </slot>
                </li>
            </ul>
            <button
                v-if="showScrollButtons"
                type="button"
                class="scroll-button"
                aria-label="scroll to the right"
                :disabled="currentFocusedTab >= tabs.length - 1"
                @click="scrollRight"
            >
                <vs-icon icon="goNext" size="1.2rem" />
            </button>
        </div>
    </vs-wrapper>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref, watch, onMounted, onUnmounted, type Ref, type PropType } from 'vue';
import { useColorScheme, useStyleSet, getResponsiveProps } from '@/composables';
import { VsComponent, type ColorScheme } from '@/declaration';
import { objectUtil } from '@/utils/object';
import { logUtil } from '@/utils/log';
import VsWrapper from '@/components/vs-wrapper/VsWrapper.vue';
import { VsIcon } from '@/icons';

import type { VsTabsStyleSet, ScrollButton } from './types';
import { computed } from 'vue';

const name = VsComponent.VsTabs;
export default defineComponent({
    name,
    components: { VsWrapper, VsIcon },
    props: {
        ...getResponsiveProps(),
        colorScheme: { type: String as PropType<ColorScheme> },
        styleSet: { type: [String, Object] as PropType<string | VsTabsStyleSet> },
        bottomLine: { type: Boolean, default: true },
        dense: { type: Boolean, default: false },
        disabled: { type: Array as PropType<number[]>, default: () => [] },
        scrollable: { type: Boolean, default: true },
        scrollButtons: {
            type: String as PropType<ScrollButton>,
            default: '',
            validator: (value: ScrollButton, props) => {
                if (!props.scrollable && value) {
                    logUtil.logPropError(name, 'scrollButtons', 'scrollable must be true to use scrollButtons');
                    return false;
                }
                return true;
            },
        },
        tabs: {
            type: Array as PropType<string[]>,
            required: true,
            validator: (prop: string[]) => {
                const isValid = objectUtil.isUniq(prop);
                if (!isValid) {
                    logUtil.logPropError(name, 'tabs', 'tabs with duplicate items are not allowed');
                }
                return isValid;
            },
        },
        // v-model
        modelValue: { type: Number, default: 0 },
    },
    emits: ['update:modelValue', 'change'],
    setup(props, { emit }) {
        const { colorScheme, styleSet, disabled, scrollable, scrollButtons, tabs, modelValue } = toRefs(props);

        const { computedColorScheme } = useColorScheme(name, colorScheme);

        const { computedStyleSet } = useStyleSet<VsTabsStyleSet>(name, styleSet);

        const scrollCount = ref(1);

        const tabsContainerRef: Ref<HTMLElement | null> = ref(null);
        const tabRefs: Ref<HTMLElement[]> = ref([]);

        function isSelected(index: number) {
            return selectedIdx.value === index;
        }

        function isDisabled(index: number) {
            return disabled.value?.includes(index);
        }

        const selectedIdx = ref(modelValue.value);
        const currentFocusedTab = ref(selectedIdx.value);
        const totalLength = computed(() => tabs.value.length);

        function selectTab(index: number) {
            if (index < 0 || index > totalLength.value - 1) {
                selectedIdx.value = 0;
                return;
            }
            if (isDisabled(index)) {
                return;
            }
            selectedIdx.value = index;
        }

        watch(tabs, () => {
            selectTab(modelValue.value);
        });

        watch(selectedIdx, (index: number) => {
            tabRefs.value[index]?.focus();
            scrollTo(index);

            if (index !== modelValue.value) {
                emit('update:modelValue', index);
                emit('change', index);
            }
        });

        watch(
            modelValue,
            (index: number) => {
                selectTab(index);
            },
            { immediate: true },
        );

        function findNextActivedIndex(startIndex: number): number {
            for (let i = startIndex; i < totalLength.value + startIndex; i++) {
                const index = i % totalLength.value;
                if (!isDisabled(index)) {
                    return index;
                }
            }
            return startIndex;
        }

        function findPreviousActivedIndex(startIndex: number): number {
            for (let i = startIndex; i > startIndex - totalLength.value; i--) {
                const index = (i + totalLength.value) % totalLength.value;
                if (!isDisabled(index)) {
                    return index;
                }
            }
            return startIndex;
        }

        function handleKeydown(event: KeyboardEvent) {
            let targetIndex = selectedIdx.value;

            switch (event.code) {
                case 'ArrowLeft':
                    targetIndex = findPreviousActivedIndex(targetIndex - 1);
                    break;
                case 'ArrowRight':
                    targetIndex = findNextActivedIndex(targetIndex + 1);
                    break;
                case 'Home':
                    targetIndex = findNextActivedIndex(0);
                    break;
                case 'End':
                    targetIndex = findPreviousActivedIndex(totalLength.value - 1);
                    break;
                default:
                    return;
            }

            event.preventDefault();
            selectTab(targetIndex);
        }

        function calculateScrollCount() {
            const tabContainerWidth = tabsContainerRef.value?.clientWidth;
            if (!tabContainerWidth) {
                return 0;
            }

            let visibleTabsCount = 0;
            let accumulatedWidth = 0;
            tabRefs.value.some((tabRef) => {
                accumulatedWidth += tabRef.offsetWidth;
                if (accumulatedWidth <= tabContainerWidth) {
                    visibleTabsCount++;
                    return false;
                }
                return true;
            });

            scrollCount.value = visibleTabsCount;
        }
        const showScrollButtons = computed(() => {
            if (!scrollable.value || scrollCount.value === totalLength.value) {
                return false;
            }

            if (scrollButtons.value === 'mobile') {
                return window.innerWidth <= 768;
            }

            return true;
        });

        function scrollTo(index: number, position: ScrollLogicalPosition = 'center') {
            let targetIndex = index;
            if (index < 0) {
                targetIndex = 0;
            }
            if (index > totalLength.value - 1) {
                targetIndex = totalLength.value - 1;
            }

            tabRefs.value[targetIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: position });
            currentFocusedTab.value = targetIndex;
        }

        function scrollLeft() {
            const targetIndex = Math.max(0, currentFocusedTab.value - scrollCount.value);
            if (targetIndex <= 1) {
                scrollTo(targetIndex, 'nearest');
            } else {
                scrollTo(targetIndex);
            }
        }

        function scrollRight() {
            const targetIndex = Math.min(totalLength.value, currentFocusedTab.value + scrollCount.value);
            if (targetIndex > totalLength.value - 1) {
                scrollTo(targetIndex, 'nearest');
            } else {
                scrollTo(targetIndex);
            }
        }

        onMounted(() => {
            calculateScrollCount();
            window.addEventListener('resize', calculateScrollCount);
        });

        onUnmounted(() => {
            window.removeEventListener('resize', calculateScrollCount);
        });

        return {
            computedColorScheme,
            computedStyleSet,
            isSelected,
            isDisabled,
            selectedIdx,
            selectTab,
            tabsContainerRef,
            tabRefs,
            handleKeydown,
            showScrollButtons,
            currentFocusedTab,
            scrollLeft,
            scrollRight,
        };
    },
});
</script>

<style lang="scss" scoped src="./VsTabs.scss" />
