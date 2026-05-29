<template>
  <div class="q-pa-md">
    <p class="text-h6 text-bold">Chamados</p>

    <q-card class="q-pa-md no-shadow column col-12">
      <div class="row justify-between items-center">
        <div class="row">
          <q-input
            style="min-width: 300px"
            outlined
            dense
            label="Pesquisar por chamados"
          >
            <template v-slot:prepend>
              <q-icon size="20px" color="grey" name="search" />
            </template>
          </q-input>
        </div>
        <div class="row q-gutter-md">
          <q-select
            style="min-width: 200px"
            :options="opcoesPrioridade"
            outlined
            dense
            label="Prioridade"
          />
          <q-select
            style="min-width: 200px"
            :options="opcoesPeriodo"
            outlined
            dense
            label="Período"
          />
          <button
            style="border: none"
            class="bg-primary text-white cursor-pointer"
            uenelevated
          >
            Novo Chamado
          </button>
        </div>
      </div>

      <div class="q-py-lg">
        <q-tabs
          v-model="tab"
          inline-label
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="left"
          narrow-indicator
          no-caps
        >
          <q-tab class="q-mr-md" name="todos" icon="o_mail" label="Todos" />
          <q-tab
            class="q-mr-md"
            name="novos"
            icon="o_mark_as_unread"
            label="Novos"
          />
          <q-tab
            class="q-mr-md"
            name="em_andamento"
            icon="o_forward_to_inbox"
            label="Em andamento"
          />
          <q-tab
            class="q-mr-md"
            name="fechados"
            icon="o_fact_check"
            label="Fechados"
          />
        </q-tabs>
      </div>

      <!--ESPAÇO PARA CHAMADOS-->

      <div>
        <q-card class="no-shadow border q-pa-md">
          <div class="column">
            <div class="row items-center justify-between">
              <p class="text-bold" style="font-size: 16px">Chamado# 0001-CRS63</p>
              <p style="font-size: 12px" class="text-grey">Criado em 29/05/2026 14:57</p>
            </div>
            <p style="font-size: 14px">
              Como depositar meu dinheiro no portal?
            </p>
            <p style="font-size: 14px" class="text-grey">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo
              impedit odit suscipit, aut culpa cumque. Reiciendis at expedita
              facilis delectus veniam facere ratione aliquid adipisci porro
              necessitatibus ipsam, quaerat velit! Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Accusantium veritatis provident
              adipisci. Eaque, impedit assumenda illo vel eveniet animi rerum
              corrupti quidem dolor velit veritatis quis quasi inventore dicta
              sequi.
            </p>
            <q-separator />
            <div class="row justify-between items-center q-mt-md">
              <div class="row items-center">
                <div
                  class="bg-primary row items-center justify-center text-white"
                  style="width: 30px; height: 30px; border-radius: 100px"
                >
                  U
                </div>
                <p class="q-ma-none q-ml-sm">Usuário</p>
              </div>
              <div>
                <p
                  class="q-ma-none text-bold text-primary cursor-pointer"
                  style="text-decoration: underline"
                >
                  Abrir Chamado
                </p>
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </q-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class ModuleComponent extends Vue {

    opcoesPrioridade = [
      { label: 'Novos', value: 'novos', color: '#4A90E2' },
      { label: 'Em andamento', value: 'em_andamento', color: '#F5A623' },
      { label: 'Fechados', value: 'fechados', color: '#7ED321' }
    ]

    opcoesPeriodo = [
      { label: '7 Dias', value: 'sete_dias' },
      { label: '15 Dias', value: 'quinze_dias' },
      { label: '30 Dias', value: 'trinta_dias' },
      { label: 'Meses Anteriores', value: 'outros_meses'}
    ]

}
</script>

<style scoped>
.q-tabs {
  border-bottom: 1px solid #e0e0e0;
}

.border {
  border: 1px solid #e0e0e0;
}
</style>
