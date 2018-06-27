const ec_pem = require('ec-pem')
import FabricBaseHub from 'msg-fabric-core/esm/core-node'
import pi_web from 'msg-fabric-core/esm/plugin-web'
import pi_ec_target from 'msg-fabric-plugin-ec-target-router/esm/node'

const FabricHub = FabricBaseHub
  .plugins( pi_web(), pi_ec_target({ec_pem}) )

import { _init } from '../unit/_setup'
_init(FabricHub)

export * from './../unit/all'
//export * from './../unit/all.node'
