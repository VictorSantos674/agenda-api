using AgendaAPI.Models;
using AgendaAPI.Services;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

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
                var usuario = new Usuario
                {
                    Nome = "Administrador",
                    Email = "admin@agenda.com",
                    SenhaHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    DataCriacao = DateTime.UtcNow
                };

                context.Usuarios.Add(usuario);
                context.SaveChanges();
                Console.WriteLine("Usuário padrão criado: admin@agenda.com / Admin@123");
            }
        }
    }
}