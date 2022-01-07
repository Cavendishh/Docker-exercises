FROM node:16 AS base
WORKDIR /usr/src/app
COPY . .

FROM base AS test
ENV  CI=true
RUN  npm ci
COPY . .
RUN  npm test

# No seperate npm ci -production because we want to build with test-stage's npm ci
FROM base AS prod
ENV  REACT_APP_BACKEND_URL='http://localhost:3000'
COPY --from=test /usr/src/app .
RUN  npm run build
RUN  npm install -g serve
CMD  ["serve", "build"]
