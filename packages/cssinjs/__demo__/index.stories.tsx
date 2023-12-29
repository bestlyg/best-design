import type { Meta, StoryObj } from '@storybook/react';
import { useArgs, useEffect, useState } from '@storybook/preview-api';
import { Button } from '@best-design/button/src/button';
import { Style, useStyle } from '@best-design/cssinjs/src';

const meta: Meta<typeof Button> = {
    title: 'Best-Design/CssInJs',
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
        className: 'container',
        children: 'child'
    },
    render: function Render(args) {
        const [props, updateArgs] = useArgs();
        const style = useStyle();
        const [val, setVal] = useState(1);
        const rule = style.useRule({
            properties: {
                width: val * 10
            }
        });
        useEffect(() => {
            console.log(style)
            // rule.updateStyle({ width: val * 10 });
        }, [val]);
        console.log('storyBook render, ', args, useArgs());
        return (
            <Button
                {...props}
                className={rule.selector}
                onClick={() => {
                    setVal(val + 1);
                }}
            >
                {val}
            </Button>
        );
    }
};
