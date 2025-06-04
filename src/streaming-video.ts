import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { start } from './receiver/main'
import { styles } from './streaming-video.styles'

export const config = {
  host: 'localhost:80',
  protocol: 'ws',
}

@customElement('streaming-video')
export class StreamingVideo extends LitElement {
  static styles = styles

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

  public render() {
    return html`
      <div id="container" style="width: ${this.width}; height: ${this.height};">
        <div id="player"></div>
        <div id="message"></div>
      </div>
    `
  }
}
