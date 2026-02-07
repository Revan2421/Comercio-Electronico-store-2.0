# TechShop E-commerce 2.0

Plataforma de comercio electrónico moderna y completa con Frontend en React y Backend en FastAPI (Python), orquestada con Docker.

## Estructura del Proyecto

- **frontend/**: Aplicación Single Page Application (SPA) construida con React, Vite y TailwindCSS.
- **backend/**: API RESTful construida con FastAPI, SQLAlchemy y Pydantic.
- **backend/BD/**: Scripts de inicialización de base de datos PostgreSQL.
- **docker-compose.yml**: Configuración para desplegar todos los servicios (Frontend, Backend, Base de Datos).

## Requisitos Previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y ejecutándose.

## Cómo Iniciar

1.  Abre una terminal en la raíz del proyecto.
2.  Ejecuta el siguiente comando para construir y levantar los contenedores:

    ```bash
    docker-compose up --build
    ```

3.  Una vez iniciados los servicios, accede a:
    - **Frontend (Tienda)**: http://localhost:5173
    - **Backend (API Docs)**: http://localhost:8000/docs

## Credenciales por Defecto (Base de Datos)

El sistema base de datos se autoconfigura. Si necesitas revisar la configuración, revisa el archivo `docker-compose.yml`.

- **User**: postgres
- **Password**: password
- **DB**: ecommerce_db

## Desarrollo

- Si modificas el código del **frontend**, los cambios se reflejarán automáticamente (Hot Reload).
- Si modificas el código del **backend**, el servidor se reiniciará automáticamente.
