FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install --timeout=300000

COPY . .

ENV PORT=5000

EXPOSE 5000


CMD ["node", "server.js"]
