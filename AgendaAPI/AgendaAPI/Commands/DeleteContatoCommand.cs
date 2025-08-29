using MediatR;

namespace AgendaAPI.Commands
{
    public class DeleteContatoCommand : IRequest<bool>
    {
        public int Id { get; set; }
    }
}