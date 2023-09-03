// Call this function first
$(document).ready(function () {
    setLineCss();
    handleLinks();
  $(document).pjax('.pjaxlink', '#pjax', {
    fragment: "#pjax",
    timeout: 10000
  });
  $(document).on('pjax:send', function () {
    $(".pjax_loading").css("display", "flex");
  });

  $(document).on('pjax:complete', function () {
    setLineCss();
    handleLinks();
    $(".pjax_loading").css("display", "none");
  });

  $(window).scroll(function () {
      let siteHome = document.getElementsByClassName('site-home')[0];
      let menubarContainer = document.getElementsByClassName('menubar-container')[0];
    if ($(window).scrollTop() > 80) {
        siteHome.setAttribute('style', 'display:none;');
        menubarContainer.setAttribute('style', 'border-bottom: 1px solid #ebebeb');
    }
    else {
        siteHome.removeAttribute('style');
        menubarContainer.removeAttribute('style');
    }
  });
});

function handleLinks () {
  // Don't open our own site's links in new tabs
  let host = location.hostname
  // Grab and loop over all <a> elements
  let allLinks = document.querySelectorAll('a')
  for (let i = 0; i < allLinks.length; ++i) {
    // if links are external and not empty
    if (allLinks[i].hostname !== host && allLinks[i].hostname !== '') {
      allLinks[i].target = '_blank';
      allLinks[i].rel = 'noopener';
    }
  }
}

const setLineCss = () => {
  let tags = document.querySelectorAll('pre');
  if (tags.length > 0) {
    tags.forEach((item) => {
      item.className += ' prettyprint linenums';
    });
    prettyPrint();
  }
}

// (function(w,d,t,u,n,s,e){w['SwiftypeObject']=n;w[n]=w[n]||function(){
//   (w[n].q=w[n].q||[]).push(arguments);};s=d.createElement(t);
//   e=d.getElementsByTagName(t)[0];s.async=1;s.src=u;e.parentNode.insertBefore(s,e);
//   })(window,document,'script','//s.swiftypecdn.com/install/v2/st.js','_st');
//   _st('install','xQUkKyG7shT6D1D4JMiT','2.0.0');
