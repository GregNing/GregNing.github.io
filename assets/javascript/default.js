// Call this function first
$(document).ready(function () {
  $(document).pjax('.pjaxlink', '#pjax', {
    fragment: "#pjax",
    timeout: 10000
  });
  $(document).on('pjax:send', function () {
    $(".pjax_loading").css("display", "flex");
  });

  $(document).on('pjax:complete', function () {
    $(".pjax_loading").css("display", "none");
  });

  $(window).scroll(function () {
      let siteHome = document.getElementsByClassName('site-home')[0];
      let menubarContainer = document.getElementsByClassName('menubar-container')[0];
    if ($(window).scrollTop() > 80) {
        siteHome.setAttribute('style', 'display:none;');
        menubarContainer.setAttribute('style', 'border-bottom: 1px solid #ebebeb');
    //   $("#backtotop").addClass("showme");
    }
    else {
    //   $("#backtotop").removeClass("showme");
        siteHome.removeAttribute('style');
        menubarContainer.removeAttribute('style');
    }
  });

    $("#backtotop").click(function () {
        $('body,html').animate({ scrollTop: 0 }, 400);
        return false;
    });
//   document.getElementsByClassName('fa-search')[0].addEventListener('click', (e) => {
//     document.getElementsByClassName('search-query')[0].classList += ' input-text';
//   })
//   document.addEventListener('click', (e) => {
//     let searchQueryClass = document.getElementsByClassName('search-query')[0].classList;
//     if (e.target.classList[1] === 'fa-search') {
//       searchQueryClass += ' input-text';
//     }
//     else{
//       searchQueryClass.remove('input-text');
//     }
//   })

});