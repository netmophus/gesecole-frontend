const path = require('path');

module.exports = {
    entry: './src/index.js', // Point d'entrée de votre application
    output: {
        path: path.resolve(__dirname, 'build'), // Dossier de sortie
        filename: 'bundle.js', // Nom du fichier de sortie
    },
    resolve: {
        fallback: {
            os: require.resolve('os-browserify/browser'), // Polyfill pour 'os'
            buffer: require.resolve('buffer/'), // Polyfill pour 'buffer'
            http: require.resolve('stream-http'), // Polyfill pour 'http'
            https: require.resolve('https-browserify'), // Polyfill pour 'https'
            zlib: require.resolve('browserify-zlib'), // Polyfill pour 'zlib'
            path: require.resolve('path-browserify'), // Polyfill pour 'path'
            util: require.resolve('util/'), // Polyfill pour 'util'
        },
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/, // Appliquer aux fichiers .js et .jsx
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // Utilisez Babel pour transpiler le code
                },
            },
            // Ajoutez d'autres règles ici si nécessaire
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'], // Résoudre les extensions
    },
    // Autres configurations (plugins, devServer, etc.)...
};
