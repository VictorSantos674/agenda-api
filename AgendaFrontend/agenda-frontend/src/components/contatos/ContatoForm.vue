<template>
  <v-dialog v-model="visible" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ formTitle }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="isFormValid">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="localContato.nome"
                  label="Nome"
                  :rules="[(v: string) => !!v || 'Nome é obrigatório']"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="localContato.email"
                  label="Email"
                  :rules="[
                    (v: string) => !!v || 'Email é obrigatório',
                    (v: string) => /.+@.+\..+/.test(v) || 'Email deve ser válido'
                  ]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="localContato.telefone"
                  label="Telefone"
                  :rules="[(v: string) => !!v || 'Telefone é obrigatório']"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="close">
          Cancelar
        </v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="save" :disabled="!isFormValid">
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, type PropType } from 'vue';
import type { Contato } from '@/types/Contato.ts';

export default defineComponent({
  name: 'ContatoForm',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    contato: {
      type: Object as PropType<Contato>,
      default: () => ({
        id: 0,
        nome: '',
        email: '',
        telefone: ''
      })
    }
  },
  emits: ['update:visible', 'save'],
  setup(props, { emit }) {
    const form = ref<HTMLFormElement>();
    const isFormValid = ref(false);
    const localContato = ref<Contato>({ ...props.contato });

    watch(() => props.contato, (newContato) => {
      localContato.value = { ...newContato };
    });

    watch(() => props.visible, (newVisible) => {
      if (!newVisible && form.value) {
        form.value.reset();
      }
    });

    const formTitle = computed(() => {
      return localContato.value.id === 0 ? 'Novo Contato' : 'Editar Contato';
    });

    const close = () => {
      emit('update:visible', false);
    };

    const save = () => {
      if (isFormValid.value) {
        emit('save', localContato.value);
        close();
      }
    };

    return {
      form,
      isFormValid,
      localContato,
      formTitle,
      close,
      save
    };
  }
});
</script>