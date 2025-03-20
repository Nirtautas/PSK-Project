using Microsoft.EntityFrameworkCore;
using WorthBoards.Data.Database;
using System.Linq.Expressions;

namespace WorthBoards.Data.Repositories.Base;

public class Repository<T> : IRepository<T> where T : class
{
    protected readonly ApplicationDbContext _dbContext;
    protected readonly DbSet<T> _dbSet;

    public Repository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
        _dbSet = _dbContext.Set<T>();
    }

    public async Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FindAsync([id], cancellationToken);
    }

    public async Task<T?> GetByExpressionAsync(Expression<Func<T, bool>> predicate,
     CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(predicate)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<T?> GetByExpressionWithIncludesAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default,
        params Expression<Func<T, object>>[] includes)
    {
        return await ApplyIncludes(_dbSet.AsQueryable(), includes).FirstOrDefaultAsync(predicate, cancellationToken);
    }
    public async Task<IReadOnlyList<T>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.AsNoTracking().ToListAsync(cancellationToken);
    }


    public async Task<List<T>> GetAllByExpressionWithIncludesAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default,
        params Expression<Func<T, object>>[] includes)
    {
        return await ApplyIncludes(_dbSet.AsQueryable(), includes).Where(predicate).ToListAsync(cancellationToken);
    }

    public async Task<List<T>> GetAllByExpressionAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken = default)
    {
        return await _dbSet.Where(predicate).ToListAsync(cancellationToken);
    }

    public async Task CreateAsync(T entity, CancellationToken cancellationToken = default)
    {
        await _dbSet.AddAsync(entity, cancellationToken);
    }

    public async Task CreateRangeAsync(List<T> range)
    {
        await _dbSet.AddRangeAsync(range);
    }

    public void Delete(T entity)
    {
        _dbSet.Remove(entity);
    }

    private static IQueryable<T> ApplyIncludes(IQueryable<T> query, params Expression<Func<T, object>>[] includes)
    {
        foreach (var include in includes)
        {
            query = query.Include(include);
        }

        return query;
    }
}