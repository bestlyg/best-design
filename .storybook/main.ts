import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';
import fs from 'fs-extra';
import webpack from 'webpack';
import hash from '@emotion/hash';
import * as changeCase from 'change-case';
import LessAutoprefix from 'less-plugin-autoprefix';
import NpmImportPlugin from 'less-plugin-npm-import';
import LessPluginFunctions from 'less-plugin-functions';

const npmImport = new NpmImportPlugin({ prefix: '~' });
const autoprefix = new LessAutoprefix();
const lessPluginFunctions = new LessPluginFunctions();

const resolve = (...p: string[]) => path.resolve(__dirname, '../', ...p);
const componentsPath = resolve('components');
const packagesPath = resolve('packages');
function aliasLibs() {
    const o: Record<string, string> = {};
    for (const dir of fs.readdirSync(componentsPath)) {
        const p = resolve(componentsPath, dir);
        const lib = require(resolve(p, 'package.json')).name;
        o[lib] = p;
    }
    for (const dir of fs.readdirSync(packagesPath)) {
        const p = resolve(packagesPath, dir);
        const lib = require(resolve(p, 'package.json')).name;
        o[lib] = p;
    }
    return o;
}

function defineVersion() {
    const o: Record<string, string> = {};
    for (const dir of fs.readdirSync(componentsPath)) {
        const p = resolve(componentsPath, dir);
        const pkgInfo = require(resolve(p, 'package.json'));
        const lib = pkgInfo.name;
        o[`VERSION_${changeCase.constantCase(lib)}`] = JSON.stringify(hash(pkgInfo.version));
    }
    for (const dir of fs.readdirSync(packagesPath)) {
        const p = resolve(packagesPath, dir);
        const pkgInfo = require(resolve(p, 'package.json'));
        const lib = pkgInfo.name;
        o[`VERSION_${changeCase.constantCase(lib)}`] = JSON.stringify(hash(pkgInfo.version));
    }
    return o;
}

const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;

function getUse(cssModule: boolean) {
    const options = cssModule
        ? {
              modules: {
                  localIdentName: '[local]-[hash:10]'
              }
          }
        : {};
    return [
        {
            loader: require.resolve('style-loader')
        },
        {
            loader: require.resolve('css-loader'),
            options
        },
        {
            loader: require.resolve('less-loader'),
            options: {
                lessOptions: {
                    javascriptEnabled: true,
                    plugins: [
                        // npmImport, autoprefix, lessPluginFunctions
                    ]
                }
            }
        }
    ];
}

function getAbsolutePath(value: string): any {
    return path.dirname(require.resolve(path.join(value, 'package.json')));
}
const config: StorybookConfig = {
    stories: [
        resolve('stories/**/*.mdx'),
        resolve('stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'),
        resolve(componentsPath, '**/__demo__', '**/*.mdx'),
        resolve(componentsPath, '**/__demo__', '**/*.stories.@(js|jsx|mjs|ts|tsx)'),
        resolve(packagesPath, '**/__demo__', '**/*.mdx'),
        resolve(packagesPath, '**/__demo__', '**/*.stories.@(js|jsx|mjs|ts|tsx)')
    ],
    addons: [
        getAbsolutePath('@storybook/addon-links'),
        getAbsolutePath('@storybook/addon-essentials'),
        getAbsolutePath('@storybook/addon-onboarding'),
        getAbsolutePath('@storybook/addon-interactions'),
        getAbsolutePath('@storybook/addon-styling-webpack')
    ],
    framework: {
        name: getAbsolutePath('@storybook/react-webpack5'),
        options: {}
    },
    typescript: {
        reactDocgen: 'react-docgen-typescript'
    },
    docs: {
        autodocs: 'tag'
    },
    webpackFinal(config) {
        config.plugins?.push(
            new webpack.DefinePlugin({
                ...defineVersion()
            })
        );
        for (const [k, v] of Object.entries(aliasLibs())) {
            config.resolve!.alias![k] = v;
        }
        config.resolve!.alias!['react'] = getAbsolutePath('react');
        config.resolve!.alias!['react-dom'] = getAbsolutePath('react-dom');
        console.log(config.resolve!.alias);
        (config as any).module.rules.push(
            {
                test: lessRegex,
                exclude: lessModuleRegex,
                use: getUse(false)
            },
            {
                test: lessModuleRegex,
                use: getUse(true)
            }
        );
        // console.log(config);
        // config.cache = false;
        console.log(defineVersion());
        return config;
    },
    async babel(config, { configType }) {
        config.presets?.push(['@babel/preset-typescript', {}]);
        if (configType === 'DEVELOPMENT') {
        }
        if (configType === 'PRODUCTION') {
        }
        return config;
    }
};
export default config;
