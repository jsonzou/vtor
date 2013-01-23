/**
 * jQuery vtor plugin 1.0.0
 * @author JsonZou, 2012-2012
 * @source 表单验证框架
 * @license MIT License <https://github.com/jsonzou/vtor>
 */

(function(){
   $vtor_func={
	  vtor_func_specification:{
		  isSpecify:function(func,param){
		     $vtor_fu.vtor_func_specification.specification['spec_'+func];
		  },
		  specification:{
		     spec_email:{},
			 spec_empty:{} 
		  }
		  
	  },
	 /*
	   验证是否是email地址
	   @id=DOM id
	  */
      func_email:function(id,undefined){
         return $vtor_func.func_regexp(id,'^[\\w\\-\\.]+@[\\w\\-\\.]+(\\.\\w+)+$');
       },
	  /*
	   验证是否为空
	   @id=DOM id
	  */
	  func_empty:function(id,undefined){
		   var _value= $("#"+id).val();
		   if(_value.length>0){
			   return true;
		   } 
	      return false;
	   },
	  /*
	   座机0开头，7-8位
	   @id=DOM id
	  */
	  func_phone:function(id,undefined){
		   return $vtor_func.func_regexp(id,'^((0\\d{2,3})-)(\\d{7,8})(-(\\d{3,}))?$');
	   
	   },
	 /*
	   手机号码，13,15,18开头
	   @id=DOM id
	  */
	  func_mobile:function(id,undefined){
		    return $vtor_func.func_regexp(id,'^1[358]\\d{9}$');
	   },
	  func_date:function(id,param){},
	  /*
	   验证区间，参数个数是1时验证区间值，参数个数是2时验证区间值范围
	   @id=DOM id
	   @param=(min[,max])
	  */
	  func_region:function(id,param){
	      if(param.lenth==0){
			  return false;
		  }
		 
		  if(!$vtor_func.func_regexp(id,'\\d+')){
		    return false;
		  }
		    var _value= $("#"+id).val();
		  if(param.length==1&&_value==param[0]){
		      return true;
		  }else if(param.length==2&&_value>=param[0]&&_value<=param[1]){
		      return true;
		  }
		 return false;
	   },
     /*
	   根据正则表达式验证
	   @id=DOM id
	   @regexp=正则表达式
	  */
	  func_regexp:function(id,regexp){
	       var _value= $("#"+id).val();
		   if(!_value){
		      return false;
		   }
		  var re = new RegExp(regexp,''); // 创建正则表达式对象。
		   return _value.match(re);
	   },
	 /*    
       float([num])
	   验证小数点后有几位,无参数表示无限制
	   @id=DOM id
	   @param=([num])
	  */
	  func_float:function(id,param){
	   if(param){
	      return $vtor_func.func_regexp(id,'^\\d+\\.\\d{'+param[0]+'}$')
	   }
	  return $vtor_func.func_regexp(id,'^\\d+\\.\\d+$')
	  },
	/*
	   验证字母。param[0]='a'小写;param[0]='A'大写;无参数，默认，大小写混合
	   @id=DOM id
	   @param=(['a'|'A'])
	  */
      func_abc:function(id,param){
		 if(param&&param[0]=='a'){
		   return $vtor_func.func_regexp(id,'[a-z]+')
		 }
		 if(param&&param[0]=='A'){
		   return $vtor_func.func_regexp(id,'[A-Z]+')
		 }
	     return $vtor_func.func_regexp(id,'[a-zA-Z]+')
	   },
	  /*
	   验证数字类型param[0]=数字位数min;param[1]=数字位数max;参数只有一个则位数为固定值;无参数则默认不限制位数
	   @id=DOM id
	   @param=(min[,max])
	  */
	  func_123:function(id,param){
		  if(param&&param.length==1&&/\d+/.test(param[0])){
                   return  $vtor_func.func_regexp(id,'\\d'+'{'+param[0]+'}') 
		  }
		 if(param&&param.length==2&&/\d+/.test(param[0])&&/\d+/.test(param[1])){
                  return $vtor_func.func_regexp(id,'\\d{'+param[0]+','+param[1]+'}') 
		  }
		  return $vtor_func.func_regexp(id,'\\d+') 
		},
	/*
	   验证字母。param[0]='a'字母开头;param[0]='1'数字开头;param[0]='_'下划线开头;无参数，默认，字母数字下划线混合
	   @id=DOM id
	   @param=(['a'|'1'|'_'])
	  */
	  func_a0_:function(id,param){
		  if(param&&param[0]=='a'){
		    return $vtor_func.func_regexp(id,'^[a-zA-Z]+[a-zA-Z_0-9]*$' )
		  }
		  if(param&&param[0]=='1'){
		    return $vtor_func.func_regexp(id,'^\\d+[a-zA-Z_0-9]*$' )
		  }
		  if(param&&param[0]=='_'){
		    return $vtor_func.func_regexp(id,'^\\d+[a-zA-Z_0-9]*$' )
		  }
		  return $vtor_func.func_regexp(id,'[a-zA-Z_0-9]+' ) 
		},
	/*
	   验证是否包含某个任意字符
	   @id=DOM id
	   @param=(string)
	  */
	  func_contain:function(id,param){
		   var _value= $("#"+id).val();
		   if(!_value){
		      return false;
		   }
		   if(param&&_value.indexOf(param[0])!=-1){
		      return true;
		   }
		   return false;
		 },
	  func_idcard:function(id,undefined){
		   return $vtor_func.func_regexp(id,'^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12])|91)\d{4}((19\\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d\|30))|(19\\d{2}(0[13578]|1[02])31)|(19\\d{2}02(0[1-9]|1\\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\\d{3}(\\d|X|x)?$');
	   },
	/*
	   验证比较param有两个参数：param[0]=['<','=','>','>=','<='];param[1]=比较的值
	   @id=DOM id
	   @param=(operator,value)
	  */
	  func_compare:function(id,param){
	     if(param&&param.length==2){
			 var operator=param[0];
		     var val=param[1];
			 var _value= $("#"+id).val();
              return operator=='<'?_value<val:
				          operator=='>'?_value>val:
				          operator=='<='?_value<=val:
				          operator=='>='?_value>=val:
                          operator=='='?_value==val:false;
				 
		 }
		 return false;
	  },
	/*
	   验证长度，参数个数是1时验证长度值，参数个数是2时验证长度范围
	   @id=DOM id
	   @param=(min[,max])
	  */
	  func_len:function(id,param){
		  if(param.lenth==0){
			  return false;
		  }
		   var _value= $("#"+id).val();
           var len=_value.length;
		  
		  if(param.length==1&&len==parseInt(param[0],10)){
		      return true;
		  }else if(param.length==2&&len>=parseInt(param[0],10)&&len<=parseInt(param[1],10)){
		      return true;
		  }
		 return false;
	   },
	 /*
	   验证正整数
	   @id=DOM id
	  */
     func_p_int:function(id,undefined){
		 
	     return $vtor_func.func_regexp(id,'^[0-9]*[1-9][0-9]*$' )
	 },
	 /*
	   验证负整数
	   @id=DOM id
	  */
	 func_n_int:function(id,undefined){
		 
	    return $vtor_func.func_regexp(id,'^\\-[0-9]*[1-9][0-9]*$' )
	 },
	  /*
	   验证正数
	   @id=DOM id
	  */
	 func_p_123:function(id,undefined){
	   return $vtor_func.func_regexp(id,'^(([1-9]+[0-9]*.{1}[0-9]+)|([0].{1}[1-9]+[0-9]*)|([1-9][0-9]*)|([0][.][0-9]+[1-9]*))$' );
	 },
	 /*
	   验证负数
	   @id=DOM id
	  */
	 func_n_123:function(id,undefined){
	   return $vtor_func.func_regexp(id,'^\\-(([1-9]+[0-9]*.{1}[0-9]+)|([0].{1}[1-9]+[0-9]*)|([1-9][0-9]*)|([0][.][0-9]+[1-9]*))$' );
	 },
	  /*
	   验证非负数
	   @id=DOM id
	  */
	 func_not_n_123:function(id,undefined){
		 return $vtor_func.func_regexp(id,'^\\d+(\\.\\d+)?$' )
	    
	 },
	/*
	   验证ip
	   @id=DOM id
	  */
	 func_ip:function(id,undefined){
		 return $vtor_func.func_regexp(id,'^((0[0-9]|1[0-9]\\d{1,2})|(2[0-5][0-5])|(2[0-4][0-9])|(\\d{1,2}))\\.((0[0-9]|1[0-9]\\d{1,2})|(2[0-5][0-5])|(2[0-4][0-9])|(\\d{1,2}))\\.((0[0-9]|1[0-9]\\d{1,2})|(2[0-4][0-9])|(2[0-5][0-5])|(\\d{1,2}))\\.((0[0-9]|1[0-9]\\d{1,2})|(2[0-4][0-9])|(2[0-5][0-5])|(\\d{1,2}))$' )
	  
	 },
	/*
	   验证网址url
	   @id=DOM id
	  */
	 func_url:function(id,undefined){
		 return $vtor_func.func_regexp(id,'^[a-zA-z]+://(\\w+(-\\w+)*)(\\.(\\w+(-\\w+)*))*(\\?\\S*)?$' );
	   
	 },
	/*
	   验证汉字
	   @id=DOM id
	  */
	 func_chinese:function(id,undefined){
		 return $vtor_func.func_regexp(id,'^[\u4e00-\u9fa5]+$' );
	 },
     /*
	   验证邮政编码
	   @id=DOM id
	  */
	 func_zipcode:function(id,undefined){
		 return $vtor_func.func_regexp(id,'^[a-zA-Z0-9 ]{3,12}$' )
	 },
	 /*
	   验证永远成功
	   @id=DOM id
	  */
	  func_ok:function(id,undefined){
	      return true;
	   },
	  /*
	   验证永远失败
	   @id=DOM id
	  */
	  func_err:function(id,undefined){
	      return false;
	   }
   };
})();