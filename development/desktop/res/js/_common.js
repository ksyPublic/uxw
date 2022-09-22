document.addEventListener('DOMContentLoaded', function () {
	// admin_lnb(),
	bytesCheck(),
	admin_gnb(),
	tooltip(),
	datepicker(),
	lyPop(),
	main(),
	// lyLnb(),
	ui_tab(),
	lyContent(),
	ui_accordion(),
	lyLogin()
})

/*****************
 바이트 수 체크
******************/
function bytesCheck() {
	var bytesCheck = document.querySelectorAll('[data-bytes-check]');

	Array.prototype.forEach.call(bytesCheck, function (el) {
		// 한글 And 특수문자 2byte, 그 외 1byte
		function getByteCheck(str) {
			var len = 0;
			for (var i = 0; i < str.length; i++) {
				if (escape(str.charAt(i)).length === 6) {
					len++;
				}
				len++;
			}
			return len;
		}

		// 초기값 세팅
		var bytes = el.getAttribute('data-bytes-check');
		// var span = document.createElement('span');
		// el.after(span);
		// el.nextElementSibling.innerText = getByteCheck(el.value) + ' / ' + bytes + 'bytes';

		// 키 입력 시 바이트 계산
		['keydown', 'keyup', 'focusout'].forEach(function (type) {
			el.addEventListener(type, function () {
				var leng = el.value.length;

				while (getByteCheck(this.value) > bytes) {
					// alert('최대' + bytes + 'bytes까지 입력할 수 있습니다.')
					leng--;
					el.value = el.value.substr(0, leng);
				}

				// el.nextElementSibling.innerText = getByteCheck(this.value) + ' / ' + bytes + 'bytes';
			})
		})
	})
}

/*****************
 admin_gnb
******************/
function admin_gnb() {
	var adminGnb = document.querySelectorAll('header.admin-header');

	Array.prototype.forEach.call(adminGnb, function (gnb) {
		document.addEventListener('scroll', function () {
			if (document.documentElement.scrollTop >= 180) {
				gnb.classList.add('active');
			} else {
				gnb.classList.remove('active');
			}
		})

		if (document.documentElement.scrollTop >= 180) {
			gnb.classList.add('active');
		}
	})
}

/*****************
 admin_lnb
******************/
function admin_lnb() {

	// lnb 트리거
	var lnbTrigger = document.querySelector('.burger-menu');

	if (lnbTrigger) {
		lnbTrigger.addEventListener('click', function (e) {
			e.preventDefault();

			this.parentNode.classList.toggle('active')
		})
	}

	// lnb 경로
	var lnbMenuActive = $('.admin-menu a');

	$(lnbMenuActive).each(function () {
		var _this_a = $(this).attr('href').split('/');
		_this_a = _this_a[_this_a.length - 1].slice(0, 20);

		var pathName = window.location.href.split('/');
		pathName = pathName[pathName.length - 1].slice(0, 20);

		if (_this_a === pathName) {
			$(this).addClass('active');
		}
		// 예외
		else if (pathName === "UXW-A304") {
			$('[special-lnb1]').addClass('active');
		}

		if ($(this).hasClass('active')) {
			$(this).next().slideDown();
			$(this).parent().parent().slideDown();
			$(this).parent().parent().prev('a').addClass('active');
		}
	})

	// lnb 드롭다운
	var dropTrigger = $('.admin-menu>li>a:not(:only-child)');

	$(dropTrigger).on('click', function (e) {
		e.preventDefault();

		$(this).next().slideToggle();

		if ($(this).hasClass('active')) {
			dropTrigger.removeClass('active');
		} else {
			dropTrigger.not($(this)).next().slideUp();
			dropTrigger.removeClass('active');
			$(this).addClass('active');
		}
	})

	// var dropTrigger = document.querySelectorAll('.admin-menu>li>a');

	// Array.prototype.forEach.call(dropTrigger, function(el) {

	//	 el.addEventListener('click', function(e) {
	//		 e.preventDefault();

	//		 if(el.classList.contains('active')) {
	//			 Array.prototype.forEach.call(dropTrigger, function(el) {
	//				 el.classList.remove('active');
	//			 })
	//		 } else {
	//			 Array.prototype.forEach.call(dropTrigger, function(el) {
	//				 el.classList.remove('active');
	//			 })
	//			 this.classList.add('active');
	//		 }
	//	 })
	// })
}

/*****************
 tooltip
******************/
function tooltip() {
	// 마우스 오버 툴팁
	var tooltip_hover = document.querySelectorAll('.tooltip.type1');

	Array.prototype.forEach.call(tooltip_hover, function (tool) {
		var tooltipA = tool.querySelector('a');

		tooltipA.addEventListener('mouseover', function (e) {
			e.preventDefault();

			Array.prototype.forEach.call(tooltip_hover, function (el) {
				el.classList.remove('active');
			})
			this.parentNode.classList.add('active');
		})

		tool.addEventListener('mouseleave', function () {
			tool.classList.remove('active');
		})
	});

	// 클릭 툴팁
	var tooltip_click = document.querySelectorAll('.tooltip.click');
	Array.prototype.forEach.call(tooltip_click, function (tool) {
		var tooltipContent = tool.querySelector('.tooltip-wrap');
		var tooltipA = tool.querySelector('a');
		var tooltipClose = document.createElement('a');
		tooltipClose.setAttribute('href', '#none');
		tooltipClose.classList.add('tooltip-close');
		tooltipContent.appendChild(tooltipClose);

		tooltipA.addEventListener('click', function (e) {
			e.preventDefault();

			Array.prototype.forEach.call(tooltip_click, function (el) {
				el.classList.remove('active');
			})
			this.parentNode.classList.add('active');
		})

		tooltipClose.addEventListener('click', function (e) {
			e.preventDefault();

			Array.prototype.forEach.call(tooltip_click, function (el) {
				el.classList.remove('active');
			})
		})
	});

	// 토글 툴팁
	var tooltip_toggle = $('.tooltip.toggle');
	var tooltip_trigger = $('.tooltip.toggle>a')

	if (tooltip_toggle.length) {
		var tooltip_dim = document.createElement('div');
		tooltip_dim.classList.add('ly-pop-dim');
		document.querySelector('body').appendChild(tooltip_dim);
	}

	tooltip_trigger.on('click', function (e) {
		e.preventDefault();

		if ($(this).parent().hasClass('active')) {
			// gnb만
			if ($(this).parent().hasClass('type3')) {
				tooltip_dim.classList.remove('active');
				$(this).parent().css('z-index', '10');
			}
			tooltip_toggle.removeClass('active');
			tooltip_toggle.children('.tooltip-wrap').slideUp(200);
		} else {
			tooltip_toggle.removeClass('active');
			tooltip_toggle.children('.tooltip-wrap').slideUp(200);
			$(this).parent().children('.tooltip-wrap').slideDown(200);
			// gnb만
			if ($(this).parent().hasClass('type3')) {
				tooltip_dim.classList.add('active');
				$(this).parent().css('z-index', '20');
			}
			$(this).parent().addClass('active');
		}
	})
}

/*****************
 datepicker
******************/
function datepicker() {
	var set_datepicker = {
		dateFormat: 'yy.mm.dd',
		showOn: 'both',
		yearRange: '2009:+0',
		monthNamesShort: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'], //달력의 월 부분 텍스트
		monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'], //달력의 월 부분 Tooltip 텍스트
		dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'], //달력의 요일 부분 텍스트
		dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'], //달력의 요일 부분 Tooltip 텍스트
		showMonthAfterYear: true,
		changeYear: true,
		changeMonth: true,
		buttonImageOnly: false,
		hideIfNoPrevNext: true,
		showButtonPanel: true,
		buttonText: "",
		currentText: '',
		prevText: '',
		nextText: '',
	};

	$('.datepicker').each(function () {
		var el_date = $(this).find('.date');

		el_date.attr('maxlength', '8');
		el_date.addClass('readonly');
		el_date.attr('readonly', 'readonly');
		el_date.attr('placeholder', '기간을 선택하세요.')

		if (el_date.length > 1) {
			// 기간선택
			var id_date_start = el_date.eq(0).attr('id');
			var id_date_end = el_date.eq(1).attr('id');

			$('#' + id_date_start)
				.datepicker(set_datepicker)
				.datepicker('option', 'onSelect', function (dateText) {
					$('#' + id_date_end).datepicker('option', 'minDate', dateText);
				})

			$('#' + id_date_end)
				.datepicker(set_datepicker)
				.datepicker('option', 'onSelect', function (dateText) {
					$('#' + id_date_start).datepicker('option', 'maxDate', dateText);
				})
		} else {
			// 날짜 선택
			var id_date = $(this).find('.date').eq(0).attr('id');
			$('#' + id_date).datepicker(set_datepicker);
		}
	})
}

/*****************
 탭
******************/
function ui_tab() {
	var tab = "[data-ui-tab-sub]";
	$(tab).tabs({
		classes: {
			"ui-tabs-nav": "area-tab-sub ul",
			"ui-tabs-active": "active",
		},
		hide: {
			effect: 'fadeOut'
		}
	})
}

/*****************
 레이어 팝업
******************/
function lyPop() {
	var popTrigger = document.querySelectorAll('[data-ly-pop-trigger]');

	if (popTrigger.length) {
		//var popDim = document.createElement('div');
		var popDim = document.querySelector('.ly-pop-dim')
		//popDim.classList.add('ly-pop-dim');
		document.querySelector('body').appendChild(popDim);
	}

	Array.prototype.forEach.call(popTrigger, function (pop) {
		var getPopId = pop.getAttribute('data-ly-pop-trigger');
		var setPopId = document.querySelector('#' + getPopId);

		pop.addEventListener('click', function (e) {
			e.preventDefault();

			setPopId.classList.add('active');
			popDim.classList.add('active');
		})
		
		if(setPopId != null) {
			var popClose = setPopId.querySelectorAll('[data-pop-close]');
			Array.prototype.forEach.call(popClose, function (pop) {
	
				pop.addEventListener('click', function (e) {
					e.preventDefault();
	
					setPopId.classList.remove('active');
					popDim.classList.remove('active');
					$(".ly-pop-dim").removeClass("active");
				})
			})
		}
	})

	// 페이지 로딩시 팝업이 있을 경우
	var lyPop = document.querySelectorAll('.ly-pop');
	Array.prototype.forEach.call(lyPop, function (el) {

		if (el.classList.contains('active')) {
			popDim.classList.add('active');
		}

		var popClose = el.querySelectorAll('[data-pop-close]');
		Array.prototype.forEach.call(popClose, function (pop) {

			pop.addEventListener('click', function (e) {
				e.preventDefault();

				el.classList.remove('active');
				popDim.classList.remove('active');
				$(".ly-pop-dim").removeClass("active");
			})
		})
	})
}

/*****************
 메인
******************/
function main() {
	var mainSlide = document.querySelectorAll('.main-slide');

	// 메인 슬라이더
	if (mainSlide.length) {
		new Swiper('.main-slide', {
			slidesPerView: 'auto',
			keyboard: true,
			navigation: {
				prevEl: '.btn-slide.prev',
				nextEl: '.btn-slide.next',
			},
		})

		Array.prototype.forEach.call(mainSlide, function (el) {

			el.addEventListener('mousewheel', function (e) {
				e.preventDefault();

				var next = el.querySelector('.btn-slide.next');
				var prev = el.querySelector('.btn-slide.prev');

				var event = document.createEvent('HTMLEvents');
				event.initEvent('click', true, false);

				if (e.wheelDelta < 0) {
					next.dispatchEvent(event);
				} else {
					prev.dispatchEvent(event);
				}

			})
		})
	}
}

/*****************
 프론트 lnb
******************/

function lyLnb() {
	var navTrigger = document.querySelectorAll('.ly-nav>a');
	var lnbContent = document.querySelector('.ly-nav-content');
	var contentAll = lnbContent.querySelectorAll('.nav-content');
	var lnbContentClose = lnbContent.querySelector('.close');

	// 컨텐츠 교정 연관
	var contentLeft = document.querySelector('.ly-content-left');
	var contentRight = document.querySelector('.ly-content-right');

	Array.prototype.forEach.call(navTrigger, function (nav) {

		nav.addEventListener('click', function (e) {
			e.preventDefault();
			var href = this.getAttribute('href');
			var content = lnbContent.querySelector('.' + href);

			if (this.classList.contains('active')) {
				Array.prototype.forEach.call(navTrigger, function (el) {
					el.classList.remove('active');
				})
				this.parentNode.classList.remove('active');
				lnbContent.classList.remove('active');
				content.classList.remove('active');

				// if(contentRight.classList.contains('active')) {
				//	 contentLeft.classList.remove('active');
				// }
			} else {
				Array.prototype.forEach.call(navTrigger, function (el) {
					el.classList.remove('active')
				})
				this.classList.add('active');
				this.parentNode.classList.add('active');

				// lnb-content>div 전부 active 삭제
				Array.prototype.forEach.call(contentAll, function (el) {
					el.classList.remove('active');
				})
				// lnb-content 활성화
				lnbContent.classList.add('active');
				content.classList.add('active');

				if (contentRight && contentRight.classList.contains('active')) {
					contentLeft.classList.add('active');
				}
			}
		})

		// lnb 관련 전부 닫기
		if(lnbContentClose != null) lnbContentClose.addEventListener('click', function (e) {
			e.preventDefault();

			Array.prototype.forEach.call(navTrigger, function (el) {
				el.classList.remove('active')
				el.parentNode.classList.remove('active');
			})

			lnbContent.classList.remove('active');
			Array.prototype.forEach.call(contentAll, function (el) {
				el.classList.remove('active');
			})

			// if(contentRight.classList.contains('active')) {
			//	 contentLeft.classList.remove('active');
			// }
		})

		// lnb 팝업
		var popTrigger = document.querySelectorAll('[data-lnb-pop-trigger]');

		Array.prototype.forEach.call(popTrigger, function (pop) {
			var getPopId = pop.getAttribute('data-lnb-pop-trigger');
			var setPopId = document.querySelector('#' + getPopId);

			pop.addEventListener('click', function (e) {
				e.preventDefault();

				setPopId.classList.add('active');
			})

			var popClose = setPopId.querySelectorAll('[data-pop-close]');

			Array.prototype.forEach.call(popClose, function (pop) {

				pop.addEventListener('click', function (e) {
					e.preventDefault();

					setPopId.classList.remove('active');
				})
			})
		})
	})
}

/*****************
 프론트 content
******************/

function lyContent() {
	// 콘텐츠 교정
	var contentTrigger = document.querySelectorAll('[data-ly-content-right-trigger]');
	var contentWrap = document.querySelector('.ly-content');
	var contentLeft = document.querySelector('.ly-content-left');
	var contentRight = document.querySelector('.ly-content-right');
	var contentClose = document.querySelectorAll('[data-ly-content-right-close]');

	Array.prototype.forEach.call(contentTrigger, function (el) {
		el.addEventListener('click', function (e) {
			e.preventDefault();

			contentRight.classList.add('active');
			contentWrap.style.overflowX = 'auto';
			contentLeft.classList.add('active');
		})
	})

	Array.prototype.forEach.call(contentClose, function (el) {
		el.addEventListener('click', function (e) {
			e.preventDefault();

			contentRight.classList.remove('active');
			contentWrap.style.overflowX = 'hidden';
			contentLeft.classList.remove('active');
		})
	})

	// 마이페이지
	var commentTrigger = document.querySelectorAll('[data-comment-trigger]');
	var comment = document.querySelector('.comment');

	Array.prototype.forEach.call(commentTrigger, function (el) {
		var commentClose = comment.querySelector('.btn-type1.arrow');

		el.addEventListener('click', function (e) {
			e.preventDefault();

			comment.classList.add('active');
			this.parentNode.classList.add('hide');

			contentWrap.scroll({
				behavior: 'smooth',
				top: contentWrap.offsetHeight
			})
		})

		commentClose.addEventListener('click', function (e) {
			e.preventDefault();

			comment.classList.remove('active');
			el.parentNode.classList.remove('hide');
		})
	})
}

/*****************
 아코디언
******************/

function ui_accordion() {
	var accordion = document.querySelectorAll('.accordion');

	Array.prototype.forEach.call(accordion, function (acc) {
		var accTrigger = acc.querySelector('dt>a');

		accTrigger.addEventListener('click', function (e) {
			e.preventDefault();

			if (this.parentNode.parentNode.classList.contains('active')) {
				Array.prototype.forEach.call(accordion, function (el) {
					el.classList.remove('active');
				})
			} else {
				Array.prototype.forEach.call(accordion, function (el) {
					el.classList.remove('active');
				})
				this.parentNode.parentNode.classList.add('active');
			}
		})

	})
}

/*****************
 로그인 페이지
******************/

function lyLogin() {
	var loginSlide = document.querySelector('.ly-login-content')

	if (loginSlide) {
		new Swiper('.ly-login-content', {
			slidesPerView: 'auto',
			loop: true,
			simulateTouch: false,
			pagination: {
				el: '.swiper-pagination',
				clickable: true
			},
			navigation: {
				prevEl: '.btn-slide.prev',
				nextEl: '.btn-slide.next',
			},
		})
	}
}

/*
 * 업로드 팝업창을 띄우고 텍스트를 띄울 경로를 설정하는 함수
 * 생성일 : 2022-08-10
 */
function uploadWindow(returnPath){
	$('.ly-content').append("<input type=hidden name='returnPathId' id='returnPathId' value='" + returnPath + "'>");
	var uploadWin = window.open(encodeURI("/noTilesPopup/uploadPopup.do"), 'target', 'top=100, left=300, width=500, height=600, toolbar=no, menubar=no, location=no, status=no, scrollbars=no, resizable=no');
	
	
}

