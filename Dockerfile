FROM bitnami/node:16.19.0 as builder
COPY . /app
WORKDIR /app

RUN npm install


ENV SERVER_PORT 4000
ENV SERVER_HOST localhost

EXPOSE 4000

CMD ["npm", "start"]
