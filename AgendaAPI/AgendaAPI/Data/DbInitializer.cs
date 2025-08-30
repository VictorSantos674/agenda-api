using AgendaAPI.Models;
using AgendaAPI.Services;
using Microsoft.EntityFrameworkCore;

namespace AgendaAPI.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AgendaContext context)
        {
            context.Database.EnsureCreated();

            // Initialize contacts if needed
            if (!context.Contatos.Any())
            {
                var contatos = new[]
                {
                    new Contato { Nome = "João Silva", Email = "joao@email.com", Telefone = "11999999999" },
                    new Contato { Nome = "Maria Santos", Email = "maria@email.com", Telefone = "11999999998" },
                    new Contato { Nome = "Pedro Oliveira", Email = "pedro@email.com", Telefone = "11999999997" }
                };

                context.Contatos.AddRange(contatos);
                context.SaveChanges();
            }

            // Initialize default user if needed
            if (!context.Usuarios.Any())
            {
                // User will be created by the AuthService in Program.cs
            }
        }
    }
}