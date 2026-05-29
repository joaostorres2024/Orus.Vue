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

  dadosMockados = 
    
[
  {
    "id_usuario": 1,
    "nome_usuario": "João Silva",
    "email": "joao.silva@coden.com",
  },
  {
    "id_usuario": 2,
    "nome_usuario": "Maria Oliveira",
    "email": "maria.oliveira@coden.com",
  },
  {
    "id_usuario": 3,
    "nome_usuario": "Carlos Souza",
    "email": "carlos.souza@coden.com",
  },
  {
    "id_usuario": 4,
    "nome_usuario": "Ana Pereira",
    "email": "ana.pereira@coden.com",
  },
  {
    "id_usuario": 5,
    "nome_usuario": "Lucas Fernandes",
    "email": "lucas.fernandes@coden.com",
  },
  {
    "id_usuario": 6,
    "nome_usuario": "Beatriz Costa",
    "email": "beatriz.costa@coden.com",
  },
  {
    "id_usuario": 7,
    "nome_usuario": "Rafael Martins",
    "email": "rafael.martins@coden.com",
  },
  {
    "id_usuario": 8,
    "nome_usuario": "Fernanda Rocha",
    "email": "fernanda.rocha@coden.com",
  },
  {
    "id_usuario": 9,
    "nome_usuario": "Gabriel Alves",
    "email": "gabriel.alves@coden.com",
  },
  {
    "id_usuario": 10,
    "nome_usuario": "Juliana Barbosa",
    "email": "juliana.barbosa@coden.com",
  }
  ]

}
</script>

<style scoped>
.border {
  border: 1px solid #e0e0e0;
}
</style>