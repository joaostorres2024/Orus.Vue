<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Sidebar -->
    <q-drawer v-model="drawer" show-if-above side="left" bordered :width="250" class="column">
      <div class="row items-center q-pa-sm q-pl-md">
        <img src="../assets/oruslogo.png" style="width: 90px" alt="" />
      </div>

      <q-list class="col q-ma-sm q-pt-none">
        <div class="nav-label q-px-sm q-mb-xs q-mt-sm">Menu</div>

        <q-item clickable v-ripple to="/" exact class="menu-item b-r-8 q-mb-xs" active-class="menu-item-active">
          <q-item-section avatar><q-icon name="o_dashboard" size="20px" /></q-item-section>
          <q-item-section class="menu-label">Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/Chamados" class="menu-item b-r-8 q-mb-xs" active-class="menu-item-active">
          <q-item-section avatar><q-icon name="o_confirmation_number" size="20px" /></q-item-section>
          <q-item-section class="menu-label">Chamados</q-item-section>
        </q-item>

        <template v-if="isAdm">
          <q-item clickable v-ripple to="/Estabelecimentos" class="menu-item b-r-8 q-mb-xs" active-class="menu-item-active">
            <q-item-section avatar><q-icon name="o_store" size="20px" /></q-item-section>
             <q-item-section class="menu-label">Estabelecimentos</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/Usuarios" class="menu-item b-r-8 q-mb-xs" active-class="menu-item-active">
            <q-item-section avatar><q-icon name="o_group" size="20px" /></q-item-section>
            <q-item-section class="menu-label">Usuários</q-item-section>
          </q-item>
        </template>

        <div class="nav-label q-px-sm q-mt-md q-mb-xs">Sistema</div>

        <q-item clickable v-ripple to="/Configuracoes" class="menu-item b-r-8 q-mb-xs" active-class="menu-item-active">
          <q-item-section avatar><q-icon name="o_settings" size="20px" /></q-item-section>
          <q-item-section class="menu-label">Configurações</q-item-section>
        </q-item>
      </q-list>

      <!-- Usuário no rodapé da sidebar -->
      <div class="q-pa-md q-pt-none">
        <q-separator class="q-mb-md" />
        <div class="row items-center q-gutter-sm">
          <div
            class="bg-primary row items-center justify-center text-white text-bold"
            style="width: 34px; height: 34px; border-radius: 100px; font-size: 13px; flex-shrink: 0"
          >
            {{ inicialNome }}
          </div>
          <div class="column col" style="overflow: hidden">
            <p class="q-ma-none text-weight-medium ellipsis" style="font-size: 13px">{{ nomeUsuario }}</p>
            <p class="q-ma-none text-grey ellipsis" style="font-size: 11px">{{ roleLabel }}</p>
          </div>
          <q-btn flat round dense icon="o_logout" size="sm" class="text-grey-6" @click="sair">
            <q-tooltip>Sair</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-drawer>

    <!-- Header -->
    <q-header unelevated :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'" style="border-bottom: 0.5px solid rgba(0,0,0,0.08)">
      <q-toolbar class="q-py-xs">
        <q-btn flat dense round icon="menu" class="text-grey-7" @click="drawer = !drawer" />
        <q-toolbar-title>
          <div class="text-weight-medium text-dark" style="font-size: 14px; line-height: 1.2">
            Bem-vindo, {{ primeiroNome }} 👋
          </div>
          <div class="text-grey-5" style="font-size: 11px">{{ currentDate }}</div>
        </q-toolbar-title>
        <q-btn flat round dense icon="o_notifications" class="text-grey-7 q-mr-xs" />
        <div
          class="bg-primary row items-center justify-center text-white text-bold"
          style="width: 30px; height: 30px; border-radius: 100px; font-size: 12px"
        >
          {{ inicialNome }}
        </div>
      </q-toolbar>
    </q-header>

    <!-- Page -->
    <q-page-container>
      <q-page class="bg-accent q-px-lg">
        <transition name="page" mode="out-in">
          <router-view />
        </transition>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { authService } from '../services/authService'

@Component
export default class MainLayout extends Vue {
  drawer = false

  get usuario() {
    return authService.getUsuario()
  }

  get nomeUsuario() {
    return (this.usuario && this.usuario.nome) || ''
  }

  get primeiroNome() {
    return this.nomeUsuario.split(' ')[0]
  }

  get inicialNome() {
    return this.nomeUsuario.charAt(0).toUpperCase()
  }

  get isAdm() {
    return this.usuario && this.usuario.role === 'adm'
  }

  get roleLabel() {
    return this.isAdm ? 'Administrador' : 'Usuário'
  }

  get currentDate() {
    return new Date().toLocaleDateString('pt-BR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    })
  }

created() {
  const token = localStorage.getItem('token')
  console.log('Layout created - token:', token)
  if (!token) {
    console.log('Sem token, redirecionando para login')
    this.$router.replace('/login')
  }
}

  sair() {
    authService.logout()
  }
}
</script>

<style scoped>
.nav-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #bdbdbd; }
.menu-label { font-size: 13px; }
.menu-item { color: #616161; min-height: 40px; transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), background 0.15s ease; }
.menu-item:hover { background: rgba(0,0,0,0.04); transform: translateY(-1px); }
.menu-item:active { transform: translateY(1px); }
.menu-item-active { background: #eef2ff !important; color: #7f56d8 !important; font-weight: 600; }
.menu-item-active .q-icon { color: #7f56d8 !important; }
.b-r-8 { border-radius: 8px; }
.page-enter-active { animation: pageIn 0.35s cubic-bezier(0.25,0.46,0.45,0.94) forwards; }
.page-leave-active { animation: pageOut 0.2s cubic-bezier(0.55,0,1,0.45) forwards; }
@keyframes pageIn { 0% { opacity:0; transform:translateY(10px) scale(0.99); filter:blur(3px); } 100% { opacity:1; transform:translateY(0) scale(1); filter:blur(0); } }
@keyframes pageOut { 0% { opacity:1; transform:translateY(0) scale(1); filter:blur(0); } 100% { opacity:0; transform:translateY(-6px) scale(0.99); filter:blur(2px); } }
</style>
