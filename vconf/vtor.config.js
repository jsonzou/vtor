/**
 * jQuery vtor plugin 1.0.0
 * @author JsonZou, 2012-2012
 * @source ����VVC˼��Ľ����ҳ����֤js��ܡ��û��Զ������á�
 * @license MIT License <https://github.com/jsonzou/vtor>
 * �Զ���ʹ�÷�������գ�api/instructions.docx
 */
$vtor.custom=function(custom){
	/*
	  ***�û��Զ���������֤�ļ�����֯��ʽ***
      * func_pre ��֤����ǰ׺��Ĭ�� func
	  * view_pre �����ļ�ģ��ǰ׺��Ĭ�� @
	  * id_pre �����ļ�DOM idǰ׺��Ĭ�� #
	  * validateTerm_pre �����ļ������ǰ׺��Ĭ�� --
	  * msg_pre �����ļ���֤��ʾ��ǰ׺��Ĭ��::
	  * param_begin �����ļ���֤������ʼ�ַ���Ĭ�� (
	  * param_end �����ļ���֤���������ַ���Ĭ�� )
	  * param_split �����ļ���֤�����ָ�����Ĭ�� ,
	  * msg_type ��ʾ����:singleֻ��ʾ�ǰ��һ��������֤��multiple��ʾȫ��������֤��Ĭ�� single
	  * msg_class ��ʾ�����ʽ�� Ĭ��vtor-input-err-msg
	  * errInput_class �����������ʽ��Ĭ�� vtor-input-err-border
	  * vtor_suf ��֤�ļ���չ�����ã�Ĭ��vtor
	  * configMethod ��ȡvtor�����ļ��ķ�ʽ��һ�������ַ�ʽ��get,post;Ĭ��post
	  */
      custom.vtor={
	   //msg_type:'multiple',
	   //vtor_suf:'txt'
	   //configMethod:'get'
	  };

	  /*
	  ***�û�����򸲸���֤��***
      *������ʽ=��֤����ǰ׺[Ĭ��func]+�»���+������������[function Name]:function(DOM ID[,��������]){[������]}
	  */

	  custom.funcs={
       //ֻ����������
	   //func_numeric:function(id){var val=$vtor.$id(id);return /^\d+$/.test(val);}
	   /*
	   * ��Ҫ�������ļ��е��ô˺���ֻ�����ã�
	   * --numeric()::ֻ����������
	   */
	 };

};