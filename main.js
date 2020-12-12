const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const userInput = () => {
  let ret = [];
  rl.on('line', (input) => {
    console.log(`Received: ${input}`);
    ret = input.split(' ');
    rl.emit('myEvent', ret);
  }).on('SIGINT', () => {
    rl.question('Are you sure you want to exit? ', (answer) => {
      if (answer.match(/^y(es)?$/i)) rl.pause();
    });
  });

  return ret;
}

rl.on('myEvent', (param) => {
  console.log("Event work!: ", param);
})


const main = () => {
  userInput();
  
}

main();