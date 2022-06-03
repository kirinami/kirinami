import { css } from '@emotion/react';

export const styles = {
  reset: css`
    *, ::before, ::after {
      box-sizing: border-box;
      border-width: 0;
      border-style: solid;
      border-color: #e5e7eb;
    }

    html, body {
      height: 100%;
      min-height: 100%;
    }

    html {
      line-height: 1;
      -webkit-text-size-adjust: 100%;
      -moz-tab-size: 4;
      -o-tab-size: 4;
      tab-size: 4;
    }

    body {
      margin: 0;
      line-height: inherit;
    }

    hr {
      height: 0;
      color: inherit;
      border-top-width: 1px;
    }

    abbr:where([title]) {
      -webkit-text-decoration: underline dotted;
      text-decoration: underline dotted;
    }

    h1, h2, h3, h4, h5, h6 {
      font-size: inherit;
      font-weight: inherit;
    }

    a {
      color: inherit;
      text-decoration: inherit;
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }
    }

    b, strong {
      font-weight: bolder;
    }

    code, kbd, samp, pre {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 1em;
    }

    small {
      font-size: 80%;
    }

    sub, sup {
      font-size: 75%;
      line-height: 0;
      position: relative;
      vertical-align: baseline;
    }

    sub {
      bottom: -0.25em;
    }

    sup {
      top: -0.5em;
    }

    table {
      text-indent: 0;
      border-color: inherit;
      border-collapse: collapse;
    }

    progress {
      vertical-align: baseline;
    }

    button, input, optgroup, select, textarea {
      font-family: inherit;
      font-size: 100%;
      line-height: inherit;
      color: inherit;
      margin: 0;
      padding: 0;
    }

    button, select {
      text-transform: none;
    }

    button, [type="button"], [type="reset"], [type="submit"] {
      -webkit-appearance: button;
      background-color: transparent;
      background-image: none;
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }
    }

    [type="search"] {
      -webkit-appearance: textfield;
      outline-offset: -2px;
    }

    :-moz-focusring {
      outline: auto;
    }

    :-moz-ui-invalid {
      box-shadow: none;
    }

    ::-webkit-inner-spin-button, ::-webkit-outer-spin-button {
      height: auto;
    }

    ::-webkit-search-decoration {
      -webkit-appearance: none;
    }

    ::-webkit-file-upload-button {
      -webkit-appearance: button;
      font: inherit;
    }

    summary {
      display: list-item;
    }

    blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre {
      margin: 0;
    }

    fieldset {
      margin: 0;
      padding: 0;
    }

    legend {
      padding: 0;
    }

    ol, ul, menu {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    textarea {
      resize: vertical;
    }

    input::-moz-placeholder, textarea::-moz-placeholder,
    input:-ms-input-placeholder, textarea:-ms-input-placeholder,
    input::placeholder, textarea::placeholder {
      opacity: 1;
      color: #9ca3af;
    }

    select {
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 0.5rem center;
      background-repeat: no-repeat;
      background-size: 1.5em 1.5em;
      padding-right: 2.5rem;
      -webkit-print-color-adjust: exact;
      color-adjust: exact;
      print-color-adjust: exact;
    }

    [multiple] {
      background-image: initial;
      background-position: initial;
      background-repeat: unset;
      background-size: initial;
      padding-right: 0.75rem;
      -webkit-print-color-adjust: unset;
      color-adjust: unset;
      print-color-adjust: unset;
    }

    [hidden] {
      display: none;
    }

    :disabled {
      cursor: default;
    }

    img, svg, video, canvas, audio, iframe, embed, object {
      display: block;
      vertical-align: middle;
    }

    img, video {
      max-width: 100%;
      height: auto;
    }

    [type="text"], [type="email"], [type="url"], [type="password"], [type="number"], [type="date"], [type="datetime-local"],
    [type="month"], [type="search"], [type="tel"], [type="time"], [type="week"], [multiple], textarea, select {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background-color: #ffffff;
      border-color: #cdd1d9;
      border-width: 1px;
      border-radius: 0;
      padding: 0.5rem 0.75rem;
      font-size: 1rem;

      &:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
        border-color: #884CB2;
      }
    }

    [type="checkbox"], [type="radio"] {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      padding: 0;
      -webkit-print-color-adjust: exact;
      color-adjust: exact;
      print-color-adjust: exact;
      display: inline-block;
      vertical-align: middle;
      background-origin: border-box;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      flex-shrink: 0;
      height: 1rem;
      width: 1rem;
      color: currentColor;
      background-color: #f6f6f6;
      border-color: #cdd1d9;
      border-width: 1px;

      &:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
      }

      &:checked {
        border-color: transparent;
        background-color: currentColor;
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;

        &:hover, &:focus {
          border-color: transparent;
          background-color: currentColor;
        }
      }
    }

    [type="checkbox"] {
      border-radius: 0;

      &:checked {
        background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
      }

      &:indeterminate {
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16'%3e%3cpath stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 8h8'/%3e%3c/svg%3e");
        border-color: transparent;
        background-color: currentColor;
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;

        &:hover, &:focus {
          border-color: transparent;
          background-color: currentColor;
        }
      }
    }

    [type="radio"] {
      border-radius: 100%;

      &:checked {
        background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e");
      }
    }

    [type="file"] {
      background: unset;
      border-color: inherit;
      border-width: 0;
      border-radius: 0;
      padding: 0;
      font-size: unset;
      line-height: inherit;

      &:focus {
        outline: 1px solid ButtonText;
        outline: 1px auto -webkit-focus-ring-color;
      }
    }

    #__next {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  `,
  root: css`
    html {
      font-family: 'Montserrat', sans-serif;
      font-weight: 400;
    }
  `,
};

export default styles;
