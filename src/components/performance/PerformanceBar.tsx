export default function PerformanceBar({
  score,
  benchmark,
}: {
  score: number;
  benchmark: number;
}) {
  return (
    <div>
      <div>{score}</div>
      <div>{benchmark}</div>
    </div>
  );
}
