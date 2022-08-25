document.addEventListener('DOMContentLoaded', function () {
  $('.admin-lnb').load('../../html/admin/layout/layout.html .admin-lnb>*', function() {
    admin_lnb();
  });
})