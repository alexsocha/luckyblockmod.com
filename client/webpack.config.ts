// @ts-ignore
import CopyPlugin from 'copy-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

import * as path from 'path';
import * as webpack from 'webpack';

const baseDir = __dirname;
const mode = (process.env.NODE_ENV as 'production' | 'development') || 'development';
const isProd = mode === 'production';

const config: webpack.Configuration = {
    mode: mode,
    entry: {
        main: path.join(baseDir, 'src/index.js'),
    },
    output: {
        path: path.resolve(baseDir, 'dist'),
        filename: '[name].js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.(html|md)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'pages/[name].html',
                        },
                    },
                    'extract-loader',
                    {
                        loader: 'html-loader',
                        options: {
                            esModule: false,
                            sources: {
                                urlFilter: (
                                    attribute: string,
                                    value: string,
                                    resourcePath: string
                                ) => {
                                    if (value.endsWith('.ico')) return false;
                                    return true;
                                },
                            },
                        },
                    },
                    path.join(baseDir, 'handlebars-loader.ts'),
                ],
            },
            {
                test: /\.txt$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'pages/[name].txt',
                        },
                    },
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: `style${isProd ? '.[contenthash:8]' : ''}.css`,
                        },
                    },
                    'extract-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.png$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: `img/[name]${isProd ? '.[contenthash:8]' : ''}.[ext]`,
                        },
                    },
                ],
            },
            {
                test: /\.ts/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: `[name]${isProd ? '.[contenthash:8]' : ''}.js`,
                        },
                    },
                    'ts-loader',
                ],
            },
        ],
    },
    plugins: [
        new CssMinimizerPlugin(),
        new CopyPlugin({
            patterns: [{ from: path.join(baseDir, 'src/static'), to: path.join(baseDir, 'dist') }],
        }),
        new CleanWebpackPlugin(),
    ],
};

export default config;
