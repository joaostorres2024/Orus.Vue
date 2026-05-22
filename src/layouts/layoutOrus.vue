<template>
  <q-layout view="lHh Lpr lFf">
    <q-drawer show-if-above v-model="drawer" side="left" bordered width="250">
      <div class="q-pa-md text-h6"><img src="../assets/LogoOrus.png" style="width: 50px;" alt=""></div>

      <q-list padding>
        <q-item clickable v-ripple to="/">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>Usuários</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="confirmation_number" />
          </q-item-section>
          <q-item-section>Chamados</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>Configurações</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-header>
      <q-toolbar class="bg-white q-py-md text-black">
        <q-btn flat dense round icon="menu" @click="drawer = !drawer" />

        <q-toolbar-title> Welcome! John Smith </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import router from 'src/router';
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class LayoutComponent extends Vue {
}
</script>
