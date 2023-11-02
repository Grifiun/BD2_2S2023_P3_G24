# Universidad de San Carlos de Guatemala
## Facultad de Ingeniería
### Práctica 3
#### Escuela de Ciencias y Sistemas
##### Sistemas de Bases de Datos 2
###### Ing. Luis Alberto Arias Solórzano
###### Aux. Emiliano José Alexander Velásquez Najera
###### 2do. Semestre 2023
###### Grupo 24

## OBJETIVOS

### Objetivo general

El objetivo general de este proyecto es proporcionar a los estudiantes una experiencia práctica en el diseño y desarrollo de una aplicación de comercio electrónico simulada, utilizando bases de datos no relacionales como MongoDB, Redis y DynamoDB. La aplicación debe permitir la gestión de productos de entretenimiento, incluyendo discos de música, películas y libros, a través de operaciones CRUD (Crear, Leer, Actualizar y Eliminar), y proporcionar un portal administrativo para la gestión eficiente de estos productos.

### Objetivos específicos

1. Diseñar el esquema de datos para productos de entretenimiento: Los estudiantes deben definir la estructura de datos para representar discos de música, películas y libros en las bases de datos no relacionales MongoDB, y DynamoDB.

2. Implementar operaciones CRUD: Los estudiantes deben desarrollar las operaciones CRUD para la gestión de productos, lo que incluye la creación, lectura, actualización y eliminación de registros en las bases de datos. Esto implica la escritura de código para interactuar con las bases de datos y realizar estas operaciones.

3. Desarrollar un portal administrativo: Se debe crear una interfaz de usuario para el portal administrativo que permita a los administradores de la tienda en línea gestionar los productos. Esto incluye la autenticación, la visualización de productos existentes y la capacidad de agregar, editar y eliminar productos.

4. Implementar la integración con MongoDB: Los estudiantes deben configurar MongoDB como el sistema de gestión de base de datos principal para los productos y garantizar que la aplicación pueda interactuar correctamente con esta base de datos.

5. Implementar la integración con DynamoDB: Se requerirá la configuración de DynamoDB para almacenar información adicional, como las transacciones de compras y las calificaciones de productos, y garantizar que la aplicación pueda acceder y modificar estos datos de manera eficiente.

## ENUNCIADO

### Descripción general

El proyecto tiene como objetivo principal proporcionar a los estudiantes una experiencia práctica en el diseño y desarrollo de una aplicación de comercio electrónico simulada que se centra en la gestión de productos de entretenimiento, como discos de música, películas y libros. La aplicación incluirá un portal administrativo que permitirá a los usuarios con roles de administrador realizar operaciones de creación, lectura, actualización y eliminación (CRUD) de estos productos en una tienda en línea ficticia. Para lograr este objetivo, se utilizarán bases de datos no relacionales como MongoDB, y DynamoDB para el almacenamiento y gestión de datos.

### Características Clave del Proyecto:

**Gestión de Productos:** La aplicación permitirá a los administradores agregar, editar, eliminar y visualizar productos dos categorías principales: películas y libros. Cada producto contendrá información relevante.

**CRUD de Libros:** Este CRUD se debe realizar por medio de MongoDB. Cada Libro debe de tener los siguientes atributos: Id, Titulo, Autor, Descripción, Fecha de Publicación, Calificación (1 a 5), Cantidad en Stock y Categoría. Del Autor debe almacenar su nombre y su fecha de nacimiento, de la categoría, su nombre y su id.

**CRUD de Películas:** Este CRUD se debe realizar por medio de DynamoDB. Cada Película debe tener los siguientes atributos: Id, Director, Fecha de Estreno, Idioma Original, Distribuidora, Descripción, Precio, Genero, Clasificación (A, B, C, R), Calificación (1 a 5) Precio. Del director debe almacenar su nombre y su fecha de nacimiento, De Cada Distribuidora, su nombre y id.

### Consultas:

#### Libros:

1. Listar todos los libros disponibles.
2. Encontrar libros por Categoria (por ejemplo, Ciencia Ficción).
3. Buscar libros con un autor específico.
4. Mostrar los libros ordenados por calificación promedio (de mayor a menor).
5. Encontrar libros con un precio inferior a 20.
6. Buscar libros con una palabra clave en el título o descripción.
7. Información de los 10 autores más caros (Suma del precio de todos sus libros).
8. Obtener la cantidad de libros en stock para un libro específico.
9. Calcular el precio promedio de todos los libros.
10. Información de todas las categorías.

#### Películas:

1. Listar todas las películas disponibles.
2. Buscar películas por género (por ejemplo, Comedia).
3. Mostrar películas con una clasificación R (restringida) o superior.
4. Encontrar películas dirigidas por un director específico.
5. Buscar películas con un precio inferior a 15.
6. Recuperar películas lanzadas en un año específico (por ejemplo, 2022).
7. Información de los 10 directores con mejor calificación (Promedio de todas sus películas).
8. Buscar películas con una palabra clave en el título o descripción.
9. Calcular el precio promedio de todas las películas.
10. Encontrar películas con las mejores calificaciones promedio (ordenadas de mayor a menor).

### Consideraciones importantes

- Se debe realizar una API para poder invocar las operaciones CRUD, el lenguaje de la misma discreción de cada grupo.

- Se debe tomar el tiempo de cada consulta y operación que se haga y se debe redactar un análisis de resultados, concluyendo en base a esos tiempos.

- Se entregarán archivos de prueba para probar las consultas, unos días antes de la entrega se les proporcionara a los estudiantes los resultados esperados de las mismas.
