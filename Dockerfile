# ---- Base ----
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

# ---- Runtime ----
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=base /app /app
EXPOSE 3000
USER node
CMD ["node", "src/index.js"]