FROM node:20-alpine AS base

# Habilitar Corepack y fijar la versión exacta de pnpm (v8)
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

WORKDIR /app

# Copiar archivos de definición de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalación limpia de dependencias
RUN pnpm install --frozen-lockfile

# Copiar el código fuente
COPY . .

# Exponer el puerto de Vite
EXPOSE 5173

# Arrancar el servidor de desarrollo
CMD ["pnpm", "dev", "--host"]