# ==========================================================
# Stage 1: builder — install ALL dependencies and prep source
# ==========================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors first to maximize Docker layer caching
COPY package*.json ./
RUN npm ci

# Copy the remaining codebase over to the builder image space
COPY . .

# ==========================================================
# Stage 2: production image — only runtime files for security
# ==========================================================
FROM node:20-alpine AS production

WORKDIR /app

# 🚨 MANUAL REQUIREMENT: Add a dedicated, non-root system user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy package configurations and install PRODUCTION dependencies only
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy application assets and backend source cleanly
COPY --from=builder /app/src ./src
COPY index.html ./
COPY styles.css ./
COPY script.js ./
COPY completeScript.js ./

# 🛡️ Switch active execution context away from root to your custom user
USER appuser

# Inform the system that web traffic travels over port 3000
EXPOSE 3000

# 🐳 AUTOMATED HEALTH CHECK: Docker monitors container health every 30s
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Fire up your production backend web server instance
CMD ["node", "src/server.js"]