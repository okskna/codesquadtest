const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'CUBE> '
});

const userInput = () => {
  let ret = [];
  rl.prompt();
  rl.on('line', (input) => {
    console.log(`Received: ${input}`);
    ret = input.split('');
    rl.emit('preprocessing', ret);
    console.log();
    rl.prompt();
  }).on('SIGINT', () => {
    rl.question('Are you sure you want to exit? ', (answer) => {
      if (answer.match(/^y(es)?$/i)) rl.pause();
    });
  }).on('close', () => {
    console.log('Bye~');
    process.exit(0);
  });

  return ret;
}

const inputPreprocessing = (...ops) => {
  
  let ret = ops.reduce( (pre, op) => {
    if (op.match(/(U|R|L|B|Q)/i)) {
      pre.push(op);
      return pre;
    } else if (op === '`') {
      pre.push(pre.pop() + '`');
      return pre;
    } else {
      throw('An invalid value was entered.');
    }
  }, [] );

  console.log('inputPreprocessing ret: ', ret);
  return ret;
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
  try {
    const ops = inputPreprocessing(...param);
    rl.emit('pushString', ops);
  } catch (msg) {
    console.log('Error: ', msg);
  }
});

main();
