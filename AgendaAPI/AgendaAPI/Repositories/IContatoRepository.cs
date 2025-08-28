using AgendaAPI.Models;

namespace AgendaAPI.Repositories
{
    public interface IContatoRepository
    {
        Task<IEnumerable<Contato>> GetAllAsync();
        Task<Contato?> GetByIdAsync(int id);
        Task<Contato> AddAsync(Contato contato);
        Task UpdateAsync(Contato contato);
        Task DeleteAsync(int id);
        Task<bool> EmailExistsAsync(string email, int? excludeId = null);
        Task<bool> TelefoneExistsAsync(string telefone, int? excludeId = null);
    }
}