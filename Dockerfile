###################
# BASE
###################
FROM node:18-alpine As base

ENV DIR /usr/src/app

WORKDIR $DIR

###################
# BUILD FOR LOCAL DEVELOPMENT
###################
FROM base as development

ENV NODE_ENV=development

# ARG NPM_TOKEN

COPY package*.json $DIR
COPY tsconfig*.json $DIR
COPY src $DIR/src

# RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > $DIR/.npmrc && \
#     npm install && \
#     rm -f .npmrc

RUN npm install

EXPOSE $PORT

CMD ["npm", "run", "start:dev" ]


###################
# BUILD FOR PRODUCTION
###################
FROM base As build


# ARG NPM_TOKEN

RUN apk update && apk add --no-cache dumb-init

COPY package*.json $DIR
COPY tsconfig*.json $DIR
COPY src $DIR/src

# RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > $DIR/.npmrc && \
#     npm ci && \
#     rm -f .npmrc

RUN npm ci

RUN npm run build && \
    npm prune --production


###################
# PRODUCTION
###################
FROM base As production

ENV NODE_ENV=production
ENV USER node

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=build $DIR/node_modules $DIR/node_modules
COPY --from=build $DIR/dist $DIR/dist
COPY --from=build $DIR/src/config/env/.env.${NODE_ENV} $DIR/src/config/env/.env.${NODE_ENV}

EXPOSE $PORT

USER $USER

CMD ["dumb-init", "node", "dist/main.js" ]