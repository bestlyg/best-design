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
    filterFn = () => true
}: {
    program: Command;
    commandDirs: string[];
    filterFn?: (filePath: string) => boolean | Promise<boolean>;
}) {
    const files = (
        await Promise.all(
            commandDirs.map(async commandDir =>
                (await fs.readdir(commandDir)).map(p => resolve(commandDir, p))
            )
        )
    ).flat();
    const filteredFiles = [];
    for (const file of files) {
        if (await filterFn(file)) {
            filteredFiles.push(file);
        }
    }
    const modules = await Promise.all(filteredFiles.map(async file => import(file)));
    for (const mod of modules) {
        const fn = mod.default;
        fn(program);
    }
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
