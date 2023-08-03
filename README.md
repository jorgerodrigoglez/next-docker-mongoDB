# next.js eCommerce Teslo
Para correr localmente, se necesita la base de datos
...
docker-compose up -d
...
* El -d significa __detached__
...
* MongoDB URL Local
mongodb://localhost:27017/teslodb
...

## Configurar variables de entorno
Renombrar el archivo __.env.template__ a __.env__

* Reconstruir los modulos de node y levantar la aplicación
# yarn install
# yarn dev


# Probar la DDBB con información de prueba
Desde:
```http://localhost:3000/api/seed 