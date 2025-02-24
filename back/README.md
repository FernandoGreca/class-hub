# Faculdade Projeto

Este projeto é um sistema para gerenciamento de alunos, professores, disciplinas, atividades e frequência, desenvolvido com NestJS e MongoDB.

## Tecnologias Usadas

- **NestJS**: Framework Node.js para construir aplicações escaláveis e eficientes.
- **Mongoose**: Biblioteca para modelar dados de forma fácil e clara com MongoDB.
- **MongoDB**: Banco de dados NoSQL utilizado para armazenar as informações.

## Pré-requisitos

Antes de começar, verifique se você tem as seguintes ferramentas instaladas:

- [Node.js](https://nodejs.org/) (v20 ou superior)
- [MongoDB](https://www.mongodb.com/) (ou um serviço de MongoDB na nuvem, como o MongoDB Atlas que é o que está sendo utilizado no projeto)

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/usuario/nome-do-repositorio.git
   cd nome-do-repositorio
   ```

2. Como o Git não armazena as pastas `node_modules` e `dist`, é necessário reinstalar as dependências do projeto. Execute o seguinte comando dentro da pasta raiz do projeto:

   ```bash
   npm install
   ```

3. Instale o CLI do NestJS globalmente:

   ```bash
   npm i -g @nestjs/cli
   ```

4. Instale o Mongoose e suas dependências dentro do projeto:

   ```bash
   npm i @nestjs/mongoose mongoose
   ```

5. Para iniciar a aplicação backend em modo de desenvolvimento, execute o seguinte comando dentro da pasta `back`:

   ```bash
   npm run start:dev
   ```

Isso inicializará a API do backend e permitirá o desenvolvimento ativo do projeto.
