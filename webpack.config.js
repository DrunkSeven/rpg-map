const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs = require('fs');
const PATHNAME = './static/'
const folders = fs.readdirSync(PATHNAME + 'img/');
let filesJson = {}
folders.forEach(e => {
    let files = fs.readdirSync(PATHNAME + 'img/' + e)
    filesJson[e] = []
    files.forEach(element => {
        filesJson[e].push(element)
    });
})
fs.writeFileSync(PATHNAME + 'json/filesJson.json', JSON.stringify(filesJson))

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: false
                    },
                },

                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'file-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: '中华一番客栈',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                minifyCSS: true
            },
            template: './src/index.html',
        }),
        new CopyWebpackPlugin([
            {
                from: 'static',
                to: 'static'
            }
        ])
    ]
}