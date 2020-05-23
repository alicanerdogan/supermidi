const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { getGlobalStyles } = require("tailwind-in-js");
const CleanCSS = require("clean-css");
const WorkboxPlugin = require("workbox-webpack-plugin");

const globalStyle = `
${getGlobalStyles()}
* {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;

  -webkit-tap-highlight-color: transparent;
}
html {
  max-height: 100%;
  background: #EDF2F7;
}
* {
  font-family: "Roboto Condensed", sans-serif;
}
`;
const minifiedGlobalStyle = new CleanCSS({ sourceMap: false }).minify(
  globalStyle
).styles;

const API_HOSTNAME = "http://localhost:3000";

const isProduction = process.argv.includes("--mode=production");
const activateServiceWorker = isProduction || process.env.BABEL_ENV === "devsw";
const activateReactRefresh = !isProduction && !activateServiceWorker;

const environmentPlugin = new webpack.EnvironmentPlugin({
  ACTIVATE_SW: activateServiceWorker,
  IS_PRODUCTION: isProduction,
});

const plugins = [
  environmentPlugin,
  new HtmlWebpackPlugin({
    title: "supermidi.",
    template: "./src/index.html.erb",
    minify: isProduction,
    globalStyle: minifiedGlobalStyle,
  }),
  new ForkTsCheckerWebpackPlugin({
    tsconfig: path.resolve(__dirname, "tsconfig.json"),
    useTypescriptIncrementalApi: true,
    checkSyntacticErrors: true,
    // Required to be async to force compilation to fail due to type checks
    async: false,
  }),
];

if (activateReactRefresh) {
  plugins.push(new ReactRefreshWebpackPlugin());
}

if (activateServiceWorker) {
  const _2MB = 2 * 1024 * 1024;
  const _10MB = 10 * 1024 * 1024;
  const swSrc = path.join(__dirname, "src", "utils", "sw.js");
  plugins.push(
    new WorkboxPlugin.InjectManifest({
      swSrc,
      swDest: "sw.js",
      maximumFileSizeToCacheInBytes: isProduction ? _2MB : _10MB,
      webpackCompilationPlugins: [environmentPlugin],
    })
  );
}

module.exports = {
  entry: { main: "./src/index.tsx", manifest: "./src/manifest/index.ts" },
  output: {
    filename: isProduction ? "[name].[contenthash].js" : "[name].[hash].js",
    path: __dirname + "/dist",
    publicPath: "/",
  },
  devtool: isProduction ? "source-map" : "cheap-module-source-map",
  devServer: {
    host: "0.0.0.0",
    contentBase: "./dist",
    compress: true,
    historyApiFallback: true,
    overlay: true,
    hot: true,
    clientLogLevel: "none",
    proxy: {
      "/api": {
        target: API_HOSTNAME,
      },
    },
    stats: "minimal",
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "src")],
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        type: "javascript/auto",
        test: /\.svg$/,
        use: [
          {
            loader: "@svgr/webpack",
          },
          {
            loader: "file-loader",
            options: {
              name: "[name].[hash].[ext]",
            },
          },
        ],
      },
      {
        type: "javascript/auto",
        test: /\.(png|svg|jpg|gif|ico|xml|json|webmanifest)$/,
        include: [path.resolve(__dirname, "src/manifest")],
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
          },
        },
      },
      {
        type: "javascript/auto",
        test: /\.(png|jpg|gif|ico|xml|json)$/,
        exclude: [path.resolve(__dirname, "src/manifest")],
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[hash].[ext]",
          },
        },
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            envName: isProduction ? "production" : "development",
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            envName: isProduction ? "production" : "development",
            cacheDirectory: true,
          },
        },
      },
    ],
  },
  plugins,
  optimization: {
    minimizer: isProduction ? [new TerserPlugin()] : [],
    splitChunks: {
      minChunks: 2,
    },
  },
};
