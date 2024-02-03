FROM node:20

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install --save-dev @types/node

RUN npm install -g @nestjs/cli

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev"]
# CMD [ "npm", "run", "start:prod"]