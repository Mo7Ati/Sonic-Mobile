const { withAndroidManifest } = require('expo/config-plugins');

module.exports = function withRTLSupport(config) {
  return withAndroidManifest(config, (config) => {
    const application = config.modResults.manifest.application[0];
    application.$['android:supportsRtl'] = 'true';
    return config;
  });
};
