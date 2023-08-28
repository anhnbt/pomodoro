chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == "install") {
    chrome.tabs.create({
      url: "https://www.anhnbt.com/ky-tu-dac-biet",
    });
  } else if (details.reason == "update") {
    //call a function to handle an update
  }
}),
  chrome.runtime.setUninstallURL("https://www.anhnbt.com/ky-tu-dac-biet");
