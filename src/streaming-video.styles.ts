import { css } from 'lit'

export const styles = css`
  #container {
    position: relative;
  }

  #player {
    width: 100%;
    height: 100%;
  }

  #message {
    position: absolute;
    top: 75px;
    left: 25px;
    color: green;
    height: 50%;
    overflow-y: auto;
  }
`
