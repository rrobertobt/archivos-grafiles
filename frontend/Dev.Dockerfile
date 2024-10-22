# Use slim node image as base
FROM node:20.0

# Set enviroment variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install package manager and utils (pnpm)
RUN corepack enable

# Copy project files
COPY . /app
WORKDIR /app

# Install dependencies
RUN pnpm install

# Build project
# RUN pnpm build

# Expose and run Nuxt 3 application
EXPOSE 3000
CMD ["pnpm", "dev"]
