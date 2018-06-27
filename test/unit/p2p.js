import { Hub, expect } from './_setup'

describe @ 'P2P Signed Target Router', @=> ::
  it @ 'hello via direct', @=>> :: 
    const hub_one = Hub.create()
    const hub_two = Hub.create()

    await hub_one.local.ready
    await hub_two.local.ready

    expect @ await hub_one.router.resolveRoute(hub_two.local.id_route)
    .to.be.undefined
    expect @ await hub_two.router.resolveRoute(hub_one.local.id_route)
    .to.be.undefined

    const [chan_a, chan_b] = await hub_one.direct.pair(hub_two)

    await chan_a.peer_info
    const rt_one_two = await hub_one.router.resolveRoute(hub_two.local.id_route)
    expect(rt_one_two).to.be.a('function')

    await chan_b.peer_info
    const rt_two_one = await hub_two.router.resolveRoute(hub_one.local.id_route)
    expect(rt_two_one).to.be.a('function')
