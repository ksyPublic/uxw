// ========================================================
// ▶ 코어 설정
// ====================================================/**/
var asyncPage			= false;				// Post매소드의  Ajax호출로 받은 페이지 HTML을 cntBody에 적용
var loadingBox			= ".loadingBox"			// 로딩 박스 클래스명
var loadingBoxActive	= "hide"				// 로딩 박스 활성/비활성 클래스명
var cntBody				= ".ly-content";		// 컨텐츠 바디 클래스명
var _csrf				= "._csrf";				// CSRF값 객체 앨리먼트
var editor			   	 = [];
var oEditors1            = [];
var oEditors2            = [];
var oEditors3            = [];
var oEditors4            = [];
var oEditors5            = [];
//var oEditors			= [];

// ========================================================
// ▶ 페이지 로드 이벤트
// ====================================================/**/
$(document).ready(function() {
	if($(_csrf).length > 0) _csrf = $(_csrf)[0].value; else _csrf = "";
	
	// onpopstate 이벤트 추가
	window.onpopstate = function () {
		anchorProc("back", document.title, window.location.href);
		if(typeof(bizProc) === "function") bizProc();
	};
	
	BindCntBodyEvent();
	if(typeof(bizProc) === "function") bizProc();
});

// 비동기 처리시 컨텐츠 바디에 이벤트 생성
function BindCntBodyEvent()
{
	// 파일 업로드 이밴트 생성
	$("[type=file]").fileLoader();
	$("[type=file]").click(function() {
		var chkList = $(".ctnsChannel[data-device="+this.dataset.device+"]");
		
		if($("#fileBox_"+ this.dataset.device).children().length > 0 && this.dataset.multi != "true") {
			alert("등록된 이미지가 있습니다.\n다시 등록하려면 업로드된 파일을 삭제해주세요.");
			return false;
		}
		else if(chkList.length != 0) {
			var checked = false;
			
			for(var i=0; i<chkList.length; i++)
				if(chkList[i].checked) checked = true;
			
			if(!checked) {
				alert("업로드 대상 장치 채널이 비활성 되어 있습니다.");
				return false;
			}
		}
	});
	$(".fileBox, #dimLayer").on("click", "button", function() {
		if($("#delFileSeq"+this.dataset.fileSeq).length > 0)
			if(confirm("삭제 하시겠습니까?"))
				restCall(null, this.dataset.submitUrl, fileDelete);
		return false;
	});
	
	// DIM 레이어 연결
	$('.dimLayer').click(function() {
		getData(this, "POST", "html", this.dataset.popupUrl, layerPopup);
		return false;
	});
	
	$(".CallPage, .Search").click(function() {
		if(runFunc(this.dataset.jsPreProc, this, null, true) == false) return false;
		if(typeof(this.dataset.formId) === "undefined" || this.dataset.formId == "") {
			alert("버튼에 formId가 지정되지 않았습니다.");
			return;
		}
		
		if(typeof(this.dataset.submitUrl) !== "undefined" && this.dataset.submitUrl != "")
			$("#"+this.dataset.formId).attr("action", this.dataset.submitUrl);
		
		var fmArr = $("#"+this.dataset.formId).serializeArray();
		var submitUrl = $("#"+this.dataset.formId).attr("action");
		var param = "?";
		
		if(submitUrl.indexOf("?") > 0) param = "&";
		
		for (var i=0; i < fmArr.length; i++) {
			if(param != "?") param += "&";
			param += fmArr[i]["name"] + "=" + fmArr[i]["value"];
		}
		
		if(typeof(this.dataset.dataType) !== "undefined") {
			if(this.dataset.dataType == "excel")
				location.href = submitUrl + param;
		}
		else anchorProc(this, document.title, submitUrl + param);
		return false;
	});
	$(".Create").click(function() {
		anchorProc(null, document.title, $(this).data("submitUrl"));
		return false;
	});
	$(".Delete").click(function() {
		if(confirm("삭제 하시겠습니까?"))
			formProc(this, "Delete");
		return false;
	});
	$(".CallData").click(function() {
		formProc(this);
		return false;
	});
	$(".JsExecute").click(function() {
		runFunc(this.dataset.jsExecute, this, null, true);
		runFunc(this.dataset.jsPreProc, this, null, true);
		runFunc(this.dataset.jsCallback, this, null, true);
		return false;
	});
	
	// 기능 버튼에 이벤트 생성
	$(cntBody + " a").click(function(e) {
		if(this.href != "" && this.href.indexOf("#") == -1)
			anchorProc(null, document.title, this.href);
		e.preventDefault();
		return false;
	});
	
	$("input[name=chkAll]").click(function() {
		if($('input[type=checkbox]').length <= 1)
		{
			alert("선택 가능한 목록이 없습니다.");
			return false;
		}
		else $('input[type=checkbox]').prop('checked', this.checked);
	});
	
	$(".tableList tbody tr").hover(function() {
		$(this).addClass("hover");
	}, function() {
		$(this).removeClass("hover");
	});
	$(".tableList tbody tr").click(function() {
		if(!tmpElMoving)
			$($(this).find("a")[0]).click();
	});
	
	// 테이블에서 객체 이동 이벤트
	var tmpEl = null; tmpElMoving = false;
	$("table.moveOrder tbody tr").each(function() {
		if (typeof(this.onselectstart) !== "undefined")
			this.onselectstart=function() { return false; }
		else if (typeof(this.style.MozUserSelect) !== "undefined")
			this.style.MozUserSelect="none";
		else this.onmousedown = function() { return false; }
	});
	$("table.moveOrder tbody tr").mousedown(function() {
		$(this).addClass("moving");
		tmpEl = this;
	});
	$("table.moveOrder tbody tr").hover(function() {
		if(tmpEl != null)
			tmpElMoving = true;
	});
	$("table.moveOrder tbody tr").mouseup(function() {
		if(tmpEl != null) {
			if($(this).offset().top > $(tmpEl).offset().top)
				$(this).after(tmpEl);
			else $(this).before(tmpEl);
			tmpElMoving = false;
			$(tmpEl).removeClass("moving");
			$('.btnOrder').removeClass("hide");
		}
	});
	
	// INPUT 태그 키 이벤트
	$("input:text").keypress(function(key) {
		if (key.keyCode == 13) {
			var baseProc = true;
			
			if(!chkNull(this.dataset.focusMoveId)) {
				$("#"+this.dataset.focusMoveId).focus();
				baseProc = false;
			}
			
			if(!chkNull(this.dataset.btnClickId)) {
				$("#"+this.dataset.btnClickId).click();
				baseProc = false;
			}
			
			if(baseProc) {
				if($(this).next("a, button").length > 0)
					$(this).next("a, button").click()
				else {
					var el = $("input:text, input:password, textarea").not(":hidden");
					$(el[el.index(this)+1]).focus();
				}
			}
			
			return false;
		}
	});
	
	// 페이지네이션 클릭 이벤트 생성
	$(".pagination li").click(function() {
		var btnSearch = $(".Search");
		var form = $("#"+btnSearch.data("formId"));
		
		if(form.length > 0 && !chkNull(this.dataset.pageNum)) {
			if($("input[name=pageNum]").length == 0)
				form.append("<input type='hidden' id='pageNum' name='pageNum' value='"+this.dataset.pageNum+"' />")
			else $("input[name=pageNum]").val(this.dataset.pageNum);
			btnSearch.click();
		}
		return false;
	});
	
	// 외부 컴포넌트 초기화 - 에디터
	$(".editor").each(function() {
		// CKEditor5
		var ckEditor = null;
		if(typeof(ClassicEditor) !== "undefined") ckEditor = ClassicEditor;
		else if(typeof(InlineEditor) !== "undefined") ckEditor = InlineEditor;
		else if(typeof(BalloonEditor) !== "undefined") ckEditor = BalloonEditor;
		else if(typeof(DecoupledEditor) !== "undefined") ckEditor = DecoupledEditor;
		
		if(ckEditor != null) {
			ckEditor.create(document.querySelector("#"+this.id))
				.then((function(newEditor) { editor[this.id] = newEditor; }).bind(this))
				.catch(function(error) { /* console.error(error); */ });
		}
		
		// CKEditor4
		else if (typeof(CKEDITOR) !== "undefined" && CKEDITOR != null )
			editor[this.id] = CKEDITOR.replace(this.id/*, { filebrowserUploadUrl : "./imageUpload.do" }*/);
		
		//else if (typeof(CKEDITOR) !== "undefined" && CKEDITOR != null )
		
		// 네이버 에디터 초기화
		// nhn.husky.EZCreator.createInIFrame({
		//	oAppRef: oEditors,
		//	elPlaceHolder: this.id,
		//	sSkinURI: "/res/neditor/SmartEditor2Skin.html",
		//	fCreator: "createSEditor2"
		// });
	});
	
	// 외부 컴포넌트 초기화 - 데이트 피커
	if(typeof($().flatpickr) === "function") {
		$(".datePicker").flatpickr({ enableTime: true, dateFormat: "Y-m-d H:i", time_24hr: true, appearence: "bottom"});
		$(".datePickerDate").flatpickr({ dateFormat: "Y-m-d", appearence: "bottom"});
	}
	
	// 비즈 이벤트 초기화
	if(typeof(bizEventInit) === "function")
		bizEventInit();
}

// ========================================================
// ▶ DIM 레이어 스크립트
// ====================================================/**/
function layerPopup(data) {
	//$('.dim-layer .pop-conts').html(data);
	$('.modal-body').html(data);
	
	
	// 콜백 스크립트 함수 설정
	var fn = setCallback(this.dataset.jsCallback);
	var rVal = runFunc(this.dataset.jsPreProc, this);
	if(rVal == null || !rVal) return false;
	
	document.querySelector(".modal-body").style.display = "flex";
	
	$(".modal-body").click(function() {
		//document.querySelector(".modal-body").style.display = 'none';
		//return false;
	});
	
	var pThis = this;
	$(".modal-body").find(".btnExit").click(function() {
		document.querySelector(".modal-body").style.display = "none";
	});
	$(".modal-body").find(".btnClose").click(function() {
		var rVal = true;
		if(typeof fn === "function")
			rVal = fn.apply(pThis);
		
		if(typeof(rVal) === "undefined" || rVal)
			document.querySelector(".modal-body").style.display = "none";
		return false;
	});
	
	var popWidth = "200px";
	if(typeof(this.dataset.width) != "undefined") popWidth = this.dataset.width;
	
	$(".modal-body").find(".modal-box").css({
		width: popWidth
	});
	
	/*
	var popWidth = "200px";
	if(typeof(this.dataset.width) != "undefined") popWidth = this.dataset.width;
	var $el = $("#dimLayer");
	var isDim = $el.prev().hasClass("dimBg");

	isDim ? $(".dim-layer").fadeIn(200) : $el.fadeIn(200);

	var $elWidth = ~~($el.outerWidth()),
		$elHeight = ~~($el.outerHeight()),
		docWidth = $(document).width(),
		docHeight = $(document).height();

	// 화면의 중앙에 레이어를 띄운다.
	if ($elHeight < docHeight || $elWidth < docWidth) {
		$el.css({
			width: popWidth,
			marginTop: -$elHeight/2,
			marginLeft: -$elWidth/2
		})
	} else $el.css({top: 0, left: 0});
	
	var pThis = this;
	$el.find("a.btn-layerClose").click(function(){
		var rVal = true;
		if(typeof fn === "function")
			rVal = fn.apply(pThis);
		
		if(typeof(rVal) === "undefined" || rVal) isDim ? $(".dim-layer").fadeOut(200) : $el.fadeOut(200);
		return false;
	});

	$(".dim-layer .dimBg").click(function() {
		$(".dim-layer").fadeOut();
		return false;
	});
	*/
}

// ========================================================
// ▶ 주요 기능 메소드
// ====================================================/**/
// 디폴트 콜백 스크립트
function callback(data, jsonString)
{
	console.log("default callback run => " + jsonString);
	console.log(data);
}

// 서버에서 보내진 콜백 메시지 후처리
function callbackProc(data, jsonString, fn)
{
	var rVal = null;
	if(typeof(data) === "string" && data.indexOf("Access Denied") != -1) {
		alert("접근할 수 없는 기능입니다.");
		return false;
	}
	
	// 서버 메시지 팝업
	if(typeof(data.alertMsg) !== "undefined") alert(data.alertMsg);
	
	// 지정된 함수 실행
	if(typeof(fn) === "function")
		rVal = fn.apply(this, [data, jsonString]);
	
	// 성공시 확인시 URL 리디랙션
	if(typeof(data.state) !== "undefined" && (data.state == "true" || data.state == true)) {
		if(typeof(this.dataset) !== "undefined" && typeof(this.dataset.completeUrl) !== "undefined" && this.dataset.completeUrl != "")
			anchorProc(null, document.title, this.dataset.completeUrl);
	}
	
	return rVal;
}

// 페이지 비동기 변경 처리
// => POST형식의 html 페이지를 가져와서 cntBody 클래스에 가져온 데이터로 교체
function anchorProc(tObj, title, targetUrl, jsCallback)
{
	// 비동기 페이지가 비활성 상태인 경우
	if(!asyncPage) {
		if(tObj != null && typeof(tObj) === "object" && typeof(tObj.dataset.formId) !== "undefined")
			$('#'+tObj.dataset.formId).submit();
		else if(targetUrl != "")
			location.href = targetUrl;
		return false;
	}
	
	// 폼 데이터 시리얼라이즈
	var obj = ajaxInit();
	if(tObj != null && typeof(tObj) === "object") {
		var fmArr = $('#'+tObj.dataset.formId).serializeArray();
		for (var i=0; i < fmArr.length; i++)
			obj[fmArr[i]['name']] = fmArr[i]['value'];
		tObj = obj;
	}
	
	$.ajax({
		type : "POST",
		url : encodeURI(targetUrl),
		data : obj,
		dataType : "html",
		async :false,
		success : function(data) {
			if(data.indexOf("Access Denied") != -1) {
				alert("접근할 수 없는 기능입니다.");
				return;
			}
			if(data.indexOf(cntBody.replaceAll(".", "")) == -1) {
				if(data.indexOf("pwChangeForm") != -1) {
					alert("세션이 만료됐습니다.\n로그인 페이지로 이동합니다.");
					location.href = "/cjAdminMng/login.do";
				}
				else {
					alert("정상적인 컨텐츠가 아닙니다.");
					location.reload(true);
				}
				return;
			}
			
			$(cntBody).after(data);
			$(cntBody + ":first").remove();
			BindCntBodyEvent();
			
			if(!(typeof(tObj) === "string" && tObj == "back")) {
				history.pushState(tObj, title, targetUrl);
				
				// 비즈니스 로직 시작
				if(typeof bizProc === "function")
					bizProc.apply();
			}
		},
		error : ajaxError,
		complete : ajaxComplete
	});
	
	return false;
}

// FORM 비동기 처리
// => 특정 폼의 데이터를 시리얼라이즈해서 JSON 데이터를 AJAX 통신으로 서버에 전송
function formProc(el, tp) {
	
	// Submit URL 체크
	var submitUrl = "";
	if(typeof(el.dataset.submitUrl) !== "undefined" && el.dataset.submitUrl != "")
		submitUrl = el.dataset.submitUrl;
	else if(typeof(el.dataset.formId) !== "undefined" && el.dataset.formId != "")
		submitUrl = $("#"+el.dataset.formId).attr("action");
	else {
		alert("No Submit URL link.");
		return false;
	}
	
	// 전처리 스크립트 실행
	if(runFunc(el.dataset.jsPreProc, el, [tp], true) == false) return;
	
	// 콜백 스크립트 함수 설정
	var fn = setCallback(el.dataset.jsCallback);
	
	// 에디터 내용을 Textarea에 적용
	{
		//var oEditors = [];
		var elList = $("textarea.editor");
		for(var i=0; i < elList.length; i++) {
			// CK에디터
			CKEDITOR.instances[elList[i].id].updateElement();
			// 네이버 에디터
			//oEditors.getById[elList[i].id].exec("UPDATE_CONTENTS_FIELD", []);
		}
	}
	
	// 벨리데이션 체크
	if(tp != "Delete") {
		var elList = $("#"+el.dataset.formId+" input, #"+el.dataset.formId+" textarea");
		for(var i=0; i < elList.length; i++) {
			if(typeof(elList[i].dataset.verify) !== "undefined")
			{
				var alertMsg = "";
				if(elList[i].dataset.verify != "" && elList[i].value == "")
				{
					if(elList[i].title != "")
						alertMsg = "'" + elList[i].title + "' ";
					else if($("label[for='"+elList[i].id+"']").length > 0)
						alertMsg = "'" + $("label[for='"+elList[i].id+"']").text() + "' ";
					
					if(elList[i].dataset.verify != "str")
						alert(elList[i].dataset.verify);
					else {
						if(alertMsg != '') alert(alertMsg + "항목을 입력해주세요.");
						else alert("입력하지 않은 항목이 있습니다.");
					}
					$(elList[i]).focus();
					return false;
				}
			}
		}
	}
	
	// 폼 데이터 시리얼라이즈
	var obj = ajaxInit();
	var fmArr = $('#'+el.dataset.formId).serializeArray();
	
	for(var i=0; i < fmArr.length; i++)
		obj[fmArr[i]['name']] = fmArr[i]['value'];
	
	// 파라미터 값 추가
	var param = submitUrl.split("?");
	if(param.length > 1) {
		param = param[1].split("&");
		for (var i=0; i < param.length; i++)
			obj[param[i].split("=")[0]] = param[i].split("=")[1];
	}
	
	if(typeof(el.dataset.exInfo) !== "undefined")
		obj['exInfo'] = el.dataset.exInfo;
	
	// 업로드 파일 정보 병합
	var uploadFiles = {uploadFiles : $("[type=file]").fileLoader("getFileObj")||[]}
	for(var i=0; i < uploadFiles.uploadFiles.length; i++) {
		var tmp = uploadFiles.uploadFiles[i].realFileName.split(".");
		if(tmp.length > 0) {
			var exName = tmp[tmp.length-1].toLowerCase();
			if(!(exName == "jpg" || exName == "jpeg" || exName == "png" || exName == "gif" || exName == "pdf" ||
					exName == "xls" || exName == "xlsx" || exName == "ppt" || exName == "pptx" || exName == "doc" || exName == "docx")) {
				alert("업로드가 제한된 파일이 있습니다.");
				return false;
			}
		}
	}
	$.extend(true, obj, uploadFiles);
	
	// 데이터 통신
	$.ajax({
		headers: {'X-CSRF-TOKEN': _csrf},
		type: "POST",
		url: encodeURI(submitUrl),
		data: JSON.stringify(obj),
		dataType: "json",
		contentType : "application/json; charset=UTF-8",
		async: false,
		success: function(data) {
			if(data.alertMsg == undefined){
				cbCorrChangeHis(data);
			}
			window["callbackProc"].apply(el, [data, JSON.stringify(data), fn]);
		},
		error : ajaxError,
		complete : ajaxComplete
	});
}

// ========================================================
// ▶ 단독 기능 메소드
// ====================================================/**/
// URL 정보만으로 JSON 파라미터를 생성하고 서버에서 JSON 데이터를 가져옴
function restCall(param, url, jsCallback) {
	
	// URL 없음 알림
	if(url == "") {
		alert("No URL.");
		return false;
	}
	
	// 콜백 스크립트 함수 설정
	var fn = setCallback(jsCallback);
	
	// 파라미터 초기화
	var obj = ajaxInit(param);
	
	// 파라미터 값 추가
	var tmp = url.split("?");
	if(tmp.length > 1) {
		param = tmp[1].split("&");
		for(var i=0; i < param.length; i++)
			obj[param[i].split("=")[0]] = param[i].split("=")[1];
	}
	
	// 데이터 통신
	$.ajax({
		headers: {'X-CSRF-TOKEN': _csrf},
		type: "POST",
		url: encodeURI(url),
		data: JSON.stringify(obj),
		dataType: "json",
		contentType : "application/json; charset=UTF-8",
		async: false,
		success: function(data) {
			window["callbackProc"].apply(fn, [data, JSON.stringify(data), fn]);
		},
		error : ajaxError,
		complete : ajaxComplete
	});
}

// POST/GET, json/html, URL, jsCallback의 옵션으로 순수하게 데이터만 가져오는 범용 AJAX 처리
function getData(el, callType, dataType, targetUrl, jsCallback) {
	// URL 없음 알림
	if(targetUrl == "") {
		alert("No URL.");
		return false;
	}
	
	// 콜백 스크립트 함수 설정
	var fn = setCallback(jsCallback);
	
	// 파라미터 값 추가
	var obj = ajaxInit();
	var param = null;
	if(callType.toUpperCase() == "POST") {
		var tmp = targetUrl.split("?");
		if(tmp.length > 1)
			param = tmp[1].split("&");
	}
	if(param != null) {
		if(typeof(param.length) != "undefined")
			for(var i=0; i < param.length; i++) {
				obj[param[i].split("=")[0]] = param[i].split("=")[1];
				obj = JSON.stringify(obj);
			}
		else obj = ajaxInit(param);
	}
	
	$.ajax({
		headers: {'X-CSRF-TOKEN': _csrf},
		type : callType,
		url : encodeURI(targetUrl),
		data : obj,
		dataType : dataType,
		async :false,
		success : function(data) {
			window["callbackProc"].apply(el, [data, JSON.stringify(data), fn]);
		},
		error : ajaxError,
		complete : ajaxComplete
	});
	
	return false;
}

function makeFileTxt(fileName, conts) {
	
	if(isIE()) {
		var blob = new Blob([conts], { type: "text/plain", endings: "native" });
		window.navigator.msSaveBlob(blob, fileName);
	} else {
		var blob = new Blob([conts], { type: 'text/plain' });
		objURL = window.URL.createObjectURL(blob);
		
		// 메모리 해제
		if (window.__Xr_objURL_forCreatingFile__) {
			window.URL.revokeObjectURL(window.__Xr_objURL_forCreatingFile__);
		}
		window.__Xr_objURL_forCreatingFile__ = objURL;
		var a = document.createElement('a');
		a.download = fileName;
		a.href = objURL;
		a.click();
	}
}

// ========================================================
// ▶ 기능 보조 메소드
// ====================================================/**/
function isIE() {
	return (navigator.appName === 'Netscape' && navigator.userAgent.search('Trident') !== -1) ||
		navigator.userAgent.toLowerCase().indexOf("msie") !== -1;
}

function setCallback(jsCallback) {
	var fn = null;
	if(typeof(jsCallback) === "string")
		fn = window[jsCallback];
	else if(typeof(jsCallback) === "function")
		fn = jsCallback;
	else fn = window["callback"];
	return fn;
}

function chkNull(target) {
	if(typeof(target) !== "undefined" && target != "")
		return false;
	return true;
}

function runFunc(callName, el, param, alertPass) {
	var rVal = null;
	if(chkNull(callName)) {
		if(typeof(alertPass) !== "undefined" && alertPass == true)
			return rVal;
		else alert("요청할 스크립트 이름이 없습니다.");
	}
	else if(typeof(window[callName]) !== "undefined") {
		try {
			rVal = window[callName].apply(el, param);
			if(typeof(rVal) === "undefined") rVal = true;
		} catch (e) {
			console.log(e);
			alert("요청된 '" + callName +"' 스크립트에서 에러가 발생했습니다.");
		}
	}
	else alert("요청한 '" + callName +"' 스크립트가 없습니다.");
	
	return rVal;
}

function ajaxInit(param) {
	var obj = {};
	if(param != null && typeof(param) === "object") obj = param;
	if(_csrf != "")
		obj['_csrf'] = _csrf;
		
	if($(loadingBox).length > 0)
		$(loadingBox).removeClass(loadingBoxActive);
	
	return obj;
}

function ajaxError(request, status, error)
{
	console.log(status + " / " + error);
	if(request.status == 403) {
		alert('토큰 시간이 만료되었습니다. 페이지를 다시 로드합니다.');
		location.reload(true);
	}
	else alert('네트워크 연결을 실패했습니다.');
}
function ajaxComplete() {
	if($(loadingBox).length > 0)
		$(loadingBox).addClass(loadingBoxActive);
}

function getParam(t) {
	var params = location.search.substr(location.search.indexOf("?") + 1);
	var rv = "";
	params = params.split("&");

	for (var i=0; i<params.length; i++) {
		temp = params[i].split("=");
		if (temp[0] == t) { rv = temp[1]; }
	}
	return rv;
}


// ========================================================
// ▶ 파일 관련
// ====================================================/**/
function findFileInfo(fiList, fileSeq) {
	if(fiList != null) {
		for(var i=0; i < fiList.length; i++) {
			if(fiList[i].fileSeq == fileSeq)
				return fiList[i];
		}
	}
}

function fileDelete(obj) {
	if(obj.state) {
		$(".topBannerImg, .partBannerImg").each(function() {
			if(this.value == obj.fileSeq)
				this.value = "";
		});
		$("#delFileSeq"+obj.fileSeq).parent().empty();
		$(".delFileSeq"+obj.fileSeq).parent().empty();
	}
}

function ppUserMessage() {
	var msg = prompt("                     다운로드 사유                     ");
	if(msg != null) {
		$("#msgUser").attr("value", msg);
		return true;
	} else return false;
}

(function($) {
	//파일 업로드
	$.fn.fileLoader = function(action) {
		var options ={defaultFileObj:null
				, addFileObj:null
			};
		
		if(typeof action === "object") {
			options = $.extend(true, options, action);
		}
		
		if(action == "getFileObj") {
			var values = $.map(this, function(o){ if(o._fileData) return o._fileData;});
			return values.length?values:null;
		}
		
		return this.each(function() {
			var reader = new FileReader(), target=this;
			
			reader.onload = function() {
				target._fileData = {}
				$.extend(target._fileData, target.dataset);
				$.extend(target._fileData,{
					fileDataBase64:reader.result.replace(/.+,/,"")
					, fileSeq:null, fileOrder:target.dataset.fileOrder, realFileName:target.files[0].name
					, fileName:null, filePath:null, banner:null
					, contentType:target.files[0].type, fileSize:target.files[0].size
				});
				
				if(options.addFileObj != null) {
					if(_.isFunction(options.addFileObj)) {
						$.extend(target._fileData, options.addFileObj.call(target));
					} else {
						$.extend(target._fileData, options.addFileObj);
					}
				}
			}
			
			$(this).off("change").on("change", function() {
				if(this.files.length) reader.readAsDataURL(this.files[0])
			});
		})
	}
}(jQuery));