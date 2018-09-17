function handleLinks () {
  // Don't open our own site's links in new tabs
  let host = location.hostname
  // Grab and loop over all <a> elements
  let allLinks = document.querySelectorAll('a')
  for (let i = 0; i < allLinks.length; ++i) {
    // if links are external and not empty
    if (allLinks[i].hostname !== host && allLinks[i].hostname !== '') {
      allLinks[i].target = '_blank'
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

// Call this function first
(function () {
  handleLinks();
  setLineCss();
})()