const path = require('path');

function resolve(dir) {
	return path.join(__dirname, dir);
}

process.env.VUE_APP_BUILD_TIME = Date.now();

module.exports = {
	publicPath: './',
	productionSourceMap: false,
	css: {
		loaderOptions: {
			sass: {
				prependData: `
          @import "./src/style.scss";
        `
			}
		}
	},
	chainWebpack: config => {
    config.plugins.delete('prefetch');
    process.env.NODE_ENV === 'production' && config.optimization.minimize(true);

		config.resolve.alias
			.set('@', resolve('./src'))
			.set('component', resolve('./src/component'))
			.set('config', resolve('./src/config'))
			.set('layout', resolve('./src/layout'))
			.set('plugins', resolve('./src/plugins'))
			.set('route', resolve('./src/route'))
			.set('util', resolve('./src/util'))
			.set('assets', resolve('./src/assets'))
			.set('service', resolve('./src/service'))
	},
	transpileDependencies: [
		'element-ui'
  ],
	configureWebpack: {
    externals: {
      'vue': 'Vue',
      'vuex': 'Vuex',
      'vue-router': 'VueRouter',
    },
		devServer: {
			// 在这里配置代理
		}
	}
}
