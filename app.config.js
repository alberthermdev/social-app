const { expo } = require('./app.json');
const APP_ENV = process.env.EXPO_PUBLIC_APP_ENV || 'development';
const EAS_PROJECT_ID = process.env.EXPO_PUBLIC_EAS_PROJECT_ID || '6a7a79c0-43fa-4efd-8fbc-c0240dac2603';

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
      projectId: EAS_PROJECT_ID,
    },
  },
  updates: {
    url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
});
