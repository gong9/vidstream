import { Observer, Sender } from './sender.js'
import { InputRemoting } from './inputremoting.js'

export class VideoPlayer {
  constructor() {
    this.playerElement = null
    this.lockMouseCheck = null
    this.videoElement = null
    this.fullScreenButtonElement = null
    this.inputRemoting = null
    this.sender = null
    this.inputSenderChannel = null
  }

  /**
 * @param {Element} playerElement parent element for create video player
 * @param {HTMLInputElement} lockMouseCheck use checked propety for lock mouse
 */
  createPlayer(playerElement) {
    this.playerElement = playerElement

    this.videoElement = document.createElement('video')
    this.videoElement.id = 'Video'
    this.videoElement.style.touchAction = 'none'
    this.videoElement.muted = true
    this.videoElement.playsInline = true
    this.videoElement.srcObject = new MediaStream()
    this.videoElement.style.width = '100%'
    this.videoElement.style.height = '100%'

    this.videoElement.addEventListener('loadedmetadata', this._onLoadedVideo.bind(this), true)
    this.playerElement.appendChild(this.videoElement)
  }

  _onLoadedVideo() {
    this.videoElement.play()
    this.resizeVideo()
  }

  _mouseMove(event) {
    this.sender._onMouseEvent(event)
  }

  /**
   * @param {MediaStreamTrack} track
   */
  addTrack(track) {
    if (!this.videoElement.srcObject)
      return

    this.videoElement.srcObject.addTrack(track)
  }

  resizeVideo() {
    if (!this.videoElement)
      return

    const clientRect = this.videoElement.getBoundingClientRect()
    const videoRatio = this.videoWidth / this.videoHeight
    const clientRatio = clientRect.width / clientRect.height

    this._videoScale = videoRatio > clientRatio ? clientRect.width / this.videoWidth : clientRect.height / this.videoHeight
    const videoOffsetX = videoRatio > clientRatio ? 0 : (clientRect.width - this.videoWidth * this._videoScale) * 0.5
    const videoOffsetY = videoRatio > clientRatio ? (clientRect.height - this.videoHeight * this._videoScale) * 0.5 : 0
    this._videoOriginX = clientRect.left + videoOffsetX
    this._videoOriginY = clientRect.top + videoOffsetY
  }

  get videoWidth() {
    return this.videoElement.videoWidth
  }

  get videoHeight() {
    return this.videoElement.videoHeight
  }

  get videoOriginX() {
    return this._videoOriginX
  }

  get videoOriginY() {
    return this._videoOriginY
  }

  get videoScale() {
    return this._videoScale
  }

  deletePlayer() {
    if (this.inputRemoting)
      this.inputRemoting.stopSending()

    this.inputRemoting = null
    this.sender = null
    this.inputSenderChannel = null

    while (this.playerElement.firstChild)
      this.playerElement.removeChild(this.playerElement.firstChild)

    this.playerElement = null
    this.lockMouseCheck = null
  }

  _isTouchDevice() {
    return (('ontouchstart' in window)
      || (navigator.maxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0))
  }

  /**
   * setup datachannel for player input (muouse/keyboard/touch/gamepad)
   * @param {RTCDataChannel} channel
   */
  setupInput(channel) {
    this.sender = new Sender(this.videoElement)
    this.sender.addMouse()
    this.sender.addKeyboard()
    if (this._isTouchDevice())
      this.sender.addTouchscreen()

    this.sender.addGamepad()
    this.inputRemoting = new InputRemoting(this.sender)

    this.inputSenderChannel = channel
    this.inputSenderChannel.onopen = this._onOpenInputSenderChannel.bind(this)
    this.inputRemoting.subscribe(new Observer(this.inputSenderChannel))
  }

  async _onOpenInputSenderChannel() {
    await new Promise(resolve => setTimeout(resolve, 100))
    this.inputRemoting.startSending()
  }
}
