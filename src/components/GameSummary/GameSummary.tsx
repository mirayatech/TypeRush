import styles from "./styles.module.css";

type GameSummaryProps = {
  calculateWPM: () => string | 0;
  points: number;
  mistakes: number;
  earnedPoints: number;
  handleReplay: () => void;
};

export default function GameSummary({
  calculateWPM,
  points,
  mistakes,
  earnedPoints,
  handleReplay,
}: GameSummaryProps) {
  return (
    <div className={styles.wrapper}>
      <p>
        WPM: <span>{calculateWPM()}</span>
      </p>
      <p>
        Total Points: <span>{points - mistakes + earnedPoints}</span>
      </p>
      <p>
        Points Earned: <span>{earnedPoints}</span>
      </p>
      <p>
        Letter Mistakes: <span>{mistakes}</span>
      </p>
      <p>
        Total Points Calculation:{" "}
        <span>
          {`(${points} points) - (${mistakes} mistakes) + (${earnedPoints} earned points) = ${
            points - mistakes + earnedPoints
          }`}
        </span>
      </p>
      <button onClick={handleReplay} className={styles.replayButton}>
        Play Again
      </button>
    </div>
  );
}
