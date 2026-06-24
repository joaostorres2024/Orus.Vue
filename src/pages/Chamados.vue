<template>
  <div class="q-pa-md">
    <p class="text-h6 text-bold">Chamados</p>

    <!-- ───────────── LISTA ───────────── -->
    <q-card v-if="view === 'lista'" class="q-pa-md no-shadow col-12">
      <div class="row justify-between items-center">
        <q-input v-model="busca" style="min-width: 300px" outlined dense label="Pesquisar por chamados" @input="filtrar">
          <template v-slot:prepend>
            <q-icon size="20px" color="grey" name="search" />
          </template>
        </q-input>
        <div class="row q-gutter-md items-center">
          <q-select v-model="filtroPrioridade" :options="opcoesPrioridade" outlined dense label="Prioridade"
            style="min-width: 160px" clearable emit-value map-options @input="carregar" />
          <q-btn unelevated color="primary" label="Novo Chamado" icon="add" @click="view = 'form'" />
        </div>
      </div>

      <div class="q-py-lg">
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary"
          align="left" narrow-indicator no-caps @input="carregar">
          <q-tab class="q-mr-md" name="todos"        icon="o_mail"             label="Todos" />
          <q-tab class="q-mr-md" name="aberto"       icon="o_mark_as_unread"   label="Abertos" />
          <q-tab class="q-mr-md" name="em_andamento" icon="o_forward_to_inbox" label="Em andamento" />
          <q-tab class="q-mr-md" name="resolvido"    icon="o_fact_check"       label="Resolvidos" />
          <q-tab class="q-mr-md" name="fechado"      icon="o_archive"          label="Fechados" />
        </q-tabs>
      </div>

      <div v-if="carregando" class="column q-gutter-md">
        <q-skeleton v-for="i in 3" :key="i" height="110px" class="border b-r-8" />
      </div>
      <div v-else-if="chamadosFiltrados.length === 0" class="text-grey text-center q-py-xl" style="font-size:14px">
        Nenhum chamado encontrado.
      </div>
      <div v-else class="column q-gutter-md">
        <q-card
          v-for="chamado in chamadosFiltrados"
          :key="chamado.id"
          :class="['no-shadow border q-pa-md cursor-pointer chamado-card', chamado.status === 'fechado' ? 'chamado-fechado' : '']"
          @click="abrirDetalhe(chamado)"
        >
          <div class="column q-mb-xs">
            <div class="row items-center q-gutter-xs q-mb-xs">
              <q-badge :color="corPrioridade(chamado.prioridade)" style="font-size:10px;height:18px;display:flex;align-items:center">
                {{ labelPrioridade(chamado.prioridade) }}
              </q-badge>
              <q-badge :color="corStatus(chamado.status)" outline style="font-size:10px;height:18px;display:flex;align-items:center">
                {{ labelStatus(chamado.status) }}
              </q-badge>
            </div>
            <div class="row items-center justify-between">
              <p class="text-bold q-ma-none" :class="chamado.status === 'fechado' ? 'text-grey-5' : ''" style="font-size:15px">
                {{ chamado.titulo }}
              </p>
              <p style="font-size:12px" class="text-grey q-ma-none">{{ formatarData(chamado.created_at) }}</p>
            </div>
          </div>
          <p class="q-ma-none q-mt-xs descricao-preview"
            :class="chamado.status === 'fechado' ? 'text-grey-4' : 'text-grey-7'"
            style="font-size:13px">{{ chamado.descricao }}</p>
          <q-separator class="q-my-sm" />
          <div class="row justify-between items-center">
            <div class="row items-center q-gutter-sm">
              <div class="row items-center justify-center text-white text-bold"
                :class="chamado.status === 'fechado' ? 'bg-grey-4' : 'bg-primary'"
                style="width:28px;height:28px;border-radius:100px;font-size:11px;flex-shrink:0">
                {{ chamado.nome_usuario ? chamado.nome_usuario.charAt(0).toUpperCase() : '?' }}
              </div>
              <p class="q-ma-none text-grey" style="font-size:12px">{{ chamado.nome_usuario }}</p>
              <q-chip dense outline size="sm"><q-icon name="o_comment" size="12px" class="q-mr-xs" />{{ chamado.total_comentarios }}</q-chip>
              <q-chip dense outline size="sm"><q-icon name="o_attach_file" size="12px" class="q-mr-xs" />{{ chamado.total_anexos }}</q-chip>
            </div>
            <q-icon v-if="chamado.status === 'fechado'" name="o_lock" size="16px" class="text-grey-4" />
          </div>
        </q-card>
      </div>
    </q-card>

    <!-- ───────────── FORMULÁRIO NOVO CHAMADO ───────────── -->
    <q-card v-else-if="view === 'form'" class="q-pa-lg no-shadow col-12">
      <div class="row items-center justify-between q-mb-lg">
        <div class="row items-center q-gutter-sm">
          <q-btn flat round dense icon="arrow_back" @click="cancelarForm" />
          <p class="text-bold q-ma-none" style="font-size:18px">Abrir Chamado</p>
        </div>
        <q-select v-model="formNovo.prioridade" :options="opcoesPrioridade" outlined dense label="Prioridade"
          style="min-width:160px" emit-value map-options />
      </div>

      <div class="column q-gutter-md">
        <q-input v-model="formNovo.titulo" label="Título do chamado" outlined :counter="true" maxlength="200" />
        <q-input v-model="formNovo.descricao" label="Descreva o problema detalhadamente" outlined type="textarea" rows="6" />

        <div>
          <p class="text-weight-medium q-mb-sm" style="font-size:13px"><q-icon name="o_image" class="q-mr-xs" />Imagens</p>
          <div class="upload-area row items-center justify-center q-pa-lg cursor-pointer border b-r-8 q-mb-sm"
            @click="triggerUpload" @dragover.prevent @drop.prevent="onDrop">
            <div class="column items-center text-grey">
              <q-icon name="o_cloud_upload" size="32px" class="q-mb-xs" />
              <p class="q-ma-none" style="font-size:13px">Clique ou arraste imagens aqui</p>
              <p class="q-ma-none" style="font-size:11px">PNG, JPG, JPEG, GIF até 10MB cada</p>
            </div>
          </div>
          <input ref="inputArquivo" type="file" multiple accept="image/*" style="display:none" @change="onFileChange" />
          <div v-if="imagensPreview.length > 0" class="row q-gutter-sm q-mt-sm">
            <div v-for="(img, idx) in imagensPreview" :key="idx" class="preview-item relative-position">
              <img :src="img.url" class="preview-img b-r-8" />
              <q-btn round dense flat icon="close" size="xs" class="preview-remove bg-negative text-white" @click.stop="removerImagem(idx)" />
              <p class="q-ma-none text-grey ellipsis" style="font-size:10px;max-width:100px">{{ img.nome }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="row justify-end q-gutter-sm q-mt-xl">
        <q-btn flat label="Cancelar" @click="cancelarForm" :disable="salvando" />
        <q-btn unelevated color="primary" icon="send" label="Abrir Chamado" :loading="salvando" @click="criarChamado" />
      </div>
    </q-card>

    <!-- ───────────── DETALHE DO CHAMADO ───────────── -->
    <q-card v-else-if="view === 'detalhe'" class="no-shadow col-12">

      <!-- Cabeçalho totalmente em row -->
      <div style="display:flex;flex-direction:row;align-items:center;gap:8px;padding:12px 16px;border-bottom:1px solid #e0e0e0;flex-wrap:nowrap">
        <q-btn flat round dense icon="arrow_back" @click="view = 'lista'" style="flex-shrink:0" />
        <q-badge :color="corPrioridade(chamadoAberto.prioridade)" style="font-size:10px;flex-shrink:0">{{ labelPrioridade(chamadoAberto.prioridade) }}</q-badge>
        <q-badge :color="corStatus(chamadoAberto.status)" outline style="font-size:10px;flex-shrink:0">{{ labelStatus(chamadoAberto.status) }}</q-badge>
        <p class="text-bold q-ma-none" style="font-size:15px;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{ chamadoAberto.titulo }}</p>
        <p class="text-grey q-ma-none" style="font-size:11px;white-space:nowrap;flex-shrink:0">{{ formatarData(chamadoAberto.created_at) }}</p>
      </div>

      <div class="row">
        <!-- ── Coluna principal ── -->
        <div class="col-12 col-md-8 q-pa-lg column q-gutter-xl" style="border-right:1px solid #f0f0f0">

          <!-- Descrição -->
          <div>
            <p class="secao-label">Descrição</p>
            <p class="q-ma-none text-grey-8" style="font-size:14px;line-height:1.8;white-space:pre-wrap">{{ chamadoAberto.descricao }}</p>
          </div>

          <!-- Imagens -->
          <div>
            <div class="row items-center justify-between q-mb-md">
              <p class="secao-label q-ma-none">Imagens ({{ chamadoAberto.anexos ? chamadoAberto.anexos.length : 0 }})</p>
              <div class="row items-center q-gutter-sm">
                <q-btn flat dense icon="o_attach_file" label="Anexar" color="primary" size="sm"
                  @click="triggerUploadDetalhe" :disable="chamadoAberto.status === 'fechado' && !isAdm" />
                <q-btn v-if="imagensNovas.length > 0" unelevated dense icon="o_upload" label="Enviar"
                  color="positive" size="sm" :loading="enviandoAnexo" @click="enviarAnexos" />
                <input ref="inputAnexoDetalhe" type="file" multiple accept="image/*" style="display:none" @change="onFileChangeDetalhe" />
              </div>
            </div>

            <!-- Grid de imagens salvas -->
            <div v-if="chamadoAberto.anexos && chamadoAberto.anexos.length > 0" class="row q-gutter-sm q-mb-md">
              <div v-for="anexo in chamadoAberto.anexos" :key="anexo.id"
                class="cursor-pointer img-thumb relative-position b-r-8 border overflow-hidden"
                @click="abrirLightbox(anexo)">
                <img :src="urlAnexo(anexo.caminho)"
                  style="width:140px;height:100px;object-fit:cover;display:block;background:#f5f5f5"
                  :alt="anexo.nome_arquivo" />
                <div class="img-overlay absolute-full row items-center justify-center">
                  <q-icon name="o_zoom_in" size="24px" color="white" />
                </div>
              </div>
            </div>
            <div v-else-if="imagensNovas.length === 0" class="text-grey" style="font-size:13px">Nenhuma imagem anexada.</div>

            <!-- Preview novas imagens -->
            <div v-if="imagensNovas.length > 0" class="row q-gutter-sm">
              <div v-for="(img, idx) in imagensNovas" :key="'new-'+idx" class="preview-item relative-position">
                <img :src="img.url" class="preview-img b-r-8" />
                <q-btn round dense flat icon="close" size="xs" class="preview-remove bg-negative text-white" @click.stop="removerImagemNova(idx)" />
                <p class="q-ma-none text-grey ellipsis" style="font-size:10px;max-width:100px">{{ img.nome }}</p>
              </div>
            </div>
          </div>

          <!-- Comentários -->
          <div>
            <p class="secao-label q-mb-md">Comentários ({{ chamadoAberto.comentarios ? chamadoAberto.comentarios.length : 0 }})</p>

            <div v-if="!chamadoAberto.comentarios || chamadoAberto.comentarios.length === 0"
              class="text-grey q-mb-lg" style="font-size:13px">Nenhum comentário ainda.</div>

            <div v-else class="column q-gutter-md q-mb-lg">
              <div v-for="c in chamadoAberto.comentarios" :key="c.id" class="row q-gutter-sm">
                <div :class="c.role === 'adm' ? 'bg-purple' : 'bg-primary'"
                  class="row items-center justify-center text-white text-bold"
                  style="width:32px;height:32px;border-radius:100px;font-size:13px;flex-shrink:0;margin-top:2px">
                  {{ c.nome_usuario ? c.nome_usuario.charAt(0).toUpperCase() : '?' }}
                </div>
                <div class="col">
                  <div class="row items-center q-gutter-xs q-mb-xs">
                    <p class="q-ma-none text-weight-medium" style="font-size:13px">{{ c.nome_usuario }}</p>
                    <q-badge v-if="c.role === 'adm'" color="purple" style="font-size:9px">Suporte</q-badge>
                    <p class="q-ma-none text-grey" style="font-size:11px">· {{ formatarData(c.created_at) }}</p>
                  </div>
                  <div class="comentario-box q-pa-sm b-r-8">
                    <p class="q-ma-none" style="font-size:13px;line-height:1.6;white-space:pre-wrap">{{ c.texto }}</p>
                  </div>
                </div>
              </div>
            </div>

            <q-separator class="q-mb-md" />

            <div v-if="chamadoAberto.status === 'fechado' && !isAdm" class="row items-center q-gutter-sm text-grey-4">
              <q-icon name="o_lock" size="16px" />
              <span style="font-size:13px">Chamado fechado — comentários desabilitados.</span>
            </div>
            <div v-else class="row q-gutter-sm items-end">
              <q-input v-model="novoComentario" outlined dense type="textarea" rows="2" label="Adicionar comentário..." class="col" />
              <q-btn unelevated color="primary" icon="send" :loading="enviandoComentario" :disable="!novoComentario.trim()" @click="enviarComentario" />
            </div>
          </div>
        </div>

        <!-- ── Coluna lateral ── -->
        <div class="col-12 col-md-4 q-pa-lg column q-gutter-lg">

          <!-- Gerenciar — adm -->
          <div v-if="isAdm">
            <p class="secao-label q-mb-sm">Gerenciar</p>
            <div class="column q-gutter-sm">
              <q-select v-model="novoStatus" :options="opcoesStatus" label="Status" outlined dense emit-value map-options />
              <q-select v-model="novaPrioridade" :options="opcoesPrioridade" label="Prioridade" outlined dense emit-value map-options />
              <q-btn unelevated color="primary" label="Salvar alterações" :loading="salvando" @click="salvarAlteracoes" class="full-width" />
            </div>
          </div>

          <!-- Informações -->
          <div>
            <p class="secao-label q-mb-sm">Detalhes</p>
            <div class="column q-gutter-xs">
              <div class="info-row">
                <span class="info-label">Solicitante</span>
                <span class="info-val">{{ chamadoAberto.nome_usuario }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Estabelecimento</span>
                <span class="info-val ellipsis">{{ chamadoAberto.nome_estabelecimento }}</span>
              </div>
              <q-separator class="q-my-xs" />
              <div class="info-row">
                <span class="info-label">Criado em</span>
                <span class="info-val">{{ formatarDataCurta(chamadoAberto.created_at) }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Atualizado</span>
                <span class="info-val">{{ formatarDataCurta(chamadoAberto.updated_at) }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Anexos</span>
                <span class="info-val">{{ chamadoAberto.anexos ? chamadoAberto.anexos.length : 0 }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Comentários</span>
                <span class="info-val">{{ chamadoAberto.comentarios ? chamadoAberto.comentarios.length : 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card>

    <!-- Lightbox -->
    <q-dialog v-model="lightbox">
      <q-card class="no-shadow bg-transparent" style="max-width:90vw">
        <q-btn flat round dense icon="close" color="white" class="absolute-top-right q-ma-sm" style="z-index:1" @click="lightbox = false" />
        <img :src="imagemAberta" style="max-width:90vw;max-height:85vh;display:block;border-radius:8px" />
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { chamadoService } from '../services/chamadoService'
import { authService } from '../services/authService'

interface ImagemPreview { url: string; nome: string; arquivo: File }

@Component
export default class Chamados extends Vue {
  view: 'lista' | 'form' | 'detalhe' = 'lista'
  carregando         = false
  salvando           = false
  enviandoComentario = false
  busca              = ''
  tab                = 'todos'
  filtroPrioridade: string | null = null
  chamados: any[]          = []
  chamadosFiltrados: any[] = []
  chamadoAberto: any       = {}
  imagensPreview: ImagemPreview[] = []
  formNovo = { titulo: '', descricao: '', prioridade: 'media' }
  novoComentario = ''
  novoStatus     = ''
  novaPrioridade = ''
  lightbox       = false
  imagemAberta   = ''
  imagensNovas: ImagemPreview[] = []
  enviandoAnexo  = false

  opcoesPrioridade = [
    { label: 'Baixa', value: 'baixa' },
    { label: 'Média', value: 'media' },
    { label: 'Alta',  value: 'alta'  },
  ]
  opcoesStatus = [
    { label: 'Aberto',       value: 'aberto' },
    { label: 'Em andamento', value: 'em_andamento' },
    { label: 'Resolvido',    value: 'resolvido' },
    { label: 'Fechado',      value: 'fechado' },
  ]

  get isAdm() { return authService.isAdm() }

  async created() {
    await this.carregar()
    // Abre chamado direto se vier da dashboard
    const abrirId = this.$route.query && this.$route.query.abrir
    if (abrirId) {
      const chamado = this.chamados.find((c: any) => c.id === +abrirId)
      if (chamado) {
        await this.abrirDetalhe(chamado)
      } else {
        // Busca direto se não estiver na lista
        this.carregando = true
        try {
          this.chamadoAberto  = await chamadoService.buscar(+abrirId)
          this.novoStatus     = this.chamadoAberto.status
          this.novaPrioridade = this.chamadoAberto.prioridade
          this.imagensNovas   = []
          this.view = 'detalhe'
        } finally { this.carregando = false }
      }
    }
  }

  async carregar() {
    this.carregando = true
    try {
      const params: any = {}
      if (this.tab !== 'todos')  params.status    = this.tab
      if (this.filtroPrioridade) params.prioridade = this.filtroPrioridade
      const result = await chamadoService.listar(params)
      this.$set(this, 'chamados', result)
      this.filtrar()
    } finally {
      this.carregando = false
      this.$forceUpdate()
    }
  }

  filtrar() {
    const t = this.busca.toLowerCase()
    let lista = this.chamados

    // Na aba "todos", esconde os fechados
    if (this.tab === 'todos') {
      lista = lista.filter((c: any) => c.status !== 'fechado')
    }

    const filtrado = t
      ? lista.filter((c: any) => c.titulo.toLowerCase().includes(t))
      : lista.slice()
    this.$set(this, 'chamadosFiltrados', filtrado)
  }

  async abrirDetalhe(chamado: any) {
    this.carregando = true
    try {
      this.chamadoAberto  = await chamadoService.buscar(chamado.id)
      this.novoStatus     = this.chamadoAberto.status
      this.novaPrioridade = this.chamadoAberto.prioridade
      this.imagensNovas   = []
      this.view = 'detalhe'
    } finally { this.carregando = false }
  }

  cancelarForm() {
    this.view = 'lista'
    this.formNovo = { titulo: '', descricao: '', prioridade: 'media' }
    this.imagensPreview = []
  }

  triggerUpload() { (this.$refs.inputArquivo as HTMLInputElement).click() }

  onFileChange(e: Event) {
    const files = (e.target as HTMLInputElement).files
    if (files) this.adicionarArquivos(Array.from(files))
  }

  onDrop(e: DragEvent) {
    const files = e.dataTransfer && e.dataTransfer.files
    if (files) this.adicionarArquivos(Array.from(files))
  }

  adicionarArquivos(files: File[]) {
    const ok = ['image/png','image/jpeg','image/jpg','image/gif']
    files.forEach(f => {
      if (!ok.includes(f.type)) { this.$q.notify({ type: 'warning', message: `${f.name} não é uma imagem válida.`, position: 'top-right' }); return }
      if (f.size > 10*1024*1024) { this.$q.notify({ type: 'warning', message: `${f.name} excede 10MB.`, position: 'top-right' }); return }
      this.imagensPreview.push({ url: URL.createObjectURL(f), nome: f.name, arquivo: f })
    })
  }

  removerImagem(idx: number) { URL.revokeObjectURL(this.imagensPreview[idx].url); this.imagensPreview.splice(idx, 1) }

  async criarChamado() {
    if (!this.formNovo.titulo || !this.formNovo.descricao) {
      this.$q.notify({ type: 'warning', message: 'Preencha título e descrição.', position: 'top-right' }); return
    }
    this.salvando = true
    try {
      const chamado = await chamadoService.criar(this.formNovo)
      for (const img of this.imagensPreview) await chamadoService.anexar(chamado.id, img.arquivo)
      window.location.reload()
    } catch (err) {
      this.$q.notify({ type: 'negative', message: 'Erro ao abrir chamado.', position: 'top-right' })
      this.salvando = false
    }
  }

  async enviarComentario() {
    if (!this.novoComentario.trim()) return
    this.enviandoComentario = true
    try {
      await chamadoService.comentar(this.chamadoAberto.id, this.novoComentario)
      window.location.reload()
    } catch (err) {
      this.$q.notify({ type: 'negative', message: 'Erro ao enviar comentário.', position: 'top-right' })
      this.enviandoComentario = false
    }
  }

  async salvarAlteracoes() {
    this.salvando = true
    try {
      await chamadoService.atualizar(this.chamadoAberto.id, { status: this.novoStatus, prioridade: this.novaPrioridade })
      window.location.reload()
    } catch (err) {
      this.$q.notify({ type: 'negative', message: 'Erro ao atualizar chamado.', position: 'top-right' })
      this.salvando = false
    }
  }

  urlAnexo(caminho: string) {
    const nome = caminho.replace(/^uploads[\\/]/, '')
    return `http://localhost:3001/uploads/${nome}`
  }
  abrirLightbox(anexo: any) { this.imagemAberta = this.urlAnexo(anexo.caminho); this.lightbox = true }

  triggerUploadDetalhe() { (this.$refs.inputAnexoDetalhe as HTMLInputElement).click() }

  onFileChangeDetalhe(e: Event) {
    const files = (e.target as HTMLInputElement).files
    if (files) {
      const ok = ['image/png','image/jpeg','image/jpg','image/gif']
      Array.from(files).forEach(f => {
        if (!ok.includes(f.type)) { this.$q.notify({ type: 'warning', message: `${f.name} não é uma imagem válida.`, position: 'top-right' }); return }
        if (f.size > 10*1024*1024) { this.$q.notify({ type: 'warning', message: `${f.name} excede 10MB.`, position: 'top-right' }); return }
        this.imagensNovas.push({ url: URL.createObjectURL(f), nome: f.name, arquivo: f })
      })
    }
  }

  removerImagemNova(idx: number) {
    URL.revokeObjectURL(this.imagensNovas[idx].url)
    this.imagensNovas.splice(idx, 1)
  }

  async enviarAnexos() {
    this.enviandoAnexo = true
    try {
      for (const img of this.imagensNovas) {
        await chamadoService.anexar(this.chamadoAberto.id, img.arquivo)
      }
      window.location.reload()
    } catch (err) {
      this.$q.notify({ type: 'negative', message: 'Erro ao enviar imagens.', position: 'top-right' })
      this.enviandoAnexo = false
    }
  }

  formatarData(data: string) {
    return new Date(data).toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })
  }
  formatarDataCurta(data: string) {
    return new Date(data).toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric' })
  }

  corPrioridade(p: string) { return ({ baixa:'blue-grey', media:'orange', alta:'deep-orange' } as any)[p] || 'grey' }
  labelPrioridade(p: string) { return ({ baixa:'Baixa', media:'Média', alta:'Alta' } as any)[p] || p }
  corStatus(s: string) { return ({ aberto:'primary', em_andamento:'orange', resolvido:'positive', fechado:'grey' } as any)[s] || 'grey' }
  labelStatus(s: string) { return ({ aberto:'Aberto', em_andamento:'Em andamento', resolvido:'Resolvido', fechado:'Fechado' } as any)[s] || s }
}
</script>

<style scoped>
.border             { border: 1px solid #e0e0e0; }
.b-r-8              { border-radius: 8px; }
.q-tabs             { border-bottom: 1px solid #e0e0e0; }
.chamado-card:hover { background: rgba(0,0,0,0.01); }
.chamado-fechado    { background: #fafafa; opacity: 0.7; }
.chamado-fechado:hover { background: #f5f5f5; opacity: 1; }
.descricao-preview  { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; line-height:1.5; }
.comentario-box     { background: #f5f5f5; border-radius: 8px; }
.secao-label        { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:#9e9e9e; margin:0 0 4px; }
.info-row           { display:flex; justify-content:space-between; align-items:center; padding: 4px 0; }
.info-label         { font-size:12px; color:#9e9e9e; }
.info-val           { font-size:12px; color:#424242; max-width:55%; text-align:right; }
.upload-area        { border: 2px dashed #e0e0e0; transition: border-color .2s, background .2s; min-height: 100px; }
.upload-area:hover  { border-color: #7f56d8; background: rgba(127,86,216,0.03); }
.preview-item       { display:flex; flex-direction:column; align-items:center; width:100px; }
.preview-img        { width:100px; height:80px; object-fit:cover; border:1px solid #e0e0e0; }
.preview-remove     { position:absolute; top:-6px; right:-6px; width:20px !important; height:20px !important; }
.img-thumb          { position:relative; }
.img-overlay        { background: rgba(0,0,0,0); transition: background .2s; border-radius:8px; }
.img-thumb:hover .img-overlay { background: rgba(0,0,0,0.35); }
</style>
