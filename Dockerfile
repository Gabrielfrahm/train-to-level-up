# Etapa de Build
FROM node:22-alpine as build

# Define o diretório de trabalho no container para a etapa de build
WORKDIR /usr/api/app


# Copia os arquivos do package.json e package-lock.json (ou yarn.lock)
COPY package*.json ./


# Instala as dependências do projeto
RUN npm ci

# Copia o restante dos arquivos do projeto para o diretório de trabalho no container
COPY . .

# Compila a aplicação para produção
RUN npm run build

# Etapa de Runtime
FROM node:22-alpine

# Define o diretório de trabalho no container para a etapa de runtime
WORKDIR /usr/api/app

# Copia os artefatos do build para o diretório de trabalho do container de runtime
COPY --from=build /usr/api/app/dist ./dist
COPY --from=build /usr/api/app/package*.json ./
COPY --from=build /usr/api/app/node_modules ./node_modules

# Expõe a porta que o servidor NestJS vai usar
EXPOSE 3333

# Define o diretório de trabalho para o serviço NestJS
WORKDIR /usr/api/app/

# O comando para iniciar a aplicação
CMD ["node", "dist/main"]
