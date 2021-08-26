
const crm = {
  namespaced: true,
  state: () => ({
    // 客服系统跳转参数
    crmQuery: {
      token: '',
      from: '',
      type: '',
      userid: '',
      cardNo: '',
      storeCode: '',
    },
  }),
  getters: {
    // 是否是由 crm 客服系统跳转而来
    isSkipFromCRM(state) {
      return state.crmQuery.userid && state.crmQuery.token;
    },
  },
  mutations: {
    // 更新客服系统跳转查询参数
    UPDATE_CRM_QUERY_PARAMS(state, crmQueryParams) {
      state.crmQuery = crmQueryParams;
    },
  },
}

export default crm