FROM node:18.16.1-alpine3.17
WORKDIR app
COPY package*.json ./
RUN npm install --quiet
COPY * ./
RUN npm run build
USER node
EXPOSE 4000
ENTRYPOINT ["node", "dist/main.js"]