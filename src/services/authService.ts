import api from './api'

export interface Usuario {
  id: number
  nome: string
  email: string
  role: 'adm' | 'usuario'
  estabelecimento_id: number
  nome_estabelecimento: string
}

export interface LoginResponse {
  token: string
  usuario: Usuario
}

export const authService = {
  async login(email: string, senha: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, senha })
    localStorage.setItem('token', data.token)
    localStorage.setItem('usuario', JSON.stringify(data.usuario))
    return data
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    window.location.href = '/login'
  },

  getUsuario(): Usuario | null {
    const raw = localStorage.getItem('usuario')
    return raw ? JSON.parse(raw) : null
  },

  isLogado(): boolean {
    return !!localStorage.getItem('token')
  },

  isAdm(): boolean {
    const u = this.getUsuario()
    return u !== null && u.role === 'adm'
  },
}
