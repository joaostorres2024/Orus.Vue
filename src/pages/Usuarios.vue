<template>
  <div class="q-pa-md">
    <p class="text-h6 text-bold">Usuários</p>
    <q-card class="q-pa-md no-shadow column col-12">
      <div class="row justify-between items-center">
        <q-input v-model="busca" style="min-width: 300px" outlined dense label="Pesquisar por usuários" @input="filtrar">
          <template v-slot:prepend>
            <q-icon size="20px" color="grey" name="search" />
          </template>
        </q-input>
        <q-btn unelevated color="primary" label="Novo Usuário" icon="add" @click="abrirModal()" />
      </div>

      <div class="q-py-lg">
        <q-table
          :columns="colunasUsuarios"
          :data="usuariosFiltrados"
          :loading="carregando"
          class="no-shadow border"
          no-data-label="Nenhum registro encontrado"
          :rows-per-page-options="[10, 20, 50]"
          flat
          bordered
        >
          <template v-slot:body-cell-role="props">
            <q-td :props="props">
              <q-badge :color="props.row.role === 'adm' ? 'purple' : 'blue-grey'">
                {{ props.row.role === 'adm' ? 'Administrador' : 'Usuário' }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="props.row.status === 'ativo' ? 'positive' : 'grey'">
                {{ props.row.status === 'ativo' ? 'Ativo' : 'Inativo' }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-acoes="props">
            <q-td align="right">
              <q-btn icon="edit" size="sm" color="primary" flat round @click="abrirModal(props.row)">
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn
                :icon="props.row.status === 'ativo' ? 'auto_delete' : 'restore'"
                size="sm"
                :color="props.row.status === 'ativo' ? 'negative' : 'positive'"
                flat round
                @click="toggleStatus(props.row)"
              >
                <q-tooltip>{{ props.row.status === 'ativo' ? 'Inativar' : 'Reativar' }}</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </q-card>

    <!-- Modal Criar/Editar Usuário -->
    <q-dialog v-model="modalAberto" persistent>
      <q-card style="min-width: 420px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-bold" style="font-size: 16px">{{ editando ? 'Editar Usuário' : 'Novo Usuário' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="fecharModal" />
        </q-card-section>

        <q-card-section class="column q-gutter-sm">
          <q-input v-model="form.nome" label="Nome completo" outlined dense />
          <q-input v-model="form.email" label="E-mail" outlined dense type="email" />
          <q-input v-model="form.senha" :label="editando ? 'Nova senha (deixe vazio para manter)' : 'Senha'" outlined dense type="password" />
          <q-select
            v-model="form.role"
            :options="opcoesRole"
            label="Perfil"
            outlined dense emit-value map-options
          />
          <q-select
            v-model="form.estabelecimento_id"
            :options="estabelecimentos"
            option-value="id"
            option-label="nome"
            label="Estabelecimento"
            outlined dense emit-value map-options
            :loading="carregandoEstab"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat label="Cancelar" @click="fecharModal" />
          <q-btn unelevated color="primary" :label="editando ? 'Salvar' : 'Criar'" :loading="salvando" @click="salvar" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { usuarioService } from '../services/usuarioService'
import { estabelecimentoService } from '../services/estabelecimentoService'


@Component
export default class Usuarios extends Vue {
  carregando = false
  carregandoEstab = false
  salvando = false
  busca = ''
  modalAberto = false
  editando = false
  usuarios: any[] = []
  usuariosFiltrados: any[] = []
  estabelecimentos: any[] = []
  usuarioEditandoId: number | null = null

  form = { nome: '', email: '', senha: '', role: 'usuario', estabelecimento_id: null as number | null }

  opcoesRole = [
    { label: 'Usuário', value: 'usuario' },
    { label: 'Administrador', value: 'adm' },
  ]

  colunasUsuarios = [
    { name: 'estabelecimento_id', label: 'ID', field: 'estabelecimento_id', align: 'left' },
    { name: 'nome_estabelecimento', label: 'Estabelecimento', field: 'nome_estabelecimento', align: 'left' },
    { name: 'nome', label: 'Usuário', field: 'nome', align: 'left' },
    { name: 'email', label: 'E-mail', field: 'email', align: 'left' },
    { name: 'role', label: 'Perfil', field: 'role', align: 'left' },
    { name: 'status', label: 'Status', field: 'status', align: 'left' },
    { name: 'acoes', label: 'Ações', field: 'acoes', align: 'right' },
  ]

  async created() {
    await this.carregar()
  }

  async carregar() {
    this.carregando = true
    try {
      const result = await usuarioService.listar()
      this.usuarios = result
      this.usuariosFiltrados = result
    } finally {
      this.carregando = false
    }
  }

  filtrar() {
    const termo = this.busca.toLowerCase()
    this.usuariosFiltrados = termo
      ? this.usuarios.filter(u => u.nome.toLowerCase().includes(termo) || u.email.toLowerCase().includes(termo))
      : this.usuarios
  }

  async abrirModal(usuario?: any) {
    this.carregandoEstab = true
    this.modalAberto = true
    this.editando = !!usuario

    if (usuario) {
      this.usuarioEditandoId = usuario.id
      this.form = { nome: usuario.nome, email: usuario.email, senha: '', role: usuario.role, estabelecimento_id: usuario.estabelecimento_id }
    } else {
      this.usuarioEditandoId = null
      this.form = { nome: '', email: '', senha: '', role: 'usuario', estabelecimento_id: null }
    }

    try {
      this.estabelecimentos = await estabelecimentoService.listar()
    } finally {
      this.carregandoEstab = false
    }
  }

  fecharModal() {
    this.modalAberto = false
  }

  async salvar() {
    if (!this.form.nome || !this.form.email || !this.form.estabelecimento_id) {
      this.$q.notify({ type: 'warning', message: 'Preencha todos os campos obrigatórios.', position: 'top-right' })
      return
    }
    if (!this.editando && !this.form.senha) {
      this.$q.notify({ type: 'warning', message: 'Informe uma senha.', position: 'top-right' })
      return
    }
    this.salvando = true
    try {
      if (this.editando && this.usuarioEditandoId) {
        const payload: any = { nome: this.form.nome, email: this.form.email, role: this.form.role, estabelecimento_id: this.form.estabelecimento_id }
        if (this.form.senha) payload.senha = this.form.senha
        await usuarioService.atualizar(this.usuarioEditandoId, payload)
      } else {
        await usuarioService.criar({ ...this.form, estabelecimento_id: this.form.estabelecimento_id! })
      }
      window.location.reload()
    } catch (err) {
      this.$q.notify({ type: 'negative', message: 'Erro ao salvar usuário.', position: 'top-right' })
      this.salvando = false
    }
  }

  async toggleStatus(usuario: any) {
    const novoStatus = usuario.status === 'ativo' ? 'inativo' : 'ativo'
    try {
      await usuarioService.atualizar(usuario.id, { status: novoStatus })
      window.location.reload()
    } catch (err) {
      this.$q.notify({ type: 'negative', message: 'Erro ao alterar status.', position: 'top-right' })
    }
  }
}
</script>

<style scoped>
.border { border: 1px solid #e0e0e0; }
</style>
