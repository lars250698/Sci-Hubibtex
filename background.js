const doiRegex = new RegExp(
  /\b(10[.][0-9]{4,}(?:[.][0-9]+)*\/(?:(?!["&\'<>])\S)+)\b/
);
const sciHubUrl = "https://sci-hub.st/";
const doi2bib = "https://doi2bib.org/bib/";

function getCitation(tab) {
  let urlString = tab[0].url;
  let currentPageIsSciHub = urlString.startsWith(sciHubUrl);

  let doi = urlString.replace(sciHubUrl, "");
  let matchesDoiRegex = doiRegex.test(doi);

  if(currentPageIsSciHub && matchesDoiRegex) {
    let creatingTab = browser.tabs.create({
      url: doi2bib + doi,
    });
    creatingTab.then();
  }
}

function executeJs() {
  var tabs = browser.tabs.query({currentWindow: true, active:true});
  tabs.then(getCitation);
}

browser.browserAction.onClicked.addListener(executeJs);
