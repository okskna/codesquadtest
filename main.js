const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'CUBE> '
});

const Cube = class {
  constructor() {
    this.cube = [
      new Plane([['B', 'B', 'B'], ['B', 'B', 'B'], ['B', 'B', 'B']], 'U'),
      new Plane([['R', 'R', 'R'], ['R', 'R', 'R'], ['R', 'R', 'R']], 'D'), 
      new Plane([['W', 'W', 'W'], ['W', 'W', 'W'], ['W', 'W', 'W']], 'R'), 
      new Plane([['O', 'O', 'O'], ['O', 'O', 'O'], ['O', 'O', 'O']], 'L'), 
      new Plane([['G', 'G', 'G'], ['G', 'G', 'G'], ['G', 'G', 'G']], 'F'), 
      new Plane([['Y', 'Y', 'Y'], ['Y', 'Y', 'Y'], ['Y', 'Y', 'Y']], 'B')
    ];
  }

  shuffle = () => {}

  turn = (side, dir) => {
    let defaultDir;
    switch (side) {
      case 'U':
        break;
      
      case 'Q':
        rl.emit('close');
    }
  }
}

const Plane = class {
  constructor (plane, pos) {
    this.plane = plane;
    this.pos = pos;
    this.print();
  }

  insert = (colors, idx1, idx2) => {
    this.plane[idx1[0]][idx2[0]] = colors[0];
    this.plane[idx1[1]][idx2[1]] = colors[1];
    this.plane[idx1[2]][idx2[2]] = colors[2];
  }

  get = (idx1, idx2) => {
    return [ this.plane[idx1[0]][idx2[0]], this.plane[idx1[1]][idx2[1]], this.plane[idx1[2]][idx2[2]] ];
  }

  print = () => {
    this.plane.forEach( row => {
      console.log(row.join(' '));
    });
    
    console.log();
  }
}

const userInput = () => {
  let ret = [];
  rl.prompt();
  rl.on('line', (input) => {
    // console.log(`Received: ${input}`);
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
    if (op.match(/(U|R|F|Q)/i)) {
      pre.push(op.toUpperCase());
      return pre;
    } else if (op === '`') {
      pre.push(pre.pop() + '`');
      return pre;
    } else {
      throw('An invalid value was entered.');
    }
  }, [] );

  // console.log('inputPreprocessing ret: ', ret);
  return ret;
}

const main = () => {
  const plane = new Plane();

  rl.on('execute', (ops) => {
    // console.log("execute: ", ops);
    
    ops.forEach( op => {
      let dir = op[op.length - 1] === '`' ? 'R' : 'L';

      plane.turn(op[0], dir);
      plane.print();
    })
  });
  
  rl.on('preprocessing', (param) => {
    // console.log("Event work!: ", param);
    try {
      const ops = inputPreprocessing(...param);
      rl.emit('execute', ops);
    } catch (msg) {
      console.log('Error: ', msg);
    }
  });

  userInput();
}

main();
