using Microsoft.AspNetCore.Mvc;
using AgendaAPI.Models;
using AgendaAPI.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace AgendaAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var response = await _authService.LoginAsync(request);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }

        [HttpPost("registrar")]
        [AllowAnonymous]
        public async Task<IActionResult> Registrar([FromBody] RegistrarRequest request)
        {
            try
            {
                var usuario = new Usuario
                {
                    Nome = request.Nome,
                    Email = request.Email
                };

                var usuarioCriado = await _authService.RegistrarAsync(usuario, request.Senha);
                
                return Ok(new { 
                    message = "Usuário criado com sucesso",
                    usuario = new UsuarioDto
                    {
                        Id = usuarioCriado.Id,
                        Nome = usuarioCriado.Nome,
                        Email = usuarioCriado.Email
                    }
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("usuario")]
        [Authorize]
        public IActionResult GetUsuarioInfo()
        {
            var usuarioDto = new UsuarioDto
            {
                Id = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value),
                Nome = User.FindFirst(ClaimTypes.Name)!.Value,
                Email = User.FindFirst(ClaimTypes.Email)!.Value
            };

            return Ok(usuarioDto);
        }
    }

    public class RegistrarRequest
    {
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
    }
}