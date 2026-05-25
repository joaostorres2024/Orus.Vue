<template>
  <q-layout view="lHh Lpr lFf">

    <!-- Sidebar -->
    <q-drawer
      v-model="drawer"
      show-if-above
      side="left"
      bordered
      :width="250"
      class="column"
    >
      <!-- Logo -->
      <div class="row items-center q-pa-md q-pl-lg">
        <span class="logo-text">Coden <span class="text-primary">Orus</span></span>
      </div>

      <!-- Nav -->
      <q-list class="col q-pa-sm">
        <div class="nav-label q-px-sm q-mb-xs q-mt-sm">Menu</div>

        <q-item clickable v-ripple to="/" exact class="menu-item b-r-8 q-mb-xs" active-class="menu-item-active">
          <q-item-section avatar>
            <q-icon name="o_dashboard" size="20px" />
          </q-item-section>
          <q-item-section class="menu-label">Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/Usuarios" class="menu-item b-r-8 q-mb-xs" active-class="menu-item-active">
          <q-item-section avatar>
            <q-icon name="o_group" size="20px" />
          </q-item-section>
          <q-item-section class="menu-label">Usuários</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/Chamados" class="menu-item b-r-8 q-mb-xs" active-class="menu-item-active">
          <q-item-section avatar>
            <q-icon name="o_confirmation_number" size="20px" />
          </q-item-section>
          <q-item-section class="menu-label">Chamados</q-item-section>
        </q-item>

        <div class="nav-label q-px-sm q-mt-md q-mb-xs">Sistema</div>

        <q-item clickable v-ripple to="/Configuracoes" class="menu-item b-r-8 q-mb-xs" active-class="menu-item-active">
          <q-item-section avatar>
            <q-icon name="o_settings" size="20px" />
          </q-item-section>
          <q-item-section class="menu-label">Configurações</q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <!-- Header -->
    <q-header unelevated :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'" style="border-bottom: 0.5px solid rgba(0,0,0,0.08)">
      <q-toolbar class="q-py-xs">
        <q-btn flat dense round icon="menu" class="text-grey-7" @click="drawer = !drawer" />

        <q-toolbar-title>
          <div class="text-weight-medium text-dark" style="font-size: 14px; line-height: 1.2">
            Bem-vindo 👋
          </div>
          <div class="text-grey-5" style="font-size: 11px">{{ currentDate }}</div>
        </q-toolbar-title>

        <q-btn flat round dense icon="o_notifications" class="text-grey-7 q-mr-xs" />
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
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: 'MainLayout',

  setup() {
    const drawer = ref(false)

    const currentDate = computed(() => {
      return new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    })

    return { drawer, currentDate }
  },
})
</script>

<style scoped>
.logo-text {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.nav-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #bdbdbd;
}

.menu-label {
  font-size: 13px;
}

.menu-item {
  color: #616161;
  min-height: 40px;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.15s ease;
  will-change: transform;
}

.menu-item:hover {
  background: rgba(0, 0, 0, 0.04);
  transform: translateY(-1px);
}

.menu-item:active {
  transform: translateY(1px);
}

.menu-item-active {
  background: #EEF2FF !important;
  color: #4F46E5 !important;
  font-weight: 600;
}

.menu-item-active .q-icon {
  color: #4F46E5 !important;
}

.b-r-8 {
  border-radius: 8px;
}

.page-enter-active {
  animation: pageIn 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}
.page-leave-active {
  animation: pageOut 0.2s cubic-bezier(0.55, 0, 1, 0.45) forwards;
}

@keyframes pageIn {
  0%   { opacity: 0; transform: translateY(10px) scale(0.99); filter: blur(3px); }
  100% { opacity: 1; transform: translateY(0) scale(1);       filter: blur(0); }
}
@keyframes pageOut {
  0%   { opacity: 1; transform: translateY(0) scale(1);       filter: blur(0); }
  100% { opacity: 0; transform: translateY(-6px) scale(0.99); filter: blur(2px); }
}
</style>
