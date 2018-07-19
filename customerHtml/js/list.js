var page = {
	status: false
};
var baseUrl = "http://localhost:8080/huadaGene/a/customerManagement/customer/";

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

var type = getSearchParams().type;

function getUrl(type,pageSize,pageNo){
	
	var url = baseUrl + "mobileList?type="+type+"&pageSize="+pageSize+"&pageNo="+pageNo;
	return url;
	
}


//deleteBatch
function deleteEvent() {
	$("#delete-a").click(function(e) {
		var arr = new Array();

		var checkboxNum = $("#myTable :checkbox[checked]").length;
		if(checkboxNum == 0) {
			alert("请选择至少一项！");
			return;
		}
		if(checkboxNum > 0) {
			$("#myTable :checkbox[checked]").each(function(i) {
				arr[i] = $(this).val();
			});
		}
		$.ajax({
			type: "get",
			url: "http://localhost:8080/huadaGene/a/customerManagement/customer/mobileBatchDelete?ids="+arr.join(','),
			async: true,
			success: function(data) {
				if(data == "success") {
//					window.location.reload();
					$("#myTable :checkbox[checked]").each(function() { 
			            n = $(this).parents("tr").index();  // 获取checkbox所在行的顺序
			            $("#myTable").find("tr:eq("+n+")").remove();
			        });
				}
			}
		});
	})
}

function addPageEvent() {
	$("#pageTool-div").on('click', function(e) {
		var content = e.target.innerHTML;
		var pageSize = getPageSize();
		var currPage;
		if(page.status) {
			page.status = false;
			if(content == "上一页") {
				currPage = page.currPage <= 1 ? 1 : page.currPage - 1;
			} else if(content == "下一页") {
				currPage = page.currPage >= page.endPage ? page.endPage : page.currPage + 1;
			} else if(content == "尾页") {
				currPage = page.endPage;
			} else if(content =="首页") {
				currPage = 1;
			}else if(content =="当前第"+page.currPage+"页"){
				currPage = page.currPage;
			}
			var url = getUrl(type,pageSize,currPage);
			loadPage(url,$("#container"));
		}
	})
}

function getPageSize() {
	return $("#pageSizeSelect option:selected").val();
}

function addTrEvent(clickTr) {
	clickTr.on('click', function(e) {
		var content = e.target.innerHTML;
		var id = e.target.id;
		if(content == "查看") {
			window.location.href = "form.html?id="+id+"&status=look&type="+type;
		} else if(content == "修改") {
			console.log('change');
			window.location.href ="form.html?id="+id+"&status=modify&type="+type;
		} else if(content == "删除") {
			var url = baseUrl+"mobileDelete?id="+id;
			$.get(url,function(result){
				if(result){
					$(e.target).parent().parent().remove();
				}else{
					alert("删除失败");
				}
			})
			console.log('delete');
		}
	})
}

// 创建tr标签
function createShowDataTr(data) {
//	console.log(data);
	var $tr = $('<tr></tr>');
	$tr.addClass('container-tr');
	var keyArr = ["id", "code", "name", "telephone", "cardNumber",
		"registerDate","registerUser","healthReportProvideDate", "operation"
	];
	for(var i = 0; i < keyArr.length; i++) {
		var $td = $('<td></td>');
		$td.addClass('container-td');
		
		if(keyArr[i] === "id") {
			var $input = $("<input type='checkbox'></input>");
			$input.val(data.id);
			$td.append($input);
		}else if(keyArr[i] =="registerUser"){
			$td.html(data["registerUser"].name);
		}else if(keyArr[i] === "operation") {
			var $a1 = $("<a href='#' data-role='button'></a>");
			var $a2 = $("<a href='#' data-role='button'></a>");
			var $a3 = $("<a href='#' data-role='button'></a>");
			$a1.html("查看");
			$a2.html("修改");
			$a3.html("删除");
			$td.append($a1);
			$td.append($a2);
			$td.append($a3);
			$a1.addClass('a-operation');
			$a2.addClass('a-operation');
			$a3.addClass('a-operation');
			$a1.attr('id', data.id);
			$a2.attr('id', data.id);
			$a3.attr('id', data.id);
		}else{
			$td.html(data[keyArr[i]]);
		}
			
		$tr.append($td);
	}
	addTrEvent($tr);
	return $tr;
}

function createShowDataTable(data, container) {
	container.empty();
	$.each(data, function(index, customer) {
		var customer_tr = createShowDataTr(customer);
		container.append(customer_tr);
	});
}

function loadPage(url, container) {
	$.get(url, function(result) {
		var data = JSON.parse(result);
		var arr = data.list;
//		console.log(data);
		if(arr.length>0){
			createShowDataTable(data.list, container);
		}
		var pageSize = data.pageSize;
		
		page.status = true;
		page.currPage = data.pageNo;
		page.endPage = Math.ceil(data.count/pageSize);
		$("#currentPage-a").html("当前第" + page.currPage + "页");
	})
}

$(function() {
		var pageSize = getPageSize();
		var url = getUrl(type,pageSize,1);
		loadPage(url,$("#container"));
		addPageEvent();
		deleteEvent();
})