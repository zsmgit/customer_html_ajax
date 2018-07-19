function getSearchParams(){
	var url = window.location.search; //获取url中"?"符后的字串  
	var searchParams = {};
	if(url.indexOf('?') != -1){
		var strs = url.substring(1,url.length);
		var params = strs.split('&');
		for(var i=0;i<params.length;i++){
			var arr = params[i].split('=');
			searchParams[arr[0]]=unescape(arr[1]);
		}
	}
	return searchParams;
}

var id = getSearchParams().id;	//
var status = getSearchParams().status;//input 输入框状态 look mofify
var type = getSearchParams().type; // 跳转list.html

function loadCustomer(url, status) {
	$.get(url, function(result) {
		var data = JSON.parse(result);
		//		console.log(result);
		showData(data, status);
	});
}

function showData(data, status) {
	if(status == 'look'){
		$("#submit-btn").hide();
	}
	
	var inputArr = $('form').find('input, select');
	for(var i = 0; i < inputArr.length; i++) {
		var inputEle = inputArr[i];
		var key = inputEle.name; 
		
		if(status == 'look'){
			$(inputEle).attr('readonly', 'readonly');
		}
		if(key =="registerUser.id"){
			inputEle.value = data["registerUser"]["id"];
		}else if(key =="sex"||key=="cardType"||key=="married"){
			console.log(key);
			var inp = $("#form input[name='"+key+"']:eq("+data[key]+")");
			console.log(inp);
//			$("#form input[name='"+key+"']:eq("+data[key]-1+")").attr("checked","checked");
			$("#form input[name='sex']:eq('0')").attr("checked","checked");
			
		}else{
			inputEle.value = data[key];
		}
	}
}

function addSubmitEvent(){
	$("#submit-btn").click(function(){
			console.log("clicked")
			var data = $('#customer-form').serialize();
//			console.log(data);
			$.ajax({
				type:"post",
				url:"http://localhost:8080/huadaGene/a/customerManagement/customer/mobileSave",
				async:true,
				data:data,
				dataType:"text",
				success:function(result){
					if(result == "success"){
						window.location.href ="list.html?type="+type;
					}
				}
			});
		})
}
$(function() {
	//查看或修改
	if(!!id){
		console.log("look or modify");
		loadCustomer('http://localhost:8080/huadaGene/a/customerManagement/customer/mobileForm?id='+id, status);
	}else{
		//添加
		console.log('add');
		$("#codeLabel").attr('class',"ui-hidden-accessible");
		$("#code").attr('class',"ui-hidden-accessible");
		$("#type").val(type);
	}
	addSubmitEvent();
})