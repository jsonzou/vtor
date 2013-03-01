/**
 * jQuery vtor plugin 1.0.0
 * @author JsonZou, 2012-2012
 * @source 基于VVC思想的解耦合页面验证js框架【用户自定义配置】
 * @license MIT License <https://github.com/jsonzou/vtor>
 * 自定义使用方法请参照：api/instructions.docx
 */
$vtor.custom=function(custom){
	/*
	  ***用户自定义配置验证文件的组织格式***
      * func_pre 验证函数前缀；默认 func
	  * view_pre 配置文件模块前缀；默认 @
	  * id_pre 配置文件DOM id前缀；默认 #
	  * validateTerm_pre 配置文件验语句前缀；默认 --
	  * msg_pre 配置文件验证提示语前缀；默认::
	  * param_begin 配置文件验证参数开始字符；默认 (
	  * param_end 配置文件验证参数结束字符；默认 )
	  * param_split 配置文件验证参数分隔符；默认 ,
	  * msg_type 提示类型:single只提示最靠前的一个错误验证；multiple提示全部错误验证；默认 single
	  * errMsg_class 提示框错误的样式； 默认vtor-input-err-msg
	  * errInput_class 输入框错误的样式；默认 vtor-input-err-border
	  * okMsg_class 提示框正确的样式； 默认vtor-input-ok-msg
	  * okInput_class 输入框正确的样式；默认 vtor-input-ok-border
	  * vtor_suf 验证文件扩展名配置；默认vtor
	  * configMethod 获取vtor配置文件的方式；一般有两种方式：get,post;默认post
	  * show 消息框显示的动作:function(vid,msg,result){//这里写你的自定义代码；vid是输入框的jQuery对象，msg是错误提示框的jQuery对象;result表示验证结果};默认function(vid,msg,result){msg.show(500);}
	  * bind 初始化验证组件完毕时执行的函数:function(vid,msg){//这里写你的自定义代码；vid是输入框的jQuery对象，msg是错误提示框的jQuery对象;};默认function(vid,msg){}
	  */
      custom.vtor={
	  // msg_type:'multiple'
	   //vtor_suf:'txt'
	   //configMethod:'get'
	 /*  show:function(vid,msg,result){
		   if(!result){
			    msg.hide();
			    alert(msg.text())
				  
		   }else{
			   msg.show(500);
			   }
	   
	   
	   },
	  bind:function(vid,msg){
		   vid.css('border','1px solid #888');
	       vid.hover(
			function(){vid.css('border','1px dashed #888');},
			function(){vid.css('border','1px solid #888');}
		  );
	   }*/
	  };

	  /*
	  ***用户扩充或覆盖验证库***
      *函数格式=验证函数前缀[默认func]+下划线+函数功能名称[function Name]:function(DOM ID[,其他参数]){[方法体]}
	  */

	  custom.funcs={
       //只能输入数字
	   //func_numeric:function(id){var val=$vtor.$id(id);return /^\d+$/.test(val);}
	   /*
	   * 若要在配置文件中调用此函数只需配置：
	   * --numeric()::只能输入数字
	   */
	 };

};