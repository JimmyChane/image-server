##############################
# INSTALL DEPENDENCIES
##############################

FROM node:22-alpine AS deps
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

##############################
# DEV
##############################

FROM node:22-alpine AS development
WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

CMD ["npm", "run", "start:dev"]

##############################
# BUILD
##############################

FROM node:22-alpine AS build
WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

RUN npm run build
RUN npm prune --production

##############################
# PRODUCTION
##############################

FROM node:22-alpine AS run
WORKDIR /usr/src/app

USER node

COPY --from=build --chown=node:node /usr/src/app/package*.json ./
COPY --from=build --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=node:node /usr/src/app/dist ./dist

CMD ["node", "dist/main.js"]

EXPOSE 3000