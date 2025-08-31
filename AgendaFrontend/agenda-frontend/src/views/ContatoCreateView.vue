<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">➕ Criar Novo Contato</h1>

    <form
      @submit.prevent="criarContato"
      class="bg-white rounded-2xl shadow-md p-6 border border-gray-200 space-y-4"
    >
      <div>
        <label class="block text-gray-700">Nome</label>
        <input
          v-model="novoContato.nome"
          type="text"
          class="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
        />
      </div>

      <div>
        <label class="block text-gray-700">Email</label>
        <input
          v-model="novoContato.email"
          type="email"
          class="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
        />
      </div>

      <div>
        <label class="block text-gray-700">Telefone</label>
        <input
          v-model="novoContato.telefone"
          type="text"
          class="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
        />
      </div>

      <div class="flex gap-3 mt-4">
        <button
          type="submit"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
        >
          ✅ Criar Contato
        </button>
        <router-link
          to="/contatos"
          class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition"
        >
          ⬅️ Cancelar
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const novoContato = ref({
  nome: "",
  email: "",
  telefone: "",
});

function criarContato() {
  console.log("Contato criado:", novoContato.value);
  router.push("/contatos");
}
</script>