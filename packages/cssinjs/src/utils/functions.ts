import unitless from '@emotion/unitless';
import hash from '@emotion/hash';
import { CSSProperties } from '../types';
import { RuleContainer, StyleRule } from '../core';

export function transformStyleValue<T>(key: string, value: T) {
    if (!unitless[key] && typeof value === 'number' && value !== 0) {
        return value + 'px';
    }
    return value;
}

export function propertyToString<T>(key: string, value: T) {
    return `${key}:${transformStyleValue(key, value)}`;
}

export function propertiesToString(properties: CSSProperties) {
    return Object.entries(properties).reduce((s, [k, v]) => `${s}${propertyToString(k, v)};`, '');
}

export function createStyleRule({
    suffix = '',
    properties = {},
    container,
    prefix = 'css'
}: {
    container: RuleContainer;
    media?: string;
    suffix?: string;
    properties?: CSSProperties;
    prefix?: string;
}): StyleRule {
    const propertyStr = propertiesToString(properties);
    const hashedSelector = `${prefix}-${hash(prefix + suffix + propertyStr)}`;
    const mergedSelector = `${hashedSelector}${suffix}`;
    const ruleStr = `.${mergedSelector}{${propertyStr}}`;
    container.cssContainer.insertRule(ruleStr);
    const ruleInstance = new StyleRule({
        container,
        cssRule: container.cssContainer.cssRules[0] as CSSStyleRule,
        selector: hashedSelector
    });
    return ruleInstance;
}
