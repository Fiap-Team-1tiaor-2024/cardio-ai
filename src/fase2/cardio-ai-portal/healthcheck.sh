#!/bin/sh
# Healthcheck script para o container

# Verifica se o servidor está respondendo
if wget --quiet --tries=1 --spider http://localhost:3000 || \
   curl -f http://localhost:3000 > /dev/null 2>&1; then
    exit 0
else
    exit 1
fi
