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
            label="Pesquisar por chamados"
          >
            <template v-slot:prepend>
              <q-icon size="20px" color="grey" name="search" />
            </template>
          </q-input>
        </div>
      </div>
    </q-card>
  </div>
</template>
