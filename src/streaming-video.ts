import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("streaming-video")
export class StreamingVideo extends LitElement {
  static styles = css`
    p {
      color: blue;
    }
  `;

  @property()
  name!: string;

 
  private _progressInterval: number | undefined;

  firstUpdated() {
    let progress = 0;
    this._progressInterval = window.setInterval(() => {
      progress += 10;
      // 创建并触发 progress 事件
      const event = new Event('progress', { bubbles: true });
      this.dispatchEvent(event);
      
      if (progress >= 100) {
        clearInterval(this._progressInterval);
      }
    }, 500);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._progressInterval) {
      clearInterval(this._progressInterval);
    }
  }
  

  render() {
    return html`
      <div>
        <video id="video" width="640" height="360" controls></video>
      </div>
    `;
  }
}
