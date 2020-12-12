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
    console.log(`Received: ${input}`);
    ret = input.split(' ');
    rl.emit('myEvent', ret);
    rl.prompt();
  }).on('SIGINT', () => {
    rl.question('Are you sure you want to exit? ', (answer) => {
      if (answer.match(/^y(es)?$/i)) rl.pause();
    });
  });

  return ret;
}

rl.on('myEvent', (param) => {
  console.log("Event work!: ", param);
  inputPreprocessing(...param);
});



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

    console.log('Res: ', word, numb, direction);
  } catch (msg) {
    console.log('Error(pushString): ', msg);
  }
}

const main = () => {
  userInput();
  
}

main();