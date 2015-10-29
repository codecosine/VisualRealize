require.config({
	baseUrl: 'lib',
	paths: {
		jquery: 'jquery-2.0.3.min',
		view: 'C_View',
		model: 'C_Model',
		view_model :"C_ViewModel",
		unrealJson :"unrealJson"
	},
	packages: [{
		name: 'echarts',
		location: 'echarts/src',
		main: 'echarts'
	}, {
		name: 'zrender',
		location: 'echarts/zrender/src',
		main: 'zrender'
	}]

});
require(['view','view_model'], function(json,view,vm) {
	view.init();//event theme
	vm.init();

});