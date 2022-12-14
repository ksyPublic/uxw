var bizData = null;
$(document).ready(function() {	
	creEditor(0);
	//$("input[type=checkbox]").prop("checked", false);

	document.getElementById('file').onchange = function(){
	  let file = this.files[0];
	  let reader = new FileReader();
	  	console.log(file.name.split('.')[file.name.split('.').length-1]);
	  	if(file.name.split('.')[file.name.split('.').length-1] === "txt"){
		 	reader.onload = function(progressEvent){
			oEditors.getById["ir1"].exec("SET_IR", [""]);
			oEditors.getById["ir1"].exec("SET_IR",[this.result.replaceAll("\n", "</p><p>")]);			  
	  		};
			reader.readAsText(file, "UTF-8");		
		}else if(file.name.split('.')[file.name.split('.').length-1] === "docx"){
			const docx2html=require("docx2html");
			docx2html(file)
				.then(html=>{
					oEditors.getById["ir1"].exec("SET_IR", [""]);
					oEditors.getById["ir1"].exec("SET_IR",[document.getElementById("A").section.innerHTML.replaceAll("\n", "</p><p>").replaceAll(`<p class=" a"></p>`, "<p><br></p>")]);	
					document.getElementById("A").remove();
				})			
		}
		let paranetFrame = document.getElementsByTagName("iframe");
		let childFrame = paranetFrame[0].contentDocument || paranetFrame[0].contentWindow.document;
		let childFrameIn = childFrame.getElementsByTagName("iframe")[0].contentDocument || childFrame.getElementsByTagName("iframe")[0].contentWindow.document;
		setTimeout( () => childFrameIn.getElementById("validation").click(),100);
	};
	
	var urlInfo = location.href.split('/');
	if($(".navLinks").length > 0) {
		$(".navLinks[data-country=" + urlInfo[4] + "]").addClass("active");
		$("#"+urlInfo[4]).addClass("active");
	}
	
	$(".navLinks").click(function() {
		$(".navSubGroup, .navLinks").each(function() {
			$(this).removeClass("active");
		});
		
		$(this).addClass("active");
		$("#"+this.dataset.country).addClass("active");
		$("#"+this.dataset.country).find("a")[0].click();
		
		return false;
	});
	
	$(".goAdminPage").click(function() {
		
		restCall(null, "/ssoToken.do", function(data) {
			location.href = data.serviceUrl + "?token=" + data.ssoToken;
		});
		return false;
	});
	
	// ?????? ?????? ?????? ?????????
	$("#boardGuideSelect").change(function() {
		guideActive();
		return false;
	}); guideActive();
	
	$("#boardExampleSelect").change(function() {
		exampleActive();
		return false;
	}); exampleActive();
	
	$(".navSubManu li").mouseover(function() {
		$(this).addClass("hv");
	}).mouseleave(function() {
		$(this).removeClass("hv");
	}).click(function() {
		$(".navSubManu li").each(function() {
			$(this).removeClass("atv");
		});
		
		$(this).addClass("atv");
		anchorProc(null, this.innerText, this.firstChild.href);
		return false;
	});
	
	$(".confirmUserChange .confirmDivision").change(function() {
		restCall(null, "/search/getUserList.do?userDivision="+$(this).find("option:selected").val(), cbSetConfirmUser);
	});
	
	$("input[name=wordTp], input[name=firstInitial]").click(function() {
		//if($("#vernacular_searchWord").val() != "")
			$("#btnVernacular").click();
	});
});

function bizProc()
{
	var url = location.href.split("?")[0].split(location.host)[1];
	var param = "";
	if(location.href.split("?").length > 1)
		param = location.href.split("?")[1].split("&");
	else param = location.href;
	
	procProxy(url, param);
}

function procProxy(url, param)
{
	switch(url) {
	case "/main.do":
		userMain(); break;
	case "/correction/corrChecker.do":
		corrChecker(); break;
	default:
		//console.log("nothing");
	}
}

function userMain() {
	$(".dfMainCorrCtgr").click(function(){
		$("#mainCorrCtgrSrvId").val($(this).data("ctgrSrvId"));
		$(".mainCorrCtgr").text($(this).text());
		$(".mainCorrCtgr").click();
	});
	$(".mainCorrCtgr").text($($(".dfMainCorrCtgr")[0]).text());
	$("#mainCorrCtgrSrvId").val($($(".dfMainCorrCtgr")[0]).data("ctgrSrvId"));
}

function corrChecker() {
	if($("#mainContents").val() == "1")
		$("#corrProc").click();
}

// ========================================================
// ??? ????????? ?????? ??????
// ====================================================/**/
function guideActive() {
	$(".boardGuide").addClass("hide");
	$(".boardGuide.Post_"+$("#boardGuideSelect option:selected").val()).removeClass("hide");
}
function exampleActive() {
	$(".boardExample").addClass("hide");
	$(".boardExample.Post_"+$("#boardExampleSelect option:selected").val()).removeClass("hide");
}

// ========================================================
// ??? ??????????????? ?????? ??????
// ====================================================/**/
function ppLoginCheck() {
	var obj = {};
	obj["userId"] = $("#userId")[0].value;
	obj["userPw"] = $("#userPw")[0].value;
	restCall(obj, this.dataset.submitUrl, cbLoginCheck);
	return false;
}

function cbLoginCheck(data) {
	if(data.state == "true") location.href = data.serviceUrl;
	else if(data.state == "pwChange")
		activeModal('#md-password');
}

// ========================================================
// ??? ?????? ?????????
// ====================================================/**/
function cbVernacular(data) {
	var tDiv = ".WordVernacularContents";
	if(data.tp == "GD") tDiv = ".VernacularContents";
	
	$(tDiv).empty();
	VernacularItem(data, data.vwList, tDiv);
	
	if(data.tp == "GDW") cbLnbCategory(data);
	
	$(".popupDicWord").click(function() {
			var tEl = $("#lnb1");
			$("#vernacular_searchWord").val($("#wordVernacular_searchWord").val());
			
			if($("#vernacular_searchWord").val() != "")
				$("#btnVernacular").click();
				
			tEl.addClass("active");
	});
	$(".hideContsView").click(function() {
		$(".hideConts").removeClass("hide");
		$(this).remove();
	});
	
	$(".lnb-content-pop [data-pop-close]").click(function() {
		$(".lnb-content-pop").removeClass("active");
	});
	$(".btnLnbOpinionWord").click(function() {
		$(".btnOpinionWord")[0].click();
	});
	$(".btnLnbOpinionSend").click(function() {
		$("#nav-pop1 #dfos_title").val(this.dataset.adviseWord);
		$("#nav-pop1").addClass("active");
		$(".ly-pop-dim").first().addClass("active");
	});
}

function VernacularItem(data, list, tDiv) {
	var html = "";
	var hideConts = "";
	var error = "<div class=\"box-noti\"><p>????????? ???????????? ????????????.<br>?????? ?????? ?????? ??????????????????!</p></div>";
	var empty = "<div class=\"box-noti\"><p>?????? ????????? ?????????.<br>???????????? ?????? ????????? ??????????????????!</p><div class=\"btn-area btnLnbOpinionWord\"><a href=\"#\" class=\"btn-type1 grey\" >?????? ????????????</a></div></div>";
	var more = "<div class=\"btn-area center\"><a href=\"#\" class=\"btn-type2\">??? ??????</a></div>";
	var dicMore = "<div class=\"btn-area vert-line center hideContsView\"><a href=\"#\" class=\"btn-type1 white arrow\">????????????</a></div>";
	var btnDicPopup = "<div class=\"btn-area right hideConts hide\"><a href=\"#\" class=\"btn-type1 white popupDicWord\">???????????? ?????? ????????????</a></div>";
	
	if(list.length > 0) {
		if(data.tp == "GD") {
			var cnt = "<div class=\"section-title type1\"><strong>"+data.pagingSet.allRowCnt+"</strong><span>???</span></div>";
			$(tDiv).append(cnt);
		}
		else if(data.tp == "GDR") {
			var btnDicCount = "<div class=\"box-type2\"><a href=\"#none\" class=\"btn-type1 white popupDicWord\">???????????? ?????? ????????????</a><p><span class=\"blue\">"+data.cnt.allRowCnt+"</span>?????? ??????????????? ????????????????????????.</p></div>";
			$(tDiv).append(btnDicCount);
			$(tDiv).append("<strong class=\"sure\">?????? ????????? ?????? ??? ???????????? ???????????????!</strong>");
		}
		
		for(var i=0; i < list.length; i++)
		{
			if(data.tp == "GDW") {
				if(i==1) $(tDiv).append(dicMore);
				if(i>=1) hideConts = " hideConts hide";
				if(i>=4) {
					$(tDiv).append(btnDicPopup);
					break;
				}
			}
			
			if(list[i].wordTp=="VW") list[i].wordTp = "????????????";
			if(list[i].wordTp=="NW") list[i].wordTp = "????????????";
			if(list[i].wordTp=="FL") list[i].wordTp = "?????????,?????????";
			
			html = "";
			html += "<div class=\"box-type3"+hideConts+"\">";
			html += "	<p class=\"title\">";
			html += "		<span class=\"icon-type2\">"+list[i].wordTp+"</span>";
			html += "		<span class=\"blue hover\">"+list[i].adviseWord+" <a href=\"#\" class=\"btnLnbOpinionSend\" title=\"???????????? ?????????\" data-ly-pop-trigger=\"nav-pop1\" data-advise-word=\""+list[i].adviseWord+"\">???????????? ?????????</a></span>";
			html += "	</p>";
			
			if(list[i].exampleAfter != null && list[i].exampleAfter != "")
				html += "	<p>"+setHighlight(list[i].exampleAfter, list[i].adviseWord, "highlight")+"</p>";
			else html += "	<p>????????? ????????????.</p>";
			
			html += "	<dl class=\"dl-type2\"><dt>????????????</dt><dd>"+setHighlight(list[i].recommended.replaceAll("|", ", "), data.searchWord, "highlight error")+"</dd></dl>";
			html += "	<dl class=\"dl-type2\"><dt>????????????</dt><dd>"+setHighlight(list[i].existing.replaceAll("|", ", "), data.searchWord, "highlight error")+"</dd></dl>";
			html += "	<dl class=\"dl-type2\"><dt>????????????</dt><dd>"+list[i].reason+"</dd></dl>";
			html += "</div>";
			
			$(tDiv).append(html);
		}
	} else $(tDiv).append(empty);
}

function setHighlight(orgText, tgWord, className) {
	return orgText.replaceAll(tgWord, "<span class=\""+className+"\">"+tgWord+"</span>");
}

// ========================================================
// ??? ????????? ??????
// ====================================================/**/
var corrData = [];
function ppMainCorrSubmit() {
	if($("#dfMainCorrSubmit #contents").val() == "") {
		alert("????????? ????????? ????????????.");
		return false;
	}
}
function cbMainCorrSubmit() {
	alert("test call");
}

function ppCorrProc() {
	paramList = [];
	param = {
		"postSeq" : "",
		"confirmCd" : "",
		"confirmId" : "",
		"mainContents" : "",
		"contents" : ""
	}

	oEditors.forEach((v,i) => {
		if (V != null) {
			param.contents = v.getIR().replaceAll("</p>", "\n").replaceAll("&nbsp;", " ").replace(/<[^>]+>/g, '');
			paramList[i] = param;
		} else {
			alert("???????????? ????????? ?????? ????????? ????????? ????????????.");
			return false;
		}
	})
	
	restCall(paramList,"/correction/corrSubmit.do",cbCorrProc);
	
	
//	if(oEditors.getById["ir1"] != null) $("#contents").val(oEditors.getById["ir1"].getIR().replaceAll("</p>", "\n").replaceAll("&nbsp;", " ").replace(/<[^>]+>/g, ''));
//	else alert("???????????? ????????? ?????? ????????? ????????? ????????????.");
}

function cbCorrProcCallBack() {	
	let paranetFrame = document.getElementsByTagName("iframe");
	let childFrame = paranetFrame[0].contentDocument || paranetFrame[0].contentWindow.document;
	let childFrameIn = childFrame.getElementsByTagName("iframe")[0].contentDocument || childFrame.getElementsByTagName("iframe")[0].contentWindow.document;	
	if(!childFrameIn.getElementById("focusBtn")) childFrameIn.head.innerHTML = childFrameIn.head.innerHTML + `<input type="hidden" id="focusBtn" onclick="setFocus()">`;
	let focusBtn = childFrameIn.getElementById("focusBtn");
	focusBtn.click();
}

function cbCorrProc(data) {
	$('.ly-content')[0].style.overflowX = 'auto';
	$('.ly-content-left')[0].classList.add('active');
	$('.ly-content-right')[0].classList.add('active');
	
	
	var selectAll = "<div class=\"btn-area right\"><label class=\"ui-form\"><input type=\"checkbox\" class=\"corrChkAll\"><span>????????????</span></label></div>";
	var changeWord = "<div class=\"btn-area center CorrChange active \"><a href=\"#none\" class=\"btn-type1 grey\">?????? ?????? ?????????</a></div>";
	var noData = "<div class=\"box-noti\"><p>?????? ????????? ????????? ?????????.<br>?????? ???????????? ?????? ??????????????????!</p></div>";
	
	$(".corrChangeList").empty();
	data.forEach((v,index,array) => {
		corrData[index] = v;
		var html = "";
		var items = v.correctionTermList
		if(items != null && items.length != 0) {
			console.log(i)
			if (document.querySelector(".corrChangeList").childNodes.length == 0) {
				$(".corrChangeList").append(selectAll);
			}
			
			var endPos = 0;
			
			for(var i=0; i < items.length; i++) {
				if(endPos <= items[i].startPos)
				{
							html = "";
							html += "<div class=\"box-type8 corrWord\">";
							html += "	<div>";
							html += "		<label class=\"ui-form\">";
							html += "			<input type=\"checkbox\" class=\"corrIdx\" value=\""+i+"\" data-corr-idx=\"" + i + "\" data-edit-idx=\"" + index + "\" data-recom-idx=\"\"/>";
							html += "			<span class=\"orgWord\">"+items[i].originalText+"</span>";
							html += "		</label>";
							
					if(items[i].recommandText != null && items[i].recommandText.length > 0) {
							html += "		<div class=\"tooltip type4 toggle\">";
							html += "			<a href=\"#none\" class=\"changeWord changeWord_"+i+"\" data-recom-idx=\"\">"+items[i].correctionText+"</a>";
							html += "			<div class=\"tooltip-wrap\">";
							html += "				<div class=\"tooltip-content\">";
							html += "					<ul>";
						
						for(var j=0; j < items[i].recommandText.length; j++)
							html += "						<li><a href=\"#\" class=\"recomWord\" data-corr-idx=\""+i+"\" data-edit-idx=\"" + index + "\" data-target=\"changeWord_"+i+"\" data-recom-idx=\""+j+"\">"+items[i].recommandText[j]+"</a></li>";
							
							html += "					</ul>";
							html += "				</div>";
							html += "			</div>";
							html += "		</div>";
					} else {
							html += "		<div class=\"changeWord\">"+items[i].correctionText+"</div>";
					}
							html += "	</div>";
					
					if(items[i].reaseon != null && items[i].reaseon != "") { 
							html += "	<div>"+items[i].reaseon+"</div>";
					}
							html += "</div>";
					
					$(".corrChangeList").append(html);
				}
				endPos = items[i].endPos;
			}
			
			if (document.querySelector(".corrChangeList").childNodes.length != 0 && index == array.length - 1 ) {
				$(".corrChangeList").append(changeWord);
				tooltip();
				
				$(".corrChkAll").click(function() {
					$('.corrWord input[type=checkbox]').prop('checked', this.checked);
				});
				$(".recomWord").click(function() {
					var corrIdx = $(this).data("corrIdx");
					var editIdx = $(this).data("editIdx");
					
					
					corrData[editIdx].correctionTermList[corrIdx].recomIdx = $(this).data("recomIdx");
					//$("."+$(this).data("setIdx")).data("recomIdx", $(this).data("recomIdx"));
					
					var tEl = $("."+$(this).data("target"));
					//tEl.data("recomIdx", $(this).data("recomIdx"));
					tEl.text($(this).text());
					tEl.click();
				});
				
				$(".CorrChange").click(function() {
					cbCorrChange();
				});
				
				$(".corrIdx").off().on("click",function(){
				    if(!$(this).prop("checked")) {
				        rollbackWord(this)
				    }
				});
				
				
			}
			
			
			
			$(document).ready(function() {
				/*editor["contents_editor"].setData(replaceWord(corrData, true));*/
				corrData.forEach((v,i) => {
					oEditors[i].exec("SET_IR", [""]);
					oEditors[i].exec("SET_IR",[replaceWord(v, true)]);
				})
			});
		} else {
			return true;
		}
	})
	
	if (document.querySelector(".corrChangeList").childNodes.length == 0) {
		corrData = null;
		$(".corrChangeList").append(noData);
	}
	setTimeout( () => cbCorrProcCallBack(),100);
}

function cbCorrChange() {
	//console.log($(".corrIdx:checked"));
//	$.each(corrData, function(i, v) {
//		$.each(v.correctionTermList, function(j, e) {
//			e.recomIdx = "";
//			if(corrUserSet.filter(".corrIdx_" + j + ".editIdx_" + i).length > 0) {
//				e.selected = true;
//				e.recomIdx = corrUserSet.filter(".corrIdx_" + j + ".editIdx_" + i).data("recomIdx");
//			} else e.selected = false;
//		})
//		
//		oEditors.getById["ir" + i].exec("SET_IR", [""]);
//		oEditors.getById["ir" + i].exec("SET_IR", [replaceWord(v, true)]);
//	});
	
	var corrUserSet = $(".corrIdx:checked");
	
	var set = new Set();
	
	$.each(corrUserSet, function(i, v) {
		var corrIdx = $(v).data("corrIdx");
		var editIdx = $(v).data("editIdx");
		
		corrData[editIdx].correctionTermList[corrIdx].selected = true;
		//corrData[editIdx].correctionTermList[corrIdx].recomIdx = $(v).data("recomIdx");
		
		set.add(editIdx);
	})
	
	set.forEach(editIdx => {
		oEditors[editIdx].exec("SET_IR", [""]);
		oEditors[editIdx].exec("SET_IR", [replaceWord(corrData[editIdx], true)]);
	})
	
	// 2022_08_16_?????? history ?????? ?????? ????????? ??????
	cbCorrChangeHis();
}

// 2022_08_16_?????? history ?????? ?????? ????????? ??????
function cbCorrChangeHis(dto) {
	//console.log("corrData!!",corrData);
	console.log('???????????????!!!!!',dto);
	if(dto != undefined){
		var postSeq = dto.postSeq;
	}
	/*
		corrData ?????? selected??? true??? ???????????? ??????&???????????? ??????
		?????? ????????? ????????? ??? ?????? ?????? ?????? ???????????? List ????????? data??? ???????????? ??????
	*/
	var corrWordList = new Array();
	for(var k=0; k<corrData.length; k++){
		$.each(corrData[k].correctionTermList, function(i, e) {
			if(e.selected == true){
				var data = {
					beforeCor : e.originalText,
					afterCor : e.correctionText,
					adminSt : true,
					regId : 'inno',
					startPos : e.startPos,
					endPos : e.endPos,
					editorNb : k,
					postSeq : postSeq != undefined? postSeq : 151,
					beforePlusAfter : e.originalText + e.correctionText
				}
				corrWordList.push(data);
			}
		});
	}
	
	console.log("corrWordList!!!",corrWordList);
	if(corrWordList.length > 0 && postSeq != undefined){
		restCall(corrWordList,'/correction/corrTest.do',null);
	}
}

function rollbackWord(e) {
	var editIdx = $(e).data('editIdx');
	var corrIdx = $(e).data('corrIdx');
	
	corrData[editIdx].correctionTermList[corrIdx].selected = false;
	
	$(e).prop("checked",false);
	
	oEditors[editIdx].exec("SET_IR", [""]);
	oEditors[editIdx].exec("SET_IR", [replaceWord(corrData[editIdx], true)]);
}

function replaceWord(corrData, highlight) {
	
	var currentPos = 0;
	var resultText = "";
	var orgText = corrData.originalText;
	
	$.each(corrData.correctionTermList, function(i, e) {
		if(currentPos <= e.startPos) {
			resultText += orgText.substring(currentPos, e.startPos);
			
			if(e.selected) {
				if(highlight == true) resultText += "<mark class=\"marker-yellow\">";
				if(e.recomIdx != null) resultText += e.recommandText[e.recomIdx];
				else resultText += e.correctionText;
				if(highlight == true) resultText += "</mark>";
			}
			else if(highlight == true) {
				resultText += "<mark class=\"marker-pink\" style='background-color: #ffd9e3'>";
				resultText += e.originalText;
				resultText += "</mark>";
			}
			
			currentPos = e.endPos;
		}
	});
	resultText += orgText.substring(currentPos);
	
	if(highlight == true) {
		resultText = "<p>" + resultText.replaceAll("\n", "</p><p>") + "</p>";
	}
	return resultText;
}

function ppCorrCheck() {
	if(corrData == null) {
		alert("????????? ????????? ????????????.");
		return false;
	}
	else return true;
}

function ppCorrSave() {
	if(ppCorrCheck()) {
		$("#contents").val("<p>" + $("#contents").val().replaceAll("\n", "</p><p>") + "</p>");
	}
}
function ppCorrReqPopup() {
	if(ppCorrCheck()) {
		$(".ly-pop-dim").addClass("active");
		$("#pop1").addClass("active");
	}
}
function ppCorrReqSubmit() {
	var confirmId = $(".confirmUserChange .confirmUser option:selected").val();
	if(confirmId == null || confirmId == "") {
		alert("???????????? ??????????????????.");
		return false;
	}
	$("#confirmCd").val("CW");
	$("#confirmId").val(confirmId);
	$(".confirmUserChange .pop-close")[0].click();
	$("#btnCorrSubmit").click();
}

function cbCorrSubmit(data) {
	$(".ly-pop-dim").addClass("active");
	$("#pop2").addClass("active");
}

function ppCorrReset() {
	if(ppCorrCheck()) {
		$("#contents").val(corrData.originalText);
		/*editor["contents_editor"].setData("<p>" + corrData.originalText.replaceAll("\n", "</p><p>") + "</p>");*/
		oEditors.getById["ir1"].exec("SET_IR", [""]);
		oEditors.getById["ir1"].exec("SET_IR", ["<p>" + corrData.originalText.replaceAll("\n", "</p><p>") + "</p>"]);
	}
	
	$('.ly-content')[0].style.overflowX = 'hidden';
	$('.ly-content-left')[0].classList.remove('active');
	$('.ly-content-right')[0].classList.remove('active');
}

function ppCorrComplete() {
	if(corrData == null) alert("????????? ????????? ????????????.");
	
	$('.ly-content')[0].style.overflowX = 'hidden';
	$('.ly-content-left')[0].classList.remove('active');
	$('.ly-content-right')[0].classList.remove('active');
}

function ppOpinionWord() {
	if($("#dfOpinionWord #dfow_title").val() == "") {
		alert("????????? ????????? ??????????????????.");
		return false;
	}
	if($("#dfOpinionWord #dfow_contents").val() == "") {
		alert("????????? ????????? ????????? ??????????????????.");
		return false;
	}
}
function cbOpinionWord(data) {
	$(".popupOpinionWord").removeClass("active");
	$(".ly-pop-dim").removeClass("active");
	$(".popupOpinionWord input").val("");
	$(".popupOpinionWord textarea").val("");
}

function ppOpinionSend() {
	if($("#dfOpinionSend #dfos_contents").val() == "") {
		alert("????????? ??????????????????.");
		return false;
	}
}
function cbOpinionSend(data) {
	$(".popupOpinionSend").removeClass("active");
	$(".ly-pop-dim").removeClass("active");
	$(".popupOpinionSend input").val("");
	$(".popupOpinionSend textarea").val("");
}

function ppConfirmSubmit() {
	$('#confirmCd')[0].value = this.dataset.confirmCd;
}
function cbConfirmSubmit(data) {
}

function ppSetLnbSearch() {
	if(!$(this).hasClass("active")) {
		restCall(null, "/search/getDicRand.do", cbVernacular);
	}
}
function ppSetLnbCategory() {
	if(!$(this).hasClass("active")) {
		restCall(null, "/setService.do", cbSetLnbCategory);
		$('#myConts').prop("checked",false);
		restCall({"searchWord" : ""}, "/search/getConts.do", cbLnbCategory);
	}
}
function cbSetLnbCategory(data) {
	$(".lnbCategory").empty();
	$(".lnbCategory").append("<option value=\"\">??????</option>");
	
	var group = data.codeTree.childCodeList;
	for(var i=0; i < group.length; i++) {
		for(var j=0; j < group[i].childCodeList.length; j++) {
			$(".lnbCategory").append("<option value=\""+group[i].childCodeList[j].codeNo+"\">"
				+group[i].name+" &gt; "+group[i].childCodeList[j].name+"</option>");
		}
	}
}
function cbLnbCategory(data) {
	var tDiv = ".lnbPostConts";
	if(data.tp == "GDW") tDiv = ".WordVernacularContents"; 
	var moreConts = data.pageNum != undefined;
	var pageNum = moreConts ? data.pageNum : null;
	var contsEmpty = "<div class=\"box-noti\"><p>???! ??? ????????? ????????? ???????????? ?????????.</p></div>";
	var contsError = "<div class=\"box-noti\"><p>????????? ???????????? ????????????.<br>?????? ?????? ?????? ??????????????????!</p></div>";
	var contsMore = "<div id=\"getMoreContsBtn\" class=\"btn-area center\"><a onclick=\"getMoreConts();\" class=\"btn-type2\">??? ??????</a></div>";
	var contsWord = "<p class=\"section-title\"><a href=\"#\">??? ????????? ????????? ?????????</a></p>";
	
	if(data.tp == "GC" && !moreConts) $(tDiv).empty();
	else if(data.tp == "GDW") $(tDiv).append(contsWord);
	
	var html = "";
	var postList = data.postList;
	
	if(postList.length == 0)
		$(tDiv).append(contsEmpty);
	else {
		html += "<div class=\"section-info\">";
		html += "	<div>";
		html += "		<strong>"+data.count+"</strong><span>???</span>";
		html += "	</div>";
		html += "	<div>";
		html += "		<span class=\"ui-toggle type2\">";
		html += "			<label>";
		html += "				<input id=\"myContsBtn\" data-search-word=\"" + data.searchWord + "\" data-page-num=\"" + pageNum + "\" type=\"checkbox\" name=\"myConts\">";
		html += "					<span>??? ???????????? ??????</span>";
		html += "			</label>";
		html += "		</span>";
		html += "	</div>";
		html += "</div>";
		
		if(moreConts) {
			html = "";
			tDiv = $('.lnbPostItem').last();
		} else if (data.tp == "GC") {
			$(tDiv).append(html)
		}
		
		for(var i=0; i < postList.length; i++) {
			
			if(data.searchWord != "") postList[i].contents = postList[i].contents.replaceAll(data.searchWord, '<span style="color : yellow">' + data.searchWord + '</span>');
			
			html = "";
			html += "<div class=\"lnbPostItem box-type4\" data-lnb-pop-trigger=\"correct1\">";
			html += "	<div class=\"header\">";
			html += "		<span class=\"txt-type2 ctgrSrvId\">"+postList[i].ctgrSrvId+"</span>";
			html += "		<span class=\"day regDt\">"+postList[i].regDt+"</span>";
			html += "	</div>";
			html += "	<div class=\"content\">";
			html += "		<strong class=\"title\">"+postList[i].title+"</strong>";
			html += "		<div class=\"contents\">"+postList[i].contents+"</div>";
			html += "	</div>";
			html += "	<div class=\"footer\">";
			html += "		<dl class=\"pipe\">";
			html += "			<dt class=\"userDivision\">"+postList[i].userDivision+"</dt>";
			html += "			<dd class=\"userName\">"+postList[i].userName+"</dd>";
			html += "		</dl>";
			
			if(postList[i].confirmCd == "CF")
				html += "		<strong class=\"accept\">??????</strong>";
			else if(postList[i].confirmCd == "RJ")
				html += "		<strong>??????</strong>";
			else if(postList[i].confirmCd == "WR")
				html += "		<strong class=\"wait\">?????????</strong>";
			else if(postList[i].confirmCd == "CW")
				html += "		<strong class=\"wait\">????????????</strong>";
			
			html += "	</div>";
			html += "</div>";
			
			if(moreConts) $(tDiv).after(html);
			else $(tDiv).append(html);
			
			$(".lnbPostItem").click(function() {
				var tEl = $("#correct");
				tEl.find(".ctgrSrvId").text($(this).find(".ctgrSrvId").text());
				tEl.find(".regDt").text($(this).find(".regDt").text());
				tEl.find(".title").text($(this).find(".title").text());
				tEl.find(".contents").html($(this).find(".contents").html());
				tEl.find(".userDivision").text($(this).find(".userDivision").text());
				tEl.find(".userName").text($(this).find(".userName").text());
				tEl.addClass("active");
			});
		}
		
		if(data.tp == "GC" && data.count > pageNum + 10 && !moreConts) {
			$(tDiv).append(contsMore);
		} else if (data.tp == "GC" && data.count <= pageNum + 10) {
			$('#getMoreContsBtn').remove();
		}
		
		
		$('#myContsBtn').prop("checked", $('#myConts').prop("checked"));
		
		$('#myContsBtn').on("click",()=> {
			
			var isChecked = $('#myContsBtn').prop("checked");
			$('#myConts').prop("checked", isChecked);
			
			let searchWord = $('#myContsBtn').data().searchWord;
			let ctgrSrvId = $('#ctgrSrvId option:selected').val()
			
			let obj = { "searchWord" : searchWord,
						"ctgrSrvId" : ctgrSrvId, 
						"myConts" : isChecked? "on" : null};
			
			restCall(obj, "/search/getConts.do", cbLnbCategory)
		})
	}
}

function ppSetCategory() {
	restCall(null, "/setService.do", cbSetCategory);
}
function cbSetCategory(data) {
	$("#main-service .box-type9").empty();
	var group = data.codeTree.childCodeList;
	var html = "";
	for(var i=0; i < group.length; i++) {
				html += "<dl class=\"dl-check2\">";
				html += "<dt>"+group[i].name+"</dt>";
			
		for(var j=0; j < group[i].childCodeList.length; j++) {
				html += "	<dd>";
				html += "		<label class=\"ui-form\">";
			
			if($("#main-service #frmServiceSet #srvId").val().indexOf(group[i].childCodeList[j].codeNo) == -1)
				html += "			<input class=\"ctgrCode\" type=\"checkbox\" value='"+group[i].childCodeList[j].codeNo+"' >";
			else
				html += "			<input class=\"ctgrCode\" type=\"checkbox\" value='"+group[i].childCodeList[j].codeNo+"' checked=\"checked\">";
				html += "			<span>"+group[i].childCodeList[j].name+"</span>";
				html += "		</label>";
				html += "	</dd>";
		}
				html += "</dl>";
	}
	
	$("#main-service .box-type9").append(html);
	$("#main-service").addClass("active");
	$(".menu").click();
}

function ppServiceConfirm() {
	$("#main-service #frmServiceSet #srvId")[0].value = "";
	$("#main-service .ctgrCode:checked").each(function(){
		if($("#main-service #frmServiceSet #srvId")[0].value != "")
			$("#main-service #frmServiceSet #srvId")[0].value += ",";
		$("#main-service #frmServiceSet #srvId")[0].value += this.value;
	});
}
function cbServiceConfirm() {
	$("#main-service").removeClass("active");
}

function cbSetConfirmUser(data) {
	
	$(".confirmUserChange .confirmUser").empty();
	for(var i=0; i < data.userList.length; i++) {
		data.userList[0]
		$(".confirmUserChange .confirmUser").append("<option value=\""+data.userList[0].userId+"\">"+data.userList[0].userName+"</option>");
	}
}

function cbConfirmUserChange(data) {
	$(".confirmUserChange .pop-close")[0].click();
	location.reload();
}

function jeMakeReqDetailText() {
	makeFileTxt("jeMakeReqDetailText.txt", "jeMakeReqDetailText");
}

oEditors = [];

function creEditor(i) {

var sLang = "ko_KR";	// ?????? (ko_KR/ en_US/ ja_JP/ zh_CN/ zh_TW), default = ko_KR

// ?????? ?????? ??????
//var aAdditionalFontSet = [["MS UI Gothic", "MS UI Gothic"], ["Comic Sans MS", "Comic Sans MS"],["TEST","TEST"]];


nhn.husky.EZCreator.createInIFrame({
	oAppRef: oEditors,
	elPlaceHolder: "ir"+i,
	sSkinURI: "/res/static/SmartEditor2Skin.html",	
	htParams : {
		bUseToolbar : false,				// ?????? ?????? ?????? (true:??????/ false:???????????? ??????)
		bUseVerticalResizer : false,		// ????????? ?????? ????????? ?????? ?????? (true:??????/ false:???????????? ??????)
		bUseModeChanger : false,			// ?????? ???(Editor | HTML | TEXT) ?????? ?????? (true:??????/ false:???????????? ??????)
		//bSkipXssFilter : true,		// client-side xss filter ?????? ?????? (true:???????????? ?????? / ??????:??????)
		//aAdditionalFontList : aAdditionalFontSet,		// ?????? ?????? ??????
		fOnBeforeUnload : function(){
			//alert("??????!");
		},
		I18N_LOCALE : sLang
	}, //boolean
	fOnAppLoad : function(){
		let paranetFrame = document.getElementsByTagName("iframe");
		let childFrame = paranetFrame[0].contentDocument || paranetFrame[0].contentWindow.document;
		let childFrameIn = childFrame.getElementsByTagName("iframe")[0].contentDocument || childFrame.getElementsByTagName("iframe")[0].contentWindow.document;
		childFrameIn.head.innerHTML = childFrameIn.head.innerHTML + `<input type="hidden" id="validation" onclick="func.validation()">`;
		childFrameIn.body.addEventListener("focus", () => paranetFrame[0].style.border = "2px solid #5367ff");
		setDefaultFont(i);
		//?????? ??????
		//oEditors.getById["ir1"].exec("PASTE_HTML", ["????????? ????????? ?????? ????????? ???????????? text?????????."]);
	},
	fCreator: "createSEditor2"
});


/*function pasteHTML() {
	var sHTML = "<span style='color:#FF0000;'>???????????? ?????? ???????????? ???????????????.<\/span>";
	oEditors.getById["ir1"].exec("PASTE_HTML", [sHTML]);
}

function showHTML() {
	var sHTML = oEditors.getById["ir1"].getIR();
	alert(sHTML);
}
	
function submitContents(elClickedObj) {
	oEditors.getById["ir1"].exec("UPDATE_CONTENTS_FIELD", []);	// ???????????? ????????? textarea??? ???????????????.
	
	// ???????????? ????????? ?????? ??? ????????? ???????????? document.getElementById("ir1").value??? ???????????? ???????????? ?????????.
	
	try {
		elClickedObj.form.submit();
	} catch(e) {}
}*/

function setDefaultFont(i) {
	var sDefaultFont = '????????????';
	var nFontSize = 12;
	oEditors.getById["ir" + i].setDefaultFont(sDefaultFont, nFontSize);
}

}

function getWord(a,b){
	document.getElementById("wordRange").innerHTML = `(${a}/${b})`;
}

function changeEdit(category) {
	$('#editorArea').empty();
	changeEditForm(category);
	
	oEditors = [];
	
	for (var i=0; i < $('#editorArea').find('textarea').length; i++) {
		creEditor(i)
	}
}

function changeEditForm(category){
	
	var target = $('#editForm').clone().find('.'+category);
	
	$.each(target, (i,v) => {
		var editor = $(v);
		
		// textarea 
		editor.attr('id','ir'+i).attr('name','ir'+i);
		var byteLimit = $('#editForm').find('.wordRange').clone().text('(0/' + editor.data('byteLimit') + ')');
		
		$('#editorArea').append($(v));
		$('#editorArea').append(byteLimit);
	})
}

function corrProcTest(){
	data = [];
	
	for (var i=0; i < $('#editorArea').find('textarea').length; i++) {
		data[i] = {
				"status":{"status":0,"msg":"?????? ??????","resultCount":6},
				"originalText":"- ?????? : 20220727 - ?????? ??????????????? ?????? ????????? ????????? ????????? ???????????? ?????? ????????????????????? ????????? ?????? ?????? ?????????????????? ???????????? ?????? ?????????\n- ????????? ????????? ????????? ?????? ???????????? ?????? ????????? ?????? ?????? ??????.\n????????? ??????????????? ????????? ??? ????????? ???????????? ??????????????? ?????????\n\n",
				"correctionTermList":

				[
					{
						"type":"RULE_SPACING",
						"correctionText":"??????????????????",
						"originalText":"???????????? ??????",
						"startPos":42,
						"endPos":49,
						"ctgrId":0
					},
					{
						"type":"FREQ_SPELLER",
						"correctionText":"?????????",
						"originalText":"?????????",
						"startPos":58,
						"endPos":61,
						"ctgrId":0
					},
					{
						"type":"RULE_SPACING",
						"correctionText":"??????????????????",
						"originalText":"???????????? ??????",
						"startPos":75,
						"endPos":82,
						"ctgrId":0
					},
					{
						"type":"FREQ_SPELLER",
						"correctionText":"?????????",
						"originalText":"?????????",
						"startPos":93,
						"endPos":96,
						"ctgrId":0
					},{"type":"RULE_SPACING","correctionText":"??????????????????","originalText":"???????????? ??????","startPos":104,"endPos":111,"ctgrId":0},{"type":"RULE_SPACING","correctionText":"?????? ???","originalText":"?????????","startPos":136,"endPos":139,"ctgrId":0}]};
	}
	
	cbCorrProc(data);
	
}
