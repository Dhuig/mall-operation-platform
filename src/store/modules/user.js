const user = {
  namespaced: true,
  state: () => ({
    // 用户信息
    userInfo: {
      access_token: "",
      refresh_token: "",
      active: null,
      avatar: null,
      cardNo: "",
      code: null,
      companyName: "",
      companyNo: "",
      data: "",
      error: null,
      error_description: null,
      exp: null,
      expires_in: 0,
      isStoreManager: "",
      memberType: "",
      mobile: "",
      nickname: "",
      openId: null,
      storeCode: null,
      token_type: "",
      unionId: null,
      userId: "",
      userType: "",
      username: "",
    },
  }),
  mutations: {
    // 更新 token [废弃]
    UPDATE_TOKEN(state, token) {
      state.userInfo.access_token = token;
    },
    // 更新用户信息
    UPDATE_USERINFO(state, userInfo) {
      state.userInfo = userInfo;
    },
  },
  getters: {
    // 是否登录
    isLogined(state) {
      return state.userInfo.userId && state.userInfo.access_token;
    },
    // 返回 Token
    getToken(state) {
      return state.userInfo.access_token;
    },
    // 返回完整形式 Token eg. bearer a64d20cf-14bc-44c7-895f-f8e5fd481570
    getFullToken(state, getters) {
      return `bearer ${getters.getToken}`;
    },
    // 返回用户名
    getUsername(state) {
      return state.userInfo.nickname;
    },
  }
}
export default user