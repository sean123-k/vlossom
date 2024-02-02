import { colorScheme, align, getColorSchemeTemplate, cssPosition } from '@/storybook/args';
import { chromaticParameters } from '@/storybook/parameters';
import VsFooter from './../VsFooter.vue';

import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof VsFooter> = {
    title: 'Components/Layout Components/VsFooter',
    component: VsFooter,
    render: (args: any) => ({
        components: { VsFooter },
        setup() {
            const content = `Lorem ipsum dolor sit amet consectetur adipisicing elit.
			Possimus, voluptatem cum? Atque facilis mollitia distinctio
			perferendis sed voluptates omnis sit maxime ad! Porro incidunt
			voluptatem quaerat sint itaque, blanditiis excepturi!`;

            return { content, args };
        },
        template: `
			<div style="height:200px; background-color:#fff; position: relative; width: 100%">
				<vs-footer v-bind="args" > This is Footer Content </vs-footer>
				{{content}}
			</div>
		`,
    }),
    tags: ['autodocs'],
    argTypes: {
        colorScheme,
        verticalAlign: align,
        position: cssPosition,
    },
};
export default meta;
type Story = StoryObj<typeof VsFooter>;

export const Default: Story = {};

export const ColorScheme: Story = {
    render: () => ({
        components: { VsFooter },
        template: `
            <div>
                ${getColorSchemeTemplate(`
                    <vs-footer color-scheme="{{ color }}" :style="{ marginBottom: '1rem' }">
						This is Footer Content
                    </vs-footer>
                `)}
            </div>
		`,
    }),
    parameters: {
        chromatic: chromaticParameters.theme,
    },
};

export const Primary: Story = {
    render: () => ({
        components: { VsFooter },
        template: `
            <div>
                ${getColorSchemeTemplate(`
                    <vs-footer color-scheme="{{ color }}" :style="{ marginBottom: '1rem' }">
						This is Footer Content
                    </vs-footer>
                `)}
            </div>
		`,
    }),
    args: {
        primary: true,
    },
    parameters: {
        chromatic: chromaticParameters.theme,
    },
};

export const VerticalAlignTop: Story = {
    render: (args: any) => ({
        components: { VsFooter },
        setup() {
            const styleSet = {
                height: '200px',
            };
            return { args, styleSet };
        },
        template: `
			<vs-footer v-bind="args" :styleSet="styleSet" > This is Footer Content </vs-footer>
		`,
    }),
    args: {
        verticalAlign: 'start',
    },
};

export const VerticalAlignBottom: Story = {
    render: (args: any) => ({
        components: { VsFooter },
        setup() {
            const styleSet = {
                height: '200px',
            };
            return { args, styleSet };
        },
        template: `
			<vs-footer v-bind="args" :styleSet="styleSet" > This is Footer Content </vs-footer>
		`,
    }),
    args: {
        verticalAlign: 'end',
    },
};

export const StyleSet: Story = {
    args: {
        styleSet: {
            backgroundColor: '#000',
            color: '#fff',
            height: '60px',
            padding: '10px',
            position: 'absolute',
            textAlign: 'center',
        },
    },
};

export const PreDefinedStyleSet: Story = {
    args: {
        styleSet: 'myStyleSet',
    },
};
