import { Hub, expect } from './_setup'

describe @ 'Static Signature Verification', @=> ::
  const req_id = `some-static-req-id`
  const chan_src = @{} id_local: 'some-chan-aaa', id_remote: 'BBB-some-chan'
  const chan_dst = @{} id_local: 'BBB-some-chan', id_remote: 'some-chan-aaa'

  it @ 'generate static signature', gen_static_signature

  it @ 'from Browser', @=>> ::
    await ver_static_signature @ 'AmSnkSUslJTqzY1RVH78zlvO8I73MfiFhRB2pqHAcb+M',
      @{} 'alg': 'ECDSA', 'tag': 'KFpR', 'sig': 'lFC/axQctkavSDmvZEiWa9P9ALaKZG7FfCzdg9pVJRjw6temGHqj7OJbxp1vfsEKL2CVtA5CpbXagWlUHP8iuA=='
        
    await ver_static_signature @ 'As3BEHcwVncZ3+zJ1mBkKkRFPmlzKIkuvrp4Td7+/oMq',
      @{} 'alg': 'ECDSA', 'tag': 'TINm', 'sig': 'ROdSjqYyrM9O9toUWj0bD0Xj/eMqypASIMQxfEVAcUxBb9p004CvsnboAPrl+e6gGN5rz2+gd0wLCKQ0AiJ3pQ=='

  it @ 'from NodeJS', @=>> ::
    await ver_static_signature @ 'AokQ+h2ukcgRhvX8VW735nAg9bU4ZIjs8Ug07ajP9kwd',
      @{} 'alg': 'ECDSA', 'tag': 'Nzc5', 'sig': 'pNaRQkw2+bMWXjDlejYow7f0ldZk86LVjW5FZdvlONAnemWiojPX9wBncb59/4p6B1nt6mtIRWrZMxZ2MQjsDA=='

    await ver_static_signature @ 'A0rxj8HVKoduCiXlnsiwZYfsWahFq+J0vpy2/7LTYtWR',
      @{} 'alg': 'ECDSA', 'tag': 'nlUo', 'sig': 'SVtDxMJOsZGa6BhfC05GFo6eFQ4gpn0y9KCVNDWrnv8XERjSP/LkzakabPvoVAS+5QQvva0rtQPyWM12K85W9w=='


  async function ver_static_signature(id_route, rec) ::
    const ans = await Hub.ECTargetRouter.verifyRouteId @
      req_id, chan_dst, id_route, rec
    expect(ans).to.equal @ id_route

  async function gen_static_signature() ::
    const hub = Hub.create()
    const rec = await hub.local.signRouteId @ req_id, chan_src

    await ver_static_signature @ hub.local.id_route, rec

    if 0 ::
      console.log @ JSON.stringify @ [hub.local.id_route, rec], null, 2
