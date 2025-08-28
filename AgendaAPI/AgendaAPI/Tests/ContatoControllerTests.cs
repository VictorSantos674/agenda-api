using Xunit;
using Moq;
using AgendaAPI.Controllers;
using AgendaAPI.Models;
using AgendaAPI.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AgendaAPI.Tests
{
    public class ContatoControllerTests
    {
        private readonly Mock<IContatoRepository> _mockRepo;
        private readonly ContatoController _controller;

        public ContatoControllerTests()
        {
            _mockRepo = new Mock<IContatoRepository>();
            _controller = new ContatoController(_mockRepo.Object);
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
            
            _mockRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(contatos);

            // Act
            var result = await _controller.GetAll();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<Contato>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }
    }
}