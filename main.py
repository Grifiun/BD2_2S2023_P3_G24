from flask import Flask, request, jsonify
from bson import ObjectId  # Importa ObjectId desde bson
from decouple import config  # Importa config desde decouple
import pymongo
import csv
import time

app = Flask(__name__)

# Lee las variables de entorno desde el archivo .env
MONGO_DB_URI = config('MONGO_DB_URI')

# Configura la conexión a MongoDB
client = pymongo.MongoClient(MONGO_DB_URI)
db = client["Bases2"]

@app.route("/carga", methods=["GET"])
def cargar_datos_desde_csv():
    start_time = time.time()
    try:
        # Carga de datos desde el archivo CSV
        with open("Libros.csv", 'r', encoding='utf-8') as archivo:
            datos_csv = csv.DictReader(archivo)
            nombre_coleccion = "Libros"  # Nombre de la colección en MongoDB

            for fila in datos_csv:
                # Convierte el campo "Precio" a un valor numérico
                fila["Precio"] = float(fila["Precio"])
                db[nombre_coleccion].insert_one(fila)

        end_time = time.time()
        execution_time = (end_time - start_time) * 1000  # Multiplica por 1000 para obtener milisegundos
        print(f"Tiempo de ejecución de la consulta 1: {execution_time} ms")

        return jsonify({"message": f"Datos cargados en la colección '{nombre_coleccion}' con éxito."})
    except Exception as e:
        return jsonify({"error": f"Error al cargar datos en la colección '{nombre_coleccion}': {str(e)}"}, 500)

# Listar todos los libros disponibles
@app.route("/libros", methods=["GET"])
def listar_libros():
    start_time = time.time()
    libros = list(db["Libros"].find({}, {"_id": 0}))
    end_time = time.time()
    execution_time = (end_time - start_time) * 1000  # Multiplica por 1000 para obtener milisegundos
    print(f"Tiempo de ejecución de la consulta 2: {execution_time} ms")

    return jsonify(libros)

# Encontrar libros por Categoría   verificar 
@app.route("/libros/categoria/<categoria>", methods=["GET"])
def buscar_libros_por_categoria(categoria):
    start_time = time.time()
    libros = list(db["Libros"].find({"Categoria": categoria}, {"_id": 0}))
    end_time = time.time()
    execution_time = (end_time - start_time) * 1000  # Multiplica por 1000 para obtener milisegundos
    print(f"Tiempo de ejecución de la consulta 3: {execution_time} ms")

    return jsonify(libros)

# Buscar libros con un autor específico
@app.route("/libros/autor/<autor>", methods=["GET"])
def buscar_libros_por_autor(autor):
    start_time = time.time()
    libros = list(db["Libros"].find({"Autor": autor}, {"_id": 0}))
    end_time = time.time()
    execution_time = (end_time - start_time) * 1000  # Multiplica por 1000 para obtener milisegundos
    print(f"Tiempo de ejecución de la consulta 4: {execution_time} ms")

    return jsonify(libros)

# Mostrar los libros ordenados por calificación promedio (de mayor a menor)
@app.route("/libros/calificacion", methods=["GET"])
def libros_por_calificacion():
    start_time = time.time()
    libros = list(db["Libros"].find({}, {"_id": 0}).sort([("Calificacion", pymongo.DESCENDING)]))
    end_time = time.time()
    execution_time = (end_time - start_time) * 1000  # Multiplica por 1000 para obtener milisegundos
    print(f"Tiempo de ejecución de la consulta 5: {execution_time} ms")
    return jsonify(libros)

# Encontrar libros con un precio inferior a 20
@app.route("/libros/precio-inferior", methods=["GET"])
def buscar_libros_precio_inferior():
    start_time = time.time()
    libros = list(db["Libros"].find({"Precio": {"$lt": 20}}, {"_id": 0}))
    end_time = time.time()
    execution_time = (end_time - start_time) * 1000  # Multiplica por 1000 para obtener milisegundos
    print(f"Tiempo de ejecución de la consulta 6: {execution_time} ms")
    return jsonify(libros)

# Buscar libros con una palabra clave en el título o descripción
@app.route("/libros/buscar/<clave>", methods=["GET"])
def buscar_libros_por_palabra_clave(clave):
    start_time = time.time()
    libros = list(db["Libros"].find({"$or": [{"Titulo": {"$regex": clave, "$options": 'i'}}, {"Descripcion": {"$regex": clave, "$options": 'i'}}]}, {"_id": 0}))
    end_time = time.time()
    execution_time = (end_time - start_time) * 1000  # Multiplica por 1000 para obtener milisegundos
    print(f"Tiempo de ejecución de la consulta 7: {execution_time} ms")
    return jsonify(libros)

# Información de los 10 autores más caros (Suma del precio de todos sus libros)
@app.route("/autores", methods=["GET"])
def autores_mas_caros():
    start_time = time.time()
    pipeline = [
        {"$group": {"_id": "$Autor", "TotalPrecio": {"$sum": "$Precio"}}},
        {"$sort": {"TotalPrecio": pymongo.DESCENDING}},
        {"$limit": 10}
    ]
    autores = list(db["Libros"].aggregate(pipeline))
    end_time = time.time()
    execution_time = (end_time - start_time) * 1000  # Multiplica por 1000 para obtener milisegundos
    print(f"Tiempo de ejecución de la consulta 8: {execution_time} ms")
    return jsonify(autores)

# Obtener la cantidad de libros en stock para un libro específico
@app.route("/libros/stock/<titulo>", methods=["GET"])
def cantidad_libros_stock(titulo):
    start_time = time.time()
    libro = db["Libros"].find_one({"Titulo": titulo})
    if libro:
        stock = libro["Stock"]
        end_time = time.time()
        execution_time = (end_time - start_time) * 1000  # Multiplica por 1000 para obtener milisegundos
        print(f"Tiempo de ejecución de la consulta 9: {execution_time} ms")
        return jsonify({"Stock": stock})
    else:
        return jsonify({"message": "Libro no encontrado"}, 404)

@app.route("/libros/precio-promedio", methods=["GET"])
def precio_promedio_libros():
    start_time = time.time()
    pipeline = [
        {"$group": {"_id": None, "PrecioPromedio": {"$avg": "$Precio"}}}
    ]
    resultado = list(db["Libros"].aggregate(pipeline))

    if resultado and resultado[0]["PrecioPromedio"] is not None:
        precio_promedio = round(resultado[0]["PrecioPromedio"], 2)  # Redondea a dos decimales
        end_time = time.time()
        execution_time = (end_time - start_time) * 1000  # Multiplica por 1000 para obtener milisegundos
        print(f"Tiempo de ejecución de la consulta 10: {execution_time} ms")
        return jsonify({"PrecioPromedio": precio_promedio})
    else:
        return jsonify({"PrecioPromedio": 0})


@app.route("/categorias", methods=["GET"])
def todas_las_categorias():
    start_time = time.time()
    categorias = db["Libros"].distinct("Categoria")
    resultado = {"Categorias": {}}

    for categoria in categorias:
        libros_categoria = db["Libros"].find({"Categoria": categoria})
        libros_categoria_list = []
        
        for libro in libros_categoria:
            libro_info = {
                "Titulo": libro["Titulo"],
                "Autor": libro["Autor"],
                "Descripcion": libro["Descripcion"],
                "FechaDePublicacion": libro["FechaDePublicacion"],
                "Calificacion": libro["Calificacion"],
                "Stock": libro["Stock"],
                "Precio": libro["Precio"]
            }
            libros_categoria_list.append(libro_info)
        
        resultado["Categorias"][categoria] = libros_categoria_list

    end_time = time.time()
    execution_time = (end_time - start_time) * 1000  # Multiplica por 1000 para obtener milisegundos
    print(f"Tiempo de ejecución de la consulta 11: {execution_time} ms")

    return jsonify(resultado)




###################################### CRUD #################################################
#############################################################################################

# Crear un nuevo libro
@app.route("/libros", methods=["POST"])
def crear_libro():
    start_time = time.time()
    nuevo_libro = request.get_json()
    resultado = db["Libros"].insert_one(nuevo_libro)
    if resultado.acknowledged:

        end_time = time.time()
        execution_time = (end_time - start_time) * 1000  # Multiplica por 1000 para obtener milisegundos
        print(f"Tiempo de ejecución de la consulta 12: {execution_time} ms")

        return jsonify({"message": "Libro creado con éxito", "id": str(resultado.inserted_id)})
    else:
        return jsonify({"error": "Error al crear el libro"}, 500)

# Leer un libro por ID
@app.route("/libros/<libro_id>", methods=["GET"])
def leer_libro(libro_id):
    start_time = time.time()
    from bson import ObjectId

    libro = db["Libros"].find_one({"_id": ObjectId(libro_id)}, {"_id": 0})
    if libro:
        end_time = time.time()
        execution_time = (end_time - start_time) * 1000  # Multiplica por 1000 para obtener milisegundos
        print(f"Tiempo de ejecución de la consulta 13: {execution_time} ms")
        return jsonify(libro)
    else:
        return jsonify({"message": "Libro no encontrado"}, 404)

# Actualizar un libro por ID
@app.route("/libros/<libro_id>", methods=["PUT"])
def actualizar_libro(libro_id):
    start_time = time.time()
    datos_actualizados = request.get_json()

    resultado = db["Libros"].update_one({"_id": ObjectId(libro_id)}, {"$set": datos_actualizados})
    
    if resultado.matched_count > 0:
        end_time = time.time()
        execution_time = (end_time - start_time) * 1000  # Multiplica por 1000 para obtener milisegundos
        print(f"Tiempo de ejecución de la consulta 14: {execution_time} ms")
        return jsonify({"message": f"Libro actualizado con éxito"}, 200)
    else:
        return jsonify({"message": "Libro no encontrado"}, 404)


# Eliminar un libro por ID
@app.route("/libros/<libro_id>", methods=["DELETE"])
def eliminar_libro(libro_id):
    start_time = time.time()
    resultado = db["Libros"].delete_one({"_id": ObjectId(libro_id)})
    if resultado.deleted_count > 0:
        end_time = time.time()
        execution_time = (end_time - start_time) * 1000  # Multiplica por 1000 para obtener milisegundos
        print(f"Tiempo de ejecución de la consulta 15: {execution_time} ms")
        return jsonify({"message": f"Libro eliminado con éxito"}, 200)
    else:
        return jsonify({"message": "Libro no encontrado"}, 404)


if __name__ == '__main__':
    app.run(debug=True, port=3000)
