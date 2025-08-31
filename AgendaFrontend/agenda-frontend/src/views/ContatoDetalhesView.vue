<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">📌 Detalhes do Contato</h1>

    <div
      v-if="contato"
      class="bg-white rounded-2xl shadow-md p-6 border border-gray-200"
    >
      <p><strong>Nome:</strong> {{ contato.nome }}</p>
      <p><strong>Email:</strong> {{ contato.email }}</p>
      <p><strong>Telefone:</strong> {{ contato.telefone }}</p>
      <p><strong>Criado em:</strong> {{ formatDate(contato.createdAt) }}</p>

      <div class="flex gap-3 mt-6">
        <router-link
          :to="{ name: 'contato.edit', params: { id: contato.id } }"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          ✏️ Editar
        </router-link>
        <router-link
          to="/contatos"
          class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition"
        >
          ⬅️ Voltar
        </router-link>
      </div>
    </div>

    <p v-else class="text-gray-600">Carregando contato...</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const contato = ref(null);

onMounted(() => {
  const id = route.params.id;
  contato.value = {
    id,
    nome: "Fulano da Silva",
    email: "fulano@email.com",
    telefone: "(81) 99999-9999",
    createdAt: "2024-09-01",
  };
});

function formatDate(date) {
  return new Date(date).toLocaleDateString("pt-BR");
}
</script>