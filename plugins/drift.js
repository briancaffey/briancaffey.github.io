/* eslint-disable no-undef */
export default defineNuxtPlugin(() => {

  // from drift documentation
  !(function () {
    const t = (window.driftt = window.drift = window.driftt || [])
    if (!t.init) {
      if (t.invoked) {
        return void (
          window.console &&
          console.error &&
          console.error('Drift snippet included twice.')
        )
      }(t.invoked = !0),
      (t.methods = [
        'identify',
        'config',
        'track',
        'reset',
        'debug',
        'show',
        'ping',
        'page',
        'hide',
        'off',
        'on'
      ]),
      (t.factory = function (e) {
        return function () {
          const n = Array.prototype.slice.call(arguments)
          return n.unshift(e), t.push(n), t
        }
      }),
      t.methods.forEach(function (e) {
        t[e] = t.factory(e)
      }),
      (t.load = function (t) {
        const e = 3e5,
          n = Math.ceil(new Date() / e) * e,
          o = document.createElement('script')
          ;(o.type = 'text/javascript'),
        (o.async = !0),
        (o.crossorigin = 'anonymous'),
        (o.src = 'https://js.driftt.com/include/' + n + '/' + t + '.js')
        const i = document.getElementsByTagName('script')[0]
        i.parentNode.insertBefore(o, i)
      })
    }
  })()
  drift.SNIPPET_VERSION = '0.3.1'
  drift.load('38cidrgz4zgv')

})
