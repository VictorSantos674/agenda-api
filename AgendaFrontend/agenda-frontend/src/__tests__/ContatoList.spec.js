import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/vue'
import ContatoList from '../ContatoList.vue'

describe('ContatoList', () => {
  it('renders empty state correctly', () => {
    const { getByText } = render(ContatoList, {
      props: { contatos: [] }
    })
    
    expect(getByText('Nenhum contato encontrado')).toBeDefined()
  })

  it('renders list of contatos', async () => {
    const contatos = [
      { id: 1, nome: 'João Silva', email: 'joao@email.com', telefone: '11999999999' },
      { id: 2, nome: 'Maria Santos', email: 'maria@email.com', telefone: '11999999998' }
    ]

    const { getByText } = render(ContatoList, {
      props: { contatos }
    })

    expect(getByText('João Silva')).toBeDefined()
    expect(getByText('Maria Santos')).toBeDefined()
  })
})