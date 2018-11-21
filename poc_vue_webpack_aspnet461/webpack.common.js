const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const requireContext = require('require-context');

var configuration = {
    target: "web",

    resolve: {
        // Add ".ts" and ".tsx" as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json", ".html"],
    },

    module: {
        rules: [
            // All files with a ".ts" or ".tsx" extension will be handled by "awesome-typescript-loader".
            { test: /.ts$/, loader: "awesome-typescript-loader" },

            // All image files will be handled here
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    "file-loader"
                ]
            },

            // All font files will be handled here
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: "file-loader"
                    }
                ]
            },

            // All files with ".html" will be handled 
            { test: /\.html$/, loader: "html-loader" },

            // All output ".js" files will have any sourcemaps re-processed by "source-map-loader".
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    plugins: ([
        // make sure we allow any jquery usages outside of our webpack modules
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),

        // Clean dist folder.
        new CleanWebpackPlugin(["./dist"], {
            "verbose": true // Write logs to console.
        }),

        // avoid publishing when compilation failed.
        new webpack.NoEmitOnErrorsPlugin(),

        new HtmlWebpackPlugin({
            inject: "body",
            filename: "../Views/Shared/_Layout.cshtml",
            template: "./Views/Shared/_Layout_Template.cshtml",
            chunks: [
                "index"
            ]
        }),

        new HtmlWebpackPlugin({
            inject: "body",
            filename: "./Views/Carro/Index.cshtml",
            template: "./Views/Shared/Index.cshtml",
            chunks: [
                "carro\\index"
            ]
        })
    ]),

    // pretty terminal output
    stats: { colors: true }
};


//Get all files index.ts insert views
var indexes = requireContext(__dirname + '/src/views', true, /index\.ts$/);


//Register all Index.cshtml
indexes.keys().forEach(function (name) {

    configuration.plugins.push(new HtmlWebpackPlugin({
        inject: "body",
        filename: __dirname + "/Views/" + name.replace('index.ts', '') + "Index.cshtml",
        template: "./Views/Shared/Index.cshtml",
        chunks: [
            name.replace('.ts', '')
        ]
    }))

})


module.exports = configuration;