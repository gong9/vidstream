import { getRTCConfiguration, getServerConfig } from '../core/config.js'
import { createDisplayStringArray } from '../core/stats.js'
import { VideoPlayer } from '../core/videoplayer.js'
import { RenderStreaming } from '../core/renderstreaming.js'
import { Signaling, WebSocketSignaling } from '../core/signaling.js'

/** @type {RenderStreaming} */
let renderstreaming
/** @type {boolean} */
let useWebSocket

export function start(renderRoot) {
  const supportsSetCodecPreferences
    = window.RTCRtpTransceiver
    && 'setCodecPreferences' in window.RTCRtpTransceiver.prototype

  const playerDiv = renderRoot.querySelector('#player')
  const messageDiv = renderRoot.querySelector('#message')
  messageDiv.style.display = 'none'

  const videoPlayer = new VideoPlayer()

  setup()

  window.document.oncontextmenu = function () {
    return false // cancel default menu
  }

  window.addEventListener(
    'resize',
    () => {
      videoPlayer.resizeVideo()
    },
    true,
  )

  window.addEventListener(
    'beforeunload',
    async () => {
      if (!renderstreaming)
        return
      await renderstreaming.stop()
    },
    true,
  )

  async function setup() {
    const res = await getServerConfig()
    useWebSocket = res.useWebSocket
    showWarningIfNeeded(res.startupMode)
    showCodecSelect()

    videoPlayer.createPlayer(playerDiv)
    setupRenderStreaming()
  }

  function showWarningIfNeeded(startupMode) {
    if (startupMode === 'private')
      console.error('This sample is not working on Private Mode.')
  }

  async function setupRenderStreaming() {
    const signaling = useWebSocket ? new WebSocketSignaling() : new Signaling()
    const config = getRTCConfiguration()
    renderstreaming = new RenderStreaming(signaling, config)
    renderstreaming.onConnect = onConnect
    renderstreaming.onDisconnect = onDisconnect
    renderstreaming.onTrackEvent = data => videoPlayer.addTrack(data.track)
    renderstreaming.onGotOffer = setCodecPreferences

    await renderstreaming.start()
    await renderstreaming.createConnection()
  }

  function onConnect() {
    const channel = renderstreaming.createDataChannel('input')
    videoPlayer.setupInput(channel)
    showStatsMessage()
  }

  async function onDisconnect(connectionId) {
    clearStatsMessage()
    messageDiv.style.display = 'block'
    messageDiv.innerText = `Disconnect peer on ${connectionId}.`

    await renderstreaming.stop()
    renderstreaming = null
    videoPlayer.deletePlayer()
  }

  function setCodecPreferences() {
    const selectedCodecs = null

    if (selectedCodecs == null)
      return

    const transceivers = renderstreaming
      .getTransceivers()
      .filter(t => t.receiver.track.kind === 'video')
    if (transceivers && transceivers.length > 0)
      transceivers.forEach(t => t.setCodecPreferences(selectedCodecs))
  }

  function showCodecSelect() {
    if (!supportsSetCodecPreferences) {
      messageDiv.style.display = 'block'
      messageDiv.innerHTML = 'Current Browser does not support <a href="https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpTransceiver/setCodecPreferences">RTCRtpTransceiver.setCodecPreferences</a>.'
      return
    }

    const codecs = RTCRtpSender.getCapabilities('video').codecs
    console.log(codecs)
  }

  /** @type {RTCStatsReport} */
  let lastStats
  /** @type {number} */
  let intervalId

  function showStatsMessage() {
    intervalId = setInterval(async () => {
      if (renderstreaming == null)
        return

      const stats = await renderstreaming.getStats()
      if (stats == null)
        return

      const array = createDisplayStringArray(stats, lastStats)
      if (array.length) {
        messageDiv.style.display = 'block'
        messageDiv.innerHTML = array.join('<br>')
      }
      lastStats = stats
    }, 1000)
  }

  function clearStatsMessage() {
    if (intervalId)
      clearInterval(intervalId)

    lastStats = null
    intervalId = null
    messageDiv.style.display = 'none'
    messageDiv.innerHTML = ''
  }
}
