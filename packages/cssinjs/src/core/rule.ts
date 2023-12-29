import { Style } from './style';
import type { CSSProperties } from '../types';
import { transformStyleValue } from '../utils';

export class Rule {
    count = 0;
    constructor(public style: Style, public cssRule: CSSRule, public selector: string) {}
    delete() {
        this.style.deleteRule(this.selector);
    }
    updateStyle(properties: CSSProperties = {}) {
        const style = (this.cssRule as CSSStyleRule).style;
        for (const [key, val] of Object.entries(properties)) {
            style?.setProperty(key, transformStyleValue(key, val));
        }
    }
}
