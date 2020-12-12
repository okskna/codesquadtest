const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

const userInput = () => {
  let ret = [];
  rl.prompt();
  rl.on('line', (input) => {
    // console.log(`Received: ${input}`);
    ret = input.split(' ');
    rl.emit('preprocessing', ret);
    console.log();
    rl.prompt();
  }).on('SIGINT', () => {
    rl.question('Are you sure you want to exit? ', (answer) => {
      if (answer.match(/^y(es)?$/i)) rl.pause();
    });
  });

  return ret;
}

const inputPreprocessing = (...arg) => {
  try {
    let word, numb, direction;
    [word, numb, direction] = arg;

    if (!word || !numb || !direction) throw('Not enough arguments.');
    
    word = word.split('');
    const numbInt = parseInt(numb);
    if (numbInt === numbInt) numb = parseInt(numb);
    else                     throw('Numb is not a valid value.');

    // console.log(direction.match(/^(l|r)(eft|ight)?$/i));
    const matchDir = direction.match(/^(l|r)(eft|ight)?$/i);
    if (matchDir) direction = matchDir[1].toUpperCase();
    else          throw('Direction is not a valid value.')

    // console.log('Res: ', word, numb, direction);
    return [word, numb, direction];
  } catch (msg) {
    console.log('Error(pushString): ', msg);
  }
}

const pushString = (ops) => {
  let word, numb, direction;
  [word, numb, direction] = ops;

  direction = direction === 'L' ? -1 : 1;

  const wordLength = word.length;
  const popTimes = (numb * direction) % wordLength;

  Array(Math.abs(popTimes)).fill(0).forEach( () => {
    if (popTimes < 0) {
      let firstItem = word.shift();
      word.push(firstItem);
    } else if (popTimes > 0) {
      let lastItem = word.pop();
      word.unshift(lastItem);
    }
  });

  console.log(word.join(''));
}

const main = () => {
  userInput();
}

rl.on('pushString', (ops) => {
  // console.log("pushString: ", ops);
  pushString(ops);
});

rl.on('preprocessing', (param) => {
  // console.log("Event work!: ", param);
  const ops = inputPreprocessing(...param);
  rl.emit('pushString', ops);
});

main();
