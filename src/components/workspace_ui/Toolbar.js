import {html} from "lit";
import {gear, upload, download} from "/src/ui/icons";

export const renderToolbar = (tc) => {
  return html`<style>
      .toolbar {
        background-color: var(--planager-toolbar);
        color: var(--planager-text-light);
        height: 2rem;
        position: absolute;
        display: flex;
        justify-content: space-between;
        width: 100%;
        align-items: center;
        z-index: 1000;
        box-shadow: 0 0 5px black;
        user-select: none;
      }
      .toolbar-title {
        font-weight: bold;
        font-size: 1rem;
        margin: 0 1rem;
        cursor: default;
      }
      .toolbar-icon-container {
        display: flex;
        flex-direction: row;
      }
      .toolbar .toolbar-icon {
        margin: 0 0.5rem;
      }
      .toolbar-icon {
        display: flex;
        cursor: pointer;
      }
      .toolbar-icon:hover svg {
        fill: var(--planager-orange);
      }
      svg {
        fill: var(--planager-text-light);
        margin: auto;
        max-height: 1rem;
        height: 1rem;
      }
    </style>
    <div class="toolbar">
      <span class="toolbar-title">Dynamic Toolchains</span>
      <div class="toolbar-icon-container">
        <span class="toolbar-icon" @click=${(e) => tc.downloadToolchain(e)}>
          ${download}
        </span>
        <span class="toolbar-icon" @click=${(e) => tc.uploadToolchain(e)}>
          ${upload}
        </span>
        <span class="toolbar-icon">${gear}</span>
      </div>
    </div>`;
};
