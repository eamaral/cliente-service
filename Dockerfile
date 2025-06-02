FROM node:18-bullseye-slim

WORKDIR /app

COPY package*.json ./
ENV NODE_ENV=production
RUN npm install --omit=dev

COPY . .

EXPOSE 4000
CMD ["npm", "start"]
