using FluentValidation;
using AgendaAPI.Models;
using AgendaAPI.Repositories;

namespace AgendaAPI.Validators
{
    public class ContatoValidator : AbstractValidator<Contato>
    {
        private readonly IContatoRepository _contatoRepository;

        public ContatoValidator(IContatoRepository contatoRepository)
        {
            _contatoRepository = contatoRepository;

            RuleFor(x => x.Nome)
                .NotEmpty().WithMessage("Nome é obrigatório")
                .MaximumLength(100).WithMessage("Nome não pode exceder 100 caracteres");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email é obrigatório")
                .EmailAddress().WithMessage("Email deve ser válido")
                .MustAsync(BeUniqueEmail).WithMessage("Email já cadastrado");

            RuleFor(x => x.Telefone)
                .NotEmpty().WithMessage("Telefone é obrigatório")
                .Matches(@"^\(?\d{2}\)?[\s-]?9?\d{4}-?\d{4}$").WithMessage("Telefone deve ser válido")
                .MustAsync(BeUniqueTelefone).WithMessage("Telefone já cadastrado");
        }

        private async Task<bool> BeUniqueEmail(Contato contato, string email, CancellationToken cancellationToken)
        {
            return !await _contatoRepository.EmailExistsAsync(email, contato.Id);
        }

        private async Task<bool> BeUniqueTelefone(Contato contato, string telefone, CancellationToken cancellationToken)
        {
            return !await _contatoRepository.TelefoneExistsAsync(telefone, contato.Id);
        }
    }
}