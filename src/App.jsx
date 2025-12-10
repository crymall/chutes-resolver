import { useState } from "react";

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
    },
    {
      name: "Player 2",
      currentPosition: 0,
      story: [],
    },
  ]);
  const [gameStarted, setGameStarted] = useState(false);

  const updatePlayerCount = (e) => {
    setPlayerCount(e.target.value);

    const newPlayers = [];
    for (let i = 0; i < e.target.value; i++) {
      newPlayers.push({
        name: `Player ${i + 1}`,
        currentPosition: 0,
        story: [],
      });
    }

    setPlayers(newPlayers);
  };

  const playGame = async () => {
    setGameStarted(true);
    let mostAdvancedSpace = 0;
    let playerTurnIndex = 0;
    let tempPlayers = structuredClone(players);

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
        }
        return acc;
      }, 0);

      setPlayers([...tempPlayers]);
      await sleep(500);
    }
  };

  return (
    <>
      <div className="startScreen">
        <div className="gameDesc">
          <h3>Chutes and Ladders</h3>
          <p>
            The game "Chutes and Ladders" requires no player choice. It is,
            effectively, a complicated coin flip. Play it here and save time.
          </p>
        </div>

        <div className="gameForm">
          <div className="playerCount">
            <label>
              {" "}
              How many players?{" "}
              <select onChange={updatePlayerCount} value={playerCount}>
                <option value="2">Two</option>
                <option value="3">Three</option>
                <option value="4">Four</option>
              </select>
            </label>
          </div>

          <button className="startButton" onClick={playGame}>
            Play!
          </button>
        </div>
      </div>
      {gameStarted && (
        <div className="wholeRecap">
          <h3>Chutes and Ladders</h3>
          <div className="storiesContainer">
            {players.map((player, playerIndex) => (
              <ul className="playerStory" key={playerIndex}>
                {player.story.map((leg, legIndex) => (
                  <li key={legIndex}>{leg}</li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default App;
