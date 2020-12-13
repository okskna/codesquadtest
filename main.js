const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'CUBE> '
});

const Plane = class {
  constructor () {
    this.plane = [['R', 'R', 'W'], ['G', 'C', 'W'], ['G', 'B', 'B']];
    this.print();
  }

  turn = (side, dir) => {
    let defaultDir;
    switch (side) {
      case 'U':
        // 왼쪽
        defaultDir = [0, 1, 2];
        if (dir === 'R') defaultDir = defaultDir.reverse();

        this._swap(0, defaultDir);
        break;
      case 'B':
        // 오른쪽
        defaultDir = [2, 1, 0];
        if (dir === 'R') defaultDir = defaultDir.reverse();

        this._swap(2, defaultDir);
        break;
      case 'R':
        // 위
        defaultDir = [0, 1, 2];
        if (dir === 'R') defaultDir = defaultDir.reverse();

        this._swap(defaultDir, 2);
        break;
      case 'L':
        // 아래
        defaultDir = [2, 1, 0];
        if (dir === 'R') defaultDir = defaultDir.reverse();

        this._swap(defaultDir, 0);
        break;
      case 'Q':
        rl.emit('close');
    }
  }

  _swap = (idx1, idx2) => {
    if (typeof idx1 === 'number') {
      let temp = this.plane[idx1][idx2[0]];
      this.plane[idx1][idx2[0]] = this.plane[idx1][idx2[1]];
      this.plane[idx1][idx2[1]] = this.plane[idx1][idx2[2]];
      this.plane[idx1][idx2[2]] = temp;
    } else {
      let temp = this.plane[idx1[0]][idx2];
      this.plane[idx1[0]][idx2] = this.plane[idx1[1]][idx2];
      this.plane[idx1[1]][idx2] = this.plane[idx1[2]][idx2];
      this.plane[idx1[2]][idx2] = temp;
    }
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
