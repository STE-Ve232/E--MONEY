FROM node:18-bullseye

# Install OpenSSL 1.1
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libssl1.1 && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 4000
CMD ["npm", "start"]
