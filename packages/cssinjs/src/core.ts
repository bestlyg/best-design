import hash from '@emotion/hash';
import { CSSProperties, useEffect, useState } from 'react';
import { usePrevious } from './hooks';

export class Rule {
    count = 0;
    constructor(public style: Style, public cssRule: CSSRule, public selector: string) {}
    delete() {
        this.style.deleteRule(this.selector);
    }
    updateStyle(properties: CSSProperties = {}) {
        const style = (this.cssRule as CSSStyleRule).style;
        for (const [key, val] of Object.entries(properties)) {
            style.setProperty(key, typeof val === 'number' ? val + 'px' : val);
        }
    }
}
export class Style {
    destroyed = false;
    clearing = false;
    cache = new Map<string, Rule>();
    style: HTMLStyleElement = document.createElement('style');
    sheet() {
        return this.style.sheet!;
    }
    rules() {
        return this.style.sheet!.cssRules;
    }
    constructor(public prefix = 'css') {
        this.prefix = prefix;
        document.head.appendChild(this.style);
    }
    clear() {
        if (!this.clearing) {
            this.clearing = true;
            requestIdleCallback(() => {
                const rules = this.rules();
                const sheet = this.sheet();
                for (let i = rules.length - 1; i >= 0; i--) {
                    const rule = rules[i];
                }
                this.clearing = false;
            });
        }
    }
    destroy() {
        document.head.removeChild(this.style);
    }
    insertRule({
        suffix = '',
        properties = {},
        track = true
    }: {
        suffix?: string;
        properties?: CSSProperties;
        track?: boolean;
    }): Rule {
        const sheet = this.sheet();
        const rules = this.rules();
        const propertyStr = Object.entries(properties).reduce(
            (s, [k, v]) => `${s}${k}:${v}${typeof v === 'number' ? 'px' : ''};`,
            ''
        );
        const hashedSelector = `${this.prefix}-${hash(suffix + propertyStr)}`;
        const mergedSelector = `${hashedSelector}${suffix}`;
        let data = this.cache.get(hashedSelector);
        if (!data) {
            const ruleStr = `.${mergedSelector}${suffix}{${propertyStr}}`;
            sheet.insertRule(ruleStr);
            const ruleInstance = new Rule(this, rules[0], hashedSelector);
            if (!track) return ruleInstance;
            data = ruleInstance;
            this.cache.set(mergedSelector, ruleInstance);
        }
        data.count += 1;
        return data;
    }
    deleteRule(hashedSelector: string) {
        const data = this.cache.get(hashedSelector);
        if (data && --data.count === 0) this.clear();
    }
    useRule(...args: Parameters<typeof this.insertRule>): Rule {
        const [rule] = useState(() => this.insertRule(...args));
        const prevDeleteRule = usePrevious(rule.delete);
        useEffect(() => rule.delete, []);
        useEffect(() => {
            prevDeleteRule?.();
        }, [rule.selector]);
        return rule;
    }
}
