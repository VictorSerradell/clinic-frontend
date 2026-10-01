FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copiar archivos de definición de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalación limpia de dependencias
RUN pnpm install --frozen-lockfile

# Copiar el código fuente
COPY . .

# Exponer el puerto de Vite
EXPOSE 5173

# Arrancar el servidor de desarrollo escuchando en 0.0.0.0
CMD ["pnpm", "dev", "--host"]