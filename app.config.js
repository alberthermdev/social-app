const { expo } = require('./app.json');
const APP_ENV = process.env.EXPO_PUBLIC_APP_ENV || 'development';

const suffixMap = {
  development: ' Dev',
  staging: ' Staging',
  production: '',
};

const bundleIdMap = {
  development: 'com.socialapp.dev',
  staging: 'com.socialapp.staging',
  production: 'com.socialapp',
};

const appNameSuffix = suffixMap[APP_ENV];
const bundleIdentifier = bundleIdMap[APP_ENV];

module.exports = () => ({
  ...expo,
  name: `${expo.name}${appNameSuffix}`,
  ios: {
    ...expo.ios,
    bundleIdentifier,
  },
  android: {
    ...expo.android,
    package: bundleIdentifier,
  },
  extra: {
    appEnv: APP_ENV,
    eas: {
      projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
    },
  },
  updates: {
    url: `https://u.expo.dev/${process.env.EXPO_PUBLIC_EAS_PROJECT_ID}`,
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
});
