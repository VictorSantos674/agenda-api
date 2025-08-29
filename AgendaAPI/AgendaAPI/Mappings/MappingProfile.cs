using AutoMapper;
using AgendaAPI.Models;
using AgendaAPI.Commands;

namespace AgendaAPI.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Commands to Models
            CreateMap<AddContatoCommand, Contato>()
                .ForMember(dest => dest.DataCriacao, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.DataAtualizacao, opt => opt.Ignore());

            CreateMap<UpdateContatoCommand, Contato>()
                .ForMember(dest => dest.DataAtualizacao, opt => opt.MapFrom(_ => DateTime.UtcNow))
                .ForMember(dest => dest.DataCriacao, opt => opt.Ignore());

            CreateMap<Contato, Contato>();
        }
    }
}