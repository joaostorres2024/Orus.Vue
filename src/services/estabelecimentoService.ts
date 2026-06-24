import api from './api'

export const estabelecimentoService = {
  async listar() {
    const { data } = await api.get('/estabelecimentos')
    return data
  },

  async buscar(id: number) {
    const { data } = await api.get(`/estabelecimentos/${id}`)
    return data
  },

  async criar(payload: any) {
    const { data } = await api.post('/estabelecimentos', payload)
    return data
  },

  async atualizar(id: number, payload: any) {
    const { data } = await api.put(`/estabelecimentos/${id}`, payload)
    return data
  },
}
