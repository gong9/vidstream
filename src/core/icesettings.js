// This code is referenced from webrtc sample.
// https://github.com/webrtc/samples/blob/gh-pages/src/content/peerconnection/trickle-ice/js/main.js

const allServersKey = 'servers'

export function getServers() {
  const storedServers = window.localStorage.getItem(allServersKey)

  if (storedServers === null || storedServers === '')
    return [{ urls: ['stun:stun.l.google.com:19302'] }]

  else
    return JSON.parse(storedServers)
}
