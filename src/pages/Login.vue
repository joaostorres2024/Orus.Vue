<template>
  <div class="row fullscreen items-center justify-center">
    <div class="column items-center justify-center" style="width: 1000px">
    <img src="../assets//LogoOrus.png" alt="" style="width: 150px; margin-top: -100px;">
      <p style="font-size: 20px" class="text-bold q-mb-sm">
        Faça o login para acessar o Coden Orus
      </p>
      <p>Acesse sua conta e acompanhe seus chamados.</p>
      <div class="column" style="width: 300px">
        <q-input label="Usuário" outlined dense type="text" class="q-my-sm" />
        <q-input
          :type="verSenha ? 'text' : 'password'"
          class="full-width"
          label="Senha"
          outlined
          dense
        >
          <template v-slot:append>
            <q-icon
              :name="verSenha ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="verSenha = !verSenha"
            />
          </template>
        </q-input>
        <q-btn
          type="submit"
          label="Entrar"
          class="full-width bg-primary text-white q-my-md q-pa-xs"
          unelevated
          @click="$router.push('/')"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import router from 'src/router';
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class LoginComponent extends Vue {
    verSenha = false
}
</script>

<style scoped></style>
