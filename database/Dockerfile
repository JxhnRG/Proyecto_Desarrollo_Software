FROM postgres:14
COPY ./databases.sql /docker-entrypoint-initdb.d/00_databases.sql
COPY ./schema.sql /docker-entrypoint-initdb.d/01_schema.sql
COPY ./data.sql /docker-entrypoint-initdb.d/03_data.sql
