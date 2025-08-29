using MediatR;
using AgendaAPI.Models;

namespace AgendaAPI.Commands
{
    public class AddContatoCommand : IRequest<Contato>
    {
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
    }
}