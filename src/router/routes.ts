import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/login',
    component: () => import('pages/Login.vue')
  },
  {
    path: '/',
    component: () => import('layouts/layoutOrus.vue'),
    children: [
      { path: '', component: () => import('pages/Home.vue') },
      { path: 'Chamados', component: () => import('pages/Chamados.vue') },
      { path: 'Usuarios', component: () => import('pages/Usuarios.vue') },
      { path: 'Configuracoes', component: () => import('pages/Configuracoes.vue') },
      { path: 'Estabelecimentos', component: () => import('pages/Estabelecimentos.vue') }
    ]
  },

  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
