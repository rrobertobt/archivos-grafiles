# Use slim node image as base
FROM node:20-slim

# Set arguments
ARG ARG_API_HOST
ARG ARG_API_PORT

# Set enviroment variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production

ENV VITE_API_HOST=$ARG_API_HOST
ENV VITE_API_PORT=$ARG_API_PORT

# Install package manager and utils (pnpm)
RUN corepack enable

# Copy project files
COPY ./ /app
WORKDIR /app

# Install dependencies
RUN pnpm install

# Build project
RUN pnpm build

# Expose and run Nuxt 3 application
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
