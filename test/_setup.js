require('source-map-support').install()

const {URL} = require('url')
const {TextEncoder, TextDecoder} = require('util')
Object.assign(global, {URL, TextDecoder, TextEncoder})

const BasicHub = require('msg-fabric-core')
const pi_ec_target = require('msg-fabric-plugin-ec-target-router')

const TestNetHub = BasicHub.plugin( pi_ec_target() )

module.exports = exports = BasicHub
Object.assign(exports, {
  default: BasicHub,
  BasicHub,
  TestNetHub,
})
