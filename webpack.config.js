const path = require("path");

const baseConfig = {
  entry: "./src/lzw.ts",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};

const moduleExport = {
  ...baseConfig,
  experiments: {
    outputModule: true,
  },
  output: {
    filename: "lzw.module.min.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      type: "module",
    },
  },
};

const umdExport = {
  ...baseConfig,
  output: {
    filename: "lzw.umd.min.js",
    path: path.resolve(__dirname, "dist"),
    library: {
      type: "umd",
    },
  },
};

module.exports = [moduleExport, umdExport];
