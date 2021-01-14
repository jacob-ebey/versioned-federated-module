const path = require("path");

const { camelCase } = require("camel-case");

const webpack = require("webpack");
const { merge } = require("webpack-merge");

const pkg = require("./package.json");

const name = camelCase(pkg.name);

const exposes = {
  "./utils/log-hello": "./src/utils/log-hello.js",
  "./utils/version": "./src/utils/version.js",
};

/** @type {webpack.Configuration} */
const baseConfig = {
  mode: process.env.NODE_ENV === "development" ? "development" : "production",
};

/** @type {webpack.Configuration} */
const browserConfig = {
  output: {
    path: path.resolve("./dist/browser"),
  },
  plugins: [
    new webpack.container.ModuleFederationPlugin({
      name,
      filename: "remote-entry.js",
      exposes,
    }),
  ],
};

/** @type {webpack.Configuration} */
const nodeConfig = {
  target: "node",
  output: {
    path: path.resolve("./dist/node"),
  },
  plugins: [
    new webpack.container.ModuleFederationPlugin({
      name,
      filename: "remote-entry.js",
      library: { type: "commonjs" },
      exposes,
    }),
  ],
};

module.exports = [
  merge(baseConfig, browserConfig),
  merge(baseConfig, nodeConfig),
];
