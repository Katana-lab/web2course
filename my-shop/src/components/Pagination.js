export default function Pagination({ totalPages, currentPage, setPage }) {
  return (
    <div className="pagination">
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          className={currentPage === i ? "active" : ""}
          onClick={() => setPage(i)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
