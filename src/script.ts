function getVideoFromPage() {
  // get the largest video (the current video)
  const videos = Array.from(document.querySelectorAll('video'))

  if (videos.length === 0) {
    // no videos found just return
    return
  }

  return videos[0]
}

async function requestPictureInPicture(video: HTMLVideoElement) {
  try {
    await video.requestPictureInPicture()
  } catch {
    new Notification('Picture in Picture not supported or video is not loaded')
  }
  // add controls to the video
  video.controls = true
  video.setAttribute('__pip__', 'true')
  video.setAttribute('controls', 'true')
  video.addEventListener(
    'leavepictureinpicture',
    () => {
      video.removeAttribute('__pip__')
    },
    { once: true },
  )
  new ResizeObserver(maybeUpdatePictureInPictureVideo).observe(video)
}

function maybeUpdatePictureInPictureVideo(
  entries: ResizeObserverEntry[],
  observer: ResizeObserver,
) {
  const observedVideo = entries[0].target
  if (!document.querySelector('[__pip__]')) {
    observer.unobserve(observedVideo)
    return
  }
  const video = getVideoFromPage()
  if (video && !video.hasAttribute('__pip__')) {
    observer.unobserve(observedVideo)
    requestPictureInPicture(video)
  }
}

// eslint-disable-next-line @typescript-eslint/no-extra-semi
;(async () => {
  const video = getVideoFromPage()
  if (!video) {
    return
  }
  if (video.hasAttribute('__pip__')) {
    document.exitPictureInPicture()
    return
  }
  await requestPictureInPicture(video)
  chrome.runtime.sendMessage({ message: 'enter' })
})()
