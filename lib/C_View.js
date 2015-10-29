define(function(require) {
	/**
	 * MVVM中  view 层
	 * 依赖界面模型,界面UI皮肤,echarts
	 * 主要方法render界面渲染方法
	 * 事件监听响应,策略下放给vm处理
	 */
	var ec = require('echarts');
	var $ = require('jquery');
	require('echarts/chart/bar');
	require('echarts/chart/line');

	var self = {};
	var myChart = null;
	self.defaultOption = {};
           
	self.init = function() {
		myChart = ec.init(document.getElementById('main'));
		myChart.setOption(self.defaultOption);
		self.eventbind();
		self.subscibeVm();
	};
	self.subscibeVm = function(){
		$(document).on("updateView",self.Rerender);
	};

	self.getstyles = function(){
		
	};
	self.Rerender = function() {
		
		//从viewModel层中获取option
		var formatData = require('view_model').self.getFormatData();
		//从view层中获取option
		//var styles = self.getstyles();
		//使用工具合并两个对象
		//var option = require('util').merge(format,styles);
		console.log(formatData);
		myChart.setOption(formatData, true);
	};
	
	
	/**
	 * view事件绑定
	 * 
	 */
	self.eventbind = function(){
		$("#test").click(function(){
			//console.log(test);
			require('view_model').controller.ajaxPost();
		});
	}
	return self;
});