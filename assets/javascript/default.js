$(function () {
  var $document = $(document);
  var $window = $(window);
  var $body = $("body");
  var $menu = $("[data-nav-menu]");
  var $toggle = $("[data-nav-toggle]");
  var $backToTop = $("[data-scroll-top]");

  if ($.fn.pjax && $("#pjax").length) {
    $document.pjax("a.pjaxlink", "#pjax", {
      fragment: "#pjax",
      timeout: 10000,
      scrollTo: 0
    });

    $document.on("pjax:send", function () {
      $(".pjax_loading").css("display", "grid");
      closeMenu();
    });

    $document.on("pjax:complete", function () {
      $(".pjax_loading").css("display", "none");
      initPageEnhancements();
    });
  }

  $toggle.on("click", function () {
    var isOpen = $menu.hasClass("is-open");
    $menu.toggleClass("is-open", !isOpen);
    $toggle.attr("aria-expanded", String(!isOpen));
    $body.toggleClass("menu-open", !isOpen);
  });

  $menu.on("click", "a", closeMenu);

  $window.on("scroll", updateScrollState);
  $backToTop.on("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  $document.on("click", "[data-back-link]", function (event) {
    if (document.referrer && document.referrer.indexOf(window.location.origin) === 0 && window.history.length > 1) {
      event.preventDefault();
      window.history.back();
    }
  });

  initPageEnhancements();
  updateScrollState();

  function closeMenu() {
    $menu.removeClass("is-open");
    $toggle.attr("aria-expanded", "false");
    $body.removeClass("menu-open");
  }

  function updateScrollState() {
    var scrollTop = $window.scrollTop() || 0;
    var documentHeight = $(document).height() - $window.height();
    var progress = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;
    $("[data-scroll-progress]").css("width", progress + "%");
    $backToTop.toggleClass("is-visible", scrollTop > 420);
  }
});

function initPageEnhancements() {
  decorateCodeBlocks();
  buildArticleToc();
  handleExternalLinks();
}

function decorateCodeBlocks() {
  var codeBlocks = document.querySelectorAll("pre");

  codeBlocks.forEach(function (block) {
    block.classList.add("prettyprint", "linenums");
  });

  if (codeBlocks.length && typeof prettyPrint === "function") {
    prettyPrint();
  }
}

function buildArticleToc() {
  var article = document.querySelector(".article-content");
  var list = document.getElementById("article-toc-list");
  var toc = document.querySelector("[data-article-toc]");

  if (!article || !list || !toc) return;

  list.innerHTML = "";
  var headings = article.querySelectorAll("h2, h3");

  if (!headings.length) {
    toc.hidden = true;
    return;
  }

  toc.hidden = false;
  headings.forEach(function (heading, index) {
    var id = heading.id || "section-" + slugify(heading.textContent) + "-" + index;
    heading.id = id;

    var item = document.createElement("li");
    var link = document.createElement("a");
    link.href = "#" + id;
    link.textContent = heading.textContent;
    if (heading.tagName.toLowerCase() === "h3") item.className = "toc-subitem";
    item.appendChild(link);
    list.appendChild(item);
  });
}

function slugify(value) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff\s-]/g, "")
    .replace(/[\s_]+/g, "-");
}

function handleExternalLinks() {
  var host = window.location.hostname;
  document.querySelectorAll("a").forEach(function (link) {
    if (link.hostname && link.hostname !== host && link.protocol.indexOf("http") === 0) {
      link.target = "_blank";
      link.rel = "noopener";
    }
  });
}
