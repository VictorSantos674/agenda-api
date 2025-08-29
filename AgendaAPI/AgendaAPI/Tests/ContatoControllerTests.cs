using Microsoft.AspNetCore.Mvc;
using Moq;
using AgendaAPI.Controllers;
using AgendaAPI.Models;
using AgendaAPI.Services;
using FluentValidation;
using Xunit;

namespace AgendaAPI.Tests
{
    public class ContatoControllerTests
    {
        private readonly Mock<IContatoService> _mockService;
        private readonly Mock<IValidator<Contato>> _mockValidator;
        private readonly ContatoController _controller;

        public ContatoControllerTests()
        {
            _mockService = new Mock<IContatoService>();
            _mockValidator = new Mock<IValidator<Contato>>();
            _controller = new ContatoController(_mockService.Object, _mockValidator.Object);
        }

        [Fact]
        public async Task GetAll_ReturnsOkResult_WithListOfContatos()
        {
            // Arrange
            var contatos = new List<Contato>
            {
                new Contato { Id = 1, Nome = "Teste 1", Email = "test1@email.com", Telefone = "11999999999" },
                new Contato { Id = 2, Nome = "Teste 2", Email = "test2@email.com", Telefone = "11999999998" }
            };
            
            _mockService.Setup(service => service.GetAllAsync()).ReturnsAsync(contatos);

            var result = await _controller.GetAll(); // Act

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<Contato>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task GetById_ReturnsNotFound_WhenContatoDoesNotExist()
        {
            _mockService.Setup(service => service.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((Contato?)null); // Arrange

            var result = await _controller.GetById(1); // Act

            Assert.IsType<NotFoundResult>(result); // Assert
        }
    }
}