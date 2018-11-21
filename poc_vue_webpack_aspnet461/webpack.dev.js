const path = require("path");
const webpack = require("webpack");
const Merge = require("webpack-merge");
const CommonConfig = require("./webpack.common.js");
const requireContext = require('require-context');

//Get all files index.ts insert views
var indexes = requireContext(__dirname + '/src/views', true, /index\.ts$/);

//Register main index.ts
var entries = {
    index: path.resolve(__dirname, "src/index.ts")
}

//Register all index.ts
indexes.keys().forEach(function (name) {
    entries[name.replace('.ts', '')] = path.resolve(__dirname, "src/views/" + name)
})

module.exports = Merge(CommonConfig, {
    devtool: "inline-source-map",

    entry: entries,

    output: {
        filename: '[name].js',
        path: __dirname + "/dist",
        // Making sure the CSS and JS files that are split out do not break the template cshtml.
        publicPath: "/dist/",
        // Defining a global var that can used to call functions from within ASP.NET Razor pages.
        library: "aspAndWebpack",
        libraryTarget: "var"
    },

    module: {
        rules: [
            // All css files will be handled here
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },

            // All files with ".scss" will be handled and transpiled to css
            {
                test: /\.(scss)$/,
                use: [{
                    loader: 'style-loader', // inject CSS to page
                }, {
                    loader: 'css-loader', // translates CSS into CommonJS modules
                }, {
                    loader: 'postcss-loader', // Run post css actions
                    options: {
                        plugins: function () { // post css plugins, can be exported to postcss.config.js
                            return [
                                require('precss'),
                                require('autoprefixer')
                            ];
                        }
                    }
                }, {
                    loader: 'sass-loader' // compiles Sass to CSS
                }]
            }
        ]
    },

    plugins: ([
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("development")
            }
        })
    ]),
})