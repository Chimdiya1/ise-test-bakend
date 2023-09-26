FROM node:latest

RUN mkdir ise

WORKDIR /ise

COPY . /ise/

COPY ./package.json ./package-lock.json /ise/

RUN npm install

RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV=development

COPY . .

EXPOSE 8000

EXPOSE 443

CMD ["npm", "run", "start:dev"]