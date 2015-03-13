/**
组件名:  system

Module name: system

版本：0.0.1

Version: 0.0.1

作者:郑杰

Author :Jason Zheng

邮箱: zjliufeng@foxmail.com

E-mail: zjliufeng@foxmail.com

描述：
最近开发一个项目时，发现在结构控制上很令人头疼，乱七八糟的代码事后去看完全找不到头绪.最后写了一个driver.js由于整个网站的工作流程
控制，现在将其一般化，以便在以后的项目中应用。

Description:
In my recent personal project, I find it is difficult to control the structure of the whole project. In order to make the structure more  simple and clear, I wrote
a script named driver.js to  solve it. Now for the purpose of other project in the future,abstract it as system.js.  At the same time ,hope it  is helpful to you! And any
advice is welcome.:)


Copyright(c) 2015 Jason Zheng

MIT Licensed
 **/
/*
var config = {
"defaultSourceDir" : "../public/",
"scriptSubDirname" : "",
"cssSubDirname" : "",
"globalScript" : [],
"globalCss" : []
}
 */

(function (w) {

	function System() {
		this.init();
	}

	System.prototype = {
		init : function () {
			this.Events = {};
			this.sessionStorage = new FTBStorage();
			this.keyPool = {};
			this.configData = {
				"defaultSourceDir" : {
					"existed" : false,
					"value" : ''
				},
				"scriptSubDirname" : {
					"existed" : false,
					"value" : ""
				},
				"cssSubDirname" : {
					"existed" : false,
					"value" : ""
				},
				"globalScript" : [],
				"globalCss" : [],
				"defaultScriptDir" : "",
				"defaultCssDir" : ""
			};
			this.resourcePackage = []; //element schema {"name":"","existed":"","path":"","version":""}如果有path这个属性的话，则不从默认路径加载资源，改为从path
			this.globalSourceLoaded = false;
			this.loadEvent();
		},
		on : function (eventName, version, callback) {

			var self = this;
			var flag = true;
			if (arguments.length == 3) {
				flag = (eventName == "ready") && ((typeof version) == "number") && ((typeof callback == "function"));
			}
			if (arguments.length == 2) {
				flag = ((typeof eventName) == "string") && ((typeof version) == "function")
			}
			if (!flag) {
				self.emit("system_alert", {
					"message" : "Failed to regist event! Illegal Arguments!"
				});
				return false;
			}

			if (self.Events[eventName] && !(Array.isArray(self.Events[eventName]))) {
				self.emit("system_alert", {
					"message" : "Failed to regist event: " + eventName + ",I is already existed!"
				});
				return false;
			}
			if (eventName == "ready" && (typeof version) != "number") {
				self.emit("system_alert", {
					"message" : "Failed to regist the special 'ready' event. An version is needed!"
				});
				return false;
			}

			if (eventName == "ready") {
				var obj = {
					"CB" : callback,
					"version" : version
				}
				if (!self.Events["ready"])
					self.Events["ready"] = [];
				self.Events["ready"].push(obj);
				self.loadResource(version);
			} else {
				if (!self.Events[eventName])
					self.Events[eventName] = {};
				self.Events[eventName].CB = version;
			}
		},
		emit : function (eventName, Args) {
			var self = this;
			if (self.Events[eventName]) {
				if (eventName !== "ready") {
					self.Events[eventName].CB(Args);
				} else {
					self.Events["ready"][Args].CB();
				}
			} else {
				self.emit("system_alert", {
					"message" : "Failed to fire event '" + eventName + "'. The event is not existed!"
				});
				return false;
			}
		},
		removeEventListener : function (eventName, version) {
			var self = this;
			if (self.Events[eventName]) {
				if (arguments.length == 1) {
					delete self.Events[eventName];
					return true;
				} else {
					delete self.Events[eventName][version];
				}
			} else {
				self.emit("system_alert", {
					"message" : "The event '" + eventName + "' is not existed!"
				});
				return false;
			}
		},
		getReadyVersion : function () {

			var self = this;
			if (self.Events["ready"]) {
				return self.Events["ready"].length;
			} else {
				return 0;
			}
		},
		setKey : function (keyName, value) {
			var self = this;
			if (self.keyPool[keyName]) {
				self.keyPool[keyName] = value;
				self.emit("system_alert", {
					"message" : "Warning! The key " + keyName + " is already existed.The original value has been covered!"
				});
			} else {
				self.keyPool[keyName] = value;
			}
			return true;
		},
		getKey : function (keyName) {
			var self = this;
			return self.keyPool[keyName];
		},
		deleteKey : function (keyName) {
			var self = this;
			if (self.keyPool[keyName]) {
				delete self.keyPool[keyName];
			}
			return true;
		},
		waterFall : function () {
			return new Async();
		},
		post : Post,
		get : Get,
		config : function (tar) {
			var self = this;
			if (tar.defaultSourceDir && tar.scriptSubDirname && tar.cssSubDirname) {
				self.configData["defaultSourceDir"].value = tar.defaultSourceDir;
				self.configData["defaultSourceDir"].existed = true;
				self.configData["scriptSubDirname"].value = tar.scriptSubDirname;
				self.configData["scriptSubDirname"].existed = true;
				self.configData["cssSubDirname"].value = tar.cssSubDirname;
				self.configData["cssSubDirname"].existed = true;
				var l1 = self.configData["defaultSourceDir"].value.length;
				if (self.configData.defaultSourceDir.value[l1 - 1] == "/") {
					self.configData.defaultScriptDir = self.configData.defaultSourceDir.value + self.configData.scriptSubDirname.value + "/";
					self.configData.defaultCssDir = self.configData.defaultSourceDir.value + self.configData.cssSubDirname.value + "/";
				} else {
					self.configData.defaultScriptDir = self.configData.defaultSourceDir.value + "/" + self.configData.scriptSubDirname.value + "/";
					self.configData.defaultCssDir = self.configData.defaultSourceDir.value + "/" + self.configData.cssSubDirname.value + "/";
				}
				if (tar.globalScript || tar.globalCss) {

					var args = [];

					//begin prepare the arguments
					if (tar.globalScript) {
						for (var i = 0; i < tar.globalScript.length; i++) {
							args.push(tar.globalScript[i]);
							self.configData.globalScript.push(tar.globalScript[i]);
						}
					};
					if (tar.globalCss) {
						for (var i = 0; i < tar.globalCss.length; i++) {
							args.push(tar.globalCss[i]);
							self.configData.globalCss.push(tar.globalCss[i]);
						}
					};
					//end begin

					//get waterFall object
					var water_fall = self.waterFall();
					//
					function cb(Args) {
						if (expandedName(Args.args[Args.n].name) == "js") {
							if (Args.args[Args.n].path) {
								addScript(Args.args[Args.n].path, function () {
									Args.n++;
									water_fall.next(Args);
								});
							} else {
								addScript(self.configData.defaultScriptDir + Args.args[Args.n].name, function () {
									Args.n++;
									water_fall.next(Args);
								});
							}
						} else {
							if (Args.args[Args.n].path) {
								addStyleSheet(Args.args[Args.n].path, function () {
									Args.n++;
									water_fall.next(Args);
								});
							} else {
								addStyleSheet(self.configData.defaultCssDir + Args.args[Args.n].name, function () {
									Args.n++;
									water_fall.next(Args);
								});
							}
						}
					};
					//begin prepare the funtions
					var funcs = [];
					for (var i = 0; i < args.length; i++) {
						funcs.push(cb);
					};
					//end prepare the functions

					//regist the functions
					water_fall.regist(funcs, function () {
						self.globalSourceLoaded = true;
						self.loadResource(0);
					})

					var obj = {
						"args" : args,
						"n" : 0
					};
					//fire the waterFall
					water_fall.fire(obj);

				} else {
					self.globalSourceLoaded = true;
					self.loadResource(0);
				}

			} else {
				var message = "";
				if (!tar.defaultSourceDir) {
					message += "defaultSourceDir";
				}
				if (!tar.scriptSubDirname) {
					message += " & scriptSubDirname";
				}
				if (!tar.cssSubDirname) {
					message += " & cssSubDirname  ";
				}
				self.emit("system_alert", {
					"message" : "Missing " + message
				});
				return false;
			}
		},
		install : function (tar, version) {
			var self = this;
			if ((typeof tar) == "string") {
				var obj = {
					"name" : tar,
					"existed" : false,
					"version" : version
				};
				self.resourcePackage.push(obj);
				return true;
			}
			if (Array.isArray(tar)) {
				for (var i = 0; i < tar.length; i++) {
					var obj = {
						"name" : tar[i].name,
						"existed" : false,
						"version" : version,
						"path" : tar[i].path
					}
					self.resourcePackage.push(obj);
				}
			}
			return self;
		},
		uninstall : function (tar) {
			var self = this;
			var pk = [];

			if ((typeof tar) == "string") {
				pk.push(tar);
			} else {
				pk = tar;
			};
			for (var i = 0; i < pk.length; i++) {
				if (expandedName(pk[i]) == "js") {
					var scripts = document.getElementsByTagName("script");
					for (var j= 0; j < scripts.length; j++) {
						var t = scripts[i].src.split("/");
						if (t[t.length - 1] == pk[i]) {
							if(scripts[j].remove){
									scripts[j].remove();
								}else
								{
									scripts[j].removeNode();
								}
							return self;
						}
					}
				} else {
					if (expandedName(pk[i]) == "css") {
						var links = document.getElementsByTagName("link");
						for (var j = 0; j< links.length; j++) {
							var t = links[j].href.split("/");
							if (t[t.length - 1] == pk[i]) {
								if(links[j].remove){
									links[j].remove();
								}else
								{
									links[j].removeNode();
								}
								return self;
							}
						}
					}
				}
			}

		},
		loadResource : function (version) {
			var self = this;

			if (!self.globalSourceLoaded) {
				return false;
			}
			if (self.resourcePackage.length == 0) {
				self.emit("ready", version);
			}
			function checkComplete(v) {
				var flag = true;
				for (var i = 0; i < self.resourcePackage.length; i++) {
					if (self.resourcePackage[i].version == v) {
						flag = flag && self.resourcePackage[i].existed;
						if (!flag)
							break;
					}
				}
				if (flag) {
					self.emit("ready", v);
				}
			};

			for (var i = 0; i < self.resourcePackage.length; i++) {
				if (self.resourcePackage[i].existed) {}
				else {
					if (expandedName(self.resourcePackage[i].name) == "js") {
						if (self.resourcePackage[i].path) {
							addScript(self.resourcePackage[i].path, function (m) {

								self.resourcePackage[m[1]].existed = true;
								checkComplete(m[0]);
							}, self.resourcePackage[i].version, i);
						} else {
							addScript(self.configData.defaultScriptDir + self.resourcePackage[i].name, function (m) {

								self.resourcePackage[m[1]].existed = true;
								checkComplete(m[0]);
							}, self.resourcePackage[i].version, i);
						}
					} else {
						if (self.resourcePackage[i].path) {
							addStyleSheet(self.resourcePackage[i].path, function (m) {

								self.resourcePackage[m[1]].existed = true;
								checkComplete(m[0]);
							}, self.resourcePackage[i].version, i);
						} else {
							addStyleSheet(self.configData.defaultCssDir + self.resourcePackage[i].name, function (m) {

								self.resourcePackage[m[1]].existed = true;
								checkComplete(m[0]);
							}, self.resourcePackage[i].version, i);
						}
					}
				}
			}
		},
		loadEvent : function () {
			var self = this;

			self.on("system_alert", function (message) {
				console.log("System  :" + message.message);
			});
		}
	}

	function Async() {
		this.passArgs;
		this.callback;
		this.step = -1;
	}
	Async.prototype.regist = function (functionArray, callback) {
		var self = this;
		self.functionArray = functionArray;
		self.callback = callback;
	}
	Async.prototype.next = function (args) {
		var self = this;
		self.step++;
		if (self.step == self.functionArray.length) {
			if (self.callback) {
				self.callback(args);
			}
			return;
		}
		self.functionArray[self.step](args);
	};

	Async.prototype.fire = function (args) {
		this.next(args);
	}

	function FTBStorage() //定义一个通用的临时性存储方式ForTimeBeingStorge()，
	{
		if (window.sessionStorage) {}
		else { //code For IE 当窗口关闭时清除存储的值
			window.onunload = function () {
				var str = document.cookie.split(";");
				for (var i = 0; i < str.length; i++) {
					document.cookie = str[i] + ";expires=" + (new Date(0)).toGMTString();
				}
			}
		}
	};
	FTBStorage.prototype.setItem = function (name, value) {
		if (window.sessionStorage) {
			window.sessionStorage.setItem(name, value);
		} else {
			document.cookie = name + "=" + value;
		}
	}
	FTBStorage.prototype.getItem = function (name) {
		if (window.sessionStorage) {
			return window.sessionStorage[name];
		} else {
			var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
			if (arr != null)
				return unescape(arr[2]);
			return null;
		}
	}
	FTBStorage.prototype.removeItem = function (name) {
		if (window.sessionStorage) {
			window.sessionStorage.removeItem(name);
		} else {
			document.cookie = name + "=;expires=" + (new Date(0)).toGMTString();
		}
	};
	function Post(json, url, callback) {
		var request;
		if (window.XMLHttpRequest) {
			request = new XMLHttpRequest();
		} else
			if (window.ActiveXObject) {
				request = new ActiveXObject('Microsoft.XMLHTTP');
			} else {
				alert('Sorry! Your browser does not support Ajax!');
				return;
			}
		request.onreadystatechange = function () {
			if (request.readyState === 4 && request.status === 200) {
				var response = JSON.parse(request.responseText); //解析登陆信息
				if (callback)
					callback(response);

			}
		}
		request.open('POST', url); //url未填写
		request.setRequestHeader("Content-Type", "application/json");
		request.send(JSON.stringify(json));
	};

	function Get(url, callback) {
		var request;
		if (window.XMLHttpRequest) {
			request = new XMLHttpRequest();
		} else
			if (window.ActiveXObject) {
				request = new ActiveXObject('Microsoft.XMLHTTP');
			} else {
				alert(' Sorry! Your browser does not support Ajax! ');
			}
		request.onreadystatechange = function () {
			if (request.readyState === 4 && request.status === 200) {
				var json = JSON.parse(request.responseText);
				if (callback)
					callback(json);
			}
		}
		request.open('GET', url);
		request.send(null);
		console.log("ok");
	};
	function addScript() {
		var address = arguments[0];
		var callback = arguments[1];
		var args = [];
		if (arguments.length > 2); {
			for (var i = 2; i < arguments.length; i++) {
				args.push(arguments[i]);
			}
		}
		var script = document.createElement("script");
		script.setAttribute("type", "text/javascript");
		script.setAttribute("src", address);
		script.onload = function () {
			if (callback) {
				callback(args);
			}
		}
		var head = document.getElementsByTagName("head")[0];
		head.appendChild(script);
	};

	function addStyleSheet() {
		var address = arguments[0];
		var callback = arguments[1];
		var args = [];
		if (arguments.length > 2); {
			for (var i = 2; i < arguments.length; i++) {
				args.push(arguments[i]);
			}
		}
		var link = document.createElement("link");
		link.setAttribute("rel", "stylesheet");
		link.setAttribute("type", "text/css");
		link.setAttribute("href", address);
		link.onload = function () {
			if (callback) {
				callback(args);
			}
		}
		var head = document.getElementsByTagName("head")[0];
		head.appendChild(link);
	}
	function expandedName(str) {
		if ((typeof str).toLowerCase() == "string") {
			var t = str.split(".");
			return t[t.length - 1].toLowerCase();

		} else {
			return;
		}
	};
	w.System = new System();
})(window)
