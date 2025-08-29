using AgendaAPI.Models;

namespace AgendaAPI.Services
{
    public interface IContatoService
    {
        Task<IEnumerable<Contato>> GetAllAsync();
        Task<Contato?> GetByIdAsync(int id);
        Task<Contato> CreateAsync(Contato contato);
        Task<Contato> UpdateAsync(Contato contato);
        Task<bool> DeleteAsync(int id);
        Task<bool> EmailExistsAsync(string email, int? excludeId = null);
        Task<bool> TelefoneExistsAsync(string telefone, int? excludeId = null);
    }
}