<img src="src/assets/imgLemnos/logoHorizontalClaro.svg" alt="Logo da Lemnos" height="250" width="100%"/>

# Lemnos

E-commerce de tecnologia desenvolvido em React como Trabalho de Conclusão de Curso (TCC) em Desenvolvimento de Sistemas, com autenticação, catálogo de produtos com filtros e busca, histórico de pedidos e painel administrativo.

<img src="src/assets/capaReadMe.png" alt="Capa do Projeto" width="100%"/>

## Índice

-   [Tecnologias Utilizadas](#tecnologias-utilizadas)
-   [Funcionalidades](#funcionalidades)
-   [Estrutura do Projeto](#estrutura-do-projeto)
-   [Como Executar o Projeto](#como-executar-o-projeto)
-   [Planos Futuros](#planos-futuros)
-   [Contato](#contato)

## Tecnologias Utilizadas

-   **React** — biblioteca principal da interface
-   **Vite** — build e dev server
-   **Firebase** — autenticação, incluindo login com Google
-   **Redux** — gerenciamento de estado
-   **SCSS** — estilização, com um arquivo por página
-   **API externa em Java** — fornece os dados de produtos ([repositório](https://github.com/LucasBonato/Lemnos-Server))

## Funcionalidades

**Autenticação**
Login e cadastro de usuários via Firebase, com suporte a login com Google.

**Filtros e pesquisa**
Filtragem de produtos por categoria, preço, etc., e busca por texto.

**Catálogo dinâmico**
Exibição dos produtos com infinite scroll.

**Modo escuro**
Alternância entre tema claro e escuro.

**Histórico de pedidos**
Consulta aos pedidos anteriores do usuário.

**Tela de produto**
Página de detalhes por produto.

**Painel administrativo**
Gerenciamento de produtos e usuários.

**Segurança**
Autenticação via Firebase e comunicação sobre HTTPS.

## Estrutura do Projeto

```
src/
├── components/  # Componentes reutilizáveis do React
├── pages/       # Páginas principais do e-commerce
├── services/    # Integração com Firebase e com a API externa
├── store/       # Reducers e configuração do Redux
└── App.jsx      # Estrutura principal da aplicação
```

## Como Executar o Projeto

1. Clone este repositório:

    ```bash
    git clone https://github.com/lucasatdriano/lemnos
    ```

2. Acesse o diretório do projeto:

    ```bash
    cd lemnos
    ```

3. Instale as dependências:

    ```bash
    npm install
    ```

4. Execute o projeto:

    ```bash
    npm run dev
    ```

5. Abra [http://localhost:5173](http://localhost:5173) no navegador.

## Planos Futuros

-   Integração com API de pagamento para transações diretamente no site
-   Sistema de recomendação de produtos com base em histórico de navegação e compras
-   Suporte multilíngue

## Contato

Desenvolvido por Lucas Adriano como TCC em Desenvolvimento de Sistemas.

-   **E-mail**: [lucasatdriano@gmail.com](mailto:lucasatdriano@gmail.com)
-   **LinkedIn**: [Lucas Adriano](https://linkedin.com/in/lucasadrianodev)
