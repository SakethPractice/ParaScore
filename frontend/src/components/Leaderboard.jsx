import ScoreRow from "./ScoreRow";

export default function Leaderboard({ title, scores }) {

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-lg">

      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        {title}
      </h2>

      <div>

        {scores.slice(0, 5).map((player, index) => (

          <ScoreRow
            key={player.id}
            player={player}
            rank={index + 1}
          />

        ))}

      </div>

    </div>
  );

}