# 🏐 Sistema de Gestão de Campeonatos de Voleibol

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white) ![Material-UI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

Este projeto é uma aplicação web completa para a gestão de campeonatos de voleibol, desenvolvida para a **Liga dos Vales**. A plataforma permite a administração completa de torneios, desde o cadastro de equipes e atletas até a operação de placares ao vivo e a exibição pública de resultados e classificações.

**[➡️ Ver a Aplicação Ao Vivo](https://seu-link-do-vercel.app)** _(Substitua pelo seu link do Vercel)_

---

## ✨ Funcionalidades Principais

O sistema é dividido em três grandes áreas: a Interface Pública, o Painel de Administração e a Mesa de Controle Ao Vivo.

### 🏛️ Área Pública

- **Página Inicial Dinâmica:** Exibe as tabelas de classificação geral da temporada (Masculino e Feminino) e destaca a próxima etapa do campeonato.
- **Listagem de Torneios:** Uma galeria de "cards" com todos os torneios da temporada, mostrando o seu status (Próximo, Em Andamento, Finalizado).
- **Página de Detalhes do Torneio:**
  - Navegação por abas para separar a Fase Classificatória dos Playoffs.
  - Exibição das chaves/grupos de cada fase.
  - Tabela de classificação por grupo, calculada automaticamente com base nos resultados.
  - Lista de todas as partidas e seus placares.

### 🔐 Painel de Administrador (Área Protegida)

- **Autenticação Segura:** Login e Logout para operadores.
- **Dashboard Central:** Gestão centralizada de Torneios, Equipes e Atletas em painéis expansíveis (Accordion).
- **Gestão de Torneios:**
  - Criação de novos torneios (nome, temporada, naipe).
  - Adição e remoção de equipes a um torneio.
- **Geração de Chaveamento:** Sorteio automático das equipes em chaves (A, B, C...).
- **Geração de Partidas:**
  - Criação automática dos confrontos da fase classificatória (todos contra todos).
  - Agendamento manual da ordem, quadra e horário dos jogos.
- **Geração de Playoffs:**
  - Lógica complexa para finalizar a fase de grupos e gerar os playoffs automaticamente.
  - Classificação geral dos qualificados com base no "Ponto Average".
  - Criação de semifinais (mata-mata) e, posteriormente, das finais e disputas de 3º lugar.

### 🔴 Mesa de Controle (Operação Ao Vivo)

- **Interface Dedicada:** Tela otimizada para o operador no dia dos jogos.
- **Navegação Hierárquica:** Seleção da fase e depois da partida a ser operada.
- **Placar Interativo:**
  - Marcação de pontos set a set.
  - Validação de placar (não permite empates, exige 2 pontos de vantagem).
  - Finalização de sets e da partida com atualização instantânea na interface.
- **Ferramentas de Correção:** Permite "reabrir" uma partida finalizada por engano e corrigir o último set inserido.

---

## 📸 Telas da Aplicação

_(Dica: Tire screenshots da sua aplicação e substitua os links abaixo para deixar o seu README incrível!)_

|                     Página Inicial                      |                 Detalhes do Torneio (Público)                 |
| :-----------------------------------------------------: | :-----------------------------------------------------------: |
|     ![Página Inicial]([COLE A URL DA IMAGEM AQUI])      | ![Página de Detalhes do Torneio]([COLE A URL DA IMAGEM AQUI]) |
|               **Painel do Administrador**               |                 **Mesa de Controle Ao Vivo**                  |
| ![Painel de Administração]([COLE A URL DA IMAGEM AQUI]) |       ![Mesa de Controle]([COLE A URL DA IMAGEM AQUI])        |

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:**
  - [React](https://reactjs.org/) (com Create React App)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Redux Toolkit](https://redux-toolkit.js.org/) para gestão de estado
- **UI/Design:**
  - [Material-UI (MUI)](https://mui.com/) para a biblioteca de componentes
  - Tema customizado com as cores da liga
- **Backend (BaaS):**
  - [Supabase](https://supabase.io/)
    - **Database:** PostgreSQL
    - **Authentication:** Gestão de utilizadores
    - **Storage:** Armazenamento de imagens e documentos
- **Hospedagem:**
  - [Vercel](https://vercel.com)

---

## 🚀 Como Executar o Projeto Localmente

Siga os passos abaixo para configurar e executar o projeto no seu ambiente de desenvolvimento.

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão LTS recomendada)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Uma conta no [Supabase](https://supabase.io/)

### Passos

1.  **Clone o repositório:**

    ```bash
    git clone [https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git)
    cd SEU_REPOSITORIO
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure o Supabase:**

    - Crie um novo projeto no seu painel do Supabase.
    - Vá para o "SQL Editor" e execute todos os scripts SQL que criámos para gerar as tabelas (`torneios`, `equipes`, `partidas`, etc.) e as políticas de segurança (RLS).
    - Crie os "Buckets" no "Storage" (`fotos`, `documentos`, `logoEquipes`).

4.  **Configure as Variáveis de Ambiente:**

    - Na raiz do projeto, crie um ficheiro chamado `.env`.
    - Adicione as suas chaves do Supabase, que pode encontrar em "Project Settings" -> "API" no seu painel:
      ```
      REACT_APP_SUPABASE_URL=SUA_URL_DO_PROJETO
      REACT_APP_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLICA
      ```

5.  **Execute a aplicação:**
    ```bash
    npm start
    ```
    A aplicação deverá estar a funcionar em `http://localhost:3000`.

---

_Este projeto foi construído com a ajuda do Parceiro de Programação._
