import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// @ts-ignore
import CopyPlugin from 'copy-webpack-plugin';
import OptimizeCssPlugin from 'optimize-css-assets-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

import * as path from 'path';
import * as webpack from 'webpack';
import * as glob from 'glob';

const baseDir = __dirname;
const mode = (process.env.NODE_ENV as 'production' | 'development') || 'development';

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
                    'file-loader?name=pages/[name].html',
                    'extract-loader',
                    'html-loader',
                    path.join(baseDir, 'handlebars-loader.ts'),
                ],
            },
            {
                test: /\.txt$/,
                loader: 'file-loader?name=pages/[name].txt',
            },
            {
                test: /\.scss$/,
                use: [
                    'file-loader?name=style.[contenthash:8].css',
                    'extract-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.png$/,
                loader: 'file-loader?name=img/[name].[contenthash:8].[ext]',
            },
            {
                test: /\.ts/,
                loader: 'file-loader?name=[name].[contenthash:8].js',
            },
        ],
    },
    plugins: [
        new OptimizeCssPlugin(),
        new CopyPlugin({
            patterns: [{ from: path.join(baseDir, 'src/static'), to: path.join(baseDir, 'dist') }],
        }),
        new CleanWebpackPlugin(),
    ],
};

export default config;
