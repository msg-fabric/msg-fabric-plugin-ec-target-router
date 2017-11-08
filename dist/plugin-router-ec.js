'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var crypto = require('crypto');
var createPacketParser = _interopDefault(require('msg-fabric-packet-stream'));

function ec_router_plugin(plugin_options = {}) {
  return { subclass };

  function subclass(MessageHub_PI, bases) {
    Object.assign(MessageHub_PI.prototype, {
      _init_packetParser() {
        return createPacketParser();
      },
      _init_router() {
        return new ECMessageRouter();
      } });

    class ECMessageRouter extends bases.MessageRouter {
      constructor() {
        super();
        initRouterIdentity(this, plugin_options.ec_curve, plugin_options.ec_pem);
        this._initDispatch();
      }
    }
  }
}

ec_router_plugin.initRouterIdentity = initRouterIdentity;
function initRouterIdentity(router, curve, ec_pem) {
  // Create closures over the Router's EC private identity credentials
  var __ec_priv_id__, ec_pub_id, id_self;
  if (!curve) {
    curve = 'prime256v1';
  }
  while (!id_self) {
    // ensure id_self !== 0 by happenstance
    __ec_priv_id__ = Object.assign(crypto.createECDH(curve), { curve });
    ec_pub_id = __ec_priv_id__.generateKeys(null, 'compressed');
    id_self = ec_pub_id.readUInt32LE(8); // read id from offset 8 to 12
  }Object.defineProperties(router, {
    id_self: { value: id_self },
    ec_pub_id: { value: ec_pub_id },
    ec_id_hmac: { value: ec_id_hmac } });

  if (undefined === ec_pem) {
    const ec_pem_missing = { value() {
        throw new Error(`Requires optional [ec-pem][1] dependency.\n    [1]: https://www.npmjs.com/package/ec-pem`);
      } };

    Object.defineProperties(router, { ec_id_sign: ec_pem_missing, ec_id_verify: ec_pem_missing });
  } else {
    const ec_signed_id = ec_id_sign('sha256', ec_pub_id).sign();
    if (!ec_signed_id_verify(ec_pub_id, ec_signed_id)) {
      throw new Error(`Asserted self-verify of ec_pub_id failed`);
    }

    Object.defineProperties(router, {
      ec_signed_id: { value: ec_signed_id },
      ec_id_sign: { value: ec_id_sign },
      ec_id_verify: { value: ec_id_verify } });
  }

  function ec_id_hmac(ec_pub_other, reverse) {
    const secret = __ec_priv_id__.computeSecret(ec_pub_other);
    return crypto.createHmac('sha256', secret).update(reverse ? ec_pub_other : ec_pub_id).digest();
  }

  function ec_id_sign(algorithm, ...args) {
    return ec_pem.sign(__ec_priv_id__, algorithm, ...args);
  }

  function ec_signed_id_verify(ec_pub_other, ec_signed_other) {
    const verify = ec_id_verify(ec_pub_other, 'sha256', ec_pub_other);
    return ec_signed_other ? verify.verify(ec_signed_other) : verify;
  }

  function ec_id_verify(ec_pub_other, algorithm, ...args) {
    // see ec-pem.verfiy and crypto.createVerfiy
    let ec = ec_pub_other;
    if (null == ec_pub_other.curve) {
      ec = Object.assign(crypto.createECDH(curve), { curve });
      if (ec_pub_other.getPublicKey) {
        ec.setPublicKey(ec_pub_other.getPublicKey());
      } else ec.setPublicKey(ec_pub_other);
    }

    return ec_pem.verify(ec, algorithm, ...args);
  }
}

module.exports = ec_router_plugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luLXJvdXRlci1lYy5qcyIsInNvdXJjZXMiOlsiLi4vY29kZS9lY19yb3V0ZXIuanN5Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Y3JlYXRlRUNESCwgY3JlYXRlSG1hY30gZnJvbSAnY3J5cHRvJ1xuaW1wb3J0IGNyZWF0ZVBhY2tldFBhcnNlciBmcm9tICdtc2ctZmFicmljLXBhY2tldC1zdHJlYW0nXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVjX3JvdXRlcl9wbHVnaW4ocGx1Z2luX29wdGlvbnM9e30pIDo6XG4gIHJldHVybiBAOiBzdWJjbGFzc1xuXG4gIGZ1bmN0aW9uIHN1YmNsYXNzKE1lc3NhZ2VIdWJfUEksIGJhc2VzKSA6OlxuICAgIE9iamVjdC5hc3NpZ24gQCBNZXNzYWdlSHViX1BJLnByb3RvdHlwZSwgQDpcbiAgICAgIF9pbml0X3BhY2tldFBhcnNlcigpIDo6IHJldHVybiBjcmVhdGVQYWNrZXRQYXJzZXIoKVxuICAgICAgX2luaXRfcm91dGVyKCkgOjogcmV0dXJuIG5ldyBFQ01lc3NhZ2VSb3V0ZXIoKVxuXG4gICAgY2xhc3MgRUNNZXNzYWdlUm91dGVyIGV4dGVuZHMgYmFzZXMuTWVzc2FnZVJvdXRlciA6OlxuICAgICAgY29uc3RydWN0b3IoKSA6OlxuICAgICAgICBzdXBlcigpXG4gICAgICAgIGluaXRSb3V0ZXJJZGVudGl0eSh0aGlzLCBwbHVnaW5fb3B0aW9ucy5lY19jdXJ2ZSwgcGx1Z2luX29wdGlvbnMuZWNfcGVtKVxuICAgICAgICB0aGlzLl9pbml0RGlzcGF0Y2goKVxuXG5cbmVjX3JvdXRlcl9wbHVnaW4uaW5pdFJvdXRlcklkZW50aXR5ID0gaW5pdFJvdXRlcklkZW50aXR5XG5mdW5jdGlvbiBpbml0Um91dGVySWRlbnRpdHkocm91dGVyLCBjdXJ2ZSwgZWNfcGVtKSA6OlxuICAvLyBDcmVhdGUgY2xvc3VyZXMgb3ZlciB0aGUgUm91dGVyJ3MgRUMgcHJpdmF0ZSBpZGVudGl0eSBjcmVkZW50aWFsc1xuICB2YXIgX19lY19wcml2X2lkX18sIGVjX3B1Yl9pZCwgaWRfc2VsZlxuICBpZiAhIGN1cnZlIDo6IGN1cnZlID0gJ3ByaW1lMjU2djEnXG4gIHdoaWxlICEgaWRfc2VsZiA6OiAvLyBlbnN1cmUgaWRfc2VsZiAhPT0gMCBieSBoYXBwZW5zdGFuY2VcbiAgICBfX2VjX3ByaXZfaWRfXyA9IE9iamVjdC5hc3NpZ24gQCBjcmVhdGVFQ0RIKGN1cnZlKSwgQHt9IGN1cnZlXG4gICAgZWNfcHViX2lkID0gX19lY19wcml2X2lkX18uZ2VuZXJhdGVLZXlzKG51bGwsICdjb21wcmVzc2VkJylcbiAgICBpZF9zZWxmID0gZWNfcHViX2lkLnJlYWRVSW50MzJMRSg4KSAvLyByZWFkIGlkIGZyb20gb2Zmc2V0IDggdG8gMTJcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyBAIHJvdXRlciwgQDpcbiAgICBpZF9zZWxmOiBAOiB2YWx1ZTogaWRfc2VsZlxuICAgIGVjX3B1Yl9pZDogQDogdmFsdWU6IGVjX3B1Yl9pZFxuICAgIGVjX2lkX2htYWM6IEA6IHZhbHVlOiBlY19pZF9obWFjXG5cblxuICBpZiB1bmRlZmluZWQgPT09IGVjX3BlbSA6OlxuICAgIGNvbnN0IGVjX3BlbV9taXNzaW5nID0gQDogdmFsdWUoKSA6OlxuICAgICAgdGhyb3cgbmV3IEVycm9yIEAgYFJlcXVpcmVzIG9wdGlvbmFsIFtlYy1wZW1dWzFdIGRlcGVuZGVuY3kuXFxuICAgIFsxXTogaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvZWMtcGVtYFxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgQCByb3V0ZXIsIEA6IGVjX2lkX3NpZ246IGVjX3BlbV9taXNzaW5nLCBlY19pZF92ZXJpZnk6IGVjX3BlbV9taXNzaW5nXG5cbiAgZWxzZSA6OlxuICAgIGNvbnN0IGVjX3NpZ25lZF9pZCA9IGVjX2lkX3NpZ24oJ3NoYTI1NicsIGVjX3B1Yl9pZCkuc2lnbigpXG4gICAgaWYgISBlY19zaWduZWRfaWRfdmVyaWZ5KGVjX3B1Yl9pZCwgZWNfc2lnbmVkX2lkKSA6OlxuICAgICAgdGhyb3cgbmV3IEVycm9yIEAgYEFzc2VydGVkIHNlbGYtdmVyaWZ5IG9mIGVjX3B1Yl9pZCBmYWlsZWRgXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyBAIHJvdXRlciwgQDpcbiAgICAgIGVjX3NpZ25lZF9pZDogQDogdmFsdWU6IGVjX3NpZ25lZF9pZFxuICAgICAgZWNfaWRfc2lnbjogQDogdmFsdWU6IGVjX2lkX3NpZ25cbiAgICAgIGVjX2lkX3ZlcmlmeTogQDogdmFsdWU6IGVjX2lkX3ZlcmlmeVxuXG5cblxuICBmdW5jdGlvbiBlY19pZF9obWFjKGVjX3B1Yl9vdGhlciwgcmV2ZXJzZSkgOjpcbiAgICBjb25zdCBzZWNyZXQgPSBfX2VjX3ByaXZfaWRfXy5jb21wdXRlU2VjcmV0KGVjX3B1Yl9vdGhlcilcbiAgICByZXR1cm4gY3JlYXRlSG1hYygnc2hhMjU2Jywgc2VjcmV0KVxuICAgICAgLnVwZGF0ZSBAIHJldmVyc2UgPyBlY19wdWJfb3RoZXIgOiBlY19wdWJfaWRcbiAgICAgIC5kaWdlc3QoKVxuXG4gIGZ1bmN0aW9uIGVjX2lkX3NpZ24oYWxnb3JpdGhtLCAuLi5hcmdzKSA6OlxuICAgIHJldHVybiBlY19wZW0uc2lnbihfX2VjX3ByaXZfaWRfXywgYWxnb3JpdGhtLCAuLi5hcmdzKVxuXG4gIGZ1bmN0aW9uIGVjX3NpZ25lZF9pZF92ZXJpZnkoZWNfcHViX290aGVyLCBlY19zaWduZWRfb3RoZXIpIDo6XG4gICAgY29uc3QgdmVyaWZ5ID0gZWNfaWRfdmVyaWZ5KGVjX3B1Yl9vdGhlciwgJ3NoYTI1NicsIGVjX3B1Yl9vdGhlcilcbiAgICByZXR1cm4gZWNfc2lnbmVkX290aGVyID8gdmVyaWZ5LnZlcmlmeShlY19zaWduZWRfb3RoZXIpIDogdmVyaWZ5XG5cbiAgZnVuY3Rpb24gZWNfaWRfdmVyaWZ5KGVjX3B1Yl9vdGhlciwgYWxnb3JpdGhtLCAuLi5hcmdzKSA6OlxuICAgIC8vIHNlZSBlYy1wZW0udmVyZml5IGFuZCBjcnlwdG8uY3JlYXRlVmVyZml5XG4gICAgbGV0IGVjID0gZWNfcHViX290aGVyXG4gICAgaWYgbnVsbCA9PSBlY19wdWJfb3RoZXIuY3VydmUgOjpcbiAgICAgIGVjID0gT2JqZWN0LmFzc2lnbiBAIGNyZWF0ZUVDREgoY3VydmUpLCBAe30gY3VydmVcbiAgICAgIGlmIGVjX3B1Yl9vdGhlci5nZXRQdWJsaWNLZXkgOjpcbiAgICAgICAgZWMuc2V0UHVibGljS2V5IEAgZWNfcHViX290aGVyLmdldFB1YmxpY0tleSgpXG4gICAgICBlbHNlIGVjLnNldFB1YmxpY0tleSBAIGVjX3B1Yl9vdGhlclxuXG4gICAgcmV0dXJuIGVjX3BlbS52ZXJpZnkoZWMsIGFsZ29yaXRobSwgLi4uYXJncylcblxuIl0sIm5hbWVzIjpbImVjX3JvdXRlcl9wbHVnaW4iLCJwbHVnaW5fb3B0aW9ucyIsInN1YmNsYXNzIiwiTWVzc2FnZUh1Yl9QSSIsImJhc2VzIiwiYXNzaWduIiwicHJvdG90eXBlIiwiY3JlYXRlUGFja2V0UGFyc2VyIiwiRUNNZXNzYWdlUm91dGVyIiwiTWVzc2FnZVJvdXRlciIsImVjX2N1cnZlIiwiZWNfcGVtIiwiX2luaXREaXNwYXRjaCIsImluaXRSb3V0ZXJJZGVudGl0eSIsInJvdXRlciIsImN1cnZlIiwiX19lY19wcml2X2lkX18iLCJlY19wdWJfaWQiLCJpZF9zZWxmIiwiT2JqZWN0IiwiY3JlYXRlRUNESCIsImdlbmVyYXRlS2V5cyIsInJlYWRVSW50MzJMRSIsImRlZmluZVByb3BlcnRpZXMiLCJ2YWx1ZSIsImVjX2lkX2htYWMiLCJ1bmRlZmluZWQiLCJlY19wZW1fbWlzc2luZyIsIkVycm9yIiwiZWNfaWRfc2lnbiIsImVjX2lkX3ZlcmlmeSIsImVjX3NpZ25lZF9pZCIsInNpZ24iLCJlY19zaWduZWRfaWRfdmVyaWZ5IiwiZWNfcHViX290aGVyIiwicmV2ZXJzZSIsInNlY3JldCIsImNvbXB1dGVTZWNyZXQiLCJjcmVhdGVIbWFjIiwidXBkYXRlIiwiZGlnZXN0IiwiYWxnb3JpdGhtIiwiYXJncyIsImVjX3NpZ25lZF9vdGhlciIsInZlcmlmeSIsImVjIiwiZ2V0UHVibGljS2V5Iiwic2V0UHVibGljS2V5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBR2UsU0FBU0EsZ0JBQVQsQ0FBMEJDLGlCQUFlLEVBQXpDLEVBQTZDO1NBQ2pELEVBQUNDLFFBQUQsRUFBVDs7V0FFU0EsUUFBVCxDQUFrQkMsYUFBbEIsRUFBaUNDLEtBQWpDLEVBQXdDO1dBQy9CQyxNQUFQLENBQWdCRixjQUFjRyxTQUE5QixFQUEyQzsyQkFDcEI7ZUFBVUMsb0JBQVA7T0FEaUI7cUJBRTFCO2VBQVUsSUFBSUMsZUFBSixFQUFQO09BRnVCLEVBQTNDOztVQUlNQSxlQUFOLFNBQThCSixNQUFNSyxhQUFwQyxDQUFrRDtvQkFDbEM7OzJCQUVPLElBQW5CLEVBQXlCUixlQUFlUyxRQUF4QyxFQUFrRFQsZUFBZVUsTUFBakU7YUFDS0MsYUFBTDs7Ozs7O0FBR1JaLGlCQUFpQmEsa0JBQWpCLEdBQXNDQSxrQkFBdEM7QUFDQSxTQUFTQSxrQkFBVCxDQUE0QkMsTUFBNUIsRUFBb0NDLEtBQXBDLEVBQTJDSixNQUEzQyxFQUFtRDs7TUFFN0NLLGNBQUosRUFBb0JDLFNBQXBCLEVBQStCQyxPQUEvQjtNQUNHLENBQUVILEtBQUwsRUFBYTtZQUFTLFlBQVI7O1NBQ1IsQ0FBRUcsT0FBUixFQUFrQjs7cUJBQ0NDLE9BQU9kLE1BQVAsQ0FBZ0JlLGtCQUFXTCxLQUFYLENBQWhCLEVBQW1DLEVBQUlBLEtBQUosRUFBbkMsQ0FBakI7Z0JBQ1lDLGVBQWVLLFlBQWYsQ0FBNEIsSUFBNUIsRUFBa0MsWUFBbEMsQ0FBWjtjQUNVSixVQUFVSyxZQUFWLENBQXVCLENBQXZCLENBQVYsQ0FIZ0I7R0FLbEJILE9BQU9JLGdCQUFQLENBQTBCVCxNQUExQixFQUFvQzthQUN2QixFQUFDVSxPQUFPTixPQUFSLEVBRHVCO2VBRXJCLEVBQUNNLE9BQU9QLFNBQVIsRUFGcUI7Z0JBR3BCLEVBQUNPLE9BQU9DLFVBQVIsRUFIb0IsRUFBcEM7O01BTUdDLGNBQWNmLE1BQWpCLEVBQTBCO1VBQ2xCZ0IsaUJBQW1CLEVBQUNILFFBQVE7Y0FDMUIsSUFBSUksS0FBSixDQUFhLDBGQUFiLENBQU47T0FEdUIsRUFBekI7O1dBR09MLGdCQUFQLENBQTBCVCxNQUExQixFQUFvQyxFQUFDZSxZQUFZRixjQUFiLEVBQTZCRyxjQUFjSCxjQUEzQyxFQUFwQztHQUpGLE1BTUs7VUFDR0ksZUFBZUYsV0FBVyxRQUFYLEVBQXFCWixTQUFyQixFQUFnQ2UsSUFBaEMsRUFBckI7UUFDRyxDQUFFQyxvQkFBb0JoQixTQUFwQixFQUErQmMsWUFBL0IsQ0FBTCxFQUFvRDtZQUM1QyxJQUFJSCxLQUFKLENBQWEsMENBQWIsQ0FBTjs7O1dBRUtMLGdCQUFQLENBQTBCVCxNQUExQixFQUFvQztvQkFDbEIsRUFBQ1UsT0FBT08sWUFBUixFQURrQjtrQkFFcEIsRUFBQ1AsT0FBT0ssVUFBUixFQUZvQjtvQkFHbEIsRUFBQ0wsT0FBT00sWUFBUixFQUhrQixFQUFwQzs7O1dBT09MLFVBQVQsQ0FBb0JTLFlBQXBCLEVBQWtDQyxPQUFsQyxFQUEyQztVQUNuQ0MsU0FBU3BCLGVBQWVxQixhQUFmLENBQTZCSCxZQUE3QixDQUFmO1dBQ09JLGtCQUFXLFFBQVgsRUFBcUJGLE1BQXJCLEVBQ0pHLE1BREksQ0FDS0osVUFBVUQsWUFBVixHQUF5QmpCLFNBRDlCLEVBRUp1QixNQUZJLEVBQVA7OztXQUlPWCxVQUFULENBQW9CWSxTQUFwQixFQUErQixHQUFHQyxJQUFsQyxFQUF3QztXQUMvQi9CLE9BQU9xQixJQUFQLENBQVloQixjQUFaLEVBQTRCeUIsU0FBNUIsRUFBdUMsR0FBR0MsSUFBMUMsQ0FBUDs7O1dBRU9ULG1CQUFULENBQTZCQyxZQUE3QixFQUEyQ1MsZUFBM0MsRUFBNEQ7VUFDcERDLFNBQVNkLGFBQWFJLFlBQWIsRUFBMkIsUUFBM0IsRUFBcUNBLFlBQXJDLENBQWY7V0FDT1Msa0JBQWtCQyxPQUFPQSxNQUFQLENBQWNELGVBQWQsQ0FBbEIsR0FBbURDLE1BQTFEOzs7V0FFT2QsWUFBVCxDQUFzQkksWUFBdEIsRUFBb0NPLFNBQXBDLEVBQStDLEdBQUdDLElBQWxELEVBQXdEOztRQUVsREcsS0FBS1gsWUFBVDtRQUNHLFFBQVFBLGFBQWFuQixLQUF4QixFQUFnQztXQUN6QkksT0FBT2QsTUFBUCxDQUFnQmUsa0JBQVdMLEtBQVgsQ0FBaEIsRUFBbUMsRUFBSUEsS0FBSixFQUFuQyxDQUFMO1VBQ0dtQixhQUFhWSxZQUFoQixFQUErQjtXQUMxQkMsWUFBSCxDQUFrQmIsYUFBYVksWUFBYixFQUFsQjtPQURGLE1BRUtELEdBQUdFLFlBQUgsQ0FBa0JiLFlBQWxCOzs7V0FFQXZCLE9BQU9pQyxNQUFQLENBQWNDLEVBQWQsRUFBa0JKLFNBQWxCLEVBQTZCLEdBQUdDLElBQWhDLENBQVA7Ozs7OzsifQ==
