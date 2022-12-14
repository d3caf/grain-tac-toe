import "./App.css";
import { useEffect, useState } from "react";

type CellValue = "x" | "o";
type GameState = Array<CellValue>;

function App() {
  const [turn, setTurn] = useState<CellValue>("x");

  const [size, setSize] = useState<number>(3);

  const [state, setState] = useState<GameState>([
    ...Array(Math.pow(size, 2)).fill(null),
  ]);

  // Update game state when size changes
  useEffect(() => {
    setState([...Array(Math.pow(size, 2))].fill(null));
  }, [size]);

  const advanceTurn = () =>
    setTurn((turn) => {
      return turn === "x" ? "o" : "x";
    });

  const mark = (clickedIdx: number) => {
    if (state[clickedIdx] !== null) return;

    advanceTurn();

    setState((state) => {
      const newState = state.map((val, index) => {
        if (clickedIdx === index) {
          return turn;
        }
        return val;
      });

      return newState;
    });
  };

  return (
    <div id="app">
      <h1>🌾 Grain-Tac-Toe</h1>
      <div
        className="gameBoard"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gridTemplateRows: `repeat(${size}, 1fr)`,
        }}
      >
        {[...Array(Math.pow(size, 2))].map((row, index) => (
          <Cell key={index} value={state[index]} onClick={() => mark(index)} />
        ))}
      </div>

      <div className="controls">
        <button
          onClick={() => setSize((size) => size - 1)}
          disabled={size === 3}
        >
          -
        </button>
        <button
          onClick={() => setSize((size) => size + 1)}
          disabled={size === 6}
        >
          +
        </button>
      </div>
    </div>
  );
}

interface ICellProps {
  value?: CellValue;
  onClick: any;
}

const Cell = ({ value, onClick }: ICellProps) => (
  <div className="cell" onClick={onClick}>
    {!!value && (value === "x" ? "❌" : "⭕️")}
  </div>
);

export default App;
