/* eslint-disable no-console */
export const state = () => ({
  adblockEnabled: false
})

export const getters = {
  isAdblockEnabled: state => state.adblockEnabled
}

export const mutations = {
  setAdblockEnabled (state, payload) {
    state.adblockEnabled = payload
  }
}
