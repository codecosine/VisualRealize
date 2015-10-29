define(function(require) {
	var self = {};
	var $ = require('jquery');
	var model = require('model');
	var formater = {};
	var formatArgs = {};
	var formatData = {};
	var formatUtil = require('jsonUtil');

	/**
		版本日志
		0.0.2   10.22
		更新了manager的参数列表
		修复了X轴生成坐标的问题
		修复了空参数导致的异常

		0.1.1   10.26
		重构了依赖板块
		分离了数据处理,样式处理板块
		统一数据处理接口
		0.1.2   10.26
		增加了目前Feature的实现方法
		
		0.2.1   10.27
		重构了设计模式,采用了MVVM的版块分离
	*/
	self.version = '0.2.1';
	self.init = function() {
		//订阅model的数据更新
		$(document).on("updateModel", controller.syncData);
	};
	self.getFormatData = function() {
		return formatData;
	};



	/**
	 * Controller
	 */
	var controller = {};
	controller.updateModel = function(jsondata) {
		jsondata = require('unrealJson').mr;
		$(document).on("updateModel", controller.syncData);
		model.update(jsondata);
	};
	/**
	 * ajax请求获得数据后的操作
	 * 更新model层数据
	 * (不是本方法依赖)model层通知vm同步包装数据
	 * (不是本方法依赖)vm通知view层渲染数据
	 *
	 */
	controller.ajaxPost = function() {
		controller.updateModel();
		/*require('jquery').ajax(function(){
				controller.updateModel(data);
		});*/
	};

	/**
	 * 从model层同步获得数据>>	新建Formater
	 * 包装数据为echarts统一的接口
	 * 当model层数据更新的时候,通知vm此方法同步数据
	 * 通知view层响应
	 */
	controller.syncData = function() {
		var data = model.getData();
		formater = new DataFormater(data);


		//参数设置
		controller.setFormatArgs({
			moneyInterval: "10"
		});

		console.log(formater._formater.generateX(formater.jsondata));
		//$(document).trigger("updateView");
	};
	controller.setFormatArgs = function(arg) {
		formatArgs = arg;
	};



	/**
	 * 数据格式化工具
	 * 根据不同的展示形式对model数据原型进行不同的数据格式化
	 * 设计成类的形式
	 * 构造方法加入了类似代理的性质,继承好像也说的过去
	 * 
	 * 优点:每个单位formater独立使用,最终接口依赖generate方法
	 * generate方法的数据依赖调用方法绑定的对象
	 * 方便单元测试,各个formater之间是完全解耦的
	 * 
	 * 
	 * 最终要求
	 * 在vm中新建formater可以依赖于require获得的新formater
	 * 单独的每一个formater可以单独使用，单独测试
	 * 别的对象（例如model等）可以通过apply来绑定方法使用formater >>好像并没有这个情景
	 * 
	 */
	function DataFormater(jsondata, formater) {
		this.jsondata = jsondata;
		//在构造方法中,如果有传formater,则以这个formater的generate方法为准.
		if (formater) {
			this._formater = formater;
			this.generateX = formater.generateX;
		/*	this.generateS = formater.generateS;
			this.generateL = formater.generateL;
			this.generateY = formater.generateY;
*/		}
	}
	DataFormater.prototype = {
		constructor: DataFormater,
		generateX: function() {
			var result = [];
			var list = formatUtil.getJsonKey(jsondata);
			list = list.sort(this.priceSorter);
			result = list.map(this.priceWrapper);
			return result;
		}，
		generateY: function() {
			var result = [];
			var list = formatUtil.getJsonKey(jsondata);
			list = list.sort(this.priceSorter);
			result = list.map(this.priceWrapper);
			return result;
		},
		generateS: function() {
			var result = [];
			var list = formatUtil.getJsonKey(jsondata);
			list = list.sort(this.priceSorter);
			result = list.map(this.priceWrapper);
			return result;
		},
		generateL: function() {
			var result = [];
			var list = formatUtil.getJsonKey(jsondata);
			list = list.sort(this.priceSorter);
			result = list.map(this.priceWrapper);
			return result;
		},
		createOption : function(){
			/*this.generateX
			this.generateS
			this.generateL
			this.generateY*/
			//利用4个方法拼合成数据类型
			//不传递任何数据参数。
		},

		_formater: {
			//_MR_formater
			jsondata: "cosine",
			priceWrapper: function(element) {
				var num = element - 0;
				var strbuffer = num - formatArgs.moneyInterval + '-' + num + "元";
				return strbuffer;
			},
			priceSorter: function(a, b) {
				return a - b;
			},
			generateX: function(jsondata) {
				var result = [];
				var list = formatUtil.getJsonKey(jsondata);
				list = list.sort(this.priceSorter);
				result = list.map(this.priceWrapper);
				return result;
			}
		}
	};



	return {
		self: self,
		controller: controller,
		init: self.init
	};
});