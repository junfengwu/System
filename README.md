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
```
       if there are  "\<script type='text/javascript' src='./public/js/filename.js'></script>" 
  or "\<link rel='styleSheet'  type='text/css' href='./public/css/filename.css'/>" in the 'head' htmlElement before,
  Now you just need to set defaultSourceDir as './public/' ,set scriptSubDirname as 'js' and set cssSubDirname as "css".
   
       the globalScript and globalCss are alternative. if there is a path attribute , then the System will try to get the
   file from the path。
       And all the files set here will be loaded one by one! just like you write it into the html file.But there are something different, that is the browser will try to parse the DOM even if some file is not ready, such as css file. It will make a  terrible user experience.the method to solve this is add content to the page after the 'ready' event is emitted.(System.on("ready",version,callback))
 
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
