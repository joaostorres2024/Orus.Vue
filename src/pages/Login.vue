<template>
  <div class="row fullscreen items-center justify-center">
    <div class="column items-center justify-center" style="width: 1000px">
      <img src="../assets/LogoOrus.png" alt="" style="width: 150px; margin-top: -100px" />
      <p style="font-size: 20px" class="text-bold q-mb-sm">
        Faça o login para acessar o Coden Orus
      </p>
      <p>Acesse sua conta e acompanhe seus chamados.</p>
      <div class="column" style="width: 300px">
        <q-input
          v-model="email"
          label="E-mail"
          outlined
          dense
          type="email"
          class="q-my-sm"
          :disable="carregando"
          @keyup.enter="entrar"
        />
        <q-input
          v-model="senha"
          :type="verSenha ? 'text' : 'password'"
          class="full-width"
          label="Senha"
          outlined
          dense
          :disable="carregando"
          @keyup.enter="entrar"
        >
          <template v-slot:append>
            <q-icon
              :name="verSenha ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="verSenha = !verSenha"
            />
          </template>
        </q-input>

        <p v-if="erro" class="text-negative q-mt-sm q-mb-none" style="font-size: 13px">
          {{ erro }}
        </p>

        <q-btn
          type="button"
          label="Entrar"
          class="full-width bg-primary text-white q-my-md q-pa-xs"
          unelevated
          :loading="carregando"
          @click.prevent="entrar"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { authService } from '../services/authService'

@Component
export default class LoginComponent extends Vue {
  email = ''
  senha = ''
  verSenha = false
  carregando = false
  erro = ''

  async entrar() {
    this.erro = ''
    if (!this.email || !this.senha) {
      this.erro = 'Preencha e-mail e senha.'
      return
    }
    this.carregando = true
    try {
      await authService.login(this.email, this.senha)
      void this.$router.push({ path: '/' })
    } catch (err: any) {
      this.erro = (err.response && err.response.data && err.response.data.message) || 'Erro ao fazer login.'
    } finally {
      this.carregando = false
    }
  }
}
</script>

<style scoped></style>
