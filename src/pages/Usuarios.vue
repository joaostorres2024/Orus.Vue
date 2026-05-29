<template>
  <div class="q-pa-md">
    <p class="text-h6 text-bold">Usuários</p>
    <q-card class="q-pa-md no-shadow column col-12">
      <div class="row justify-between items-center">
        <div class="row">
          <q-input
            style="min-width: 300px"
            outlined
            dense
            label="Pesquisar por usuários"
          >
            <template v-slot:prepend>
              <q-icon size="20px" color="grey" name="search" />
            </template>
          </q-input>
        </div>
      </div>

      <div class="q-py-lg">
        <q-table
          :columns="colunasUsuarios"
          :data="dadosMockados"
          class="no-shadow border text-weight-medium"
          no-data-label="Nenhum registro encontrado"
          :rows-per-page-options="[10, 20, 50]"
          flat bordered
        >
        <template v-slot:body-cell-acoes="props">
          <q-td align="right">
            <q-btn icon="edit" size="sm" color="primary" flat round @click="verDetalhes(props.row)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn icon="auto_delete" size="sm" color="negative" flat round @click="verDetalhes(props.row)">
              <q-tooltip>Inativar temporariamente</q-tooltip>
            </q-btn>
          </q-td>
        </template>
        </q-table>
      </div>
    </q-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import listUsuarios from '../config/listUsuarios.json'

@Component
export default class ModuleComponent extends Vue {

  colunasUsuarios = listUsuarios.columns

dadosMockados = [
  {
    "id_usuario": 1,
    "estabelecimento_id": 1,
    "nome_usuario": "TechStore Brasil",
    "email": "techstore@coden.erp",
    "permissoes": "Usuário Coden"
  },
  {
    "id_usuario": 2,
    "estabelecimento_id": 2,
    "nome_usuario": "Coden",
    "email": "coden@admin.com",
    "permissoes": "Administrador"
  },
  {
    "id_usuario": 3,
    "estabelecimento_id": 3,
    "nome_usuario": "Loja Mais Construção",
    "email": "maisconstrucao@coden.erp",
    "permissoes": "Usuário Coden"
  },
  {
    "id_usuario": 4,
    "estabelecimento_id": 4,
    "nome_usuario": "Auto Peças Rápidas",
    "email": "autopecasrapidas@coden.erp",
    "permissoes": "Usuário Coden"
  },
  {
    "id_usuario": 5,
    "estabelecimento_id": 5,
    "nome_usuario": "Padaria Sabor Caseiro",
    "email": "saborcaseiro@coden.erp",
    "permissoes": "Usuário Coden"
  },
  {
    "id_usuario": 6,
    "estabelecimento_id": 6,
    "nome_usuario": "Papelaria Criativa",
    "email": "papelariacriativa@coden.erp",
    "permissoes": "Usuário Coden"
  },
  {
    "id_usuario": 7,
    "estabelecimento_id": 7,
    "nome_usuario": "Informática Upgrade",
    "email": "upgradeinfo@coden.erp",
    "permissoes": "Usuário Coden"
  },
  {
    "id_usuario": 8,
    "estabelecimento_id": 8,
    "nome_usuario": "Moda Urbana Store",
    "email": "modaurbana@coden.erp",
    "permissoes": "Usuário Coden"
  },
  {
    "id_usuario": 9,
    "estabelecimento_id": 9,
    "nome_usuario": "Distribuidora Central DF",
    "email": "centraldf@coden.erp",
    "permissoes": "Usuário Coden"
  },
  {
    "id_usuario": 10,
    "estabelecimento_id": 10,
    "nome_usuario": "Casa do Eletricista",
    "email": "eletricista@coden.erp",
    "permissoes": "Usuário Coden"
  }
]

}
</script>

<style scoped>
.border {
  border: 1px solid #e0e0e0;
}
</style>