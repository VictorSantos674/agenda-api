using MediatR;

namespace AgendaAPI.Commands
{
    public class UpdateContatoCommand : IRequest<Models.Contato>
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefone { get; set; } = string.Empty;
    }
}