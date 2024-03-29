/**
 * Bundled by jsDelivr using Rollup v2.79.1 and Terser v5.17.1.
 * Original file: /npm/jwt-decode@3.1.2/build/jwt-decode.esm.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
function e(e) {
  this.message = e;
}
(e.prototype = new Error()), (e.prototype.name = "InvalidCharacterError");
var r =
  ("undefined" != typeof window && window.atob && window.atob.bind(window)) ||
  function (r) {
    var t = String(r).replace(/=+$/, "");
    if (t.length % 4 == 1) throw new e("'atob' failed: The string to be decoded is not correctly encoded.");
    for (
      var n, o, a = 0, i = 0, c = "";
      (o = t.charAt(i++));
      ~o && ((n = a % 4 ? 64 * n + o : o), a++ % 4) ? (c += String.fromCharCode(255 & (n >> ((-2 * a) & 6)))) : 0
    )
      o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(o);
    return c;
  };
function t(e) {
  var t = e.replace(/-/g, "+").replace(/_/g, "/");
  switch (t.length % 4) {
    case 0:
      break;
    case 2:
      t += "==";
      break;
    case 3:
      t += "=";
      break;
    default:
      throw "Illegal base64url string!";
  }
  try {
    return (function (e) {
      return decodeURIComponent(
        r(e).replace(/(.)/g, function (e, r) {
          var t = r.charCodeAt(0).toString(16).toUpperCase();
          return t.length < 2 && (t = "0" + t), "%" + t;
        })
      );
    })(t);
  } catch (e) {
    return r(t);
  }
}
function n(e) {
  this.message = e;
}
function o(e, r) {
  if ("string" != typeof e) throw new n("Invalid token specified");
  var o = !0 === (r = r || {}).header ? 0 : 1;
  try {
    return JSON.parse(t(e.split(".")[o]));
  } catch (e) {
    throw new n("Invalid token specified: " + e.message);
  }
}
(n.prototype = new Error()), (n.prototype.name = "InvalidTokenError");
export { n as InvalidTokenError, o as default };
//# sourceMappingURL=/sm/8e3e752c4cd51cca7a237b9b4f1bde2e126cbe93b5e3de49a110b84baae19e88.map
