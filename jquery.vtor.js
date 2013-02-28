/**
 * jQuery vtor plugin 1.0.0
 * @author JsonZou, 2012-2012
 * @source ����VVC˼��Ľ����ҳ����֤js��ܡ�����controler��
 * @license MIT License <https://github.com/jsonzou/vtor>
 */
(function($){
   $vtor={
	   /**
		 * ��ʼ��
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
		 //����lib��config��css
         $vtor.lib.init();
		 
		 var custom={};
		 
		 if($vtor.custom){
			 
		     $vtor.custom(custom);
			//�����û���֤�ļ���ʽ
			 if(custom.vtor){
				  $.extend($vtor.config,custom.vtor);
			 }
			 //�����û��Զ�����֤������
			 if(custom.funcs){
			  $.extend($vtor.lib.funcs,custom.funcs);
		 }
		 
		 }
		  //��ȡ��֤�ļ�������Ϣ
	       $vtor.core.getVtors(path);
		  //������֤����
		   $vtor.core.builtVtors();
		  //��ʼ����֤ģ�� 
		   $vtor.view=view;

		    //alert($vtor.vtorStr) 
			//alert(JSON.stringify($vtor.vtorObject)) 
		   },
      //�����ļ��ַ���
      vtorStr:'',
	 //��֤����
      vtorObject:{},
	//��֤ģ��
	  view:[],
	/*
	  ***vtor����***
      * func_pre ��֤����ǰ׺
	  * view_pre �����ļ�ģ��ǰ׺
	  * id_pre �����ļ�DOM idǰ׺
	  * validateTerm_pre �����ļ������ǰ׺
	  * msg_pre �����ļ���֤��ʾ��ǰ׺
	  * param_begin �����ļ���֤������ʼ�ַ�
	  * param_end �����ļ���֤���������ַ�
	  * param_split �����ļ���֤�����ָ���
	  * msg_type ��ʾ���ͣ�singleֻ��ʾ�ǰ��һ��������֤��multiple��ʾȫ��������֤
	  * msg_class ��ʾ�����ʽ
	  * errInput_class �����������ʽ
	  * vtor_suf ��֤�ļ���չ������
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
		 vtor_suf:'vtor',
	     configMethod:'post',
	     show:function(msg){msg.show(500);},
	     hide:function(msg){msg.hide(500);}
	  },
	/*
	  ***vtor����***
	  * msg_html ������ʾ��Ϣhtml����
	  * msg_type_singleֻ��ʾ�ǰ��һ��������֤
	  * msg_type_multy��ʾȫ��������֤
	  */
	constant:{
		func_middle:'_',
	    msg_html:"<span>&nbsp;</span>",
		msg_type_single:'single',
		msg_type_multiple:'multiple'
	  },
		//ִ����֤
	  validate:function(){
	    return $vtor.core.dovalidate($vtor.view);
	  },
	 /*
      ***���߰�***
      * clearAnnotation ���ע��
	  * trim ȥ���ַ������ҿհ��ַ�
	  * getParam ������֤����
	  */
      util:{
		getValById:function(id){
		   return $("#"+id).val();
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
	  ***��֤���İ�***
      * show ִ����ʾ
	  * dovalidate ������֤����ִ����֤
	  * builtVtors ������֤����
	  * getVtors ��ȡ�����ļ���֤��Ϣ
	  */
	  core:{
		  
		  show:function(id,msg){
			  var _ido=$("#"+id);
			  if(_ido&&_ido.length>0){
			  _ido.addClass($vtor.config.errInput_class);
			  var _msgo= _ido.next('span.'+$vtor.config.msg_class);
			  _msgo.html(msg);
			  _msgo.css({
				  'position':'absolute',
				  'z-index':100
			  });
		     $vtor.config.show(_msgo);
              }
			  _ido=null;
		  },
		  dovalidate:function(view){
		            var result=true;
					for(v in view){
					   var ids=$vtor.vtorObject[view[v]];
					  for(id in ids){
						 var id_result=true;  
                         var validateTerms=ids[id];
                         for(validateTerm in validateTerms){
						    var  _result=$vtor.lib.funcs[$vtor.config.func_pre+$vtor.constant.func_middle+validateTerm](id,validateTerms[validateTerm].param);
							//alert(validateTerm+'='+_result)
                            id_result=id_result&&_result;
							 
							if(!_result){
								result=result&&_result;
							  if($vtor.config.msg_type==$vtor.constant.msg_type_multiple){
								  $vtor.core.show(id,validateTerms[validateTerm].msg);
							      break;
							  }else{
								$('.'+$vtor.config.errInput_class).removeClass($vtor.config.errInput_class);
								$('.'+$vtor.config.msg_class).hide();
							    $vtor.core.show(id,validateTerms[validateTerm].msg);
						        return result;
							  }
						    }else{ 
							  if(id_result){
							   $('#'+id).removeClass($vtor.config.errInput_class);
							  }
							  $('.'+$vtor.config.msg_class).hide();
							}
					    
						 }
					  }
					 }
					 
					 return result;
			 
			 
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
							  //��ʾ���div
							  var _msgo=$($vtor.constant.msg_html);
							  
							  var _ido= $("#"+$vtor.util.trim(validateTerms[0]));
							  _msgo.hide();
							  if(_ido&&_ido.length>0){
							  _ido.after(_msgo);
							  _msgo.addClass($vtor.config.msg_class);
							  _msgo.css('left',_ido.offset().left+_ido.width());
							  _msgo.css('top',_ido.offset().top);
							  _ido.focus(function(){
								 $vtor.config.hide($(this).next('span.'+$vtor.config.msg_class));
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
	   ��֤�Ƿ���email��ַ
	   @id=DOM id
	  */
      $vtor.lib.funcs[$vtor.config.func_pre+'_email']=function(id,undefined){
		 
         return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^[\\w\\-\\.]+@[\\w\\-\\.]+(\\.\\w+)+$');
       };
	  /*
	   ��֤�Ƿ�Ϊ��
	   @id=DOM id
	  */
	  $vtor.lib.funcs[$vtor.config.func_pre+'_notNull']=function(id,undefined){
		   var _value=$vtor.$id(id);
		   if(_value.length>0){
			   return true;
		   } 
	      return false;
	   };
	  /*
	   ����0��ͷ��7-8λ
	   @id=DOM id
	  */
	  $vtor.lib.funcs[$vtor.config.func_pre+'_phone']=function(id,undefined){
		 
		   return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^((0\\d{2,3})-)(\\d{7,8})(-(\\d{3,}))?$');
	   
	   };
	 /*
	   �ֻ����룬13,15,18��ͷ
	   @id=DOM id
	  */
	  $vtor.lib.funcs[$vtor.config.func_pre+'_mobile']=function(id,undefined){
		  
		    return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^1[358]\\d{9}$');
	   };
	   /*
	   ���ڸ�ʽ��֤��
	   param=[yyyy-mm-dd hh:mm:ss|yyyy/mm/dd hh:mm:ss|yyyymmdd hh:mm:ss|yyyy-mm-dd|yyyy/mm/dd|yyyymmdd]
	   ���ֳ��ø�ʽ
	   @id=DOM id
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
	   ��֤���䣬����������1ʱ��֤����ֵ������������2ʱ��֤����ֵ��Χ
	   @id=DOM id
	   @param=(min[,max])
	  */
	  $vtor.lib.funcs[$vtor.config.func_pre+'_region']=function(id,param){
		   var _value= $vtor.$id(id);
		   if(_value.length==0){return true;}

	      if(param.lenth==0){
			  return false;
		  }
		 
		  if(!$vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^\\d+$')){
		    return false;
		  }
		   
		  if(param.length==1&&_value==param[0]){
		      return true;
		  }else if(param.length==2&&_value>=param[0]&&_value<=param[1]){
		      return true;
		  }
		 return false;
	   };
     /*
	   ����������ʽ��֤
	   @id=DOM id
	   @regexp=������ʽ
	  */
	  $vtor.lib.funcs[$vtor.config.func_pre+'_regexp']=function(id,regexp){
	       var _value= $vtor.$id(id);
		   if(_value.length==0){return true;}
		  var re = new RegExp(regexp,''); // ����������ʽ����
		   return re.test(_value);
	   };
	 /*    
       float([num])
	   ��֤С������м�λ,�޲�����ʾ������
	   @id=DOM id
	   @param=([num])
	  */
	  $vtor.lib.funcs[$vtor.config.func_pre+'_float']=function(id,param){
	   if(param){
	      return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^\\d+\\.\\d{'+param[0]+'}$')
	   }
	  return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^\\d+\\.\\d+$')
	  };
	/*
	   ��֤��ĸ��param[0]='a'Сд;param[0]='A'��д;�޲�����Ĭ�ϣ���Сд���
	   @id=DOM id
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
	   ��֤��������param[0]=����λ��min;param[1]=����λ��max;����ֻ��һ����λ��Ϊ�̶�ֵ;�޲�����Ĭ�ϲ�����λ��
	   @id=DOM id
	   @param=(min[,max])
	  */
	  $vtor.lib.funcs[$vtor.config.func_pre+'_123']=function(id,param){
		  if(param&&param.length==1&&/^\d+$/.test(param[0])){
                   return  $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'\\d'+'{'+param[0]+'}') 
		  }
		 if(param&&param.length==2&&/^\d+$/.test(param[0])&&/^\d+$/.test(param[1])){
                  return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'\\d{'+param[0]+','+param[1]+'}') 
		  }
		  return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^\\d+$') 
		};
	/*
	   ��֤��ĸ��param[0]='a'��ĸ��ͷ;param[0]='1'���ֿ�ͷ;param[0]='_'�»��߿�ͷ;�޲�����Ĭ�ϣ���ĸ�����»��߻��
	   @id=DOM id
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
	   ��֤�Ƿ����ĳ�������ַ�param[0]Ҫ�������ַ�,param[1]=i�����ִ�Сд
	   @id=DOM id
	   @param=(string)
	  */
	  $vtor.lib.funcs[$vtor.config.func_pre+'_contain']=function(id,param){
		   var _value= $vtor.$id(id);
		    if(_value.length==0){
				return true;
			}
			//�����ִ�Сд
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
		   return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12])|91)\d{4}((19\\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d\|30))|(19\\d{2}(0[13578]|1[02])31)|(19\\d{2}02(0[1-9]|1\\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\\d{3}(\\d|X|x)?$');
	   };
	/*
	   ��֤�Ƚ�param������������param[0]=['<','=','>','>=','<='];param[1]=�Ƚϵ�ֵ;
	   @id=DOM id
	   @param=(operator,value)
	  */
	  $vtor.lib.funcs[$vtor.config.func_pre+'_compare']=function(id,param){
		  var _value= $vtor.$id(id);
		    if(_value.length==0){
				return true;
			}
	     if(param&&param.length==2){
			 var operator=param[0];
		     var val=param[1];
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
	   ��֤���ȣ�����������1ʱ��֤����ֵ������������2ʱ��֤���ȷ�Χ
	   @id=DOM id
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
		  }else if(param.length==2&&len>=parseInt(param[0],10)&&len<=parseInt(param[1],10)){
		      return true;
		  }
		 return false;
	   };
	 /*
	   ��֤������
	   @id=DOM id
	  */
     $vtor.lib.funcs[$vtor.config.func_pre+'_p_int']=function(id,undefined){
		 
	     return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^[0-9]*[1-9][0-9]*$' )
	 };
	 /*
	   ��֤������
	   @id=DOM id
	  */
	 $vtor.lib.funcs[$vtor.config.func_pre+'_n_int']=function(id,undefined){
		 
	    return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^\\-[0-9]*[1-9][0-9]*$' )
	 };
	  /*
	   ��֤����
	   @id=DOM id
	  */
	 $vtor.lib.funcs[$vtor.config.func_pre+'_p_123']=function(id,undefined){
	   return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^(([1-9]+[0-9]*.{1}[0-9]+)|([0].{1}[1-9]+[0-9]*)|([1-9][0-9]*)|([0][.][0-9]+[1-9]*))$' );
	 };
	 /*
	   ��֤����
	   @id=DOM id
	  */
	 $vtor.lib.funcs[$vtor.config.func_pre+'_n_123']=function(id,undefined){
	   return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^\\-(([1-9]+[0-9]*.{1}[0-9]+)|([0].{1}[1-9]+[0-9]*)|([1-9][0-9]*)|([0][.][0-9]+[1-9]*))$' );
	 };
	  /*
	   ��֤�Ǹ���
	   @id=DOM id
	  */
	 $vtor.lib.funcs[$vtor.config.func_pre+'_not_n_123']=function(id,undefined){
		 return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^\\d+(\\.\\d+)?$' )
	    
	 };
	/*
	   ��֤ip
	   @id=DOM id
	  */
	 $vtor.lib.funcs[$vtor.config.func_pre+'_ip']=function(id,undefined){
		 return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^((0[0-9]|1[0-9]\\d{1,2})|(2[0-5][0-5])|(2[0-4][0-9])|(\\d{1,2}))\\.((0[0-9]|1[0-9]\\d{1,2})|(2[0-5][0-5])|(2[0-4][0-9])|(\\d{1,2}))\\.((0[0-9]|1[0-9]\\d{1,2})|(2[0-4][0-9])|(2[0-5][0-5])|(\\d{1,2}))\\.((0[0-9]|1[0-9]\\d{1,2})|(2[0-4][0-9])|(2[0-5][0-5])|(\\d{1,2}))$' )
	  
	 };
	/*
	   ��֤��ַurl
	   @id=DOM id
	  */
	 $vtor.lib.funcs[$vtor.config.func_pre+'_url']=function(id,undefined){
		 return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^[a-zA-z]+://(\\w+(-\\w+)*)(\\.(\\w+(-\\w+)*))*(\\?\\S*)?$' );
	   
	 };
	/*
	   ��֤����
	   @id=DOM id
	  */
	 $vtor.lib.funcs[$vtor.config.func_pre+'_chinese']=function(id,undefined){
		 return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^[\u4e00-\u9fa5]+$' );
	 };
     /*
	   ��֤��������
	   @id=DOM id
	  */
	 $vtor.lib.funcs[$vtor.config.func_pre+'_zipcode']=function(id,undefined){
		 return $vtor.lib.funcs[$vtor.config.func_pre+'_regexp'](id,'^[a-zA-Z0-9 ]{3,12}$' )
	 };
	/*
	   ajax��֤
	   @return {result:true[false]}
	   @id=DOM id
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
		   
	     alert('err:\n id='+id+' ajax validator error! param of url not found ��');
		 return false;
	   }
      return ajaxResult;
	 };
	 /*
	   ��֤��Զ�ɹ�
	   @id=DOM id
	  */
	  $vtor.lib.funcs[$vtor.config.func_pre+'_ok']=function(id,undefined){
	      return true;
	   };
	  /*
	   ��֤��Զʧ��
	   @id=DOM id
	  */
	  $vtor.lib.funcs[$vtor.config.func_pre+'_err']=function(id,undefined){
	      return false;
	   }
		
		
		}
		
	   }
   
   }; 
  
})(jQuery);