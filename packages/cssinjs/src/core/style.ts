import { RuleContainer } from './rule';

export class Style extends RuleContainer {
    started = false;
    destroyed = false;
    style: HTMLStyleElement;
    constructor(public prefix = 'css') {
        super();
    }
    init() {
        if (!this.started) {
            this.style = document.createElement('style');
            document.head.appendChild(this.style);
            this.cssContainer = this.style.sheet;
            this.started = true;
        }
    }
    destroy() {
        if (!this.destroyed) {
            document.head.removeChild(this.style);
            this.destroyed = true;
        }
    }
}
