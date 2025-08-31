import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ContatoForm from '../ContatoForm.vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

describe('ContatoForm', () => {
  const mockContato = {
    id: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '(11) 99999-9999'
  }

  it('renders dialog with correct title when creating new contato', () => {
    const wrapper = mount(ContatoForm, {
      props: {
        visible: true,
        contato: null
      },
      global: {
        components: { Dialog, InputText, Button }
      }
    })
    
    expect(wrapper.find('h2').text()).toBe('Novo Contato')
  })

  it('renders dialog with correct title when editing contato', () => {
    const wrapper = mount(ContatoForm, {
      props: {
        visible: true,
        contato: mockContato
      },
      global: {
        components: { Dialog, InputText, Button }
      }
    })
    
    expect(wrapper.find('h2').text()).toBe('Editar Contato')
  })

  it('emits save event with form data when valid', async () => {
    const wrapper = mount(ContatoForm, {
      props: {
        visible: true,
        contato: mockContato
      },
      global: {
        components: { Dialog, InputText, Button }
      }
    })

    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.emitted().save).toBeTruthy()
    expect(wrapper.emitted().save[0][0]).toEqual(mockContato)
  })
})