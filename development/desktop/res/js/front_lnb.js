document.addEventListener('DOMContentLoaded', function () {
  $('.ly-nav').load('../../html/front/layout/layout.html .ly-nav>*', function() {
    // lyLnb();
  }),
  $('.ly-nav-content').load('../../html/front/layout/layout.html .ly-nav-content>*', function() {
    lyLnb();
    ui_tab();
  })
  // $('.ly-header').load('../../html/front/layout/layout.html .ly-header>*', function() {
  //   tooltip();
  // })
})