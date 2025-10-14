// babel.config.js correto para SDK 50+
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Remove 'expo-router/babel' se estiver lá
      'react-native-worklets/plugin', // Substitui 'react-native-reanimated/plugin'
    ],
  };
};