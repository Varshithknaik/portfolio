import { stats } from "@/data/content";

export default function Stats() {
  return (
    <div className="stats">
      {stats.map((s) => (
        <div className="stat" key={s.label}>
          <div className="num">{s.num}</div>
          <div className="label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
