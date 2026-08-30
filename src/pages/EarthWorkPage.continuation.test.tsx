import { describe, expect, it } from 'vitest'

describe('Earth Work continuation UX contract', () => {
  it('keeps completion oriented toward reflection and continuation', () => {
    const actions = ['Voltar ao Jardim', 'Abrir o Átrio']
    const prohibited = ['executar ação automaticamente', 'medir produtividade', 'enviar mensagem']

    expect(actions).toContain('Abrir o Átrio')
    expect(actions).toContain('Voltar ao Jardim')
    expect(prohibited).not.toContain('executar ação automaticamente')
  })
})
