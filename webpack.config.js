const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
// npm_lifecycle_event  tiene el comando que npm ejecuta
// (tomado de la sección scripts de package.json
const TARGET = process.env.npm_lifecycle_event;  // <- variable global de npm
const PATHS = {
    app: path.join(__dirname, 'app'),
    components: path.join(__dirname, 'app/component'),
    build: path.join(__dirname, 'build')
};

const common = {  // Mantenemos la configuración en esta variable
    // Entry acepta una ruta (path) o un objeto con varias Entry
    // para configuraciones más complejas.
    entry: {
        app: PATHS.app
    },
    resolve: { // Agrega las extensiones para resolver.
        // Notar que el punto "." antes de las extensiones se requiere para que funcionen
        extensions: ['', '.js', '.jsx'] // '' se necesita para permitir imports sin extensión.
    },
    output: {
        path: PATHS.build,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.css$/,  // test espera una expresión regular RegExp. ¡Notar los slashes!
                loaders: ['style', 'css'],
                include: PATHS.app  // include acepta ambos, una ruta o un arreglo de rutas.
            },
            {
                test: /\.jsx?$/, // Acepta .js y .jsx
                // ?cacheDirectory habilita el caché en el desarrollo (quitar en producción)
                loaders: ['babel'], //  loaders: ['babel?cacheDirectory'],
                include: [PATHS.app, PATHS.components] // Parsea sólo en carpeta app
            }
        ]
    }
};


// Configuración por Defecto (Default)
if(TARGET === 'start' || !TARGET) { // si no hay TARGET se elige éste

    module.exports = merge(common, { // Envía la configuración de start
        devtool: 'eval-source-map', // Configuración para sourcemap
        devServer: {
            contentBase: PATHS.build,
            // Habilita history API fallback para que funcione el enrutamiento
            // basado en la API HTML5 History API. Es un buen defecto que ayudará
            // en setup's más complicados.
            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: true,
            // Muestra sólo errores para reducir la salida de mensajes.
            stats: 'errors-only',
            // Toma host y port desde env (de npm). Así es mejor para modificar.
            //
            // Si usamos Vagrant o Cloud9, ponemo
            // host: process.env.HOST || '0.0.0.0';
            //
            // 0.0.0.0 está disponible para todos los dispositivos de red,
            // a diferencia de localhost
            host: process.env.HOST,
            port: process.env.PORT
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    });
}

if(TARGET === 'build') {
    module.exports = merge(common, {}); // Envía la configuración de build
}

