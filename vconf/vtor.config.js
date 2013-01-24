/**
 * jQuery vtor plugin 1.0.0
 * @author JsonZou, 2012-2012
 * @source 基于VVC思想的解耦合页面验证js框架【用户自定义配置】
 * @license MIT License <https://github.com/jsonzou/vtor>
 */
$vtor.cfg=function(config){
	/*
	  ***用户自定义配置验证文件的组织格式***
      * func_pre 验证函数前缀；默认 func_
	  * view_pre 配置文件模块前缀；默认 @
	  * id_pre 配置文件DOM id前缀；默认 #
	  * validateTerm_pre 配置文件验语句前缀；默认 --
	  * msg_pre 配置文件验证提示语前缀；默认::
	  * param_begin 配置文件验证参数开始字符；默认 (
	  * param_end 配置文件验证参数结束字符；默认 )
	  * param_split 配置文件验证参数分隔符；默认 ,
	  * msg_type 提示类型:single只提示最靠前的一个错误验证；multiple提示全部错误验证；默认 single
	  */
      config.vtor={
	   msg_type:'single'
	  };

	  /*
	  ***用户扩充或覆盖验证库***
      *函数格式=验证函数前缀[默认func_]+函数功能名称[function Name]:function(DOM ID[,其他参数]){[方法体]}
	  */

	  config.funcs={
       //只能输入数字
	   func_numeric:function(id){var val=$vtor.$id(id);return /^\d+$/.test(val);}
	   /*
	   * 若要在配置文件中调用此函数只需配置：
	   * --numeric()::只能输入数字
	   */
	 };

}