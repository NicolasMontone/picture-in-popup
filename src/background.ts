if (!document) {
  new Notification('Picture in Picture not supported or video is not loaded')
} else {
  chrome.browserAction.onClicked.addListener(() => {
    // execute script.js
    chrome.tabs.executeScript({ file: 'script.js', allFrames: true })
  })
}
