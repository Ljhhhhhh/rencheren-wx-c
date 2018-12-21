import * as types from './mutation-types'

const matutaions = {
  [types.SET_USERINFO](state, userinfo) {
    state.userinfo = userinfo
  },
}

export default matutaions
