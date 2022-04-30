# msg-fabric-plugin-ec-target-router

(DEPRECATED) 

Eliptic Curve target router identity for [msg-fabric-core](https://github.com/shanewholloway/msg-fabric-core)


## Plugin Installation

```javascript
import FabricHub from 'msg-fabric-core'
import ec_target_router from 'msg-fabric-plugin-ec-target-router'

const ec_pem = require('ec-pem')
const Hub = FabricHub.plugin(ec_target_router({ec_pem}))
```
