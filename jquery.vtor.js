/**
 * jQuery vtor plugin 1.0.0
 * @author JsonZou, 2012-2012
 * @source 表单验证框架
 * @license MIT License <https://github.com/jsonzou/vtor>
 */
(function($){
   $vtor={

	   /**
		 * 初始化
		 */
      init:function(paths,model){
		 //加载lib
		  
		 //获取配置文件
	       $vtor.core.getVtors(paths);
		  //构建验证部件
		   $vtor.core.builtVtors();
		  //初始化验证模块 
		   $vtor.model=model;

		    //alert($vtor.vtorStr) 
			//alert(JSON.stringify($vtor.vtorObject)) 
		   },
      //配置文件字符串
      vtorStr:'',
	 //验证部件
      vtorObject:{},
	//验证模块
	  model:'',
	/*
	  ***常量***
      * func_pre 验证函数前缀
	  * model_pre 配置文件模块前缀
	  * id_pre 配置文件DOM id前缀
	  * validateTerm_pre 配置文件验语句前缀
	  * msg_pre 配置文件验证提示语前缀
	  * param_begin 配置文件验证参数开始字符
	  * param_end 配置文件验证参数结束字符
	  * param_split 配置文件验证参数分隔符
	  * msg_html 提示信息代码
	  * msg_type 提示类型：single只提示最靠前的一个错误验证；multy提示全部错误验证
	  */
	 contants:{
	     func_pre:'func_',
		 model_pre:'@',
		 id_pre:'#',
         validateTerm_pre:'--',
		 msg_pre:'::',
		 param_begin:'(',
		 param_end:')',
		 param_split:',',
		 msg_html:"<span class='vtor-input-err-msg'> </span>",
		 msg_type:'single'
	  },
		//执行验证
	  validate:function(){
	    return $vtor.core.dovalidate($vtor.vtorObject[$vtor.model]);
	  },
	 /*
      ***工具包***
      * clearAnnotation 清楚注释
	  * trim 去掉字符串左右空白字符
	  * getParam 处理验证参数
	  */
      util:{
	    clearAnnotation:function(str){
			 return str.replace(/\*[^*]*\*+(?:[^\/*][^*]*\*+)*/g,'').replace(/\/\/[^\r\n]*/g ,'');
			 
		  },
		trim : function(str) { 
				return str.replace(/(^\s*)|(\s*$)/g, ""); 
				},
		getParam:function(param){
			   if(!$vtor.util.trim(param)){
			     return [];
			   }
               var paramArr=param.split($vtor.contants.param_split);
			   if(!paramArr){
			     return [];
			   }
               for (p in paramArr )
               {
				paramArr[p]=$vtor.util.trim(paramArr[p])
               }
			  return paramArr;
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
			  _ido.addClass('vtor-input-err-border');
			  var _msgo= _ido.next('span.vtor-input-err-msg');
			  _msgo.html(msg);
			  _msgo.css('left',_ido.css('left')+_ido.css('width'))
		      _msgo.show(500);

		  },
		  dovalidate:function(ids){
		            var resoult=true;
					 for(id in ids){
                         var functs=ids[id];
                         for(func in functs){
						    var  _resoult=$vtor_func[$vtor.contants.func_pre+func.toLowerCase()](id,functs[func].param);
							if(!_resoult){
								resoult=resoult&&_resoult;
							  if($vtor.contants.msg_type=='multiple'){
								  $vtor.core.show(id,functs[func].msg);
							     
							  }else{
								$('.vtor-input-err-border').removeClass('vtor-input-err-border');
							   $vtor.core.show(id,functs[func].msg);
						       return resoult;
							  }
						    }else{
							 
							  $("#"+id).removeClass('vtor-input-err-border');
							}
					    
						 }
					 }
					 return resoult;
			 
			 
		  },
		  builtVtors:function(){
			 return  (function(){
			    var strs=$vtor.vtorStr.split($vtor.contants.model_pre); 
			   for(s in strs){
				if($vtor.util.trim(strs[s])){
				   var validates=strs[s].split($vtor.contants.id_pre)
				   var ids={};
				   for(var i=1;i<validates.length;i++){
					  if($vtor.util.trim(validates[i])){
							  var inputs=validates[i].split($vtor.contants.validateTerm_pre);
							  
							  var rules={};
							  for(var g=1;g<inputs.length;g++){
								   var func= $vtor.util.trim(inputs[g]);
									  
									var func_id=$vtor.util.trim(func.substring(0,func.indexOf($vtor.contants.param_begin)));
									var param=$vtor.util.trim(func.substring(func.indexOf($vtor.contants.param_begin)+1,func.indexOf($vtor.contants.param_end)));
									var msg=func.split($vtor.contants.msg_pre);
									var _msg='';
									if(msg.length==2){
										_msg=msg[1];
									}
									if(func_id){
										 
										rules[func_id]={param:$vtor.util.getParam(param),msg:_msg}
									}
									
							  }
							  
							  $("#"+$vtor.util.trim(inputs[0])).after($vtor.contants.msg_html);
							  $("#"+$vtor.util.trim(inputs[0])).focus(function(){
								  $(this).next('span.vtor-input-err-msg').hide(500);
								 
									  });
							  ids[$vtor.util.trim(inputs[0])]=rules;
					   }
				   }
				  $vtor.vtorObject[$vtor.util.trim(validates[0])]=ids;
				}
			  }	 
			  })();
		  },
		  getVtors:function(paths){
			  (function(){
			    for (i=0;i<paths.length ;i++ )
			    {
                    $.ajax({
					    type: "get",
					    url: paths[i],
					    async:false,
					    success: function(data, textStatus){
						$vtor.vtorStr+=data;
				        } 
			        });
			    }
				 $vtor.vtorStr=$vtor.util.clearAnnotation($vtor.vtorStr);
			   })();
		  }
	   }
   
   }; 
  
})(jQuery);