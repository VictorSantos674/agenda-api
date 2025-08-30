using AgendaAPI.Models;

namespace AgendaAPI.Services
{
    public interface IAuthService
    {
        Task<LoginResponse> LoginAsync(LoginRequest request);
        Task<Usuario> RegistrarAsync(Usuario usuario, string senha);
        Task<bool> EmailExisteAsync(string email);
    }
}