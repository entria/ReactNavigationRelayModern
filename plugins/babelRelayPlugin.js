const getBabelRelayPlugin = require('babel-relay-plugin');

const schemaData = require('../data/schema.json');

module.exports = getBabelRelayPlugin(schemaData.data);
