using MediatR;
using AgendaAPI.Models;

namespace AgendaAPI.Queries
{
    public class GetContatoQuery : IRequest<Contato>
    {
        public int Id { get; set; }
    }

    public class GetAllContatosQuery : IRequest<IEnumerable<Contato>>
    {
    }

    public class SearchContatosQuery : IRequest<IEnumerable<Contato>>
    {
        public string Term { get; set; } = string.Empty;
    }
}