define(
	/* 
	 * 部分代码来着zrender/tool模块
	 * @module zrender/tool/util
	 */
	function(require) {
		var ArrayProto = Array.prototype;
		var nativeForEach = ArrayProto.forEach;
		var nativeMap = ArrayProto.map;
		var nativeFilter = ArrayProto.filter;
		var BUILTIN_OBJECT = {
			'[object Function]': 1,
			'[object RegExp]': 1,
			'[object Date]': 1,
			'[object Error]': 1,
			'[object CanvasGradient]': 1
		};
		var objToString = Object.prototype.toString;


		/**
		 * 数组或对象遍历
		 * @memberOf module:zrender/tool/util
		 * @param {Object|Array} obj
		 * @param {Function} cb
		 * @param {*} [context]
		 */
		function each(obj, cb, context) {
			if (!(obj && cb)) {
				return;
			}
			if (obj.forEach && obj.forEach === nativeForEach) {
				obj.forEach(cb, context);
			} else if (obj.length === +obj.length) {
				for (var i = 0, len = obj.length; i < len; i++) {
					cb.call(context, obj[i], i, obj);
				}
			} else {
				for (var key in obj) {
					if (obj.hasOwnProperty(key)) {
						cb.call(context, obj[key], key, obj);
					}
				}
			}
		}

		/**
		 * 数组映射
		 * @memberOf module:zrender/tool/util
		 * @param {Array} obj
		 * @param {Function} cb
		 * @param {*} [context]
		 * @return {Array}
		 */
		function map(obj, cb, context) {
				if (!(obj && cb)) {
					return;
				}
				if (obj.map && obj.map === nativeMap) {
					return obj.map(cb, context);
				} else {
					var result = [];
					for (var i = 0, len = obj.length; i < len; i++) {
						result.push(cb.call(context, obj[i], i, obj));
					}
					return result;
				}
			}
			/**
			 * @memberOf module:zrender/tool/util
			 * @param {Array} array
			 * @param {*} value
			 */

		function indexOf(array, value) {
			if (array.indexOf) {
				return array.indexOf(value);
			}
			for (var i = 0, len = array.length; i < len; i++) {
				if (array[i] === value) {
					return i;
				}
			}
			return -1;
		}

		/** 数组过滤
		 * @memberOf module:zrender/tool/util
		 * @param {Array} obj
		 * @param {Function} cb
		 * @param {*} [context]
		 * @return {Array}
		 */
		function filter(obj, cb, context) {
			if (!(obj && cb)) {
				return;
			}
			if (obj.filter && obj.filter === nativeFilter) {
				return obj.filter(cb, context);
			} else {
				var result = [];
				for (var i = 0, len = obj.length; i < len; i++) {
					if (cb.call(context, obj[i], i, obj)) {
						result.push(obj[i]);
					}
				}
				return result;
			}
		}

		function isDom(obj) {
			return obj && obj.nodeType === 1 && typeof(obj.nodeName) == 'string';
		}

		/**
		 * 对一个object进行深度拷贝
		 * @memberOf module:zrender/tool/util
		 * @param {*} source 需要进行拷贝的对象
		 * @return {*} 拷贝后的新对象
		 */
		function clone(source) {
			if (typeof source == 'object' && source !== null) {
				var result = source;
				if (source instanceof Array) {
					result = [];
					for (var i = 0, len = source.length; i < len; i++) {
						result[i] = clone(source[i]);
					}
				} else if (!BUILTIN_OBJECT[objToString.call(source)] && !isDom(source)) {
					result = {};
					for (var key in source) {
						if (source.hasOwnProperty(key)) {
							result[key] = clone(source[key]);
						}
					}
				}

				return result;
			}

			return source;
		}


		function isArray(obj) {
			return Object.prototype.toString.call(obj) === '[object Array]';
		};
		/**
		 * 从json对象中按for-in的顺序遍历，获得map数组[[key1,value1],[key2,value2]]
		 * @param {Object} source  json对象
		 * 暂时不做这个兼容 这个map数组只是为了散点图   getKey  获得key的特征函数
		 */
		function getSourceMap(source) {
			if (typeof source == 'object' && source !== null) {
				var result = [];
				for (var key in source) {
					if (source.hasOwnProperty(key)) {
						result.push([key, clone(source(key))]);
					}
				}
			}
			return result;
		}

		/**
		 * 从source中遍历，根据key的特征值,获得Value数组
		 * @param {Object} source  json对象
		 * @param {Object} keyfilter  获得key的特征函数
		 */
		function getSourceValue(source, keyfilter) {
				if (typeof source == 'object' && source !== null) {
					var result = [];
					if(isArray(source)){
						for (var i = 0; i < source.length; i++) {
							var unit = getSourceValue(source[i],keyfilter);
							result.push(unit);
						}
					}else{
						var size = Object.getOwnPropertyNames(source).length;
						for (var i = 0; i < size; i++) {
							result.push(clone(source[keyfilter(i)]));
						}
					}
				}
				return result;
			}
			/**
			 * 从json对象中按for-in的顺序遍历，获得key数组
			 * @param {Object} source  json对象
			 */

			function getJsonKey(source) {
				console.log("getJsonKey");
				if (typeof source == 'object' && source !== null) {
					var result = [];
					for (var key in source) {
						if (source.hasOwnProperty(key)) {
							result.push(key);
						}
					}
				}
				return result;
			}
			/**
			 * 把数据Value包装成对象数组
			 * @param {Object} source
			 * @param {Object} wrapModel
			 */

		function WrapSource(source, wrapModel, names) {
			if (typeof source == 'object' && source !== null && wrapModel != null) {
				var result = [];
				if (isArray(source)) {
					for (var i = 0; i < source.length; i++) {
						var model = clone(wrapModel);
						model.data = clone(source[i]);
						if (names) {
							model.name = names[i];
						}
						result.push(model);
					}
				}

			} else {
				//for in 遍历对象
				for (var key in source) {
					if (source.hasOwnProperty(key)) {
						var model = clone(wrapModel);
						model.data = clone(source[key]);
						result.push(model);
					}
				}
			}
			return result;
		}


		function test() {
			alert("jsonUtil_success_loading");
		}
		return {
			getJsonKey: getJsonKey,
			getSourceValue: getSourceValue,
			getSourceMap: getSourceMap,
			WrapSource: WrapSource,
			test: test
		};
	});