const popCommand = new Deno.Command('paplay', {
  args: ['./sounds/Morse.aiff'],
});

const pop = () => popCommand.spawn();

const triplePop = () => {
  setTimeout(pop, 0);
  setTimeout(pop, 100);
  setTimeout(pop, 200);
};

const tripleTriplePop = () => {
  setTimeout(triplePop, 0);
  setTimeout(triplePop, 600);
  setTimeout(triplePop, 1200);
};

export const alert = () => {
  setTimeout(tripleTriplePop, 0);
  setTimeout(tripleTriplePop, 2500);
  setTimeout(tripleTriplePop, 5000);
};
