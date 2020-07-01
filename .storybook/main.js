// module.exports = {
//   stories: ['../stories/**/*.stories.js'],
//   addons: ['@storybook/addon-actions', '@storybook/addon-links'],
//   webpackFinal: async config => {
//     // do mutation to the config
//
//     return config;
//   },
// };
const path = require('path')
module.exports = {
    addons: ['@storybook/addon-actions/register'],
    stories: ['../src/**/*.stories.tsx'],
    webpackFinal: async (config) => {
        config.module.rules = config.module.rules.filter((rule) => !rule.test.test('.scss'))
        config.module.rules.push(
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
                include: path.resolve(__dirname, '../'),
            },
            {
                test: /\.(ts|tsx)$/,
                loader: require.resolve('babel-loader'),
                options: {
                    presets: [['react-app', { flow: false, typescript: true }]],
                },
            }
        )
        config.resolve.extensions.push('.ts', '.tsx')
        return config
    },
}
