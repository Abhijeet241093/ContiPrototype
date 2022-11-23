module.exports = {
   resolve: {
      extensions: [".jsx", ".js", ".json", ".css", ".scss", ".jpg", ".jpeg", ".png"],
      // alias: {
      //    'react-native$': 'react-native-web',
      //    "react-native/Libraries/Renderer/shims/ReactNativePropRegistry":
      //       "react-native-web/dist/modules/ReactNativePropRegistry",
      // }
   },
   module: {
      rules: [
         {
            test: /\.(png|jpe?g)$/i,
            use: [
               {
                  loader: "file-loader",
               },
            ],
         },
         {
            test: /\.m?js/,
            type: "javascript/auto",
            resolve: {
               fullySpecified: false,
            },
         },
         {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
               loader: "babel-loader",
               options: {
                  presets: ["@babel/preset-react", "@babel/preset-env"],
                  plugins: ["@babel/plugin-transform-runtime"],
               },
            },
         },
         {
            test: /\.json$/,
            loader: 'json-loader'
          },
         {
            test: /\.(css|s[ac]ss)$/i,
            use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
         },
      ],
   },
 };
 