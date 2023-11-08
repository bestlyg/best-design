import type { Meta, StoryObj } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';
import { Button } from '@best-design/button/src/button';
import '@best-design/button/src/style/index.less';

const meta = {
    title: 'Best-Design/Button',
    component: Button,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs'],
    argTypes: {}
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
      containerProps: { className: 'container' },
      children: 'child'
    },
    render: function Render(args) {
        const [props, updateArgs] = useArgs();
        console.log('storyBook render, ', args, useArgs());
        return <Button {...props} />;
    }
};
