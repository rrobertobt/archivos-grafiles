# Use slim node image as base
FROM node:20-slim

# Set enviroment variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production

# Install package manager and utils (pnpm)
RUN corepack enable

# Copy project files
COPY ./ /app
WORKDIR /app

# Install dependencies
RUN pnpm install

# Install nest cli globally
RUN pnpm i -g @nestjs/cli

# Build project
RUN pnpm build

# Expose and run NestJS server
EXPOSE 8000
CMD ["node", "dist/main"]
