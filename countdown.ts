import readline from 'node:readline';
import { alert } from './alert.ts';

const SPINNER_INTERVAL = 80;
const SPINNER_CHARS = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';

const makeSpinner = (startingMessage: string) => {
  let message = startingMessage;
  let tick = 0;

  const writeLine = () => {
    process.stdout.write(
      `${SPINNER_CHARS[tick++ % SPINNER_CHARS.length]} - ${message}`,
    );
  };

  const clearLine = () => {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
  };

  let interval: number | undefined;
  const start = () => {
    writeLine();
    interval = setInterval(() => {
      clearLine();
      writeLine();
    }, SPINNER_INTERVAL);
  };

  const stop = () => {
    clearLine();
    clearInterval(interval);
  };

  const setMessage = (newMessage: string) => {
    message = newMessage;
  };

  return {
    start,
    stop,
    setMessage,
  };
};

const makeCountdown = (startingSeconds: number, onStop?: () => void) => {
  let seconds = startingSeconds;
  const getMessage = () => {
    const minStr = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secStr = (seconds % 60).toString().padStart(2, '0');
    return `${minStr}:${secStr}`;
  };
  const spinner = makeSpinner(getMessage());
  let interval: number | undefined;

  const stop = () => {
    spinner.stop();
    clearInterval(interval);
    alert();
    onStop?.();
  };

  const start = () => {
    spinner.start();
    interval = setInterval(() => {
      seconds--;
      if (seconds < 0) {
        stop();
        return;
      } else {
        spinner.setMessage(getMessage());
      }
    }, 1000);
  };

  return { start, stop };
};

export const countdown = (seconds: number) =>
  new Promise<void>((res) => {
    const countdown = makeCountdown(seconds, () => {
      res();
    });
    countdown.start();
  });
