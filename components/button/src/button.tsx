import clsx from '@best-design/core/es/deps/clsx';
import { useConfigContext } from '@best-design/core/es/config-provider';
import { version } from './version';
import { forwardRef } from 'react';
import { ButtonProps } from './interface';

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
            data-version={version}
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
