import { useContext, createContext, useRef, useMemo, useEffect } from 'react';
import { Style } from '../core';
import { CreateStyleRule, propertiesToString, createStyleRule } from './functions';

export const defaultContext = { styles: [new Style()] };
export const Context = createContext(defaultContext);

export function useStyles(): Style[] {
    const { styles } = useContext(Context);
    return styles;
}

export function useStyleRule(args: CreateStyleRule) {
    const rule = useMemo(
        () => createStyleRule(args),
        [propertiesToString(args.properties ?? {}), args.suffix]
    );
    useEffect(() => () => rule.delete(), []);
    const prevDeleteFn = usePrevious(() => rule.delete());
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
