let initialValue = false

if (process.window) {
  initialValue = JSON.parse(window.localStorage.getItem('adblockEnabled')) || false
}
export const state = () => ({
  adblockEnabled: initialValue
})

export const getters = {
  isAdblockEnabled: state => state.adblockEnabled
}

export const mutations = {
  setAdblockEnabled (state, payload) {
    state.adblockEnabled = payload
  }
}
