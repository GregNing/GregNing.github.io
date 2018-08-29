// Call this function first
(function () {
  handleLinks()
})()

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