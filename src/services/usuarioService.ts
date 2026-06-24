import api from './api'

export const usuarioService = {
  async listar(params?: { role?: string; status?: string; estabelecimento_id?: number }) {
    const { data } = await api.get('/usuarios', { params })
    return data
  },

  async buscar(id: number) {
    const { data } = await api.get(`/usuarios/${id}`)
    return data
  },

  async criar(payload: {
    nome: string
    email: string
    senha: string
    role: string
    estabelecimento_id: number
    status?: string
  }) {
    const { data } = await api.post('/usuarios', payload)
    return data
  },

  async atualizar(id: number, payload: Partial<{ nome: string; email: string; senha: string; role: string; status: string; estabelecimento_id: number }>) {
    const { data } = await api.put(`/usuarios/${id}`, payload)
    return data
  },

  async excluir(id: number) {
    const { data } = await api.delete(`/usuarios/${id}`)
    return data
  },
}
