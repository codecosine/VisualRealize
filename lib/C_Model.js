define(function(require) {
	/**
	 * Model层
	 * 不修改原始json数据
	 * 只有基本解析方法
	 * 在数据更新的时候通知订阅者响应
	 * 提供接口给vm来更新数据
	 */
	var data = {"default":"cosine"};
	var self = {};

	self.version = '0.1.8';	
	self.update = function(jsondata){
		data = jsondata;
		console.log("model-update");
		//通知订阅者响应
		require('jquery')(document).trigger("updateModel");

	};
	

	self.getData = function(){
		return data;
	};
	return self;
});