import type { Meta, StoryObj } from '@storybook/react';
import { useArgs, useEffect, useState } from '@storybook/preview-api';
import { Button } from '@best-design/button/src/button';
import { Style, useStyles, useStyleRule } from '@best-design/cssinjs/src';

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
        const [val, setVal] = useState(1);
        const rule = useStyleRule({
            suffix: ' .a1',
            properties: { width: val * 10, '--width': val }
        });
        console.log(rule);
        useEffect(() => {
            // const style = rule.style;
            // const sheet = style.sheet();
            // sheet.insertRule(`
            // @media (min-width: 768px) {
            //     .a1 {
            //       background: red;
            //     }
            //   }`);
            // console.log(style);
            // const rule1 = sheet.cssRules[0] as CSSMediaRule;
            // const rule2 = sheet.cssRules[1] as CSSStyleRule;
            // console.log(rule1, rule2);
        }, []);
        return (
            <Button
                {...props}
                className={rule.selector}
                onClick={() => {
                    setVal(val + 1);
                }}
            >
                <div className="a1" style={{ background: 'red', height: 10 }}></div>
                {val}
            </Button>
        );
    }
};
