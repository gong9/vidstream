import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

// @ts-ignore
import { start } from "./receiver/js/main";

@customElement("streaming-video")
export class StreamingVideo extends LitElement {
  static styles = css`
    #player {
      position: relative;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      align-items: center;
      justify-content: center;
      display: flex;
      background-color: #323232;
    }

    #player:before {
      content: "";
      display: block;
      padding-top: 66%;
    }

    #playButton {
      width: 15%;
      max-width: 200px;
      cursor: pointer;
    }

    #Video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    #fullscreenButton {
      position: absolute;
      top: 25px;
      right: 25px;
      width: 32px;
      height: 32px;
    }
  `;

  @property()
  name!: string;

  firstUpdated() {
    start(this.renderRoot);
  }

  render() {
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
