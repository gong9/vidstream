import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { start } from "./receiver/main";
import { styles } from "./streaming-video.styles";

export const config = {
  wsUrl: "ws://localhost:8080"
}

@customElement("streaming-video")
export class StreamingVideo extends LitElement {
  static styles = styles;

  @property()
  public url: string = '';

  public firstUpdated() {
    config.wsUrl = this.url;
    start(this.renderRoot);
  }

  public render() {
    return html`
      <div id="container">
        <div id="warning" hidden="true"></div>
        <div id="player"></div>

        <div class="box">
          <span>Codec preferences:</span>
          <select id="codecPreferences" autocomplete="off" disabled>
            <option selected value="">Default</option>
          </select>
        </div>

        <div class="box">
          <span>Lock Cursor to Player:</span>
          <input type="checkbox" id="lockMouseCheck" autocomplete="off" />
        </div>

        <p>
          For more information about sample, see
          <a
            href="https://docs.unity3d.com/Packages/com.unity.renderstreaming@3.1/manual/sample-broadcast.html"
            >Broadcast sample</a
          >
          document page.
        </p>

        <div id="message"></div>

        <section>
          <a
            href="https://github.com/Unity-Technologies/UnityRenderStreaming/tree/develop/WebApp/client/public/receiver"
            title="View source for this page on GitHub"
            id="viewSource"
            >View source on GitHub</a
          >
        </section>
      </div>
    `;
  }
}
