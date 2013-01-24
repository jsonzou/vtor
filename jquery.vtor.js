/**
 * jQuery vtor plugin 1.0.0
 * @author JsonZou, 2012-2012
 * @source 基于VVC思想的解耦合页面验证js框架【核心controler】
 * @license MIT License <https://github.com/jsonzou/vtor>
 */
(function($){
   $vtor={

	   /**
		 * 初始化
		 */
	  $:function(path,view){
	     $vtor.init(path,view);
	  },
	  $v:function(){
	    return $vtor.validate();
	  },
	  $id:function(id){
		  return $vtor.util.getValById(id);
	  },
      init:function(path,view){
		 //加载lib、config、css
         $vtor.util.loadFile();
		//获取用户配置信息
		 var config={
		   vtor:{},//自定义验证文件格式
		   funcs:{}//自定义的用户验证方法库
		 };
		 $vtor.cfg(config);
        //重置用户验证文件格式
		 if(config.vtor){
			  $.extend($vtor.config,config.vtor);
		 }
		 //加入用户自定义验证函数库
		 if(config.funcs){
			  $.extend($vtor_func,config.funcs);
		 }
		  
		  
		  //获取验证文件配置信息
	       $vtor.core.getVtors(path);
		  //构建验证部件
		   $vtor.core.builtVtors();
		  //初始化验证模块 
		   $vtor.view=view;

		    //alert($vtor.vtorStr) 
			//alert(JSON.stringify($vtor.vtorObject)) 
		   },
      //配置文件字符串
      vtorStr:'',
	 //验证部件
      vtorObject:{},
	//验证模块
	  view:[],
	/*
	  ***vtor配置***
      * func_pre 验证函数前缀
	  * view_pre 配置文件模块前缀
	  * id_pre 配置文件DOM id前缀
	  * validateTerm_pre 配置文件验语句前缀
	  * msg_pre 配置文件验证提示语前缀
	  * param_begin 配置文件验证参数开始字符
	  * param_end 配置文件验证参数结束字符
	  * param_split 配置文件验证参数分隔符
	  * msg_type 提示类型：single只提示最靠前的一个错误验证；multiple提示全部错误验证
	  * msg_class 提示框的样式
	  * errInput_class 输入框错误的样式
	  * vtor_suf 验证文件扩展名配置
	  */
	 config:{
	     func_pre:'func',
		 view_pre:'@',
		 id_pre:'#',
         validateTerm_pre:'--',
		 msg_pre:'::',
		 param_begin:'(',
		 param_end:')',
		 param_split:',',
		 msg_type:'single',
		 msg_class:'vtor-input-err-msg',
		 errInput_class:'vtor-input-err-border',
		 vtor_suf:'vtor'
	  },
	/*
	  ***vtor常量***
	  * msg_html 错误提示信息html代码
	  * msg_type_single只提示最靠前的一个错误验证
	  * msg_type_multy提示全部错误验证
	  */
	constant:{
		func_middle:'_',
	    msg_html:"<span>&nbsp;</span>",
		msg_type_single:'single',
		msg_type_multiple:'multiple'
	  },
		//执行验证
	  validate:function(){
	    return $vtor.core.dovalidate($vtor.view);
	  },
	 /*
      ***工具包***
      * clearAnnotation 清楚注释
	  * trim 去掉字符串左右空白字符
	  * getParam 处理验证参数
	  */
      util:{
		getValById:function(id){
		   return $("#"+id).val();
		},
		loadFile:function(){
		  var js=document.scripts;
		 
			var jsPath='';
			for(var i=0;i<js.length;i++){
			 if(js[i].src.indexOf("jquery.vtor.js")>-1){
			   jsPath=js[i].src.substring(0,js[i].src.lastIndexOf("jquery.vtor.js"));
			 }
             }
		 
         $("head").append("<script src='"+jsPath+"lib/vtor.lib.js'> </script>");
		 $("head").append("<script src='"+jsPath+"vconf/vtor.config.js'> </script>");
	     $("head").append("<link rel='stylesheet' type='text/css' href='"+jsPath+"css/vtor.css' />");
			 

		},
	    clearAnnotation:function(str){
			 return str.replace(/\/\*(\s|.)*?\*\//g,'').replace(/(?!http:)\/\/.*/g ,'');
		  },
		trim : function(str) { 
				return str.replace(/(^\s*)|(\s*$)/g, ""); 
				},
		getParam:function(param){
			   if(!$vtor.util.trim(param)){
			     return [];
			   }
               var paramArr=param.split($vtor.config.param_split);
			   if(!paramArr){
			     return [];
			   }
               for (p in paramArr )
               {
				paramArr[p]=$vtor.util.trim(paramArr[p])
               }
			  return paramArr;
			 },
		checkVtorPth:function(path){
				  var reg=new RegExp('\\.'+$vtor.config.vtor_suf+"$"); 
				  if(reg.test(path)){
				     return true;
				  }else{
				     alert('err:\npath->'+path+'\n is not the validator file!The validator file must be end width ".'+$vtor.config.vtor_suf+'"');
				  }
                   return reg.test(path);  
			 }
	  },
	/* 
	  ***验证核心包***
      * show 执行提示
	  * dovalidate 调用验证函数执行验证
	  * builtVtors 构建验证部件
	  * getVtors 获取配置文件验证信息
	  */
	  core:{
		  
		  show:function(id,msg){
			  var _ido=$("#"+id);
			  if(_ido&&_ido.length>0){
			  _ido.addClass($vtor.config.errInput_class);
			  var _msgo= _ido.next('span.'+$vtor.config.msg_class);
			  _msgo.html(msg);
		      _msgo.show(500);
              }
			  _ido=null;
		  },
		  dovalidate:function(view){
		            var resoult=true;
					for(v in view){
					   var ids=$vtor.vtorObject[view[v]];
					  for(id in ids){
                         var validateTerms=ids[id];
                         for(validateTerm in validateTerms){
						    var  _resoult=$vtor_func[$vtor.config.func_pre+$vtor.constant.func_middle+validateTerm](id,validateTerms[validateTerm].param);
							if(!_resoult){
								resoult=resoult&&_resoult;
							  if($vtor.config.msg_type==$vtor.constant.msg_type_multiple){
								  $vtor.core.show(id,validateTerms[validateTerm].msg);
							     
							  }else{
								$('.'+$vtor.config.errInput_class).removeClass($vtor.config.errInput_class);
								$('.'+$vtor.config.msg_class).hide();
							   $vtor.core.show(id,validateTerms[validateTerm].msg);
						       return resoult;
							  }
						    }else{
							 
						
							  $('.'+$vtor.config.msg_class).hide();
							}
					    
						 }
					  }
					 }
					 
					 return resoult;
			 
			 
		  },
		  builtVtors:function(){
			 return  (function(){
			    var strs=$vtor.vtorStr.split($vtor.config.view_pre); 
			   for(s in strs){
				if($vtor.util.trim(strs[s])){
				   var validates=strs[s].split($vtor.config.id_pre)
				   var ids={};
				   for(var i=1;i<validates.length;i++){
					  if($vtor.util.trim(validates[i])){
							  var validateTerms=validates[i].split($vtor.config.validateTerm_pre);
							  
							  var rules={};
							  for(var g=1;g<validateTerms.length;g++){
								   var validateTerm= $vtor.util.trim(validateTerms[g]);
									  
									var func_id=$vtor.util.trim(validateTerm.substring(0,validateTerm.indexOf($vtor.config.param_begin)==-1?
										validateTerm.indexOf($vtor.config.msg_pre):validateTerm.indexOf($vtor.config.param_begin)
									));
									var param=$vtor.util.trim(validateTerm.substring(validateTerm.indexOf($vtor.config.param_begin)+1,validateTerm.indexOf($vtor.config.param_end)));
									var msg=validateTerm.split($vtor.config.msg_pre);
									var _msg='';
									if(msg.length==2){
										_msg=msg[1];
									}
									if(func_id){
										 
										rules[func_id]={param:$vtor.util.getParam(param),msg:_msg}
									}
									
							  }
							  //提示语句div
							  var _msgo=$($vtor.constant.msg_html);
							  var _ido= $("#"+$vtor.util.trim(validateTerms[0]));
							  if(_ido&&_ido.length>0){
							  _ido.after(_msgo);
							  _msgo.addClass($vtor.config.msg_class);
							  _msgo.css('left',_ido.offset().left+_ido.width())
							  _msgo.css('top',_ido.offset().top)
							  _ido.focus(function(){
								  $(this).next('span.'+$vtor.config.msg_class).hide(500);
								 
									  });
							  ids[$vtor.util.trim(validateTerms[0])]=rules;
							  }
					   }
				   }
				  $vtor.vtorObject[$vtor.util.trim(validates[0])]=ids;
				}
			  }	 
			  })();
		  },
		  getVtors:function(path){
			  if($vtor.util.checkVtorPth(path)){
			     
                    $.ajax({
					    type: "get",
					    url: path,
					    async:false,
					    dataType:'text',
					    success: function(data, textStatus){
						$vtor.vtorStr+=data;
				        } 
			        });
			      
				  $vtor.vtorStr=$vtor.util.clearAnnotation($vtor.vtorStr);

			  }
		  }
	   }
   
   }; 
  
})(jQuery);