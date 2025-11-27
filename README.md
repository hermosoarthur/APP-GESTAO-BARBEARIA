# APP-GESTAO-BARBEARIA

Studio é um aplicativo completo para gestão de barbearias, projetado para otimizar as operações do dia a dia. Construído com React Native e Expo, ele oferece uma interface intuitiva para gerenciar agendamentos, serviços, funcionários e acompanhar o desempenho do negócio. O aplicativo utiliza Firebase para armazenamento de dados em tempo real e EmailJS para um fluxo de autenticação seguro e sem senha.


---

## 🌟 Abordagem
  Decidimos utilizar as stacks aprendidas em aula junto às ferramentas recomendadas pelo professor, a fim de colocar em prática todo o conteúdo do semestre em um único projeto. O objetivo é desenvolver um aplicativo comercial que possa ser aprimorado ao longo do tempo, permitindo a implementação de novas funcionalidades e tecnologias. Dessa forma, buscamos    ampliar nossos conhecimentos sobre novas tendências e nos manter atualizados.

---

## ⚙️ Funcionalidades

- **Dashboard** – Visão geral do dia com quantidade de agendamentos, total de vendas e serviços mais realizados.  
- **Gerenciamento de Agendamentos** – Criar, visualizar, editar e alterar status (Agendado, Confirmado, Concluído, Cancelado). Envio de SMS como lembrete ao cliente.  
- **Catálogo de Serviços** – CRUD completo para serviços com preço, descrição e duração.  
- **Perfis da Equipe** – Gerenciamento de funcionários, cargos e status.  
- **Relatórios Inteligentes** – Relatórios semanais e mensais para análise de vendas e desempenho.  
- **Autenticação Segura** – Login sem senha utilizando EmailJS para envio de códigos.  
- **Tema Dinâmico** – Alternância entre modo claro e escuro.


---

## 🧩 Stack Tecnológica

- **Framework:** React Native (Expo)  
- **Banco de Dados:** Firebase Realtime Database  
- **Autenticação:** EmailJS    
- **Estado:** React Hooks (`useState`, `useEffect`, `useMemo`)  
- **Estilização:** `StyleSheet` do React Native


---

## 📁 Estrutura do Projeto

```bash
/
├── services/             # Módulos para Firebase (databaseService) e EmailJS (authService)
├── src/
│   └── screens/          # Todas as telas principais do aplicativo (Login, Dashboard, Agendamentos, etc.)
├── components/           # Componentes de UI reutilizáveis (ex.: FormModal)
├── assets/               # Recursos estáticos como ícones e imagens
├── App.js                # Componente raiz, gerencia navegação, tema e estado do usuário
├── firebase-config.js    # Configuração e inicialização do Firebase
└── package.json          # Dependências do projeto e scripts

```



---

## 🚀 Começando

Passo a passo para rodar o projeto em ambiente de desenvolvimento.




## 📌 Pré-requisitos

- Node.js LTS  
- Expo Go instalado no celular  



## 📥 Instalação

1. **Clone o repositório:**
    ```sh
    git clone https://github.com/hermosoarthur/app-gestao-barbearia.git
    ```

2. **Acesse a pasta do projeto:**
    ```sh
    cd app-gestao-barbearia
    ```

3. **Instale as dependências gerais:**
    ```sh
    npm install
    ```

4. **Instale as dependências compatíveis com Expo (recomendado):**
    ```sh
    npx expo install
    ```

---

### 🎯 Executando a Aplicação

1.  **🖥️ Inicie o servidor de desenvolvimento:**
    ```sh
    npx expo start
    ```
    Este comando inicia o servidor de desenvolvimento do Expo 🚀

2.  **🌐 Abra a aplicação:**
    - No terminal será exibido um QR Code que você pode escanear com o app Expo Go no seu celular 📱
    - Para web: pressione `w` no terminal para abrir no navegador 🌐
    - Para Android: pressione `a` no terminal para abrir no emulador 🤖
    - Para iOS: pressione `i` no terminal para abrir no simulador 🍎
  
3.  **✨ Aproveite a aplicação!**
    A aplicação estará rodando e você poderá explorar todas as funcionalidades 🎉


## 📞 Suporte

Se encontrar algum problema durante a instalação ou execução, verifique se todas as dependências do Expo estão corretamente instaladas e se você está usando uma versão compatível do Node.js 🔍

Se você tiver algum feedback, por favor nos deixe saber por meio de arthur.hermoso@aluno.faculdadeimpacta.com.br


## Autores

- [@hermosoarthur](https://github.com/hermosoarthur)
- [@vicrubiovic](https://github.com/vicrubiovic)
- [@Rafa-S68](https://github.com/Rafa-S68)
- [@vitoriasmo](https://github.com/vitoriasmo)
- [@Geovannatoso](https://github.com/geovannatoso)
- [@Joicy-SantosP](https://github.com/Joicy-SantosP)

