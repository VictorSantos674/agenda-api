using Microsoft.AspNetCore.Mvc;
using AgendaAPI.Models;
using AgendaAPI.Services;
using AgendaAPI.Commands;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;

namespace AgendaAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ContatoController : ControllerBase
    {
        private readonly IContatoService _contatoService;
        private readonly IValidator<Contato> _validator;

        public ContatoController(
            IContatoService contatoService, 
            IValidator<Contato> validator)
        {
            _contatoService = contatoService;
            _validator = validator;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var contatos = await _contatoService.GetAllAsync();
            return Ok(contatos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var contato = await _contatoService.GetByIdAsync(id);
            if (contato == null) return NotFound();
            return Ok(contato);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AddContatoCommand command)
        {
            var contato = new Contato
            {
                Nome = command.Nome,
                Email = command.Email,
                Telefone = command.Telefone,
                DataCriacao = DateTime.UtcNow
            };

            var validationResult = await _validator.ValidateAsync(contato);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            if (await _contatoService.EmailExistsAsync(contato.Email))
                return BadRequest("Email já cadastrado");
            
            if (await _contatoService.TelefoneExistsAsync(contato.Telefone))
                return BadRequest("Telefone já cadastrado");

            var createdContato = await _contatoService.CreateAsync(contato);
            return CreatedAtAction(nameof(GetById), new { id = createdContato.Id }, createdContato);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateContatoCommand command)
        {
            if (id != command.Id) return BadRequest("ID mismatch");

            var existingContato = await _contatoService.GetByIdAsync(id);
            if (existingContato == null) return NotFound();

            existingContato.Nome = command.Nome;
            existingContato.Email = command.Email;
            existingContato.Telefone = command.Telefone;
            existingContato.DataAtualizacao = DateTime.UtcNow;

            var validationResult = await _validator.ValidateAsync(existingContato);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors);
            }

            if (await _contatoService.EmailExistsAsync(existingContato.Email, id))
                return BadRequest("Email já cadastrado");
            
            if (await _contatoService.TelefoneExistsAsync(existingContato.Telefone, id))
                return BadRequest("Telefone já cadastrado");

            var updatedContato = await _contatoService.UpdateAsync(existingContato);
            return Ok(updatedContato);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _contatoService.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string term)
        {
            if (string.IsNullOrEmpty(term))
                return BadRequest("Termo de busca é obrigatório");

            var contatos = await _contatoService.GetAllAsync();
            var results = contatos.Where(c =>
                c.Nome.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                c.Email.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                c.Telefone.Contains(term)
            ).ToList();

            return Ok(results);
        }
    }
}