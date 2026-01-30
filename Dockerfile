FROM node:20-alpine

WORKDIR /app

# Installera dependencies
# --legacy-peer-deps: @auth0/nextjs-auth0 kräver next ~15.5.9, vi har 15.5.5
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Kopiera in resten av projektet
COPY . .

# Bygg Next.js (server mode för Auth0 + API routes)
RUN npm run build

ENV NODE_ENV=production

# Cloud Run sätter PORT, Next.js lyssnar på PORT
EXPOSE 8080
CMD ["npx", "next", "start", "-p", "8080"]

