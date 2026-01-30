FROM node:20-alpine

WORKDIR /app

# Installera dependencies + serve som global server
# --legacy-peer-deps: @auth0/nextjs-auth0 kräver next ~15.5.9, vi har 15.5.5
COPY package*.json ./
RUN npm install --legacy-peer-deps && npm install -g serve

# Kopiera in resten av projektet
COPY . .

# Bygg Next.js-sidan (med output: export → lägger filer i /app/out)
RUN npm run build

ENV NODE_ENV=production

# Cloud Run sätter PORT, vi lyssnar på 8080
EXPOSE 8080

# Serva den statiska exporten från /app/out
CMD ["serve", "out", "-l", "8080"]

