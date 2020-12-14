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

    this.shuffle();
    this.print();
    this.min = 0;
    this.sec = 0;
    this.controlCount = 0;
  }

  timer = () => {
    setInterval(() => {
      this.sec += 1;
      if (this.sec >= 60) {
        this.sec -= 60;
        this.min += 1;
      }
    }, 1000);
  }

  complete = () => {
    let sumOfCompletePlane = 0;
    this.cube.forEach( plane => {
      if (plane.complete()) sumOfCompletePlane += 1;
    })
    if (sumOfCompletePlane === 6) {
      return true;
    }
    return false;
  }

  shuffle = () => {
    const opInTheBox = ['U', 'F', 'R', 'B', 'L', 'D'];
    let randomOpList = [];

    const opSize = Math.floor(Math.random() * (11 - 5) + 5);

    Array(opSize).fill(0).forEach( _ => {
      randomOpList.push(opInTheBox[ Math.floor(Math.random() * (5 - 0 + 1) )]);
    });
    
    let shuffleList = [];
    randomOpList.forEach( op => {
      let dir = Math.floor(Math.random() * 2) === 0 ? 'R' : 'L';
      this.turn(op, dir);

      shuffleList.push(dir === 'R' ? op : op + '`');
    });

    console.log('Cube: shuffle: randomOpList: ', shuffleList);
  }

  turn = (side, dir) => {
    this.controlCount += 1;

    let idx1, idx2;
    let colors = [];
    let tempPlane;
    let swapDirList = [];
    switch (side) {
      case 'U':
        swapDirList = [1, 2, 3, 4];
        if (dir === 'L') swapDirList = swapDirList.reverse();

        swapDirList.forEach( (planeIdx, idx) => {
          if (idx === 0) {
            colors = this.cube[planeIdx].plane[0];
          } else {
            idx1 = [0, 0, 0];
            idx2 = [0, 1, 2];
            let tempColors = this.cube[planeIdx].get(idx1, idx2);
            // console.log('Cube: turn: tempColors: ', tempColors, colors);
            this.cube[planeIdx].insert(colors, idx1, idx2);
            colors = tempColors;
          }
        });
        // console.log('Cube: turn: tempColors: ', colors);
        this.cube[swapDirList[0]].insert(colors, idx1, idx2);

        break;

      case 'D':
        swapDirList = [1, 4, 3, 2];
        if (dir === 'L') swapDirList = swapDirList.reverse();

        swapDirList.forEach( (planeIdx, idx) => {
          if (idx === 0) {
            colors = this.cube[planeIdx].plane[2];
          } else {
            idx1 = [2, 2, 2];
            idx2 = [0, 1, 2];
            let tempColors = this.cube[planeIdx].get(idx1, idx2);
            // console.log('Cube: turn: tempColors: ', tempColors, colors);
            this.cube[planeIdx].insert(colors, idx1, idx2);
            colors = tempColors;
          }
        });
        // console.log('Cube: turn: tempColors: ', colors);
        this.cube[swapDirList[0]].insert(colors, idx1, idx2);

        break;

      case 'R':
        swapDirList = [1, 0, 3, 5];
        if (dir === 'L') swapDirList = swapDirList.reverse();

        swapDirList.forEach( (planeIdx, idx) => {
          idx1 = [0, 1, 2];
          idx2 = [2, 2, 2];
          if (idx === 0) {
            colors = this.cube[planeIdx].get(idx1, idx2);
          } else {
            if (planeIdx === 3) {
              idx1 = [0, 1, 2];
              idx2 = [0, 0, 0];
            }
            let tempColors = this.cube[planeIdx].get(idx1, idx2);
            // console.log('Cube: turn: tempColors: ', tempColors, colors);
            this.cube[planeIdx].insert(colors, idx1, idx2);
            colors = tempColors;
          }
        });
        // console.log('Cube: turn: tempColors: ', colors);
        this.cube[swapDirList[0]].insert(colors, idx1, idx2);

        break;

      case 'L':
        swapDirList = [1, 5, 3, 0];
        if (dir === 'L') swapDirList = swapDirList.reverse();

        swapDirList.forEach( (planeIdx, idx) => {
          idx1 = [0, 1, 2];
          idx2 = [0, 0, 0];
          if (idx === 0) {
            colors = this.cube[planeIdx].get(idx1, idx2);
          } else {
            if (planeIdx === 3) {
              idx1 = [0, 1, 2];
              idx2 = [2, 2, 2];
            }
            let tempColors = this.cube[planeIdx].get(idx1, idx2);
            // console.log('Cube: turn: tempColors: ', tempColors, colors);
            this.cube[planeIdx].insert(colors, idx1, idx2);
            colors = tempColors;
          }
        });
        // console.log('Cube: turn: tempColors: ', colors);
        this.cube[swapDirList[0]].insert(colors, idx1, idx2);

        break;

      case 'F':
        swapDirList = [0, 2, 5, 4];
        if (dir === 'L') swapDirList = [0, 4, 5, 2];

        swapDirList.forEach( (planeIdx, idx) => {
          if (idx === 0) {
            idx1 = [2, 2, 2];
            idx2 = [0, 1, 2];
            colors = this.cube[planeIdx].get(idx1, idx2);
          } else {
            if        (planeIdx === 2) {
              idx1 = [0, 1, 2];
              idx2 = [0, 0, 0];
            } else if (planeIdx === 5) {
              idx1 = [0, 0, 0];
              idx2 = [2, 1, 0];
            } else if (planeIdx === 4) {
              idx1 = [2, 1, 0];
              idx2 = [2, 2, 2];
            }
            let tempColors = this.cube[planeIdx].get(idx1, idx2);
            // console.log('Cube: turn: tempColors: ', tempColors, colors);
            this.cube[planeIdx].insert(colors, idx1, idx2);
            colors = tempColors;
          }
        });
        // console.log('Cube: turn: tempColors: ', colors);
        idx1 = [2, 2, 2];
        idx2 = [0, 1, 2];
        this.cube[swapDirList[0]].insert(colors, idx1, idx2);

        break;

      case 'B':
        swapDirList = [0, 4, 5, 2];
        if (dir === 'L') swapDirList = [0, 2, 5, 4];

        swapDirList.forEach( (planeIdx, idx) => {
          if (idx === 0) {
            idx1 = [0, 0, 0];
            idx2 = [0, 1, 2];
            colors = this.cube[planeIdx].get(idx1, idx2);
          } else {
            if        (planeIdx === 2) {
              idx1 = [0, 1, 2];
              idx2 = [2, 2, 2];
            } else if (planeIdx === 5) {
              idx1 = [2, 2, 2];
              idx2 = [2, 1, 0];
            } else if (planeIdx === 4) {
              idx1 = [2, 1, 0];
              idx2 = [0, 0, 0];
            }
            let tempColors = this.cube[planeIdx].get(idx1, idx2);
            // console.log('Cube: turn: tempColors: ', tempColors, colors);
            this.cube[planeIdx].insert(colors, idx1, idx2);
            colors = tempColors;
          }
        });
        // console.log('Cube: turn: tempColors: ', colors);
        idx1 = [0, 0, 0];
        idx2 = [0, 1, 2];
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
    console.log('-----------------------------------------');
  }
}

const Plane = class {
  constructor (plane, pos) {
    this.plane = plane;
    this.pos = pos;
    // this.print();
  }

  complete = () => {
    let sumOfSameEle = 0;
    this.plane.forEach( row => {
      row.forEach( ele => {
        if (ele === this.plane[0][0]) sumOfSameEle += 1;
      })
    });
    if (sumOfSameEle === 9) 
      return true;
    return false;
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
      if (answer.match(/^y(es)?$/i)) {
        rl.emit('close');
      };
    });
  }).on('close', () => {
    console.log('Bye~');
    process.exit(0);
  });

  return ret;
}

const inputPreprocessing = (...ops) => {
  console.log('inputPreprocessing: ops: ', ops);
  let ret = ops.reduce( (pre, op) => {
    if (op.match(/(U|R|F|D|L|B|Q)/i)) {
      pre.push(op.toUpperCase());
      return pre;
    } else if (op === '`') {
      pre.push(pre.pop() + '`');
      return pre;
    } else if (op === '2') {
      console.log(pre, pre[pre.length - 1]);
      pre.push(pre[pre.length - 1]);
      console.log(pre);
      return pre;
    } else {
      throw('An invalid value was entered.');
    }
  }, [] );

  console.log('inputPreprocessing ret: ', ret);
  return ret;
}

const main = () => {
  const cube = new Cube();

  rl.on('complete', () => {
    console.log('Congratuation~!!');
    console.log('경과시간: ', cube.min + ':' + cube.sec );
    console.log('조작개수: ', cube.controlCount);
    process.exit(0);
  })

  rl.on('execute', (ops) => {
    // console.log("execute: ", ops);
    
    ops.forEach( op => {
      let dir = op[op.length - 1] === '`' ? 'L' : 'R';

      cube.turn(op[0], dir);
      cube.print();

      if (cube.complete()) {
        rl.emit('complete');
      }
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
  cube.timer();
}

main();
