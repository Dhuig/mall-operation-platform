export default [
  {
    path: '/login',
    component: () => import(
			/* webpackChunkName: 'Login-login'*/
			'@/component/login/login.vue'
		),
    meta: { title: '登录' }
	},
];
