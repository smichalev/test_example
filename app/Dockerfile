FROM node:12

WORKDIR /var/www/app

COPY package*.json ./
RUN npm install --production

COPY . ./

ENV NODE_PATH=.
ENV NODE_ENV=production

ENV HOST=127.0.0.1
ENV PORT=8881

ENV NATS_SERVER=nats://127.0.0.1:4222

ENV DB__HOST=127.0.0.1
ENV DB__PORT=5432
ENV DB__USERNAME=postgres
ENV DB__PASSWORD=postgres
ENV DB__DATABASE=table_test
ENV DB__DIALECT=postgres

CMD [ "npm", "run", "start" ]
