const express = require('express');
const AWS = require('aws-sdk');
const csv = require('csv-parser');
const fs = require('fs');
const dotenv = require('dotenv');
const app = express();
app.use(express.json());

// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Configura las credenciales de AWS utilizando las variables de entorno
AWS.config.update({
  region: process.env.AWS_REGION, // Usa la variable de entorno para la región
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Usa la variable de entorno para la clave de acceso
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Usa la variable de entorno para la clave de acceso secreta
});

// Crea un cliente de DynamoDB
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Inicializa un contador para el ID incremental
let idCounter = 1;

// Variable para almacenar el tiempo de inicio de carga de datos
let startTimeLoadingData = Date.now();;

// Carga datos desde el archivo CSV a DynamoDB
fs.createReadStream('Peliculas.csv')
  .pipe(csv())
  .on('data', (row) => {
    const params = {
      TableName: 'Peliculas',
      Item: {
        id: idCounter++, // Incrementa el contador y utiliza como ID
        Titulo: row.Titulo,
        Director: row.Director,
        FechaDeEstreno: row.FechaDeEstreno,
        IdiomaOriginal: row.IdiomaOriginal,
        Distribuidora: row.Distribuidora,
        Descripcion: row.Descripcion,
        Precio: parseFloat(row.Precio),
        Genero: row.Genero,
        Clasificacion: row.Clasificacion,
        Calificacion: parseFloat(row.Calificacion)
      },
    };
    dynamodb.put(params, (err, data) => {
      if (err) {
        console.error('Error al cargar datos:', err);
      }
    });
  })
  .on('end', () => {
    
    console.log('Datos cargados desde el archivo CSV.');

    const endTimeLoadingData = Date.now(); // Tiempo de finalización de la carga de datos
    const loadingDataTime = (endTimeLoadingData - startTimeLoadingData); // Tiempo en segundos
    console.log(`Tiempo de carga de datos: ${loadingDataTime} ms`);
  });

// Consulta 1: Listar todas las películas disponibles
app.get('/peliculas', (req, res) => {
    const params = {
      TableName: 'Peliculas',
    };

    const startTime = Date.now();
  
    dynamodb.scan(params, (err, data) => {
      if (err) {
        console.error('Error al escanear la tabla:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        // Mapea los elementos y transforma el formato
        const peliculas = data.Items.map((item) => {
          return {
            "Titulo": item.Titulo,
            "Director": item.Director,
            "FechaDeEstreno": item.FechaDeEstreno,
            "IdiomaOriginal": item.IdiomaOriginal,
            "Distribuidora": item.Distribuidora,
            "Descripcion": item.Descripcion,
            "Precio": item.Precio,
            "Genero": item.Genero,
            "Clasificacion": item.Clasificacion,
            "Calificacion": item.Calificacion
          };
        });

        // Registra el tiempo de finalización después de obtener los datos
        const endTime = Date.now();
        const executionTime = endTime - startTime; // Calcula el tiempo en milisegundos
        console.log(`Tiempo de ejecución de la consulta 1: ${executionTime} ms`);
  
        res.json(peliculas);
      }
    });
  });
  
  // Consulta 2: Buscar películas por género (por ejemplo, Comedia).
  app.get('/peliculas/genero/:genero', (req, res) => {
    const genero = req.params.genero;
    const params = {
      TableName: 'Peliculas',
      FilterExpression: 'Genero = :genero',
      ExpressionAttributeValues: { ':genero': genero },
    };

    const startTime = Date.now();
  
    dynamodb.scan(params, (err, data) => {
      if (err) {
        console.error('Error al buscar películas por género:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        // Registra el tiempo de finalización después de obtener los datos
        const endTime = Date.now();
        const executionTime = endTime - startTime; // Calcula el tiempo en milisegundos
        console.log(`Tiempo de ejecución de la consulta 2: ${executionTime} ms`);
        res.json(data.Items);
      }
    });
  });

    // Consulta 3: Mostrar películas con una clasificación R (restringida) o superior.
    app.get('/peliculas/clasificacion/:clasificacion', (req, res) => {
        const clasificacion = req.params.clasificacion;
        const params = {
          TableName: 'Peliculas',
          FilterExpression: 'Clasificacion >= :clasificacion',
          ExpressionAttributeValues: { ':clasificacion': clasificacion },
        };
      
        const startTime = Date.now();

        dynamodb.scan(params, (err, data) => {
          if (err) {
            console.error('Error al buscar películas por clasificación:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
          } else {
            // Registra el tiempo de finalización después de obtener los datos
        const endTime = Date.now();
        const executionTime = endTime - startTime; // Calcula el tiempo en milisegundos
        console.log(`Tiempo de ejecución de la consulta 3: ${executionTime} ms`);
            res.json(data.Items);
          }
        });
      });

  // Consulta 4: Encontrar películas dirigidas por un director específico.
  app.get('/peliculas/director/:director', (req, res) => {
    const director = req.params.director;
    const params = {
      TableName: 'Peliculas',
      FilterExpression: 'Director = :director',
      ExpressionAttributeValues: { ':director': director },
    };

    const startTime = Date.now();
  
    dynamodb.scan(params, (err, data) => {
      if (err) {
        console.error('Error al buscar películas por director:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        // Registra el tiempo de finalización después de obtener los datos
        const endTime = Date.now();
        const executionTime = endTime - startTime; // Calcula el tiempo en milisegundos
        console.log(`Tiempo de ejecución de la consulta 4: ${executionTime} ms`);

        res.json(data.Items);
      }
    });
  });

  // Consulta 5: Buscar películas con un precio inferior a 15.
  app.get('/peliculas/precio/:precio', (req, res) => {
    const precio = parseFloat(req.params.precio);
    const params = {
      TableName: 'Peliculas',
      FilterExpression: 'Precio < :precio',
      ExpressionAttributeValues: { ':precio': precio },
    };

    const startTime = Date.now();
  
    dynamodb.scan(params, (err, data) => {
      if (err) {
        console.error('Error al buscar películas por precio:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {

        // Registra el tiempo de finalización después de obtener los datos
        const endTime = Date.now();
        const executionTime = endTime - startTime; // Calcula el tiempo en milisegundos
        console.log(`Tiempo de ejecución de la consulta 5: ${executionTime} ms`);

        res.json(data.Items);
      }
    });
  });

  // Consulta 6: Recuperar películas lanzadas en un año específico (por ejemplo, 2022).
  app.get('/peliculas/lanzamiento/:anio', (req, res) => {
    const anio = req.params.anio;
    const params = {
      TableName: 'Peliculas',
      FilterExpression: 'contains(FechaDeEstreno, :anio)',
      ExpressionAttributeValues: { ':anio': anio },
    };

    const startTime = Date.now();
  
    dynamodb.scan(params, (err, data) => {
      if (err) {
        console.error('Error al buscar películas por año de lanzamiento:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {

        // Registra el tiempo de finalización después de obtener los datos
        const endTime = Date.now();
        const executionTime = endTime - startTime; // Calcula el tiempo en milisegundos
        console.log(`Tiempo de ejecución de la consulta 6: ${executionTime} ms`);

        res.json(data.Items);
      }
    });
  });


// Consulta 7: Información de los 10 directores con mejor calificación (Promedio de todas sus películas)
app.get('/directores/mejores', (req, res) => {
    const params = {
      TableName: 'Peliculas',
    };

    const startTime = Date.now();
  
    dynamodb.scan(params, (err, data) => {
      if (err) {
        console.error('Error al escanear la tabla:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        const movies = data.Items;
  
        // Crear un objeto para realizar el seguimiento de las calificaciones y el recuento de películas por director
        const directorInfo = {};
  
        movies.forEach((movie) => {
          const director = movie.Director;
          const calificacion = movie.Calificacion;
  
          if (!directorInfo[director]) {
            directorInfo[director] = {
              totalCalificacion: 0,
              peliculasContadas: 0,
            };
          }
  
          directorInfo[director].totalCalificacion += calificacion;
          directorInfo[director].peliculasContadas++;
        });
  
        // Calcular el promedio de calificación para cada director
        const directorPromedios = Object.keys(directorInfo).map((director) => {
          const totalCalificacion = directorInfo[director].totalCalificacion;
          const peliculasContadas = directorInfo[director].peliculasContadas;
          const promedio = totalCalificacion / peliculasContadas;
  
          return {
            Director: director,
            PromedioCalificacion: promedio,
          };
        });
  
        // Ordenar la lista de directores por promedio de calificación de mayor a menor
        directorPromedios.sort((a, b) => b.PromedioCalificacion - a.PromedioCalificacion);
  
        // Limitar la lista a los 10 directores principales
        const mejoresDirectores = directorPromedios.slice(0, 10);

        // Registra el tiempo de finalización después de obtener los datos
        const endTime = Date.now();
        const executionTime = endTime - startTime; // Calcula el tiempo en milisegundos
        console.log(`Tiempo de ejecución de la consulta 7: ${executionTime} ms`);
  
        res.json(mejoresDirectores);
      }
    });
  });
  
  
  // Consulta 8: Buscar películas con una palabra clave en el título o descripción.
  app.get('/peliculas/buscar/:keyword', (req, res) => {
    const keyword = req.params.keyword.toLowerCase();
    const params = {
      TableName: 'Peliculas',
    };

    const startTime = Date.now();
  
    dynamodb.scan(params, (err, data) => {
      if (err) {
        console.error('Error al buscar películas:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        // Filtra las películas que contienen la palabra clave en el título o descripción
        const filteredMovies = data.Items.filter(movie =>
          movie.Descripcion.toLowerCase().includes(keyword) || movie.Titulo.toLowerCase().includes(keyword)
        );

        // Registra el tiempo de finalización después de obtener los datos
        const endTime = Date.now();
        const executionTime = endTime - startTime; // Calcula el tiempo en milisegundos
        console.log(`Tiempo de ejecución de la consulta 8: ${executionTime} ms`);

        res.json(filteredMovies);
      }
    });
  });
  
// Consulta 9: Calcular el precio promedio de todas las películas
app.get('/peliculas/precio-promedio', (req, res) => {
    const params = {
      TableName: 'Peliculas',
    };

    const startTime = Date.now();
  
    dynamodb.scan(params, (err, data) => {
      if (err) {
        console.error('Error al escanear la tabla:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        const movies = data.Items;
  
        // Calcular el precio promedio de todas las películas
        const totalPrecios = movies.reduce((total, movie) => total + movie.Precio, 0);
        const precioPromedio = totalPrecios / movies.length;
  
        // Redondear el precio promedio a 2 decimales
        const precioPromedioRedondeado = precioPromedio.toFixed(2);

        // Registra el tiempo de finalización después de obtener los datos
        const endTime = Date.now();
        const executionTime = endTime - startTime; // Calcula el tiempo en milisegundos
        console.log(`Tiempo de ejecución de la consulta 9: ${executionTime} ms`);
  
        res.json({ PrecioPromedio: parseFloat(precioPromedioRedondeado) });
      }
    });
  });
  
  
  
// Consulta 10: Encontrar películas con las mejores calificaciones promedio (ordenadas de mayor a menor)
app.get('/peliculas/mejor-calificacion', (req, res) => {
    const params = {
      TableName: 'Peliculas',
    };

    const startTime = Date.now();
  
    dynamodb.scan(params, (err, data) => {
      if (err) {
        console.error('Error al escanear la tabla:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        const movies = data.Items;
        
        // Crear un objeto para rastrear las mejores películas por director
        const bestMoviesByDirector = {};
  
        // Recorrer todas las películas y mantener un seguimiento de la mejor calificación por director
        movies.forEach((movie) => {
          const director = movie.Director;
          const calificacion = movie.Calificacion;
          
          if (!bestMoviesByDirector[director] || calificacion > bestMoviesByDirector[director].Calificacion) {
            bestMoviesByDirector[director] = { ...movie };
          }
        });
  
        // Obtener las mejores películas en un array
        const bestMovies = Object.values(bestMoviesByDirector);
  
        // Ordenar las mejores películas por calificación de mayor a menor
        bestMovies.sort((a, b) => b.Calificacion - a.Calificacion);

        // Registra el tiempo de finalización después de obtener los datos
        const endTime = Date.now();
        const executionTime = endTime - startTime; // Calcula el tiempo en milisegundos
        console.log(`Tiempo de ejecución de la consulta 10: ${executionTime} ms`);
  
        res.json(bestMovies);
      }
    });
  });

    // Consulta 11: Crear una nueva película
app.post('/peliculas', (req, res) => {
  const body = req.body;
  const startTime = Date.now();

  // Validar que se proporcionen todos los campos necesarios
  if (!body.Titulo || !body.Director || !body.FechaDeEstreno || !body.IdiomaOriginal ||
      !body.Distribuidora || !body.Descripcion || !body.Precio || !body.Genero ||
      !body.Clasificacion || !body.Calificacion) {
    return res.status(400).json({ error: 'Se requieren todos los campos para crear una película.' });
  }

  const params = {
    TableName: 'Peliculas',
    Item: {
      id: idCounter++, // Incrementa el contador y utiliza como ID
      Titulo: body.Titulo,
      Director: body.Director,
      FechaDeEstreno: body.FechaDeEstreno,
      IdiomaOriginal: body.IdiomaOriginal,
      Distribuidora: body.Distribuidora,
      Descripcion: body.Descripcion,
      Precio: parseFloat(body.Precio),
      Genero: body.Genero,
      Clasificacion: body.Clasificacion,
      Calificacion: parseFloat(body.Calificacion)
    }
  };

  dynamodb.put(params, (err, data) => {
    if (err) {
      console.error('Error al crear una película:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.json({ message: 'Película creada con éxito' });
    }
  });


  const endTime = Date.now();
  const executionTime = endTime - startTime; // Calcula el tiempo en milisegundos
  console.log(`Tiempo de ejecución de la consulta 11: ${executionTime} ms`);
});


// Consulta 12: Actualizar una película existente por ID
app.put('/peliculas/:id', (req, res) => {
  const id = req.params.id;
  const idNumero = parseInt(id);
  const body = req.body;

  const startTime = Date.now();

  // Validar que se proporcionen todos los campos necesarios
  if (!body.Titulo || !body.Director || !body.FechaDeEstreno || !body.IdiomaOriginal ||
      !body.Distribuidora || !body.Descripcion || !body.Precio || !body.Genero ||
      !body.Clasificacion || !body.Calificacion) {
    return res.status(400).json({ error: 'Se requieren todos los campos para actualizar una película.' });
  }

  const params = {
    TableName: 'Peliculas',
    Key: { id: idNumero },
    UpdateExpression: 'set Titulo = :titulo, Director = :director, FechaDeEstreno = :fecha, IdiomaOriginal = :idioma, Distribuidora = :distribuidora, Descripcion = :descripcion, Precio = :precio, Genero = :genero, Clasificacion = :clasificacion, Calificacion = :calificacion',
    ExpressionAttributeValues: {
      ':titulo': body.Titulo,
      ':director': body.Director,
      ':fecha': body.FechaDeEstreno,
      ':idioma': body.IdiomaOriginal,
      ':distribuidora': body.Distribuidora,
      ':descripcion': body.Descripcion,
      ':precio': parseFloat(body.Precio),
      ':genero': body.Genero,
      ':clasificacion': body.Clasificacion,
      ':calificacion': parseFloat(body.Calificacion)
    }
  };

  dynamodb.update(params, (err, data) => {
    if (err) {
      console.error('Error al actualizar la película:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.json({ message: 'Película actualizada con éxito' });
    }
  });

  // Registra el tiempo de finalización después de obtener los datos
  const endTime = Date.now();
  const executionTime = endTime - startTime; // Calcula el tiempo en milisegundos
  console.log(`Tiempo de ejecución de la consulta 12: ${executionTime} ms`);

});

// Consulta 13: Borrar una película existente por ID
app.delete('/peliculas/:id', (req, res) => {
  const id = req.params.id;
  const idNumero = parseInt(id);
  const startTime = Date.now();

  const params = {
    TableName: 'Peliculas',
    Key: { id: idNumero },
  };

  dynamodb.delete(params, (err, data) => {
    if (err) {
      console.error('Error al borrar la película:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.json({ message: 'Película borrada con éxito' });
    }
  });

  // Registra el tiempo de finalización después de obtener los datos
  const endTime = Date.now();
  const executionTime = endTime - startTime; // Calcula el tiempo en milisegundos
  console.log(`Tiempo de ejecución de la consulta 13: ${executionTime} ms`);
});
  
  
  
  const port = 6000;
  app.listen(port, () => {
    console.log(`API en ejecución en el puerto ${port}`);
  });
  
