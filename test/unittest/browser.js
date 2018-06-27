import FabricBaseHub from 'msg-fabric-core/esm/core-browser'
import pi_ec_target from 'msg-fabric-plugin-ec-target-router/esm/browser'

const FabricHub = FabricBaseHub
  .plugins( pi_ec_target() )

import { _init } from '../unit/_setup'
_init(FabricHub)

export * from '../unit/all'
//export * from './../unit/all.browser'
