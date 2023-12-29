import hash from '@emotion/hash';
import { CSSProperties } from '../types';
import { propertiesToString } from '../utils';
import { Rule } from './rule';

export class Style {
    started = false;
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
    }
    init() {
        if (!this.started) {
            document.head.appendChild(this.style);
            this.started = true;
        }
    }
    clear() {
        if (!this.clearing) {
            this.clearing = true;
            requestIdleCallback(() => {
                const ruleMap = new Map<CSSRule, Rule>();
                for (const rule of this.cache.values()) {
                    ruleMap.set(rule.cssRule, rule);
                }
                const rules = this.rules();
                const sheet = this.sheet();
                for (let i = rules.length - 1; i >= 0; i--) {
                    const rule = ruleMap.get(rules[i]);
                    if (rule?.count === 0) {
                        sheet.deleteRule(i);
                        this.cache.delete(rule.selector);
                    }
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
        const propertyStr = propertiesToString(properties);
        const hashedSelector = `${this.prefix}-${hash(this.prefix + suffix + propertyStr)}`;
        const mergedSelector = `${hashedSelector}${suffix}`;
        let data = this.cache.get(hashedSelector);
        if (!data) {
            const ruleStr = `.${mergedSelector}{${propertyStr}}`;
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
        // console.log('deleteRule', hashedSelector, data);
        if (data && --data.count === 0) this.clear();
    }
}
