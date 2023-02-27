FROM node

WORKDIR /app/src/server

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 8070

CMD [ "npm", "run", "server" ]