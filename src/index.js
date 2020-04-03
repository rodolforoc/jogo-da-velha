import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
 renderRow(number){
    const squares = [];
    for(let i = number ; i< number + 3; i++) {
      squares.push(
        <Square  
          key={i}
          value={this.props.squares[i]} 
          onClick={() => this.props.onClick(i)}
        />
      )
    }
    return (
      <div className="board-row">
        {squares}
      </div>
    );
  }


  render() {
    const rows = [];
    for(let i= 0; i <= 6; i += 3) {
      rows.push(
        this.renderRow(i)
      )
    }

    return (
      <div>
        {rows}    
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props); // Sempre chamar o super ao definir o constructor de uma subclasse
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        row: null,
        col: null,
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice(); // Copia o array
    let row = current.row;
    let col = current.col;

    // Define as Rows
    if(i === 0 || i === 1 || i === 2){ 
      row = 1;
    } else if (i === 3 || i === 4 || i === 5) {
      row = 2;
    } else {
      row = 3;
    }

    // Define as Cols
    if(i === 0 || i === 3 || i === 6){
      col = 1;
    } else if (i === 1 || i === 4 || i === 7) {
      col = 2;
    } else {
      col = 3;
    }


    if(calculateWinner(squares) || squares[i]){ // Caso alguem tenha vencido ou se o quadrado ja esteja ocupado
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{ // Preferível o uso do concat ao invés do push() por nao modificar o array original
        squares: squares,
        row: row,
        col: col,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';

      const bold = step.row === current.row && step.col === current.col ?
        <button onClick={() => this.jumpTo(move)}><b>{desc}-({step.row},{step.col})</b></button> :
        <button onClick={() => this.jumpTo(move)}>{desc}-({step.row},{step.col})</button>;
        return (
          <li key={move}>
            {bold}
          </li>
        );
    });

    let status;
    if (winner) {
      status = 'Winner:' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
