FROM node:14.17.0-alpine3.13

LABEL maintainer="security-testing@example.com"
LABEL description="Vulnerable Node.js application for SCA scanner testing"
LABEL version="1.0.0"

WORKDIR /app

RUN apk add --no-cache \
    bash \
    curl \
    wget \
    git \
    openssl=1.1.1k-r0 \
    python3=3.8.10-r0 \
    make \
    g++

COPY package.json package-lock.json* ./

RUN npm install --unsafe-perm

COPY . .

RUN mkdir -p /app/uploads /app/extracted /app/archives /app/public /app/views

RUN chmod -R 755 /app

EXPOSE 3000

ENV NODE_ENV=production \
    PORT=3000 \
    JWT_SECRET=super-secret-key-123

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

USER node

CMD ["node", "server.js"]

