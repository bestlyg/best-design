import type { StorybookConfig } from '@storybook/react-webpack5';
import webpack from 'webpack';
import hash from '@emotion/hash';
import { constantCase } from 'change-case';
import LessAutoprefix from 'less-plugin-autoprefix';
import NpmImportPlugin from 'less-plugin-npm-import';
import LessPluginFunctions from 'less-plugin-functions';
import { getAbsolutePath, getLibs, componentsPath, packagesPath, resolve } from '../scripts/utils';

const npmImport = new NpmImportPlugin({ prefix: '~' });
const autoprefix = new LessAutoprefix();
const lessPluginFunctions = new LessPluginFunctions();

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

const config: StorybookConfig = {
    stories: process.env.MATERIAL_CENTER_DEMO_COMPONENT
        ? [
              resolve(
                  ...process.env.MATERIAL_CENTER_DEMO_COMPONENT.split('/'),
                  '**/__demo__',
                  '**/*.stories.@(js|jsx|mjs|ts|tsx)'
              )
          ]
        : [
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
        name: getAbsolutePath('@storybook/react-webpack5') as any,
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
                ...getLibs().reduce((o, { packageJson: { name, version } }) => {
                    o[`VERSION_${constantCase(name)}`] = JSON.stringify(hash(version));
                    return o;
                }, {})
            })
        );
        for (const lib of getLibs()) {
            config.resolve!.alias![lib.packageJson.name] = lib.dirPath;
        }
        config.resolve!.alias!['react'] = getAbsolutePath('react');
        config.resolve!.alias!['react-dom'] = getAbsolutePath('react-dom');
        console.log(config.resolve!.alias);
        config.module?.rules?.push(
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
