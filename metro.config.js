const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add custom configuration
config.resolver.alias = {
  '@': path.resolve(__dirname),
};

// Set Metro server port
config.server = {
  port: 8082
};

module.exports = config; 