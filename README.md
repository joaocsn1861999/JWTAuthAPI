# JWTAuthAPI

**API Rest para Autenticação de usuários com JWT**

## Índice

1.  [Visão Geral](#visão-geral)
2.  [Como rodar o projeto](#como-rodar-o-projeto)
3.  [Endpoints](#endpoints)
    * [Base URL](#url-base)
    * [Autenticação](#autenticação)
    * [Usuários](#usuários)
4.  [Tecnologias Utilizadas (Dependências)](#tecnologias-utilizadas-dependências)

---

## Visão Geral

Este projeto é um objeto de estudo focado na implementação de uma API Rest com autenticação JWT, Bcrypt para criptografar senha, SQLite para persistencia de dados e controle de acesso baseado em funções/cargos. O serviço permite auto cadastro com permissões limitadas e também podendo ter administradores com permissões adicionais.

---

## Como rodar o projeto

Requisitos:
- **Node.js**

Na raiz do projeto, crie um arquivo ".env" conforme exemplificado no arquivo ".env.example".
Em seguida, com o node instalado em sua máquina, execute na raiz do projeto os seguintes comandos em ordem:

```bash
npm install
```

```bash
npm run createDB
```

```bash
npm start
```

Com isso, você terá a API rodando na porta 3000, podendo fazer requisições em `http://localhost:3000/`.

---

## Endpoints

### URL base

```json
// URL base
http://localhost:3000/
```

---

### Autenticação

- **POST** **`/login`** → Busca a data.
    
    ```json
    
    // Exemplo de requisição
    {
        "email": "user@email.com",
        "password": "Password123#"
    }

    // Exemplo de resposta
    {
        "message": "Login realizado com sucesso",
        "token": "tokenDeAcesso"
    }
    ```

- **GET** **`/token-validation`** → Faz a validação do token.
    
    ```json

    // Exemplo de resposta
    {
        "message": "Token válido",
        "valid": true,
        "user": {
          "id": 1,
          "first_name": "User",
          "last_name": "Admin",
          "email": "adminuser@email.com",
          "is_admin": true,
          "active": true,
          "created_at": "2025-05-22 18:03:58",
          "updated_at": "2025-05-22 18:03:58"
        }
    }
    ```

---

### Usuários

- **GET** **`/users`** → Busca usuários com paginação.
    - Autenticação (Bearer token):
        - token (Obrigatório): token de acesso.

    - Parâmetros de busca:
        - page (Opcional): número da página, padrão 1.
        - limit (Opcional): itens por página, padrão: 5.
        - name (Opcional): buscar por nomes similares a string informada.
        - active (Opcional): busca somente usuários ativos.
        - is_admin (Opcional): busca somente usuários administradores.

    ```json
    // Exemplo de resposta
    {
      "message": "Usuários encontrados com sucesso",
      "users": [
        {
          "id": 1,
          "first_name": "User",
          "last_name": "Admin",
          "email": "adminuser@email.com",
          "is_admin": true,
          "active": true,
          "created_at": "2025-05-22 18:03:58",
          "updated_at": "2025-05-22 18:03:58"
        }
      ],
      "pagination": {
        "total": 1,
        "pages": 1,
        "current_page": 1,
        "limit": 5,
      }
    }
    ```

- **GET** **`/users/:id`** → Busca usuário por id.
    - Autenticação (Bearer token):
        - token (Obrigatório): token de acesso.

    ```json
    // Exemplo de resposta
    {
      "message": "Usuário encontrado com sucesso",
      "user": {
        "id": 1,
        "first_name": "User",
        "last_name": "Admin",
        "email": "adminuser@email.com",
        "is_admin": true,
        "active": true,
        "created_at": "2025-05-22 18:03:58",
        "updated_at": "2025-05-22 18:03:58"
      }
    }
    ```

- **GET** **`/users/count`** → Busca usuários com paginação.
    - Autenticação (Bearer token):
        - token (Obrigatório): token de acesso.

    ```json
    // Exemplo de resposta
    {
      "total": 1,
      "is_admin": 1,
      "active": 1,
      "not_active": 0,
    }
    ```

- **POST** **`/users`** → Cadastrar novo usuário ou auto cadastro.
    - Autenticação (Bearer token):
        - token (Opcional*): token de acesso, somente administrador pode criar outro administrador.

    ```json
    // Exemplo de requisição
    {
      "first_name": "first_name",
      "last_name": "last_name",
      "email": "user@email.com",
      "password": "senhaDoUsuario",
      "is_admin": false,
    }

    // Exemplo de resposta
    {
      "message": "Usuário cadastrado com sucesso",
      "user": {
        "first_name": "first_name",
        "last_name": "last_name",
        "email": "user@email.com",
        "password": "senhaDoUsuario",
        "is_admin": false,
      }
    }
    ```

- **PATCH** **`/users/me/password`** → Alterar a senha do usuário autenticado.
    - Autenticação (Bearer token):
        - token (Obrigatório): token de acesso.

    ```json
    // Exemplo de requisição
    {
      "currentPassword": "SenhaAntiga",
      "newPassword": "NovaSenha"
    }

    // Exemplo de resposta
    {
      "message": "Senha alterada com sucesso"
    }
    ```

- **PATCH** **`/users/me`** → Alterar dados do usuário autenticado.
    - Autenticação (Bearer token):
        - token (Obrigatório): token de acesso.

    ```json
    // Exemplo de requisição
    {
      "first_name": "Novo nome",
      "last_name": "Novo sobrenome",
      "email": "novo@email.com",
      "active": false
    }

    // Exemplo de resposta
    {
      "message": "Usuário atualizado com sucesso",
      "user": {
        "first_name": "Novo nome",
        "last_name": "Novo sobrenome",
        "email": "novo@email.com",
        "active": false
      }
    }
    ```

- **PATCH** **`/users/:id`** → Alterar dados do usuário autenticado.
    - Autenticação (Bearer token):
        - token (Obrigatório): token de acesso.

    ```json
    // Exemplo de requisição
    {
      "first_name": "Usuário",
      "last_name": "Comum",
      "email": "comum@email.com",
      "is_admin": true,
      "active": true
    }

    // Exemplo de resposta
    {
      "message": "Usuário atualizado com sucesso",
      "user": {
        "first_name": "Usuário",
        "last_name": "Comum",
        "email": "comum@email.com",
        "is_admin": true,
        "active": false
      }
    }
    ```

- **DELETE** **`/users/me`** → Exclui o usuário autenticado.
    - Autenticação (Bearer token):
        - token (Obrigatório): token de acesso.

    ```json
    // Exemplo de resposta
    {
      "message": "Usuário deletado com sucesso"
    }
    ```

- **DELETE** **`/users/:id`** → Exclui usuário com id informado.
    - Autenticação (Bearer token):
        - token (Obrigatório): token de acesso.

    ```json
    // Exemplo de resposta
    {
      "message": "Usuário deletado com sucesso"
    }
    ```

---

## Tecnologias Utilizadas (Dependências)

- **Node.js** com **Express.js.**
- **SQLite3** para persistência de dados.
- **DotEnv** para gerenciamento de variáveis de ambiente.
- **CORS** para administrar domínios que podem fazer requisições.
- **BCrypt** para encriptação de senha.
- **JWT (JSON Web Token)** para autenticação e autorização.
- **Awilix e Awilix Express** para automatizar injeção de dependências.

