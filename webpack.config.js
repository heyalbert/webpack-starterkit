require('dotenv').config();
const path = require('path');

const HtmlWebpackPlugin = require("html-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const cssnano = require("cssnano");
const DotEnv = require('dotenv-webpack');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production'

let webpackConfig = {
    devServer: {
        // Display only errors to reduce the amount of output.
        stats: "errors-only",

        // Parse host and port from env to allow customization.
        //
        // If you use Docker, Vagrant or Cloud9, set
        // host: options.host || "0.0.0.0";
        //
        // 0.0.0.0 is available to all network devices
        // unlike default `localhost`.
        host: process.env.HOST, // Defaults to `localhost`
        port: process.env.PORT, // Defaults to 8080
        open: true, // Open the page in browser
        overlay: true,
        quiet: true
    },
    entry: ['./source/main.js'],
    output: {
        filename: './bundle.js',
        path: path.resolve(__dirname, 'static')
    },
    /*optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            }),
        ]
    },*/
    plugins: [
        new ErrorOverlayPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        new DotEnv(),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            //filename: devMode ? '[name].dev.css' : '[name].[hash].prod.css',
            // chunkFilename: devMode ? '[id].dev.css' : '[id].[hash].prod.css',
            filename: '[name].[hash].dev.css',
            chunkFilename: '[id].[hash].dev.css',
        }),
        new OptimizeCSSAssetsWebpackPlugin({
            cssProcessorOptions: { discardComments: { removeAll: true } },
            cssProcessor: cssnano,
            // canPrint: A boolean indicating if the plugin can print messages to the console, defaults to true
            // devMode: first = dev; second = prod
            canPrint: devMode ? true : false,
        }),
        new HtmlWebpackPlugin({
            title: "Webpack demo",
        })
    ],
    devtool: "source-map", // any "source-map"-like devtool is possible
    module: {
        rules: [
            {
                test: /\.s?[ac]ss$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader, options: {
                        sourceMap: true
                    }
                }, {
                    loader: "css-loader", options: {
                        sourceMap: true
                    }
                }, {
                    loader: "sass-loader", options: {
                        sourceMap: true
                    }
                }]
                /*use: [
                   {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                   /* {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true,
                            plugins: () => [require("autoprefixer")()],
                        }
                    },*/
                    /*{
                        loader: "resolve-url-loader",
                        options: {
                            sourceMap: true
                        }
                    },*/
                    /*{
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }*
                ]*/
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 50000,
                        name: "./fonts/[name].[ext]", // Output below ./fonts
                        publicPath: "../", // Take the directory into account
                    },
                },
            },
            {
                test: /.*\.(gif|png|jpe?g)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8000,
                            name: '/images/[name]_[sha512:hash:base64:7].[ext]',
                            publicPath: "../", // Take the directory into account
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            optipng: {
                                optimizationLevel: 7
                            },
                            pngquant: {
                                quality: '65-90'
                            },
                            mozjpeg: {
                                quality: 65
                            }
                        }
                    }
                ]
            }
        ]
    }
}



module.exports = webpackConfig;

/*
module.exports = {
    mode: 'production',
    entry: './source/main.js',
    output: {
        filename: './bundle.js',
        path: path.resolve(__dirname, 'static')
    },
    module: {
        rules: [
        {
            test: /\.css$/,
                include: [
                    path.resolve(__dirname, "static")
                ],
            use: ExtractTextPlugin.extract({
                fallback: 'style',
                use: [
                    { loader: 'cache' },
                    { loader: 'css', options: { sourceMap: true } },
                ],
            }),
            test: /\.scss$/,
                include: [
                    path.resolve(__dirname, "static")
                ],
            use: ExtractTextPlugin.extract({
                fallback: 'style',
                use: [
                    { loader: 'cache' },
                    { loader: 'css', options: { sourceMap: true } },
                    { loader: 'resolve-url', options: { sourceMap: true } },
                    { loader: 'sass', options: { sourceMap: true } },
                ],
            }),
        }],
    },
    plugins: [
        extractSass
    ]
    
};
*/


