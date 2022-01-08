FROM node:16

WORKDIR /usr/src/app

COPY . .

ENV CHOKIDAR_USEPOLLING=true
# Change npm ci to npm install since we are going to be in development mode
RUN npm ci
RUN node -v
RUN npm -v
RUN npm update

# npm start is the command to start the application in development mode
CMD ["npm", "start"]