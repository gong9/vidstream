import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { start } from './receiver/main'
import { styles } from './streaming-video.styles'
import { emitter } from './core/utils'

export const config = {
  host: 'localhost:80',
  protocol: 'ws',
}

@customElement('streaming-video')
export class StreamingVideo extends LitElement {
  static styles = styles

  constructor() {
    super()

    emitter.on('stream-start', () => {
      this.dispatchEvent(new CustomEvent('stream-connected', {
        detail: { connected: false },
        bubbles: true,
        composed: true,
      }))
    })

    emitter.on('stream-connected', () => {
      this.dispatchEvent(new CustomEvent('stream-connected', {
        detail: { connected: true },
        bubbles: true,
        composed: true,
      }))
    })

    emitter.on('stream-disconnected', () => {
      this.dispatchEvent(new CustomEvent('stream-disconnected', {
        detail: { connected: false },
        bubbles: true,
        composed: true,
      }))
    })

    emitter.on('stream-error', () => {
      console.log('stream-error')
    })

    emitter.on('stream-progress', () => {
      console.log('stream-progress')
    })

    emitter.on('stream-stats', (stats) => {
      this.dispatchEvent(new CustomEvent('stream-stats', {
        detail: { stats },
        bubbles: true,
        composed: true,
      }))
    })
  }

  @property()
  public host = ''

  @property()
  public width = '100%'

  @property()
  public height = '100%'

  public firstUpdated() {
    config.host = this.host
    start(this.renderRoot)
  }

  public connected() {
    console.log('test')
  }

  public disconnected() {
    console.log('test')
  }

  public render() {
    return html`
      <div id="container" style="width: ${this.width}; height: ${this.height};">
        <div id="player"></div>
        <div id="message"></div>
      </div>
    `
  }
}
