FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm install --production

WORKDIR /app

# Copy backend code
COPY backend ./backend

# Create uploads directory
RUN mkdir -p /app/backend/uploads

WORKDIR /app/backend

EXPOSE 5000

CMD ["node", "index.js"]