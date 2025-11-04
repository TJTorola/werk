import { mkdir } from 'node:fs/promises';

const getXdgDataHome = () => {
  const { XDG_DATA_HOME, HOME } = process.env;
  if (XDG_DATA_HOME) return XDG_DATA_HOME;
  if (!HOME) {
    throw new Error(
      'Cannot determine data directory without $XDG_DATA_HOME or $HOME',
    );
  }

  return `${HOME}/.local/share`;
};

export const getDataPath = () => `${getXdgDataHome()}/werk`;

export const ensureDataPath = async () => {
  const dataPath = getDataPath();
  const dataFile = Bun.file(dataPath);
  if (!(await dataFile.exists())) {
    await mkdir(dataPath, { recursive: true });
  } else if (!(await dataFile.stat().then((stat) => stat.isDirectory()))) {
    throw new Error(
      `Data Directory "${dataPath}" exists but is not a directory`,
    );
  }

  return dataPath;
};
