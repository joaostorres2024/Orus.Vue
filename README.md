# Orus - Helpdesk Simples

Orus é um helpdesk simples e funcional, desenvolvido para facilitar o gerenciamento de solicitações de suporte de forma eficiente.

## Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

*   **Vue.js 2**: Um framework progressivo para a construção de interfaces de usuário.
*   **Quasar Framework v1**: Um framework de código aberto baseado em Vue.js que permite desenvolver aplicativos de alto desempenho para diversas plataformas (SPA, SSR, PWA, Mobile, Desktop).

## Pré-requisitos

Para rodar o projeto Orus, você precisará ter as seguintes ferramentas instaladas em sua máquina:

*   **Node.js**: Recomenda-se a versão 12.x ou 14.x para compatibilidade ideal com o Quasar v1. Embora versões mais recentes possam funcionar, pode ser necessário usar `NODE_OPTIONS=--openssl-legacy-provider` para evitar problemas de compatibilidade com dependências mais antigas [1] [2].
*   **npm** ou **Yarn**: Gerenciadores de pacotes para Node.js.
*   **Quasar CLI**: A interface de linha de comando do Quasar Framework.

## Instalação

Siga os passos abaixo para configurar e rodar o projeto Orus em sua máquina local:

1.  **Clone o repositório** (se aplicável):

    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd Orus.Vue
    ```

2.  **Instale o Quasar CLI globalmente** (se ainda não tiver):

    ```bash
    npm install -g @quasar/cli
    # ou
    yarn global add @quasar/cli
    ```

3.  **Instale as dependências do projeto**:

    Navegue até o diretório raiz do projeto Orus e execute o comando para instalar todas as dependências necessárias:

    ```bash
    npm install
    # ou
    yarn
    ```

## Execução do Projeto

Para iniciar o servidor de desenvolvimento e visualizar o projeto em seu navegador, execute o seguinte comando no diretório raiz do projeto:

```bash
quasar dev
```

Se você estiver usando uma versão mais recente do Node.js e encontrar problemas, tente o seguinte comando:

```bash
NODE_OPTIONS=--openssl-legacy-provider quasar dev
```

Após a execução bem-sucedida, o aplicativo estará disponível em `http://localhost:8080` (ou outra porta, dependendo da configuração).

## Referências

[1] Quasar Framework - UI Upgrade Guide: [https://quasar.dev/start/upgrade-guide/](https://quasar.dev/start/upgrade-guide/)
[2] GitHub - quasar/dev (implicitly) prohibits upgrading node to v14 #6884: [https://github.com/quasarframework/quasar/issues/6884](https://github.com/quasarframework/quasar/issues/6884)
