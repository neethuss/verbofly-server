FROM node:alpine3.18
WORKDIR /app
COPY package.json dest ./
RUN npm install
COPY . .
EXPOSE 3002
CMD [ "npm", "run", "start" ]