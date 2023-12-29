import { useContext, createContext, useRef, useMemo, useEffect } from 'react';
import { Style } from '../core';
import { propertiesToString } from './functions';

export const defaultContext = { styles: [new Style()] };
export const Context = createContext(defaultContext);

export function useStyles(): Style[] {
    const { styles } = useContext(Context);
    return styles;
}

export function useStyleRule(args: { style?: Style } & Parameters<Style['insertStyleRule']>[0]) {
    const { style: _style, ...restArgs } = args;
    const styles = useStyles();
    const style = _style ?? styles[0];
    style.init();
    const rule = useMemo(
        () => style.insertStyleRule(restArgs),
        [propertiesToString(restArgs.properties ?? {}), restArgs.suffix]
    );
    const prevDeleteFn = usePrevious(() => rule.delete());
    useEffect(() => () => rule.delete(), []);
    useEffect(() => prevDeleteFn?.(), [rule]);
    return rule;
}

export function usePrevious<T>(val: T, compare = Object.is): T | undefined {
    const oldValRef = useRef<T>();
    const newValRef = useRef<T>();
    if (!compare(oldValRef.current, val)) {
        oldValRef.current = newValRef.current;
        newValRef.current = val;
    }
    return oldValRef.current;
}
