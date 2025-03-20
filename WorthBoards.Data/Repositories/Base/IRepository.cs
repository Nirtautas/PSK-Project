using System.Linq.Expressions;

namespace WorthBoards.Data.Repositories.Base;

public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken);

    Task<T?> GetByExpressionAsync(Expression<Func<T, bool>> predicate,
     CancellationToken cancellationToken = default);

    Task<T?> GetByExpressionWithIncludesAsync(Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default, params Expression<Func<T, object>>[] includes);

    Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<List<T>> GetAllByExpressionWithIncludesAsync(Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default, params Expression<Func<T, object>>[] includes);

    Task<List<T>> GetAllByExpressionAsync(Expression<Func<T, bool>> predicate,
        CancellationToken cancellationToken = default);

    Task CreateAsync(T entity, CancellationToken cancellationToken = default);

    Task CreateRangeAsync(List<T> range);

    void Delete(T entity);
}
