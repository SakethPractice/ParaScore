import MedalDisplay from "./MedalDisplay";
import RankChangeIndicator from "./RankChangeIndicator";

export default function ScoreRow({ player, rank }) {

  const rankChange = player.rankChange ?? 0;

  return (
    <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg mb-2 hover:bg-gray-700 transition">

      <div className="flex items-center gap-4">

        <MedalDisplay rank={rank} />

        <span className="text-white font-semibold">
          {player.name}
        </span>

        <RankChangeIndicator change={rankChange} />

      </div>

      <div className="text-green-400 font-bold text-lg">
        {player.score}
      </div>

    </div>
  );
}