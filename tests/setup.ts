import util from 'util';
import React from 'react';
console.log('JEST setup');
if (window) {
    // (window as any).React = React;
}
// eslint-disable-next-line no-console
console.log('Current React Version:', React.version);
