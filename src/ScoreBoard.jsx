import React from "react";

const ScoreBoard = ({ scores, bestScores }) => {
  return (
    <div>
      <p>Score: {scores}</p>
      <p>Best Score: {bestScores}</p>
    </div>
  );
};

export default ScoreBoard;
