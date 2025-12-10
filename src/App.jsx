import { useState, useRef, useEffect } from "react";
import "./App.css";

const board = {
  1: 38,
  4: 14,
  9: 31,
  16: 6,
  21: 42,
  28: 84,
  36: 44,
  47: 26,
  51: 67,
  56: 53,
  62: 19,
  64: 60,
  71: 91,
  80: 100,
  87: 24,
  93: 73,
  95: 75,
  98: 78,
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const App = () => {
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState([
    {
      name: "Player 1",
      currentPosition: 0,
      story: [],
      colorClass: "player-1",
    },
    {
      name: "Player 2",
      currentPosition: 0,
      story: [],
      colorClass: "player-2",
    },
  ]);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState("");
  const listRefs = useRef([]);

  useEffect(() => {
    listRefs.current.forEach((list) => {
      if (list) {
        list.scrollTop = list.scrollHeight;
      }
    });
  }, [players]);

  const setCountAndPlayers = (count) => {
    setPlayerCount(count);

    const newPlayers = [];
    for (let i = 0; i < count; i++) {
      newPlayers.push({
        name: `Player ${i + 1}`,
        currentPosition: 0,
        story: [],
        colorClass: `player-${i + 1}`,
      });
    }

    setPlayers(newPlayers);
  };

  const updatePlayerCount = (e) => {
    const count = parseInt(e.target.value, 10);
    setCountAndPlayers(count);
  };

  const playGame = async () => {
    setGameStarted(true);
    let mostAdvancedSpace = 0;
    let playerTurnIndex = 0;
    let tempPlayers = structuredClone(players);
    let winner;

    while (mostAdvancedSpace < 100) {
      let currentPlayer = tempPlayers[playerTurnIndex];
      let roll = Math.floor(Math.random() * 6 + 1);

      if (currentPlayer.currentPosition + roll > 100) {
        currentPlayer.story.push(
          "Roll exceeded 100! Player still on " + currentPlayer.currentPosition
        );
      } else {
        currentPlayer.currentPosition = currentPlayer.currentPosition + roll;

        currentPlayer.story.push(
          currentPlayer.name +
            " landed on " +
            currentPlayer.currentPosition +
            "."
        );

        if (board[currentPlayer.currentPosition]) {
          if (
            currentPlayer.currentPosition < board[currentPlayer.currentPosition]
          ) {
            currentPlayer.currentPosition =
              board[currentPlayer.currentPosition];
            currentPlayer.story.push(
              "Ladder! " +
                currentPlayer.name +
                " now on " +
                currentPlayer.currentPosition +
                "!"
            );
          } else {
            currentPlayer.currentPosition =
              board[currentPlayer.currentPosition];
            currentPlayer.story.push(
              "Chute! " +
                currentPlayer.name +
                " now on " +
                currentPlayer.currentPosition +
                "!"
            );
          }
        }
      }

      playerTurnIndex = (playerTurnIndex + 1) % playerCount;
      mostAdvancedSpace = tempPlayers.reduce((acc, player) => {
        if (player.currentPosition > acc) {
          acc = player.currentPosition;
          winner = player.name;
        }
        return acc;
      }, 0);

      setPlayers([...tempPlayers]);
      await sleep(200);
    }

    setWinner(winner);
  };

  const resetGame = () => {
    setGameStarted(false);
    setCountAndPlayers(2);
    setWinner("");
  };

  return (
    <div className="gameWrapper">
      {!gameStarted ? (
        <div className="startCard">
          <div className="gameHeader">
            <h3>Chutes and Ladders</h3>
            <p>
              Want to play Chutes and Ladders, but don't have the time? Play it
              here!
            </p>
          </div>

          <div className="gameControls">
            <div className="playerSelect">
              <label>
                SELECT PLAYERS:
                <select onChange={updatePlayerCount} value={playerCount}>
                  <option value="2">Two (2)</option>
                  <option value="3">Three (3)</option>
                  <option value="4">Four (4)</option>
                </select>
              </label>
            </div>

            <button className="playButton" onClick={playGame}>
              START
            </button>
          </div>
        </div>
      ) : (
        <div className="boardContainer">
          <div className="boardHeader">
            <h3>RACE IN PROGRESS</h3>
          </div>
          <div className="playerColumns">
            {players.map((player, playerIndex) => (
              <div
                className={`playerColumn ${player.colorClass}`}
                key={playerIndex}
              >
                <div className="playerTokenHeader">
                  <span className="tokenIcon">♟</span> {player.name}
                </div>
                <ul
                  className="storyList"
                  ref={(el) => (listRefs.current[playerIndex] = el)}
                >
                  {player.story.map((leg, legIndex) => (
                    <li key={legIndex}>{leg}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {winner && (
            <div className="winner-modal-overlay">
              <div className="winner-modal-box">
                {winner} wins!
                <button className="playButton againButton" onClick={resetGame}>
                  AGAIN
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
