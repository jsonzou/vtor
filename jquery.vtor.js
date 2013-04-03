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
	  $:function(vc){
		  
	     $vtor.init(vc);
	  },
	  $v:function(){
	    return $vtor.validate();
	  },
	  $id:function(id){
		  return $vtor.util.getValByVId(id);
	  },
      init:function(vc){
		 //加载lib、config、css
         $vtor.lib.init();
		 //验证参数
		 if(vc){
		  $.extend($vtor.vc,vc);
		 }
		 var custom={};
		 
		 if($vtor.custom){
			 
		     $vtor.custom(custom);
			//重置用户验证文件格式
			 if(custom.vtor){
				  $.extend($vtor.config,custom.vtor);
			 }
			 //加入用户自定义验证函数库
			 if(custom.funcs){
			  $.extend($vtor.lib.funcs,custom.funcs);
		 }
		 
		 }
		  //$vtor.constant.autoCheck=autoCheck;
		  //获取验证文件配置信息
	       $vtor.core.getVtors($vtor.vc.path);
		  //构建验证部件
		   $vtor.core.builtVtors();
		    //alert($vtor.vtorStr) 
			//alert(JSON.stringify($vtor.vtorObject)) 
		   },
	  result:true,
      //配置文件字符串
      vtorStr:'',
	 //验证部件
     // vtorObject:{},
     /*
	  ***验证参数配置***
      * path 验证配置文件路径
	  * view 当前页面名
	  * auto 是否开启自动验证
	  * autoFunc 自动验证方式函数
	  */
	 vc:{
	    path:'',
	    view:'',
	    auto:false,
        autoFunc:'keyup'
	  },
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
	  * errMsg_class 提示框的样式
	  * errInput_class 输入框错误的样式
	  * okMsg_class 提示框的样式
	  * okInput_class 输入框错误的样式
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
		 errMsg_class:'vtor-input-err-msg',
		 errInput_class:'vtor-input-err-border',
		 okMsg_class:'vtor-input-ok-msg',
		 okInput_class:'vtor-input-ok-border',
		 vtor_suf:'vtor',
	     configMethod:'post',
	     show:function(vid,msg,result){msg.show(500);},
	     bind:function(vid,msg){}
	  },
	/*
	  ***vtor常量***
	  * msg_html 错误提示信息html代码
	  * msg_type_single只提示最靠前的一个错误验证
	  * msg_type_multy提示全部错误验证
	  */
	constant:{
		func_middle:'_',
	    msg_html:"<span>&nbsp;</span>"
	  },
		//执行验证
	  validate:function(){
	    return $vtor.core.dovalidate($vtor.vc.view);
	  },
	 /*
      ***工具包***
      * clearAnnotation 清楚注释
	  * trim 去掉字符串左右空白字符
	  * getParam 处理验证参数
	  */
      util:{
		getValByVId:function(id){
		   return $("[vid="+id+"]").val();
		},
	    clearAnnotation:function(str){
			 return str.replace(/\/\*(\s|.)*?\*\//g,'').replace(/(?!http:)\/\/.*/g ,'');
		  },
		trim : function(str) { 
				return str.replace(/(^\s*)|(\s*$)/g, ""); 
				},
		hasClass:function($obj,clazz){
				if(!$obj){return false;}
				 var classStr=$obj.attr('class');
				 if(classStr&&classStr.length>0){
					 var clazzs = classStr.split(" ");   
                    return $.inArray(clazz, clazzs);
				 }
                return false;   
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
		  
		  show:function(id,msg,errOrok){
			  var _ido=$("[vid="+id+"]");
			  if(_ido&&_ido.length>0){
			  var _msgo= _ido.next('span.vtor-msg-style');
              $vtor.core.renderClass(_ido,_msgo,errOrok);  
			  _msgo.html(msg);
			  _msgo.css({
				  'position':'absolute',
				  'z-index':100
			  });
		     $vtor.config.show(_ido,_msgo,errOrok);
              }
			  _ido=null;
		  },

	      renderClass:function(_ido,_msgo,errOrok){
			  if(!errOrok){
                _ido.addClass($vtor.config.errInput_class);
				_msgo.addClass($vtor.config.errMsg_class);
				 _ido.removeClass($vtor.config.okInput_class);
				_msgo.removeClass($vtor.config.okMsg_class);
			  }else{
			    _ido.removeClass($vtor.config.errInput_class);
				_msgo.removeClass($vtor.config.errMsg_class);
				 _ido.addClass($vtor.config.okInput_class);
				_msgo.addClass($vtor.config.okMsg_class);
			  }
		  },
		  dovalidate:function(view){
						$("[vid]").each(function(i,n){
						   var r=$vtor.core.IDvalidate(view,$(this).attr('vid'));
						   $vtor.result=$vtor.result&&r;
						   if(!r&&$vtor.config.msg_type!='multiple'){
						      return false;
						   }
                            $vtor.result=$vtor.result&&r;
						}); 
					 return $vtor.result;
		  },
	     IDvalidate:function(view,cuid){
			            
					 	 var id_result=true;  
					 
						  var validateTerms= $('[vid='+cuid+']').data('vtor-'+view+'-'+cuid);
						 
						  if(!validateTerms){
                               return true;
						  }
                         for(var validateTerm in validateTerms){
							 
						    var  _result=$vtor.lib.funcs[$vtor.config.func_pre+$vtor.constant.func_middle+validateTerm](cuid,validateTerms[validateTerm].param);
							  
                            id_result=id_result&&_result;
							  
                             if(!_result){
								 
							  $vtor.core.show(cuid,validateTerms[validateTerm].msg,_result);
							      break;
							 }
						 }
                       //如果验证正确显示验证正确消息提示
                        if(id_result){
							   if(validateTerms['ok']){
								$vtor.core.show(cuid,validateTerms['ok'].msg,id_result);
						       }
						}
				 
					 return id_result;
		  },
		  builtVtors:function(){
			 return  (function(){
			    var strs=$vtor.vtorStr.split($vtor.config.view_pre); 
			   for(s in strs){
				if($vtor.util.trim(strs[s])){
					 
				   var validates=strs[s].split($vtor.config.id_pre)
					   
				   var ids={};
                   var currView=$vtor.util.trim(validates[0]);
				  
				   if(!currView||currView!=$vtor.vc.view){
					   continue;
				   }
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
							  
							  var _ido= $("[vid="+$vtor.util.trim(validateTerms[0])+"]");
							  
							  _msgo.hide();
							  if(_ido&&_ido.length>0){
							  _ido.after(_msgo);
							  _msgo.addClass('vtor-msg-style');
							  _msgo.css('left',_ido.offset().left+_ido.width());
							  _msgo.css('top',_ido.offset().top);
							  if($vtor.vc.auto){
							      _ido.bind($vtor.vc.autoFunc,function(){
									 
							          $vtor.core.IDvalidate($vtor.vc.view,$(this).attr('vid')); 
							     });
							  } 
					       
							 _ido.data('vtor-'+currView+'-'+$vtor.util.trim(validateTerms[0]),rules);
							//创建验证部件时绑定函数   
							 $vtor.config.bind(_ido,_msgo);
							 
							  }
					   }
				   }
				}
			  }	 
			  })();
		  },
		  getVtors:function(path){
			  if($vtor.util.checkVtorPth(path)){
                    $.ajax({
					    type:$vtor.config.configMethod,
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
	   },
	 lib:{
		funcs:{},
	    init:function(){
		      /*
	   验证是否是email地址
	   @id=DOM vid
	  */
      $vtor.lib.funcs[$vtor.config.func_pre+'_email']=function(id,undefined){
		 
         return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^[\\w\\-\\.]+@[\\w\\-\\.]+(\\.\\w+)+$');
       };
	  /*
	   验证是否为空
	   @id=DOM vid
	  */
	  $vtor.lib.funcs[$vtor.config.func_pre+'_notNull']=function(id,undefined){
		   var _value=$vtor.$id(id);
		   if(_value.length>0){
			   return true;
		   } 
	      return false;
	   };
	  /*
	   座机0开头，7-8位
	   @id=DOM vid
	  */
	  $vtor.lib.funcs[$vtor.config.func_pre+'_phone']=function(id,undefined){
		 
		   return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^((0\\d{2,3})-)(\\d{7,8})(-(\\d{3,}))?$');
	   
	   };
	 /*
	   手机号码，13,15,18开头
	   @id=DOM vid
	  */
	  $vtor.lib.funcs[$vtor.config.func_pre+'_mobile']=function(id,undefined){
		  
		    return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^1[358]\\d{9}$');
	   };
	   /*
	   日期格式验证。
	   param=[yyyy-mm-dd hh:mm:ss|yyyy/mm/dd hh:mm:ss|yyyymmdd hh:mm:ss|yyyy-mm-dd|yyyy/mm/dd|yyyymmdd]
	   六种常用格式
	   @id=DOM vid
	  */
	  $vtor.lib.funcs[$vtor.config.func_pre+'_date']=function(id,param){
		  var formats=[
		  {f:"^[Yy]{4}\/[Mm]{2}\/[Dd]{2}\\s[hH]{2}\:[Mm]{2}\:[Ss]{2}$",
		   r:"^[0-9]{4}\/(((0[13578]|(10|12))\/(0[1-9]|[1-2][0-9]|3[0-1]))|(02\/(0[1-9]|[1-2][0-9]))|((0[469]|11)\/(0[1-9]|[1-2][0-9]|30)))\\s([01][0-9]|2[0-3])(\:[0-5][0-9]){2}$"
		  },
          {f:"^[Yy]{4}\-?[Mm]{2}\-[Dd]{2}\\s[hH]{2}\:[Mm]{2}\:[Ss]{2}$",
		   r:"^[0-9]{4}\-(((0[13578]|(10|12))\-(0[1-9]|[1-2][0-9]|3[0-1]))|(02\-(0[1-9]|[1-2][0-9]))|((0[469]|11)\-(0[1-9]|[1-2][0-9]|30)))\\s([01][0-9]|2[0-3])(\:[0-5][0-9]){2}$"
		  } ,
		  {f:"^[Yy]{4}[Mm]{2}[Dd]{2}\\s[hH]{2}\:[Mm]{2}\:[Ss]{2}$",
		   r:"^[0-9]{4}(((0[13578]|(10|12))(0[1-9]|[1-2][0-9]|3[0-1]))|(02(0[1-9]|[1-2][0-9]))|((0[469]|11)(0[1-9]|[1-2][0-9]|30)))\\s([01][0-9]|2[0-3])(\:[0-5][0-9]){2}$"
		  },
		  {f:"^[Yy]{4}\/[Mm]{2}\/[Dd]{2}$",
		   r:"^[0-9]{4}\/(((0[13578]|(10|12))\/(0[1-9]|[1-2][0-9]|3[0-1]))|(02\/(0[1-9]|[1-2][0-9]))|((0[469]|11)\/(0[1-9]|[1-2][0-9]|30)))$"
		  },
		  {f:"^[Yy]{4}\-[Mm]{2}\-[Dd]{2}$",
		   r:"^[0-9]{4}\-(((0[13578]|(10|12))\-(0[1-9]|[1-2][0-9]|3[0-1]))|(02\-(0[1-9]|[1-2][0-9]))|((0[469]|11)\-(0[1-9]|[1-2][0-9]|30)))$"
		  },
		  {f:"^[Yy]{4}[Mm]{2}[Dd]{2}$",
		   r:"^[0-9]{4}(((0[13578]|(10|12))(0[1-9]|[1-2][0-9]|3[0-1]))|(02(0[1-9]|[1-2][0-9]))|((0[469]|11)(0[1-9]|[1-2][0-9]|30)))$"
		  }
		  ]
	      if(param&&param.length==1){
			   var format=param[0];
			   var fr;
			  for(var i=0;i<formats.length;i++){
			    fr=new RegExp(formats[i].f);
				if(fr.test(format)){
				 
                   return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,formats[i].r);
				}
			  }
             alert("error:\nno such date format ["+format+"]!")
		  }
		   var _value= $vtor.$id(id);
		   if(_value.length==0){return true;}
		   return false;
	  };
	  /*
	   验证区间，参数个数是1时验证区间值，参数个数是2时验证区间值范围:(~,n)表示<=n，(n,~)表示>=n
	   @id=DOM vid
	   @param=(min[,max])
	  */
	  $vtor.lib.funcs[$vtor.config.func_pre+'_region']=function(id,param){
		  
		   var _value= parseInt($vtor.$id(id));
		   if(_value.length==0){return true;}

	      if(param.lenth==0){
			  return false;
		  }
		 
		  if(!$vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^-?[1-9]*(\\.\\d*)?$|^-?0(\\.\\d*)?$')){
			 
		    return false;
		  }
		    
		  if(param.length==1&&_value==parseInt(param[0])){
		      return true;
		  }else if(param.length==2){
			 
		      return  param[0]=='~'?_value<=parseInt(param[1]):
				      param[1]=='~'?_value>=parseInt(param[0]):
				      _value>=parseInt(param[0])&&_value<=parseInt(param[1]);
		  }
		 return false;
	   };
     /*
	   根据正则表达式验证
	   @id=DOM vid
	   @regexp=正则表达式
	  */
	  $vtor.lib.funcs[$vtor.config.func_pre+'_regexp']=function(id,regexp,rule){
	       var _value= $vtor.$id(id);
		   if(_value.length==0){return true;}
		  var re = new RegExp(regexp,rule?rule:''); // 创建正则表达式对象。
		   return re.test(_value);
	   };
	 /*    
       float([num])
	   验证小数点后有几位,无参数表示无限制
	   @id=DOM vid
	   @param=([num])
	  */
	  $vtor.lib.funcs[$vtor.config.func_pre+'_float']=function(id,param){
	   if(param){
	      return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^\\d+\\.\\d{'+param[0]+'}$')
	   }
	  return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^\\d+\\.\\d+$')
	  };
	/*
	   验证字母。param[0]='a'小写;param[0]='A'大写;无参数，默认，大小写混合
	   @id=DOM vid
	   @param=(['a'|'A'])
	  */
      $vtor.lib.funcs[$vtor.config.func_pre+'_abc']=function(id,param){
		 if(param&&param[0]=='a'){
		   return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'[a-z]+')
		 }
		 if(param&&param[0]=='A'){
		   return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'[A-Z]+')
		 }
	     return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'[a-zA-Z]+')
	   };
	  /*
	   验证数字类型
	   @id=DOM vid
	  */
	  $vtor.lib.funcs[$vtor.config.func_pre+'_123']=function(id,param){
		   return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^-?[1-9]*(\\.\\d*)?$|^-?0(\\.\\d*)?$') 
		};
	/*
	   验证字母。param[0]='a'字母开头;param[0]='1'数字开头;param[0]='_'下划线开头;无参数，默认，字母数字下划线混合
	   @id=DOM vid
	   @param=(['a'|'1'|'_'])
	  */
	  $vtor.lib.funcs[$vtor.config.func_pre+'_a0_']=function(id,param){
		  if(param&&param[0]=='a'){
		    return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^[a-zA-Z]+[a-zA-Z_0-9]*$' )
		  }
		  if(param&&param[0]=='1'){
		    return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^\\d+[a-zA-Z_0-9]*$' )
		  }
		  if(param&&param[0]=='_'){
		    return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^\\d+[a-zA-Z_0-9]*$' )
		  }
		  return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'[a-zA-Z_0-9]+' ) 
		};
	/*
	   验证是否包含某个任意字符param[0]要包含的字符,param[1]=i不区分大小写
	   @id=DOM vid
	   @param=(string)
	  */
	  $vtor.lib.funcs[$vtor.config.func_pre+'_contain']=function(id,param){
		   var _value= $vtor.$id(id);
		    if(_value.length==0){
				return true;
			}
			//不区分大小写
			if(param&&param.length==2){
			  _value=_value.toLowerCase();
			  param[0]=param[0].toLowerCase();
			}
		   if(param&&_value.indexOf(param[0])!=-1){
		      return true;
		   }
		   return false;
		 };
	  $vtor.lib.funcs[$vtor.config.func_pre+'_idcard']=function(id,undefined){
		   return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12])|91)\\d{4}((19\\d{2}(0[13-9]|1[012])(0[1-9]|[12]\\d|30))|(19\\d{2}(0[13578]|1[02])31)|(19\\d{2}02(0[1-9]|1\\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\\d{3}(\\d|X|x)?$');
	   };
	/*
	   验证比较param有两个参数：param[0]=['<','=','>','>=','<='];param[1]=比较的值;
	   @id=DOM vid
	   @param=(operator,value)
	  */
	  $vtor.lib.funcs[$vtor.config.func_pre+'_compare']=function(id,param){
		  var _value= $vtor.$id(id);
		    if(_value.length==0){
				return true;
			}
	     if(param&&param.length>=2){
			 var operator=param[0];
		     var val=param.length==3?param[2]==1?$vtor.$id(param[1]):param[1]:param[1];
			 var _value= $vtor.$id(id);
              return operator=='<'?_value<val:
				          operator=='>'?_value>val:
				          operator=='<='?_value<=val:
				          operator=='>='?_value>=val:
                          operator=='='?_value==val:false;
				 
		 }
		 return false;
	  };
	/*
	   验证长度，参数个数是1时验证长度值，参数个数是2时验证长度范围:(~,n)表示<=n，(n,~)表示>=n
	   
	   @id=DOM vid
	   @param=(min[,max])
	  */
	  $vtor.lib.funcs[$vtor.config.func_pre+'_len']=function(id,param){
		  var _value= $vtor.$id(id);
		    if(_value.length==0){
				return true;
			}
		  if(param.lenth==0){
			  return false;
		  }
		   var _value= $vtor.$id(id);
           var len=_value.length;
		  

		  if(param.length==1&&len==parseInt(param[0],10)){
		      return true;
		  }else if(param.length==2){
			 
              return param[0]=='~'?len<=parseInt(param[1],10):
				     param[1]=='~'?len>=parseInt(param[0],10):
				     len>=parseInt(param[0],10)&&len<=parseInt(param[1],10);
 
		  }
		 return false;
	   };
	 /*
	   验证正整数
	   @id=DOM vid
	  */
     $vtor.lib.funcs[$vtor.config.func_pre+'_p_int']=function(id,undefined){
		 
	     return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^[0-9]*[1-9][0-9]*$' )
	 };
	 /*
	   验证负整数
	   @id=DOM vid
	  */
	 $vtor.lib.funcs[$vtor.config.func_pre+'_n_int']=function(id,undefined){
		 
	    return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^\\-[0-9]*[1-9][0-9]*$' )
	 };
	  /*
	   验证正数
	   @id=DOM vid
	  */
	 $vtor.lib.funcs[$vtor.config.func_pre+'_p_123']=function(id,undefined){
	   return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^(([1-9]+[0-9]*.{1}[0-9]+)|([0].{1}[1-9]+[0-9]*)|([1-9][0-9]*)|([0][.][0-9]+[1-9]*))$' );
	 };
	 /*
	   验证负数
	   @id=DOM vid
	  */
	 $vtor.lib.funcs[$vtor.config.func_pre+'_n_123']=function(id,undefined){
	   return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^\\-(([1-9]+[0-9]*.{1}[0-9]+)|([0].{1}[1-9]+[0-9]*)|([1-9][0-9]*)|([0][.][0-9]+[1-9]*))$' );
	 };
	  /*
	   验证非负数
	   @id=DOM vid
	  */
	 $vtor.lib.funcs[$vtor.config.func_pre+'_not_n_123']=function(id,undefined){
		 return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^\\d+(\\.\\d+)?$' )
	    
	 };
	/*
	   验证ip
	   @id=DOM vid
	  */
	 $vtor.lib.funcs[$vtor.config.func_pre+'_ip']=function(id,undefined){
		 return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^((0[0-9]|1[0-9]\\d{1,2})|(2[0-5][0-5])|(2[0-4][0-9])|(\\d{1,2}))\\.((0[0-9]|1[0-9]\\d{1,2})|(2[0-5][0-5])|(2[0-4][0-9])|(\\d{1,2}))\\.((0[0-9]|1[0-9]\\d{1,2})|(2[0-4][0-9])|(2[0-5][0-5])|(\\d{1,2}))\\.((0[0-9]|1[0-9]\\d{1,2})|(2[0-4][0-9])|(2[0-5][0-5])|(\\d{1,2}))$' )
	  
	 };
	/*
	   验证网址url
	   @id=DOM vid
	  */
	 $vtor.lib.funcs[$vtor.config.func_pre+'_url']=function(id,undefined){
		 return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^[a-zA-z]+://(\\w+(-\\w+)*)(\\.(\\w+(-\\w+)*))*(\\?\\S*)?$' );
	   
	 };
	/*
	   验证汉字
	   @id=DOM vid
	  */
	 $vtor.lib.funcs[$vtor.config.func_pre+'_chinese']=function(id,undefined){
		 return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^[\u4e00-\u9fa5]+$' );
	 };
     /*
	   验证邮政编码
	   @id=DOM vid
	  */
	 $vtor.lib.funcs[$vtor.config.func_pre+'_zipcode']=function(id,undefined){
		 return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^[1-9][0-9]{5}$' )
	 };
	/*
	   ajax验证
	   @return {result:true[false]}
	   @id=DOM vid
	   @param(url,method)
	  */
	 $vtor.lib.funcs[$vtor.config.func_pre+'_ajax']=function(id,param){
		 var _value= $vtor.$id(id);
		    if(_value.length==0){
				return true;
			}
		 var ajaxResult=false;
		 var ajaxMethod='post';
		 if(param&&param.length==2){
		      ajaxMethod=param[1];
		 }
		 if(param&&param[0].length>0){
		 $.ajax({
				type:ajaxMethod,
				async:false,
			    dataType:'json',
				url:param[0],
				data:id+"="+$vtor.$id(id),
				success:function(data){
				   ajaxResult=data.result;
				},
			    error:function(){
				   alert('err:\n id='+id+' ajax validator error!');
				} 
		 });
       }else{
		   
	     alert('err:\n id='+id+' ajax validator error! param of url not found ！');
		 return false;
	   }
      return ajaxResult;
	 };

	 
   /*
	   验证sql注入
	   @id=DOM vid
	  */
	  $vtor.lib.funcs[$vtor.config.func_pre+'_sqlin']=function(id,undefined){
	      var _value= $vtor.$id(id);
		    if(_value.length==0){
				return true;
			} 
	 return !$vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,"\'|Select|Update|Delete|insert|Count|drop table|truncate|Asc|Mid|char|xp_cmdshell|exec master|net localgroup administrators|And|net user|Or" ,'i');
	   };
	 /*
	   验证永远成功
	   @id=DOM vid
	  */
	  $vtor.lib.funcs[$vtor.config.func_pre+'_ok']=function(id,undefined){
	      return true;
	   };
	  /*
	   验证永远失败
	   @id=DOM vid
	  */
	  $vtor.lib.funcs[$vtor.config.func_pre+'_err']=function(id,undefined){
	      return false;
	   }
		
		
		}
		
	   }
   
   }; 
  
})(jQuery);