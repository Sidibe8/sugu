FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT 5000 # or keep 8080, depending on what port your app runs on
EXPOSE 5000 # should match the PORT env
CMD ["node", "index.js"]
