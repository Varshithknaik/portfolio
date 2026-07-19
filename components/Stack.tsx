import { stack } from "@/data/content";

function ManifestLine({
  keyName,
  values,
  trailingComma = true,
}: {
  keyName: string;
  values: string[];
  trailingComma?: boolean;
}) {
  return (
    <div className="line">
      {"  "}
      <span className="key">&quot;{keyName}&quot;</span>
      {": ["}
      {values.map((v, i) => (
        <span key={v}>
          <span className="str">&quot;{v}&quot;</span>
          {i < values.length - 1 ? ", " : ""}
        </span>
      ))}
      {"]"}
      {trailingComma ? "," : ""}
    </div>
  );
}

export default function Stack() {
  return (
    <section id="stack">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-title">Stack</span>
        </div>
        <div className="manifest">
          <div className="line">{"{"}</div>
          <ManifestLine keyName="languages" values={stack.languages} />
          <ManifestLine keyName="frontend" values={stack.frontend} />
          <ManifestLine keyName="backend" values={stack.backend} />
          <ManifestLine keyName="tooling" values={stack.tooling} trailingComma={false} />
          <div className="line">{"}"}</div>
        </div>
      </div>
    </section>
  );
}
