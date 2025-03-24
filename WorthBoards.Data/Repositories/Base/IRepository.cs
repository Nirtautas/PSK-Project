using System.Linq.Expressions;

namespace WorthBoards.Data.Repositories.Base
{
    public interface IRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken);

        Task<T?> GetByIdStringAsync(string id, CancellationToken cancellationToken = default);

        Task<T?> GetByIdDateTimeAsync(DateTime id, CancellationToken cancellationToken = default);

        Task<T?> GetByExpressionAsync(Expression<Func<T, bool>> predicate,
         CancellationToken cancellationToken = default);

        Task<T?> GetByExpressionWithIncludesAsync(Expression<Func<T, bool>> predicate,
            CancellationToken cancellationToken = default, params Expression<Func<T, object>>[] includes);

        Task<(List<T> Results, int TotalCount)> GetByExpressionWithIncludesAndPaginationAsync(
            Expression<Func<T, bool>> predicate, int pageSize, int pageNumber,
            CancellationToken cancellationToken = default, params Expression<Func<T, object>>[] includes);

        Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken = default);
        Task<(List<T> Results, int TotalCount)> GetAllByExpressionWithPaginationAsync(
        Expression<Func<T, bool>> predicate,
        int pageSize,
        int pageNumber,
        CancellationToken cancellationToken = default);

        Task<(IReadOnlyList<T> Results, int TotalCount)> GetAllWithPaginationAsync(
        int pageSize, int pageNumber, CancellationToken cancellationToken = default);

        Task<(IReadOnlyList<T> Results, int TotalCount)> GetByExpressionWithPaginationAsync(Expression<Func<T, bool>>? predicate, int pageSize, int pageNumber,
            CancellationToken cancellationToken = default);

        Task<List<T>> GetAllByExpressionWithIncludesAsync(Expression<Func<T, bool>> predicate,
            CancellationToken cancellationToken = default, params Expression<Func<T, object>>[] includes);

        Task<(List<T> Results, int TotalCount)> GetAllWithIncludesAndPaginationAsync(int pageSize, int pageNumber,
            CancellationToken cancellationToken = default, params Expression<Func<T, object>>[] includes);

        Task<List<T>> GetAllByExpressionAsync(Expression<Func<T, bool>> predicate,
            CancellationToken cancellationToken = default);

        Task<(IEnumerable<T>, int)> GetAllByExpressionWithIncludesAndPaginationAsync(
        Expression<Func<T, bool>> predicate, int pageSize, int pageNum,
        CancellationToken cancellationToken, params Expression<Func<T, object>>[] includes);

        Task CreateAsync(T entity, CancellationToken cancellationToken = default);

        Task CreateRangeAsync(List<T> range);

        void Delete(T entity);
    }
}

