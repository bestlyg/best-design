import { useContext, createContext, useRef } from 'react';
import { Style } from '../core';

export const defaultContext = { styles: [new Style()] };
export const Context = createContext(defaultContext);

export function useStyles(): Style[] {
    const { styles } = useContext(Context);
    return styles;
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
