import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { start } from './receiver/main'
import { styles } from './streaming-video.styles'

export const config = {
  wsUrl: 'ws://localhost:80',
}

@customElement('streaming-video')
export class StreamingVideo extends LitElement {
  static styles = styles

  @property()
  public url = ''

  public firstUpdated() {
    config.wsUrl = this.url
    start(this.renderRoot)
  }

  public render() {
    return html`
      <div id="container">
        <div id="player"></div>
        <div id="message"></div>
      </div>
    `
  }
}
