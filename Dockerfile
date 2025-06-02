FROM node:18-bullseye-slim

WORKDIR /app

COPY package*.json ./
ENV NODE_ENV=production
RUN npm install --omit=dev

COPY . .

ARG API_BASE_URL
ENV API_BASE_URL=${API_BASE_URL}

EXPOSE 4000
CMD ["npm", "start"]
