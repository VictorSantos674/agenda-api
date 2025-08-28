using Microsoft.EntityFrameworkCore;
using AgendaAPI.Data;
using AgendaAPI.Models;
using AgendaAPI.Repositories;

public class ContatoRepository : IContatoRepository
{
    private readonly AgendaContext _context;

    public ContatoRepository(AgendaContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Contato>> GetAllAsync() => 
        await _context.Contatos.ToListAsync();

    public async Task<Contato?> GetByIdAsync(int id) => 
        await _context.Contatos.FindAsync(id);

    public async Task<Contato> AddAsync(Contato contato)
    {
        _context.Contatos.Add(contato);
        await _context.SaveChangesAsync();
        return contato;
    }

    public async Task UpdateAsync(Contato contato)
    {
        _context.Entry(contato).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var contato = await _context.Contatos.FindAsync(id);
        if (contato != null)
        {
            _context.Contatos.Remove(contato);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> EmailExistsAsync(string email, int? excludeId = null) => 
        await _context.Contatos.AnyAsync(c => c.Email == email && c.Id != excludeId);

    public async Task<bool> TelefoneExistsAsync(string telefone, int? excludeId = null) => 
        await _context.Contatos.AnyAsync(c => c.Telefone == telefone && c.Id != excludeId);
}