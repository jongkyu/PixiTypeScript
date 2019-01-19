const path = require("path");
//whtch file copy
var CopyWebpackPlugin = require('copy-webpack-plugin');

//watch resource copy
const WriteFilePlugin = require('write-file-webpack-plugin');

module.exports = {
    //babel es6+ transfiling incluse 
    // entry: {
    //     app: ['babel-polyfill', './src/scripts/main.ts']
    // },
    entry: "./src/scripts/main.ts",
    output: {
        filename: "./scripts/bundle.js",
        path: path.resolve(__dirname, "./dist"),
    },
    // Enable sourcemaps for debugging webpack's otput.
    devtool: "inline-source-map",
    resolve: {
        // Add '.ts' as resolvable extensions.
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: ["ts-loader"]
            },
            {
                test: /\.(png|jpg|gif)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'file-loader',
                }]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: { presets: ['es2015', 'es2016'] },
                }],
            },

        ]
    },

    //babel optimazation
    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //             commons: {
    //                 test: /[\\/]node_modules[\\/]/,
    //                 name: 'vendors',
    //                 chunks: 'all'
    //             }
    //         }
    //     }
    // },

    mode: "development",

    devServer: {
        contentBase: path.join(__dirname, "."),
        compress: true,
        port: 8080
    },
    // Omit "externals" if you don't have any. Just an example because it's
    // common to have them.
    externals: {
        // Don't bundle giant dependencies, instead assume they're available in
        // the html doc as global variables node module name -> JS global
        // through which it is available
        "pixi.js": "PIXI"
    },

    plugins: [
        //
        new CopyWebpackPlugin([
            { from: './src/images', to: './images' }
        ]),
        new WriteFilePlugin(),
    ]
};
