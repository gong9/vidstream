import { getRTCConfiguration } from '../core/config.js'
import { createDisplayStatsArray } from '../core/stats.js'
import { VideoPlayer } from '../core/videoplayer.js'
import { RenderStreaming } from '../core/renderstreaming.js'
import { Signaling, WebSocketSignaling } from '../core/signaling.js'
import { emitter } from '../core/utils.js'

let renderstreaming
const useWebSocket = true

export function start(renderRoot) {
  const playerDiv = renderRoot.querySelector('#player')
  const messageDiv = renderRoot.querySelector('#message')
  messageDiv.style.display = 'none'

  const videoPlayer = new VideoPlayer()

  setup()

  window.document.oncontextmenu = function () {
    return false
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
    videoPlayer.createPlayer(playerDiv)
    setupRenderStreaming()
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

  let lastStats
  let intervalId

  function showStatsMessage() {
    intervalId = setInterval(async () => {
      if (renderstreaming == null)
        return

      const stats = await renderstreaming.getStats()

      if (stats == null)
        return

      const data = createDisplayStatsArray(stats, lastStats)
      emitter.emit('stream-stats', data)

      lastStats = stats
    }, 1000)
  }

  function clearStatsMessage() {
    if (intervalId)
      clearInterval(intervalId)

    lastStats = null
    intervalId = null
  }
}
