var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require("webpack");

module.exports = {
  entry: ['./public/scripts/app'],

  output: {
    publicPath: "http://localhost:8080/",
    path: "./public/js",
    filename: "bundle.js"
  },

  //Grunt plugin stuff
  stats: {
    colors: true,
    modules: true,
    reasons: true
  },
  storeStatsTo: "xyz", 
  progress: true, 
  failOnError: true, 
  watch: true,
  keepalive: true,

  cache: true,

  resolve: {
    root:"http://localhost:8080/",
    modulesDirectories: [
      './public/scripts',
      './public/lib',
      './public/templates',
      //'./public/styles',

      //so mustache-loader can find hogan
      './node_modules'
    ]
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style!css" },
      /*
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!stylus-loader")
      },*/
      // { test: /\.useable\.css$/, loader: "style/useable!css" },
      
      { test: /\.tmpl$/, loader: 'mustache'},
      { test: /\.tmpl\?noShortcut$/, loader: 'mustache?noShortcut'},

      // { test: /require\.js$/, loader: "exports?requirejs!script" }
    ]
  },
  externals: {
    // require("jquery") is external and available
    //  on the global var jQuery
    "jquery": "jQuery"
  },
  plugins: [
   // new ExtractTextPlugin("[name].css")//,
    //new webpack.optimize.UglifyJsPlugin({minimize: true})
  ]
};