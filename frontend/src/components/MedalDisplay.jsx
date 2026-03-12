export default function MedalDisplay({ rank }) {

  if (rank === 1) {
    return <span className="text-yellow-400 text-xl">🥇</span>;
  }

  if (rank === 2) {
    return <span className="text-gray-300 text-xl">🥈</span>;
  }

  if (rank === 3) {
    return <span className="text-orange-500 text-xl">🥉</span>;
  }

  return (
    <span className="text-gray-400 font-semibold">
      {rank}
    </span>
  );
}