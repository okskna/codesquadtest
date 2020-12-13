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
      new Plane([['W', 'W', 'W'], ['W', 'W', 'W'], ['W', 'W', 'W']], 'F'),
      new Plane([['O', 'O', 'O'], ['O', 'O', 'O'], ['O', 'O', 'O']], 'R'), 
      new Plane([['G', 'G', 'G'], ['G', 'G', 'G'], ['G', 'G', 'G']], 'B'), 
      new Plane([['Y', 'Y', 'Y'], ['Y', 'Y', 'Y'], ['Y', 'Y', 'Y']], 'L'),
      new Plane([['R', 'R', 'R'], ['R', 'R', 'R'], ['R', 'R', 'R']], 'D')
    ];

    this.print();
  }

  shuffle = () => {}

  turn = (side, dir) => {
    let idx1, idx2;
    let colors = [];
    let tempPlane;
    let swapDirList = [];
    switch (side) {
      case 'U':
        swapDirList = [1, 2, 3, 4];
        swapDirList.forEach( (planeIdx, idx) => {
          if (idx === 0) {
            colors = this.cube[planeIdx].plane[0];
          } else {
            idx1 = [0, 0, 0];
            idx2 = [0, 1, 2];
            let tempColors = this.cube[planeIdx].get(idx1, idx2);
            console.log('Cube: turn: tempColors: ', tempColors, colors);
            this.cube[planeIdx].insert(colors, idx1, idx2);
            colors = tempColors;
          }
        });
        console.log('Cube: turn: tempColors: ', colors);
        this.cube[swapDirList[0]].insert(colors, idx1, idx2);

        break;

      case 'D':
        swapDirList = [1, 4, 3, 2];
        swapDirList.forEach( (planeIdx, idx) => {
          if (idx === 0) {
            colors = this.cube[planeIdx].plane[2];
          } else {
            idx1 = [2, 2, 2];
            idx2 = [0, 1, 2];
            let tempColors = this.cube[planeIdx].get(idx1, idx2);
            console.log('Cube: turn: tempColors: ', tempColors, colors);
            this.cube[planeIdx].insert(colors, idx1, idx2);
            colors = tempColors;
          }
        });
        console.log('Cube: turn: tempColors: ', colors);
        this.cube[swapDirList[0]].insert(colors, idx1, idx2);

        break;

      case 'Q':
        rl.emit('close');
    }
  }

  print = () => {
    this.cube[0].print();
    for (let i = 0; i < 3; ++i) {
      let printStr = "";
      this.cube.forEach( (plane, idx) => {
        if (idx > 0 && idx < 5) {
          // console.log('Test: ', plane.plane[i].join(' '));
          printStr += plane.plane[i].join(' ') + '   ';
        }
      })
      console.log(printStr);
    }
    console.log();
    this.cube[5].print();
  }
}

const Plane = class {
  constructor (plane, pos) {
    this.plane = plane;
    this.pos = pos;
    // this.print();
  }

  insert = (colors, idx1, idx2) => {
    this.plane[idx1[0]][idx2[0]] = colors[0];
    this.plane[idx1[1]][idx2[1]] = colors[1];
    this.plane[idx1[2]][idx2[2]] = colors[2];
  }

  get = (idx1, idx2) => {
    // console.log("plane class: get: ", idx1, idx2);
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
    if (op.match(/(U|R|F|D|L|B|Q)/i)) {
      pre.push(op.toUpperCase());
      return pre;
    } else if (op === '`') {
      pre.push(pre.pop() + '`');
      return pre;
    } else if (op === '2') {
      pre.push(pre[pre.length - 1]);
    } else {
      throw('An invalid value was entered.');
    }
  }, [] );

  // console.log('inputPreprocessing ret: ', ret);
  return ret;
}

const main = () => {
  const cube = new Cube();

  rl.on('execute', (ops) => {
    // console.log("execute: ", ops);
    
    ops.forEach( op => {
      let dir = op[op.length - 1] === '`' ? 'R' : 'L';

      cube.turn(op[0], dir);
      cube.print();
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
