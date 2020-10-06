const doiRegex = new RegExp(
  /\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&\'<>])\S)+)\b/
);
const sciHubUrl = "https://sci-hub.st/";
const doi2bib = "https://www.doi2bib.org/bib/";
const doi2bibApi = "https://www.doi2bib.org/2/doi2bib?id=";

function writeToClipboard(text) {
  navigator.clipboard.writeText(text).then(function() {
    console.log("Copied to clipboard: " + text)
  }, function(err) {
    console.error("Failed to copy to clipboard: " + text + " Error: " + err)
  })
}

function getCitation(tab) {
  let urlString = tab[0].url;
  let currentPageIsSciHub = urlString.startsWith(sciHubUrl);

  let doi = urlString.replace(sciHubUrl, "");
  let matchesDoiRegex = doiRegex.test(doi);

  if(currentPageIsSciHub && matchesDoiRegex) {
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        writeToClipboard(this.responseText);

      }
    }
    req.open("GET", doi2bibApi + doi, true);
    req.send();

    let creatingTab = browser.tabs.create({
      active: true,
      url: doi2bibApi + doi,
    });
  }
}

function executeJs() {
  var tabs = browser.tabs.query({currentWindow: true, active:true});
  tabs.then(getCitation);
}

browser.browserAction.onClicked.addListener(executeJs);
