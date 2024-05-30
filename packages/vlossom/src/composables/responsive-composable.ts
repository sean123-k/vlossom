import { ComputedRef, PropType, Ref, computed } from 'vue';
import { utils } from '@/utils';

import type { Breakpoints } from '@/declaration';

export function getResponsiveProps() {
    return {
        width: { type: [String, Number, Object] as PropType<string | number | Breakpoints>, default: null },
        grid: { type: [String, Number, Object] as PropType<string | number | Breakpoints>, default: null },
    };
}

function convertSize(width: string | number) {
    if (isNaN(Number(width)) && typeof width === 'string') {
        return width;
    } else {
        return `${width || 0}px`;
    }
}

export function useResponsive(
    width: Ref<string | number | Breakpoints | null>,
    grid: Ref<string | number | Breakpoints | null>,
) {
    const responsiveClasses: ComputedRef<string[]> = computed(() => {
        const classes: string[] = ['vs-responsive'];

        if (width.value && utils.object.isPlainObject(width.value)) {
            const { sm, md, lg, xl } = width.value;
            const widthClasses = [
                ...(sm ? ['vs-width-sm'] : []),
                ...(md ? ['vs-width-md'] : []),
                ...(lg ? ['vs-width-lg'] : []),
                ...(xl ? ['vs-width-xl'] : []),
            ];
            classes.push(...widthClasses);
        }

        if (grid.value && utils.object.isPlainObject(grid.value)) {
            const { sm, md, lg, xl } = grid.value;
            const gridClasses = [
                ...(sm ? ['vs-grid-sm'] : []),
                ...(md ? ['vs-grid-md'] : []),
                ...(lg ? ['vs-grid-lg'] : []),
                ...(xl ? ['vs-grid-xl'] : []),
            ];
            classes.push(...gridClasses);
        }

        return classes;
    });

    const responsiveStyles: ComputedRef<Record<string, string>> = computed(() => {
        const styles: Record<string, string> = {};
        if (width.value !== undefined && width.value !== null) {
            if (utils.object.isPlainObject(width.value)) {
                const { base, sm, md, lg, xl } = width.value;
                const widthStyles = {
                    //  TODO: 0px 지정 안되는 이슈
                    ...(base !== undefined && base !== null && { ['--vs-width-base']: convertSize(base) }),
                    ...(sm !== undefined && base !== null && { ['--vs-width-sm']: convertSize(sm) }),
                    ...(md !== undefined && base !== null && { ['--vs-width-md']: convertSize(md) }),
                    ...(lg !== undefined && base !== null && { ['--vs-width-lg']: convertSize(lg) }),
                    ...(xl !== undefined && base !== null && { ['--vs-width-xl']: convertSize(xl) }),
                };

                Object.assign(styles, widthStyles);
                console.log('width', styles);
            } else {
                styles['width'] = convertSize(width.value);
            }
        }

        if (grid.value !== undefined && grid.value !== null) {
            if (utils.object.isPlainObject(grid.value)) {
                const { base, sm, md, lg, xl } = grid.value;
                //  TODO: grid 속성 반영 안되는 이슈
                const gridStyles = {
                    ...(base !== undefined && base !== null && { ['--vs-grid-base']: base?.toString() }),
                    ...(sm !== undefined && base !== null && { ['--vs-grid-sm']: sm?.toString() }),
                    ...(md !== undefined && base !== null && { ['--vs-grid-md']: md?.toString() }),
                    ...(lg !== undefined && base !== null && { ['--vs-grid-lg']: lg?.toString() }),
                    ...(xl !== undefined && base !== null && { ['--vs-grid-xl']: xl?.toString() }),
                };
                Object.assign(styles, gridStyles);
                console.log('grid', styles);
            } else {
                const gridStyles = {
                    '--vs-grid-base': grid.value?.toString(),
                };
                Object.assign(styles, gridStyles);
            }
        }

        return styles;
    });

    return {
        responsiveClasses,
        responsiveStyles,
    };
}
