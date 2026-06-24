<template>
  <div class="q-pa-md">
    <p class="text-h6 text-bold">Estabelecimentos</p>

    <q-card class="q-pa-md no-shadow column col-12">
      <div class="row justify-between items-center">
        <q-input v-model="busca" style="min-width: 300px" outlined dense label="Pesquisar estabelecimento" @input="filtrar">
          <template v-slot:prepend>
            <q-icon size="20px" color="grey" name="search" />
          </template>
        </q-input>
        <q-btn unelevated color="primary" label="Novo Estabelecimento" icon="add" @click="abrirModal()" />
      </div>

      <div class="q-py-lg">
        <q-table
          :columns="colunas"
          :data="estabelecimentosFiltrados"
          :loading="carregando"
          class="no-shadow border"
          no-data-label="Nenhum estabelecimento encontrado"
          :rows-per-page-options="[10, 20, 50]"
          flat bordered
        >
          <template v-slot:body-cell-acoes="props">
            <q-td align="right">
              <q-btn icon="edit" size="sm" color="primary" flat round @click="abrirModal(props.row)">
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </q-card>

    <!-- Modal Criar/Editar -->
    <q-dialog v-model="modalAberto" persistent>
      <q-card style="min-width: 560px; max-width: 640px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-bold" style="font-size: 16px">{{ editando ? 'Editar Estabelecimento' : 'Novo Estabelecimento' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="fecharModal" />
        </q-card-section>

        <q-card-section class="column q-gutter-sm">
          <!-- Dados principais -->
          <div class="row q-gutter-sm">
            <q-input v-model="form.nome"         label="Razão Social *" outlined dense class="col" />
            <q-input v-model="form.nome_fantasia" label="Nome Fantasia"  outlined dense class="col" />
          </div>
          <div class="row q-gutter-sm">
            <q-input v-model="form.cnpj"               label="CNPJ"                outlined dense class="col" mask="##.###.###/####-##" />
            <q-input v-model="form.inscricao_estadual"  label="Insc. Estadual"      outlined dense class="col" />
            <q-input v-model="form.inscricao_municipal" label="Insc. Municipal"      outlined dense class="col" />
          </div>
          <div class="row q-gutter-sm">
            <q-input v-model="form.regime_tributario" label="Regime Tributário" outlined dense class="col" />
          </div>

          <!-- Contato -->
          <div class="row q-gutter-sm">
            <q-input v-model="form.email"    label="E-mail"   outlined dense type="email" class="col" />
            <q-input v-model="form.telefone" label="Telefone" outlined dense class="col" mask="(##) #####-####" />
            <q-input v-model="form.site"     label="Site"     outlined dense class="col" />
          </div>

          <!-- Endereço -->
          <div class="row q-gutter-sm">
            <q-input v-model="form.cep"      label="CEP"      outlined dense class="col-3" mask="#####-###" />
            <q-input v-model="form.endereco" label="Endereço" outlined dense class="col" />
            <q-input v-model="form.numero"   label="Nº"       outlined dense class="col-2" />
          </div>
          <div class="row q-gutter-sm">
            <q-input v-model="form.complemento" label="Complemento" outlined dense class="col" />
            <q-input v-model="form.bairro"      label="Bairro"      outlined dense class="col" />
          </div>
          <div class="row q-gutter-sm">
            <q-input v-model="form.cidade" label="Cidade" outlined dense class="col" />
            <q-input v-model="form.uf"     label="UF"     outlined dense class="col-2" maxlength="2" />
          </div>

          <!-- Responsável -->
          <div class="row q-gutter-sm">
            <q-input v-model="form.responsavel" label="Responsável" outlined dense class="col" />
            <q-input v-model="form.cargo"       label="Cargo"       outlined dense class="col" />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn flat label="Cancelar" @click="fecharModal" :disable="salvando" />
          <q-btn unelevated color="primary" :label="editando ? 'Salvar' : 'Criar'" :loading="salvando" @click="salvar" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { estabelecimentoService } from '../services/estabelecimentoService'

const formVazio = () => ({
  nome: '', nome_fantasia: '', cnpj: '', inscricao_estadual: '',
  inscricao_municipal: '', regime_tributario: '', email: '', telefone: '',
  site: '', cep: '', endereco: '', numero: '', complemento: '',
  bairro: '', cidade: '', uf: '', responsavel: '', cargo: '', logo: '',
})

@Component
export default class Estabelecimentos extends Vue {
  carregando = false
  salvando   = false
  busca      = ''
  modalAberto = false
  editando    = false
  editandoId: number | null = null
  estabelecimentos: any[]          = []
  estabelecimentosFiltrados: any[] = []
  form = formVazio()

  colunas = [
    { name: 'id',            label: 'ID',           field: 'id',            align: 'left', sortable: true },
    { name: 'nome',          label: 'Razão Social',  field: 'nome',          align: 'left', sortable: true },
    { name: 'nome_fantasia', label: 'Nome Fantasia', field: 'nome_fantasia', align: 'left' },
    { name: 'cnpj',          label: 'CNPJ',          field: 'cnpj',          align: 'left' },
    { name: 'cidade',        label: 'Cidade',        field: 'cidade',        align: 'left' },
    { name: 'uf',            label: 'UF',            field: 'uf',            align: 'left' },
    { name: 'telefone',      label: 'Telefone',      field: 'telefone',      align: 'left' },
    { name: 'responsavel',   label: 'Responsável',   field: 'responsavel',   align: 'left' },
    { name: 'acoes',         label: 'Ações',         field: 'acoes',         align: 'right' },
  ]

  async created() { await this.carregar() }

  async carregar() {
    this.carregando = true
    try {
      this.estabelecimentos = await estabelecimentoService.listar()
      this.estabelecimentosFiltrados = this.estabelecimentos
    } finally {
      this.carregando = false
    }
  }

  filtrar() {
    const t = this.busca.toLowerCase()
    this.estabelecimentosFiltrados = t
      ? this.estabelecimentos.filter(e =>
          (e.nome && e.nome.toLowerCase().includes(t)) ||
          (e.nome_fantasia && e.nome_fantasia.toLowerCase().includes(t)) ||
          (e.cnpj && e.cnpj.includes(t))
        )
      : this.estabelecimentos
  }

  async abrirModal(estab?: any) {
    this.editando  = !!estab
    this.editandoId = estab ? estab.id : null

    if (estab) {
      // Busca dados completos pelo id para preencher todos os campos
      const completo = await estabelecimentoService.buscar(estab.id)
      this.form = {
        nome:                completo.nome                || '',
        nome_fantasia:       completo.nome_fantasia       || '',
        cnpj:                completo.cnpj                || '',
        inscricao_estadual:  completo.inscricao_estadual  || '',
        inscricao_municipal: completo.inscricao_municipal || '',
        regime_tributario:   completo.regime_tributario   || '',
        email:               completo.email               || '',
        telefone:            completo.telefone            || '',
        site:                completo.site                || '',
        cep:                 completo.cep                 || '',
        endereco:            completo.endereco            || '',
        numero:              completo.numero              || '',
        complemento:         completo.complemento         || '',
        bairro:              completo.bairro              || '',
        cidade:              completo.cidade              || '',
        uf:                  completo.uf                  || '',
        responsavel:         completo.responsavel         || '',
        cargo:               completo.cargo               || '',
        logo:                completo.logo                || '',
      }
    } else {
      this.form = formVazio()
    }
    this.modalAberto = true
  }

  fecharModal() {
    this.modalAberto = false
    this.form = formVazio()
  }

  async salvar() {
    if (!this.form.nome) {
      this.$q.notify({ type: 'warning', message: 'Razão Social é obrigatória.', position: 'top-right' })
      return
    }
    this.salvando = true
    try {
      if (this.editando && this.editandoId) {
        await estabelecimentoService.atualizar(this.editandoId, this.form)
      } else {
        await estabelecimentoService.criar(this.form)
      }
      window.location.reload()
    } catch (err) {
      this.$q.notify({ type: 'negative', message: 'Erro ao salvar estabelecimento.', position: 'top-right' })
      this.salvando = false
    }
  }
}
</script>

<style scoped>
.border { border: 1px solid #e0e0e0; }
</style>
