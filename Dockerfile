# ==========================================================
# Stage 1: builder — install ALL dependencies and prep source
# ==========================================================
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
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

# ✅ FIX: Copies your entire structured layout cleanly (including index.html and assets/)
COPY --from=builder /app/ .

# 🛡️ Switch active execution context away from root to your custom user
USER appuser

# Inform the system that web traffic travels over port 3000
EXPOSE 3000

# 🐳 AUTOMATED HEALTH CHECK: Docker monitors container health every 30s
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Fire up your production backend web server instance
CMD ["node", "src/server.js"]