import api from './api'

export const chamadoService = {
  async listar(params?: { status?: string; prioridade?: string; estabelecimento_id?: number }) {
    const { data } = await api.get('/chamados', { params })
    return data
  },

  async buscar(id: number) {
    const { data } = await api.get(`/chamados/${id}`)
    return data
  },

  async criar(payload: { titulo: string; descricao: string; prioridade?: string }) {
    const { data } = await api.post('/chamados', payload)
    return data
  },

  async atualizar(id: number, payload: { status?: string; prioridade?: string; atribuido_a?: number }) {
    const { data } = await api.put(`/chamados/${id}`, payload)
    return data
  },

  async comentar(id: number, texto: string) {
    const { data } = await api.post(`/chamados/${id}/comentarios`, { texto })
    return data
  },

  async anexar(id: number, arquivo: File) {
    const form = new FormData()
    form.append('arquivo', arquivo)
    const { data } = await api.post(`/chamados/${id}/anexos`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async dashboard() {
    const { data } = await api.get('/chamados/dashboard')
    return data
  },
}
