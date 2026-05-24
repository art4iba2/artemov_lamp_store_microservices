function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Назад
      </button>

      <span>
        Страница {page} из {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
      >
        Вперёд
      </button>
    </div>
  );
}

export default Pagination;