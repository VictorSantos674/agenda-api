using AgendaAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace AgendaAPI.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AgendaContext context)
        {
            context.Database.EnsureCreated();

            if (!context.Contatos.Any())
            {
                var contatos = new[]
                {
                    new Models.Contato { Nome = "João Silva", Email = "joao@email.com", Telefone = "11999999999" },
                    new Models.Contato { Nome = "Maria Santos", Email = "maria@email.com", Telefone = "11999999998" },
                    new Models.Contato { Nome = "Pedro Oliveira", Email = "pedro@email.com", Telefone = "11999999997" }
                };

                context.Contatos.AddRange(contatos);
                context.SaveChanges();
            }
        }
    }
}