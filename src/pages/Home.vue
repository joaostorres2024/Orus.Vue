<template>
  <div class="q-pa-md">
    <p class="text-h6 text-bold">Dashboard</p>

    <div class="row q-col-gutter-md q-mb-lg">
      <div v-if="isAdm" class="col-12 col-sm-6 col-md-3">
        <q-card class="no-shadow border b-r-10 q-pa-md">
          <div class="row items-center justify-between q-mb-sm">
            <div class="text-caption text-grey-6 text-uppercase">Usuários ativos</div>
            <q-icon name="o_group" color="primary" size="20px" />
          </div>
          <q-skeleton v-if="carregando" type="text" width="60px" height="40px" />
          <div v-else class="text-h4 text-bold text-dark">{{ stats.total_usuarios }}</div>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="no-shadow border b-r-10 q-pa-md">
          <div class="row items-center justify-between q-mb-sm">
            <div class="text-caption text-grey-6 text-uppercase">Chamados abertos</div>
            <q-icon name="o_confirmation_number" color="orange" size="20px" />
          </div>
          <q-skeleton v-if="carregando" type="text" width="60px" height="40px" />
          <div v-else class="text-h4 text-bold text-dark">{{ (stats.chamados && stats.chamados.abertos) || 0 }}</div>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="no-shadow border b-r-10 q-pa-md">
          <div class="row items-center justify-between q-mb-sm">
            <div class="text-caption text-grey-6 text-uppercase">Chamados resolvidos</div>
            <q-icon name="o_fact_check" color="positive" size="20px" />
          </div>
          <q-skeleton v-if="carregando" type="text" width="60px" height="40px" />
          <div v-else class="text-h4 text-bold text-dark">{{ (stats.chamados && stats.chamados.resolvidos) || 0 }}</div>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="no-shadow border b-r-10 q-pa-md">
          <div class="row items-center justify-between q-mb-sm">
            <div class="text-caption text-grey-6 text-uppercase">Alta prioridade</div>
            <q-icon name="o_priority_high" color="negative" size="20px" />
          </div>
          <q-skeleton v-if="carregando" type="text" width="60px" height="40px" />
          <div v-else class="text-h4 text-bold text-dark">{{ (stats.chamados && stats.chamados.alta_prioridade) || 0 }}</div>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <!-- Chamados recentes -->
      <div :class="isAdm ? 'col-12 col-md-7' : 'col-12'">
        <q-card class="no-shadow border b-r-10 q-pa-md" style="height:100%">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-bold" style="font-size:15px">Chamados recentes</div>
            <q-btn flat dense label="Ver todos" color="primary" size="sm" to="/Chamados" />
          </div>

          <div v-if="carregando" class="column q-gutter-sm">
            <q-skeleton v-for="i in 3" :key="i" height="56px" class="b-r-8" />
          </div>

          <div v-else-if="chamadosRecentes.length === 0" class="text-grey text-center q-py-lg" style="font-size:13px">
            Nenhum chamado encontrado.
          </div>

          <div v-else class="column q-gutter-sm">
            <div
              v-for="chamado in chamadosRecentes"
              :key="chamado.id"
              class="row items-center justify-between q-pa-sm border b-r-8 cursor-pointer chamado-row"
              @click="irParaChamado(chamado.id)"
            >
              <div class="column col">
                <div class="row items-center q-gutter-sm">
                  <p class="q-ma-none text-weight-medium" style="font-size:13px">{{ chamado.titulo }}</p>
                  <q-badge :color="corPrioridade(chamado.prioridade)" style="font-size:10px">
                    {{ labelPrioridade(chamado.prioridade) }}
                  </q-badge>
                </div>
                <p class="q-ma-none text-grey" style="font-size:11px">
                  {{ chamado.nome_usuario }} · {{ formatarData(chamado.created_at) }}
                </p>
              </div>
              <div class="row items-center q-gutter-sm">
                <q-badge :color="corStatus(chamado.status)" outline class="q-px-sm" style="font-size:11px">
                  {{ labelStatus(chamado.status) }}
                </q-badge>
                <q-icon name="o_chevron_right" size="16px" class="text-grey-4" />
              </div>
            </div>
          </div>
        </q-card>
      </div>

      <!-- Usuários recentes — só adm -->
      <div v-if="isAdm" class="col-12 col-md-5">
        <q-card class="no-shadow border b-r-10 q-pa-md" style="height:100%">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-bold" style="font-size:15px">Usuários recentes</div>
            <q-btn flat dense label="Ver todos" color="primary" size="sm" to="/Usuarios" />
          </div>

          <div v-if="carregando" class="column q-gutter-sm">
            <q-skeleton v-for="i in 4" :key="i" height="50px" class="b-r-8" />
          </div>

          <div v-else class="column q-gutter-sm">
            <div
              v-for="u in usuariosRecentes"
              :key="u.id"
              class="row items-center q-gutter-sm q-pa-sm border b-r-8"
            >
              <div class="bg-primary row items-center justify-center text-white text-bold"
                style="width:34px;height:34px;border-radius:100px;font-size:13px;flex-shrink:0">
                {{ u.nome ? u.nome.charAt(0).toUpperCase() : '?' }}
              </div>
              <div class="column col">
                <p class="q-ma-none text-weight-medium ellipsis" style="font-size:13px">{{ u.nome }}</p>
                <p class="q-ma-none text-grey ellipsis" style="font-size:11px">{{ u.email }}</p>
              </div>
              <q-badge :color="u.role === 'adm' ? 'purple' : 'blue-grey'" style="font-size:10px">
                {{ u.role === 'adm' ? 'Administrador' : 'Usuário' }}
              </q-badge>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { chamadoService } from '../services/chamadoService'
import { usuarioService } from '../services/usuarioService'
import { authService } from '../services/authService'

@Component
export default class Dashboard extends Vue {
  carregando = true
  stats: any = {}
  chamadosRecentes: any[] = []
  usuariosRecentes: any[] = []

  get isAdm() { return authService.isAdm() }

  async created() { await this.carregar() }

  async carregar() {
    this.carregando = true
    try {
      const promises: Promise<any>[] = [
        chamadoService.dashboard(),
        chamadoService.listar(),
      ]
      if (this.isAdm) promises.push(usuarioService.listar())
      const results = await Promise.all(promises)
      this.stats = results[0]
      this.chamadosRecentes = results[1].slice(0, 5)
      if (this.isAdm) this.usuariosRecentes = results[2].slice(0, 5)
    } finally {
      this.carregando = false
    }
  }

  irParaChamado(id: number) {
    // Navega para Chamados passando o id como query para abrir direto
    void this.$router.push({ path: '/Chamados', query: { abrir: String(id) } })
  }

  formatarData(data: string) {
    return new Date(data).toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })
  }

  corPrioridade(p: string) { return ({ baixa:'blue-grey', media:'orange', alta:'deep-orange' } as any)[p] || 'grey' }
  labelPrioridade(p: string) { return ({ baixa:'Baixa', media:'Média', alta:'Alta' } as any)[p] || p }
  corStatus(s: string) { return ({ aberto:'primary', em_andamento:'orange', resolvido:'positive', fechado:'grey' } as any)[s] || 'grey' }
  labelStatus(s: string) { return ({ aberto:'Aberto', em_andamento:'Em andamento', resolvido:'Resolvido', fechado:'Fechado' } as any)[s] || s }
}
</script>

<style scoped>
.border { border: 1px solid #e0e0e0; }
.b-r-10 { border-radius: 10px; }
.b-r-8  { border-radius: 8px; }
.chamado-row:hover { background: rgba(0,0,0,0.02); }
</style>
