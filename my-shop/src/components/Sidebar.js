export default function Sidebar({ selectedModel, setSelectedModel }) {
  const models = [
    "Усі",
    "iPhone 11",
    "iPhone 12",
    "iPhone 13",
    "iPhone 14",
    "iPhone 15",
  ];

  return (
    <aside className="sidebar">
      <h3>Моделі iPhone</h3>
      <ul>
        {models.map((m) => (
          <li
            key={m}
            className={selectedModel === m ? "active" : ""}
            onClick={() => setSelectedModel(m)}
          >
            {m}
          </li>
        ))}
      </ul>
    </aside>
  );
}
