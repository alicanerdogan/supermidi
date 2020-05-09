const devPlugins = [
  ["babel-plugin-styled-components", { displayName: true, fileName: true }],
];

if (process.env.BABEL_ENV !== "devsw") {
  devPlugins.push("react-refresh/babel");
}

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
        useBuiltIns: "usage",
        corejs: 3,
        targets: {
          browsers: ["last 2 Firefox versions", "last 2 Chrome versions"],
        },
      },
    ],
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
  plugins: [
    ["babel-plugin-styled-components", { pure: true }],
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-syntax-object-rest-spread",
    "@babel/plugin-proposal-class-properties",
  ],
  env: {
    development: {
      plugins: devPlugins,
    },
  },
};
