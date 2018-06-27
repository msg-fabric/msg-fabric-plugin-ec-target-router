export const sym_sampi = '\u03E0' // 'Ϡ'

var Hub
export { Hub }
export function _init(FabricHub) :: Hub = FabricHub

const chai = require('chai')

import chaiAsPromised from 'chai-as-promised'
chai.use @ chaiAsPromised

export const assert = chai.assert
export const expect = chai.expect

export const sinon = require('sinon')

export const sleep = ms =>
  new Promise @ resolve =>
    setTimeout @ resolve, ms

export function newLog() ::
  const log = (...args) =>
    log.calls.push @ 1 === args.length
      ? args[0] : args

  log.calls = []
  return log
