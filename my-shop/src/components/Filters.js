export default function Filters({ sort, setSort }) {
  return (
    <div className="filters">
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="default">Сортування</option>
        <option value="cheap">Спочатку дешеві</option>
        <option value="expensive">Спочатку дорогі</option>
      </select>
    </div>
  );
}
