module.exports = {
    entry: './app/App.js',
    output: {
        path: __dirname + '/public',
        filename: 'bundle.js'
    },
    devServer: {
        inline: true,
        contentBase: __dirname + '/public',
        port: 3333
    }
};
module: {
    loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
            presets: ['es2015']
        }
    }]
}
