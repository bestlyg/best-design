import type { JestConfigWithTsJest } from 'ts-jest';
import path from 'path';
import fs from 'fs-extra';

const resolve = (...p: string[]) => path.resolve(__dirname, ...p);
const componentsPath = resolve('components');
const packagesPath = resolve('packages');
function aliasLibs() {
    const o: Record<string, string> = {};
    for (const dir of fs.readdirSync(componentsPath)) {
        const p = resolve(componentsPath, dir);
        const lib = require(resolve(p, 'package.json')).name;
        o[`^${lib}$`] = `${p}/src`;
    }
    for (const dir of fs.readdirSync(packagesPath)) {
        const p = resolve(packagesPath, dir);
        const lib = require(resolve(p, 'package.json')).name;
        o[`^${lib}$`] = `${p}/src`;
    }
    return o;
}

function getAbsolutePath(value: string): any {
    return path.dirname(require.resolve(path.join(value, 'package.json')));
}

export default async (): Promise<JestConfigWithTsJest> => {
    return {
        verbose: true,
        preset: 'ts-jest',
        testEnvironment: 'jsdom',
        setupFiles: ['./tests/setup.ts'],
        setupFilesAfterEnv: ['./tests/setupAfterEnv.ts'],
        moduleFileExtensions: ['ts', 'tsx', 'js'],
        testPathIgnorePatterns: ['/node_modules/'],
        testRegex: '.*\\.test\\.(j|t)sx?$',
        collectCoverageFrom: [
            'components/**/*.{ts,tsx}',
            '!components/*/style/index.tsx',
            '!components/*/__test__/**',
            '!components/*/__demo__/**',
            '!components/**/*/interface.{ts,tsx}'
        ],
        moduleNameMapper: {
            '/\\.(css|less)$/': 'identity-obj-proxy',
            '^react$': getAbsolutePath('react'),
            '^react-dom$': getAbsolutePath('react-dom'),
            ...aliasLibs()
        },
        // testEnvironmentOptions: {
        //     url: 'http://localhost'
        // },
        transform: {
            '\\.tsx?$': './tests/code-transformer.js',
            '\\.jsx?$': './tests/code-transformer.js'
        }
    };
};
