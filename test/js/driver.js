


// begin the global configuration|全局默认设置

var config={
	"defaultSourceDir":"./", 
	"scriptSubDirname":"js", 
	"cssSubDirname":"css", 
	"globalScript":[{"name":"jquery-1.8.3.min.js","path":"http://code.jquery.com/jquery-1.8.3.min.js"},{"name":"test1.js"}],
	"globalCss":[{"name":"test1.css"}]
};

/*
   如果你以前是通过在head 或者在body 元素里添加script 和link 标签引用相应文件，那么现在你只需要在head 里添加<script type="text/javascript"  src="system.js"></script>
   和<script type="text/javascript" src="driver.js"></script>。 然后在driver.js 里面初始化页面配置即可。
   
    比如你以前在head里写上这样的内容 "<script type='text/javascript' src='./public/js/filename.js'></script>", 
	
	那么defaultSourceDir就是"./public/" ,scriptSubDirname就是'js'。globalScript  和 globalCss 是可选的俩个参数，格式如上所示， 如果含path这个值，那么就从path所指的路径获得
	资源，否则从设置的默认路径获得资源。 这里设置的全局依赖文件将被一个一个的加载，就像是你将它写在html文件里一样。唯一不同的是这种方式不会阻止浏览器解析文档
	js和css资源的加载相对于文档的解析是异步的。
	这样有个弊端就是如果body里面有内容依赖于css或js文件，那么在所依赖的文件被加载完成之前将产生错误。比如依赖的是css文件的话，页面布局就会出现混乱直到相应的css
	文件被加载之前
	
	解决的办法是等到ready事件触发之后，才往页面添加内容，在此之前你可以在页面里添加几个无内容的容器。
	
	虽然有这种弊端，我依然这样做的目的是使网页开发的过程变得有序，有条理，使其可以模块化编写。我们可以将具有独立功能的一个元素（比如导航栏)编写成一个组件
	需要时安装对应的js和css文件，并使用System.post(),或则System.get(),从后台获取相应的html即可
	

   if there are  "<script type='text/javascript' src='./public/js/filename.js'></script>" or "<link rel='styleSheet' type='text/css' href='./public/css/filename.css'/>" in the 'head'
   htmlElement before, now you just set defaultSourceDir as './public/' ,set scriptSubDirname as 'js' and set cssSubDirname as "css".
   
   the globalScript and globalCss are alternative. if there is a path attribute , then the System will try to get the file from the path。
   And all the files set here will be loaded one by one! just like you write it into the html file.
   But there are something different, that is the browser will try to parse the DOM even if some file is not ready,such as css file. It will make a  terrible user experience.
   the method to solve this is add content to the page after the 'ready' event is emitted . 
   
*/
//end begin
//初始化设置
System.config(config);



/*
    ready 是一个特殊事件，可以多次监听，并绑定多个回调函数。但每次监听都需要一个版本号(通过System.getReadyVersion()来获取),版本号作为第二个参数传入
	目的是为了实现可以在多个文件中多次调用System.install(),安装所需的配置,System.install()也需要版本号作为参数。通过下面的例子你将明白
*/


var v1=System.getReadyVersion();

System.install("test2.js",v1);
System.install("test2.css",v1);

System.on("ready",v1,function(){
	// 
	 document.getElementById("t").innerHTML= '<div class="t1 t2">hello world!</div>';
	 
	 //我们设置了一个键值：名为‘name’,值为：“Jason Zheng”
	 System.setKey("name","Jason Zheng");
	 //System.deleteKey("name");
	 //我们监听一个自定义事件'ok',并绑定相应的回调函数
	 System.on("ok",function(m){
		 console.log(m);
	 });
	 
	 //移除安装的配置文件，必须写在ready事件的回调函数里面
	 //System.uninstall("test2.css");
});


//你也可以像这样调用一次System.install()安装配置
var v2=System.getReadyVersion();
var data=[{"name":"test3.js"},{"name":"test4.js"},{"name":"test4.css"}];

System.install(data,v2);
System.on("ready",v2,function(){
	
	document.getElementById("t2").innerHTML="<div class='t4'></div>";
	
	//我们再这里触发之前设置的'ok'事件
	
	//System.removeEventListener("ok");移除事件
	
	System.emit("ok",System.getKey("name"));
	
	//begin System.waterFall()
	var water_fall=System.waterFall();
	function cb(n)
	{
		setTimeout(function(){
			console.log(n);
			
			water_fall.next(n+1);//注意这里
			
		},n%3*300);
	}
	 var funcs=[];
	 for(var i=0;i<6;i++)
	 {
		 funcs.push(cb);
	 }
	 
	 water_fall.regist(funcs,function(m){
		 console.log("end at :"+m);
	 });
	water_fall.fire(0);
	/*
	  the result:
	         0
			 1
			 2
			 3
			 4
			 5
			 end at :6
			 
	   this mean the funtions you regist will be executed one by one .
	*/
	//end begin
	//兼容IE的临时性存储，刷新页面仍然存在，通过System.setKey保存的值刷新后则会丢失
	System.sessionStorage.setItem("name","Jason Zheng");
	
	console.log(System.sessionStorage.getItem("name"));
	//System.removeItem("name");
	//卸载test2.css
	System.uninstall("test2.css");
	
	//System.post(json,url,callback);//json为JSON格式的数据，将传到服务器，url是服务器端的路径，返回数据设成了JSON格式，如果有的话将传递给callback
	//System.get(url,callback);//返回数据也设成了JSON格式，并将传递给callback
	
})