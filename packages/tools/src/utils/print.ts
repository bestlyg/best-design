import chalk from 'chalk';

export const PREFIX = 'M4B-CLI';

function log(...args) {
    console.log(...args);
}

function _print(color, ...args) {
    if (args.length > 1) {
        log(
            chalk[`bg${color.replace(/^\w/, w => w.toUpperCase())}`](` ${args[0]} `),
            chalk[color](args.slice(1))
        );
    } else {
        log(chalk[color](...args));
    }
}

function list(info: Record<string, any>) {
    const entries = Object.entries(info).filter(([, v]) => v !== undefined);
    const padEndLength = Math.max(...entries.map(([k]) => k.length)) + 1;
    for (const [k, v] of entries) {
        print.info(`${k.padEnd(padEndLength)}: ${v}`);
    }
}

export const print = _print as typeof _print & {
    info: typeof _print;
    warn: typeof _print;
    error: typeof _print;
    success: typeof _print;
    log: typeof log;
    chalk: typeof chalk;
    divider: typeof divider;
    list: typeof list;
};

print.info = _print.bind(null, 'gray', PREFIX);
print.warn = _print.bind(null, 'yellow', PREFIX);
print.error = _print.bind(null, 'red', PREFIX);
print.success = _print.bind(null, 'green', PREFIX);
print.log = log;
print.chalk = chalk;
print.divider = divider;
print.list = list;

export function error(msg: string, ...errs: any[]) {
    print.error(msg);
    errs.forEach(err => {
        if (typeof err === 'string') {
            print.error(err);
        } else {
            console.error(err);
        }
    });
}

/**
 * Print divider
 * @param {'info' | 'warn' | 'success' | 'error'} level
 */
function divider(level = 'info') {
    const logger = print[level] || print.info;
    logger(
        '---------------------------------------------------------------------------------------'
    );
}
