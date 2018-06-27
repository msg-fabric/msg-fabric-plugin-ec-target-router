import { Hub, expect } from './_setup'

describe @ 'Static Signature Verification', @=> ::
  const req_id = `some-static-req-id`
  const chan_src = @{} id_local: 'some-chan-aaa', id_remote: 'BBB-some-chan'
  const chan_dst = @{} id_local: 'BBB-some-chan', id_remote: 'some-chan-aaa'

  it @ 'generate static signature', gen_static_signature

  it @ 'from Browser', @=>> ::
    await ver_static_signature @ "CqyHUXtYCGhR36rX", @{}
      "alg": "ECDSA", "tag": "WqmJ",
      "sig": "nlM1oQ6kL3D/yorvKkDD700GCzJiDJ0wJ8g8qK17cz89GG95NFkA+nUOqv0C65Wd7Gqj8YB01x2sC6BzPlwThA==",
      "ec": "BIrYxG23GWZGkOH97s65rsBlXh7jT/eLbpgLpoGWpWBziFP83Yat10wT8P1bSA8HtEwfuCh2qTBFvwBHc42aAL0="
        
    await ver_static_signature @ "Mt4W4Y1QZnENmmj3", @{}
      "alg": "ECDSA", "tag": "2aTM",
      "sig": "LMJvsLQuLnytWItJAtAgdH6BXnzdMLufmtO150NBXsXFwzTWojB3gKG/6XcWy18sMGr6SCi4QbSimeFMbX8GNg==",
      "ec": "BLJzlUgroXa8wJ8/GyNFC4A+bReVc/6988jy+U3M9xIohkMzRZmjVjwABrbCkANTsWLPqy29cj53GFXVp4awzM4="

  it @ 'from NodeJS', @=>> ::
    await ver_static_signature @ "2SpC8Oq6O7zMskFq", @{}
      "alg": "ECDSA", "tag": "MCPu",
      "sig": "VYUzryiSVkdao4a7+sbH9eOevUOLWQdXGyflRVa16NAsoAnxZbPUNDydkHlFYGftVFniEzFuXwsiC44tsybRNA=="
      "ec": "BNQLyoJIaEuxIZkV3qEUfFUvAXDKGkLA007tC/2kNqzIt0FUoJInEb0xWsnmJjfip+SKChb8M9ASI/U6VhUd7Xg=",

    await ver_static_signature @ "p6oweq68vVKzaT3F", @{}
      "alg": "ECDSA", "tag": "fm1x",
      "sig": "IIAMg+8v1eHL7GLtMYm0TihstZj22AWYR9DA4rDYQdLO/xPDwK0oDnVvqi2AOTiOd/4JIQdflwMI0HZ+Gziweg=="
      "ec": "BFKLbWQLpau7GN6zYQD1wQgwHoBe0+KQ9+Wr5n9x2leABeduQG5vqdswGzy2591pJtlFJHlU57MYynyfzFRVe7o=",


  async function ver_static_signature(id_route, rec) ::
    const ans = await Hub.ECTargetRouter.verifyRouteId @
      req_id, chan_dst, id_route, rec
    expect(ans).to.equal @ id_route

  async function gen_static_signature() ::
    const hub = Hub.create()
    const ec_route = hub.createECRoute()
    const rec = await ec_route.signRouteId @ req_id, chan_src

    await ver_static_signature @ ec_route.id_route, rec

    if 0 ::
      console.log @ JSON.stringify @ [ec_route.id_route, rec], null, 2
