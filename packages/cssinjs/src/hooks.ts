import { useContext, useRef, createContext } from 'react';
import { Style } from './core';

export type ShouldUpdateFunc<T> = (prev: T | undefined, next: T) => boolean;

const defaultShouldUpdate = <T extends any>(a?: T, b?: T) => !Object.is(a, b);

export function usePrevious<T>(
    state: T,
    shouldUpdate: ShouldUpdateFunc<T> = defaultShouldUpdate
): T | undefined {
    const prevRef = useRef<T>();
    const curRef = useRef<T>();

    if (shouldUpdate(curRef.current, state)) {
        prevRef.current = curRef.current;
        curRef.current = state;
    }

    return prevRef.current;
}

export const defaultContext = { style: new Style() };
export const Context = createContext(defaultContext);

export function useStyle(): Style {
    const { style } = useContext(Context);
    return style;
}

