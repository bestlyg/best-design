import clsx from '@best-design/core/es/deps/clsx';
import { useConfigContext } from '@best-design/core/es/config-provider';
import { forwardRef } from 'react';
import { ButtonProps } from './interface';

declare const VERSION_BEST_DESIGN_BUTTON: string;

function Button(props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) {
    const {
        prefix,
        defaultConfig: { size: defaultSize }
    } = useConfigContext();
    const prefixCls = `${prefix}-button`;
    const { containerProps = {}, size: propsSize } = props;
    const size = propsSize ?? defaultSize ?? 'medium';
    return (
        <button
            ref={ref}
            data-v={VERSION_BEST_DESIGN_BUTTON}
            {...containerProps}
            className={clsx(prefixCls, `${prefixCls}-${size}`, containerProps.className)}
        >
            button-{props.children}
        </button>
    );
}

const ForwardRefButton = forwardRef<HTMLButtonElement, ButtonProps>(Button);

export { ForwardRefButton as Button };
export type { ButtonProps };
