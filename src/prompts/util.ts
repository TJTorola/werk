import c from './color.ts';

export const action = (key, isSelect) => {
  if (key.meta && key.name !== 'escape') return;

  if (key.ctrl) {
    if (key.name === 'a') return 'first';
    if (key.name === 'c') return 'abort';
    if (key.name === 'd') return 'abort';
    if (key.name === 'e') return 'last';
    if (key.name === 'g') return 'reset';
  }

  if (isSelect) {
    if (key.name === 'j') return 'down';
    if (key.name === 'k') return 'up';
  }

  if (key.name === 'return') return 'submit';
  if (key.name === 'enter') return 'submit'; // ctrl + J
  if (key.name === 'backspace') return 'delete';
  if (key.name === 'delete') return 'deleteForward';
  if (key.name === 'abort') return 'abort';
  if (key.name === 'escape') return 'exit';
  if (key.name === 'tab') return 'next';
  if (key.name === 'pagedown') return 'nextPage';
  if (key.name === 'pageup') return 'prevPage';
  // TODO create home() in prompt types (e.g. TextPrompt)
  if (key.name === 'home') return 'home';
  // TODO create end() in prompt types (e.g. TextPrompt)
  if (key.name === 'end') return 'end';

  if (key.name === 'up') return 'up';
  if (key.name === 'down') return 'down';
  if (key.name === 'right') return 'right';
  if (key.name === 'left') return 'left';

  return false;
};

export const strip = (str) => {
  const pattern = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PRZcf-ntqry=><~]))',
  ].join('|');

  const RGX = new RegExp(pattern, 'g');
  return typeof str === 'string' ? str.replace(RGX, '') : str;
};

const width = (str) => [...strip(str)].length;

export const clear = (prompt, perLine) => {
  if (!perLine) return erase.line + cursor.to(0);

  let rows = 0;
  const lines = prompt.split(/\r?\n/);
  for (let line of lines) {
    rows += 1 + Math.floor(Math.max(width(line) - 1, 0) / perLine);
  }

  return erase.lines(rows);
};

const main = {
  arrowUp: '↑',
  arrowDown: '↓',
  arrowLeft: '←',
  arrowRight: '→',
  radioOn: '◉',
  radioOff: '◯',
  tick: '✔',
  cross: '✖',
  ellipsis: '…',
  pointerSmall: '›',
  line: '─',
  pointer: '❯',
};
const win = {
  arrowUp: main.arrowUp,
  arrowDown: main.arrowDown,
  arrowLeft: main.arrowLeft,
  arrowRight: main.arrowRight,
  radioOn: '(*)',
  radioOff: '( )',
  tick: '√',
  cross: '×',
  ellipsis: '...',
  pointerSmall: '»',
  line: '─',
  pointer: '>',
};
export const figures = process.platform === 'win32' ? win : main;

// rendering user input.
const styles = Object.freeze({
  password: { scale: 1, render: (input) => '*'.repeat(input.length) },
  emoji: { scale: 2, render: (input) => '😃'.repeat(input.length) },
  invisible: { scale: 0, render: (input) => '' },
  default: { scale: 1, render: (input) => `${input}` },
});
const render = (type) => styles[type] || styles.default;

// icon to signalize a prompt.
const symbols = Object.freeze({
  aborted: c.red(figures.cross),
  done: c.green(figures.tick),
  exited: c.yellow(figures.cross),
  default: c.cyan('?'),
});

const symbol = (done, aborted, exited) =>
  aborted
    ? symbols.aborted
    : exited
      ? symbols.exited
      : done
        ? symbols.done
        : symbols.default;

// between the question and the user's input.
const delimiter = (completing) =>
  c.gray(completing ? figures.ellipsis : figures.pointerSmall);

const item = (expandable, expanded) =>
  c.gray(expandable ? (expanded ? figures.pointerSmall : '+') : figures.line);

export const style = {
  styles,
  render,
  symbols,
  symbol,
  delimiter,
  item,
};

export const lines = (msg: string, perLine: number) => {
  let lines = String(strip(msg) || '').split(/\r?\n/);

  if (!perLine) return lines.length;
  return lines
    .map((l) => Math.ceil(l.length / perLine))
    .reduce((a, b) => a + b);
};

export const wrap = (
  msg: string,
  opts: { margin?: number | string; width?: number } = {},
) => {
  const tab = Number.isSafeInteger(parseInt(opts.margin))
    ? new Array(parseInt(opts.margin)).fill(' ').join('')
    : opts.margin || '';

  const width = opts.width;

  return (msg || '')
    .split(/\r?\n/g)
    .map((line) =>
      line
        .split(/\s+/g)
        .reduce(
          (arr, w) => {
            if (
              w.length + tab.length >= width ||
              arr[arr.length - 1].length + w.length + 1 < width
            )
              arr[arr.length - 1] += ` ${w}`;
            else arr.push(`${tab}${w}`);
            return arr;
          },
          [tab],
        )
        .join('\n'),
    )
    .join('\n');
};

/**
 * Determine what entries should be displayed on the screen, based on the
 * currently selected index and the maximum visible. Used in list-based
 * prompts like `select` and `multiselect`.
 */
export const entriesToDisplay = (
  cursor: number,
  total: number,
  maxVisible: number,
) => {
  maxVisible = maxVisible || total;

  let startIndex = Math.min(
    total - maxVisible,
    cursor - Math.floor(maxVisible / 2),
  );
  if (startIndex < 0) startIndex = 0;

  const endIndex = Math.min(startIndex + maxVisible, total);

  return { startIndex, endIndex };
};
