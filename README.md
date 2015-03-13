# system.js
一个浏览器端流程控制框架
### System
 
## System.config()
```js
    var config={
      "defaultSourceDir":"./", 
      "scriptSubDirname":"js", 
      "cssSubDirname":"css", 
      "globalScript":[{"name":"jquery-1.8.3.min.js","path":"http://code.jquery.com/jquery-1.8.3.min.js"},{"name":"test1.js"}],
      "globalCss":[{"name":"test1.css"}]
   };
   
   System.config(config);
   
   var v1=System.getReadyVersion();//get the version of the 'ready' event
   
   //if there are global file(the globalScript and globalCss),the event 'ready' will be emitted after the files are loaded.
   System.on("ready",v1,function(){
      console.log("hello world!");
   })
```
  如果以前是通过在head元素里面添加标签script和link来加载相应的文件，现在只需要设置几个值就可以了。‘defaultSourceDir’是js文件和css文件所在文件夹的上层目录，scriptSubDirname是js文件所在文件夹的名字,cssSubDirname是css文件所在文件夹的名字。
‘globalScrip’和‘globalCss’是俩个可选的参数，顾名思义，即设置全局依赖文件。一旦System.config(config)被调用，这些文件将按顺序加载，如果对某个文件设置了path属性，将从这个path加载资源，而不是从默认目录加载资源。参数设置的格式如上所示，System.config()函数只能调用一次。再次调用会覆盖之前设置的参数。

注意：

   配置文件的加载和浏览器对文档的解析是异步的。可能由于网络原因，当文档解析完成后，相应的配置文件还没有加载完成,势必造成很坏的用户体验。解决办法是在系统激发'ready'事件后再将内容加到页面中去。不禁要问，既然如此，为什么还这样做。个人认为哈，这样会让前端开发更为清晰，利于工程模块化，同时使整个项目的过程控制更加明了。
   
 if there are  "\<script type='text/javascript' src='./public/js/filename.js'></script>"  or "\<link rel='styleSheet'  type='text/css' href='./public/css/filename.css'/>" in the 'head' htmlElement before,Now you just need to set 'defaultSourceDir' as './public/' ,set 'scriptSubDirname' as 'js' and set 'cssSubDirname' as "css".

 The 'globalScript' and 'globalCss' are alternative. if there is a 'path' attribute , then the System will try to get the
file from the 'path'。

 And all the files set here will be loaded one by one! just like you write it into the html file.But there are something different, that is the browser will try to parse the DOM even if some file is not ready, such as css file. It will make a  terrible user experience.the method to solve this is adding contents to the page after the 'ready' event is emitted.(System.on("ready",version,callback))
##System.install()
 安装配置文件
 
 我们需要一个版本号用来标识这次的安装，在on('ready'）时也传入相应的版本号，使其关联起来
 
 install configuration files
 
 when install file,we need a version to distinguish from other 'install' operations
 
 ```js
    var v2=System.getReadyVersion();
    
    System.install("test2.js",v2);
    System.install("test2.css",v2);
    System.install("test3.css",v2);
    
    System.on("ready",v2,function(){
      console.log("Resource has already been loaded!You can do your things safely now.");
    ])
    
    //or
    
    var v2=System.getReadyVersion();
    
    var obj=[{"name":"test2.js"},{"name":"test2.css"},{"test3.css"}];
    
    System.install(obj,v2).on("ready",v2,function(){
       console.log("Resource has already been loaded! You can do your things safely now.");
    });
 ```
 ##System.uninstall()
 卸载配置文件
 
 uninstall configuration files
 ```js
     System.uninstall("test1.js");
     System.uninstall("test2.css");
     
     //or
     
     var obj=["test1.js","test2.css"];
     
     System.uninstall(obj);//no callback ,the files will be uninstalled right now! 
 ```
 ##System.getReadyVersion() && System.on("ready",version,function(){})
 
 System.getReadyVersion()将返回未注册的ready事件的版本，加版本是为了避免激发其他的回调函数.
 
 'ready' 事件是一个系统特殊对待的事件，每次监听时都需要传递俩个参数，一个是版本号，一个是回调函数，而且同一个版本号只允许监听一次
 
 System.getReadyVersion() will return the version of the 'ready' event which is not registed yet. And each version only be allowed to monitor for once.
 
 ##System.on(eventName,callback) && System.emit(eventName,Args)
 ```js
     //let's do it safely :)
     System.on("ready",v1,function(){
     
        System.on("event1",function(message){
          console.log(message)
        });
        
        setTimeout(function(){
           System.emit("event1","hello world!");
        },1000);
        
        //we regist the event in 'v1 ready' ,we can emit it in another 'ready' event's callback with different version
        System.on("event2",function(m){
            console.log(m);
        })
     });
     
     System.on("ready",v2,function(){
        
        System.emit("event2","we can communicate! :)"); 
        
     });
 ```
 ##System.waterFall()
 ```js
      var water_fall=System.waterFall();//the first step
      
      funciton cb(m)
      {
       setTimeout(function(){
        console.log(m);
        water_fall.next(m+1);//important!!! 
       },m%2*300);
      };
      
     var funcs=[];
     for(var i=0;i<6;i++)
        funcs.push(cb);
        
     //the second step();
     water_fall.regist(funcs,function(n){
        console.log("End at :"+n);
     });
     
     water_fall.fire(0);//the last step
     
     /*
       result:
         0
         1
         2
         3
         4
         5
         End at :6
         
         this mean that the functions will be executed one by one.
     */
      
 ```
 ##System.setKey(name,value) && System.getKey(name)&&System.removeKey(name)
 ```js
     System.setKey("name","Jason Zheng");
     
     System.getKey("name");//return "Jason Zheng"
     
     System.removeKey("name");
     
     System.getKey("name");//undefined
     
     /*note :
     
        when the page was refreshed ,all the key will lost
        
     */
     
 ```
 ##System.sessionStorage.setItem(name,value) && System.sessionStorage.getItem(name) && System.sessionStorage.removeItem(name)
 
 功能和window.sessionStorage一样，只是做了兼容性
 
 the same with window.sessionStorage,but it works in IE
 ##System.post(json,url,callback) && System.get(url,callback)
 Ajax
 ```bash
 System.post()发送的是JSON格式的数据，送给callback的也是JSON格式的数据，服务器那边要注意一下，不要把格式弄错了
 
 System.get(),送给callback的也是JSON格式的数据
 
 the format of all data is JSON
 ```


###Licensed
MIT Licensed
Copyright(c) 2015 Jason Zheng
