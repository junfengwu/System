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
 
 install configuration files
 
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
