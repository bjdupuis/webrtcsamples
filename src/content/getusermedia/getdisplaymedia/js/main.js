/*
 *  Copyright (c) 2018 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
'use strict';

if (adapter.browserDetails.browser === 'chrome' &&
    adapter.browserDetails.version >= 107) {
  // See https://developer.chrome.com/docs/web-platform/screen-sharing-controls/
  try {
    document.getElementById('options').style.display = 'block';    
  } catch (error) {
    console.warn(`This will likely happen in CEF. ${error.name}`)
  }
} else if (adapter.browserDetails.browser === 'firefox') {
  // Polyfill in Firefox.
  // See https://blog.mozilla.org/webrtc/getdisplaymedia-now-available-in-adapter-js/
  adapter.browserShim.shimGetDisplayMedia(window, 'screen');
}

for (var i = 1; i <= 9; i++) {
  const startButton = document.getElementById("startButton"+ i)
  const preferredDisplaySurface = document.getElementById("displaySurface" + i)
  const video = document.getElementById("gum-local" + i);
  const errorElement = document.querySelector('#errorMsg' + i);

  startButton.addEventListener('click', () => {
    const options = {audio: false, video: true};
    const displaySurface = preferredDisplaySurface.options[preferredDisplaySurface.selectedIndex].value;
    if (displaySurface !== 'default') {
      options.video = {displaySurface};
    }
    navigator.mediaDevices.getDisplayMedia(options)
        .then((stream) => {
          startButton.disabled = true;
          preferredDisplaySurface.disabled = true;
          video.srcObject = stream;
        
          // demonstrates how to detect that the user has stopped
          // sharing the screen via the browser UI.
          stream.getVideoTracks()[0].addEventListener('ended', () => {
            errorMsg('The user has ended sharing the screen');
            startButton.disabled = false;
            preferredDisplaySurface.disabled = false;
          });        
        }, (error) => {
          const msg = `getDisplayMedia error: ${error.name}`
          errorMsg(msg)
        });
  });

  if ((navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices)) {
    startButton.disabled = false;
  } else {
    errorMsg('getDisplayMedia is not supported');
  }
  
  function errorMsg(msg) {
    errorElement.innerHTML += `<p>${msg}</p>`;
    if (typeof error !== 'undefined') {
      console.error(error);
    }        
  }
}
