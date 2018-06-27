import { Hub, expect, newLog } from './_setup'

describe @ 'ECTargetRouter', @=> ::
  it @ 'Hub API', @=>> ::
    expect(Hub.ECTargetRouter).to.be.a('function')
    expect(Hub.ECTargetRouter.verifyRouteId).to.be.a('function')

    const hub = Hub.create()
    expect(hub.createECRoute).to.be.a('function')
    expect(hub.newECRoute).to.be.a('function')

  it @ 'Default local route is an ECTargetRouter', @=>> ::
    const hub = Hub.create()
    expect(hub.local).to.be.an.instanceof(hub.constructor.ECTargetRouter)

  it @ 'Signed Route API for P2P registration', @=>> ::
    const hub = Hub.create()
    const ec_route = hub.createECRoute()
    expect(ec_route.id_route).to.be.undefined
    expect(ec_route.ready).to.be.a('promise')
    expect(ec_route.signRouteId).to.be.a('function')
    expect(ec_route.verifyRouteId).to.be.a('function')

    await ec_route.ready
    expect(ec_route.id_route).to.be.a('string')

  it @ 'simple message send', @=>> ::
    const log = newLog()
    const hub = Hub.create()
    await hub.local.ready

    const {id_route} = hub.local
    log @ 'typeof id_route', typeof id_route

    hub.local.registerTarget @ 'a-tgt', (pkt, pktctx) => ::
      const {id_target} = pkt
      log @ 'tgt recv', @{} id_target, body: pkt.json()

    ::
      const ts = new Date()
      await hub.send @:
        id_route, id_target: 'a-tgt'
        body: @{} msg: 'a message', ts

      expect(log.calls).to.be.deep.equal @#
        @[] 'typeof id_route', 'string'
        @[] 'tgt recv', @{} id_target: 'a-tgt', body: @{} msg: 'a message', ts: ts.toJSON()


  it @ 'sign/verify direct', @=>> ::
    const req_id = `some-req-id ${new Date}`
    const chan_src = @{} id_local: 'some-chan-aaa', id_remote: 'BBB-some-chan'
    const chan_dst = @{} id_local: 'BBB-some-chan', id_remote: 'some-chan-aaa'

    const hub = Hub.create()
    ::
      const rec = await hub.local.signRouteId @ req_id, chan_src
      await expect_verify @ hub.local.id_route, rec

    ::
      const ec_route = hub.createECRoute()
      const rec = await ec_route.signRouteId @ req_id, chan_src
      await expect_verify @ ec_route.id_route, rec


    async function expect_verify(id_route, rec) ::
      expect(rec.curve).to.be.equal('P-256')
      expect(rec.hash).to.be.equal('SHA-256')
      expect(rec.tag).to.be.a('string')
      expect(rec.sig).to.be.a('string')

      const valid = await hub.local.verifyRouteId @
        req_id, chan_dst, id_route, rec

      expect(valid).to.be.equal(id_route)


      const invalid = await hub.local.verifyRouteId @
        req_id, chan_src, id_route, rec

      expect(invalid).to.be.false

