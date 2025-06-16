# Utiliser une image Node.js officielle comme base
FROM node:22-alpine AS BUILDER

LABEL authors="voikyrioh"

# Créer et définir le répertoire de travail
WORKDIR /app

# Copier le reste des fichiers du projet
COPY . .

# install && build
RUN npm install --production
RUN npm run build

# Image Nginx pour servir l'application
FROM nginx:alpine

# Copier les fichiers construits depuis l'étape précédente
COPY --from=builder /app/dist /usr/share/nginx/html


# Exposer le port 80
EXPOSE 80

