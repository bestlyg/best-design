import { Command } from 'commander';
import fs from 'fs-extra';
import { capitalCase } from 'change-case';
import path from 'node:path';
import { print } from './print.js';

export const resolve = (...p: string[]) =>
    path.resolve(path.dirname(import.meta.url), '../..', ...p);

export const getEnv = (s: string) => process.env[`M4B_CLI_${s}`];

export async function loadCommands({
    program,
    commandDirs,
    filter = () => false
}: {
    program: Command;
    commandDirs: string[];
    filter?: (filePath: string) => boolean;
}) {
    
    return Promise.allSettled(
        commandDirs
            .map(commandDir => {
                if (!fs.existsSync(commandDir) || !fs.statSync(commandDir).isDirectory()) return [];
                return fs
                    .readdirSync(commandDir)
                    .filter(entry => filter(resolve(commandDir, entry)))
                    .map(entry => {
                        return require(resolve(commandDir, entry)).default;
                    })
                    .filter(mod => typeof mod === 'function');
            })
            .flat()
            .map(fn => {
                return Promise.resolve().then(() => fn(program));
            })
    ).then(list => {
        const rejectedList = list.filter(item => item.status === 'rejected');
        if (rejectedList.length > 0) {
            print.warn('Failed to load commands.');
            rejectedList.forEach((item: PromiseRejectedResult) => {
                if (item.reason) print.warn(item.reason);
            });
        }
    });
}

export function precheckArgs({
    program,
    args,
    checkList
}: {
    program: Command;
    args: Record<string, any>;
    checkList: {
        key: string;
        required?: boolean;
        message?: string;
        validator?: (args: Parameters<typeof precheckArgs>[0]['args']) => boolean;
    }[];
}): boolean {
    // if (args.help) {
    //   program.help();
    //   return false;
    // }
    for (const { key, required, message, validator = () => true } of checkList) {
        if (required && args[key] === undefined) {
            if (message) print.error(message);
            else print.error(`${capitalCase(key)} is required.`);
            return false;
        } else if (!validator(args)) {
            print.error(message);
            return false;
        }
    }
    return true;
}
