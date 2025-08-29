using AgendaAPI.Models;
using AgendaAPI.Repositories;
using Microsoft.EntityFrameworkCore;

namespace AgendaAPI.Services
{
    public class ContatoService : IContatoService
    {
        private readonly IContatoRepository _contatoRepository;

        public ContatoService(IContatoRepository contatoRepository)
        {
            _contatoRepository = contatoRepository;
        }

        public async Task<IEnumerable<Contato>> GetAllAsync()
        {
            return await _contatoRepository.GetAllAsync();
        }

        public async Task<Contato?> GetByIdAsync(int id)
        {
            return await _contatoRepository.GetByIdAsync(id);
        }

        public async Task<Contato> CreateAsync(Contato contato)
        {
            return await _contatoRepository.AddAsync(contato);
        }

        public async Task<Contato> UpdateAsync(Contato contato)
        {
            await _contatoRepository.UpdateAsync(contato);
            return contato;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var contato = await _contatoRepository.GetByIdAsync(id);
            if (contato == null) return false;
            
            await _contatoRepository.DeleteAsync(id);
            return true;
        }

        public async Task<bool> EmailExistsAsync(string email, int? excludeId = null)
        {
            return await _contatoRepository.EmailExistsAsync(email, excludeId);
        }

        public async Task<bool> TelefoneExistsAsync(string telefone, int? excludeId = null)
        {
            return await _contatoRepository.TelefoneExistsAsync(telefone, excludeId);
        }
    }
}