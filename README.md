<body>
  <h1>Pasos para ejecutar el proyecto</h1>
  <ul>
    <h2>Para levantar la base de datos</h2>
    <li>Ingresamos en la carpeta de la Base de datos: <code>cd database/</code></li>
    <li>Creamos la imagen de la base de datos con el siguiente comando: <code>docker build -t desarrollo/project .</code></li>
    <li>Levantamos la base de datos con el comado: <code>docker run --name project -p 0.0.0.0:5432:5432 -e POSTGRES_PASSWORD=projectds desarrollo/project</code></li>
    <h2>Para levantar el backend</h2>
    <li>Ingresamos a la carpeta del backend: <code>cd backend/</code></li>
    <li>Creamos el entorno virtual:</li>
    <ul>
      <h3>Para windows</h3>
      <li>Para crear el entorno virtual se usa el comando: <code>python -m venv venv</code></li>
      <li>Lo ejecutamos con el comado: <code>.\venv\Scripts\activate</code></li>
      <h3>Para Linux</h3>
      <li>Creamos el entorno virtual con el comando: <code>python3 -m venv venv</code></li>
      <li>Ejecutamos con el comando: <code>source venv/bin/activate</code></li>
    </ul>
    <li>Instalamos los requerimientos: <code>pip install -r requirements.txt</code></li>
    <li>Creamos las migraciones con: <code>python3 manage.py makemigrations</code></li>
    <li>Hacemos la migracion: <code>python3 manage.py migrate</code></li>
    <li>Creamos el super usuario: <code>python3 manage.py createsuperuser</code></li>
    <li>Corremos el servidor: <code>python3 manage.py runserver</code></li>
    <p>En windows usamos el <code>python</code> y en linux usamos <code>python3</code></p>
    <h2>Para levantar el frontend</h2>
    <li>Instalamos node-modules: <code>npm install</code></li>
    <li>Corremos el node: <code>npm run</code></li>
    <li>Iniciamos el servidor: <code>npm start</code></li>
  </ul>
</body>