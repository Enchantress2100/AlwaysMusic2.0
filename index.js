const { Pool } = require("pg")
const config = {
    user: "postgres",
    host: "localhost",
    password: "postgres",
    database: "music",
    port: 5432,
    max: 20,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000,
};

const informacion = process.argv.slice(2) //path to node (command line arguments)
const pool = new Pool(config)

//agregar estudiantes nuevos
async function agregar() {
    pool.connect(async (error, client, release) => {
    if(error) return console.error('no se ha podido establecer la conexion con la base de datos', error.code)
        const SQLQuery = {
            name: "fetch-user",
            text: "insert into estudiante (nombre, rut, curso, nivel) values($1, $2, $3, $4) RETURNING *;",
            values:[`${informacion[1]}`, `${informacion[2]}`,`${informacion[3]}`, `${informacion[4]}`]
        }
        const res = await client.query(SQLQuery);
        console.log(`el/la estudiante ${informacion[1]} ha sido agregado(a) exitosamente`)
        release();
        pool.end();
    })
}
if (informacion[0]=='agregar') {
    agregar()
}
// node index.js agregar 'Simon Fuentes' '7.678.345-1' 'bajo' '6'

//consultar estudiante por rut, se devuelve el resultado como array
async function consultar() {
    pool.connect(async (error, client, release) => {
        if (error) return console.error('no se ha podido establecer la conexion con la base de datos', error.code)
        const SQLQuery = {
            name: "fetch-user",
            rowMode: "array",
            text: 'SELECT * from estudiante WHERE rut=$1',
            values: [`${informacion[1]}`]
        }
        const res = await client.query(SQLQuery);
        console.log(`el/la estudiante con rut ${informacion[1]} corresponde a:`,res.rows)
        release();
        pool.end()
    })
}
if (informacion[0]=='consultar') {
    consultar()
}
//node index.js consultar '7.678.345-1'

//consultar los estudiantes registrados
async function estudiantes() {
    pool.connect(async (error, client, release) => {
        if (error) return console.error('no se ha podido establecer la conexion con la base de datos', error.code)
        const SQLQuery = {
            name: "fetch-user",
            rowMode: "array",
            text: "SELECT * from estudiante",
        }
        const res = await client.query(SQLQuery, (error, res) => {
            if (error) return console.error('revisar posible error de sintaxis en la tabla', error.code);
            console.log(`Nomina de estudiantes registrados:`, res.rows)
            release()
            pool.end()
        });
    })
}
if (informacion[0]=='estudiantes') {
    estudiantes()
}
//node index.js estudiantes

//actualizar datos de estudiante en la base de datos
async function update() {
    pool.connect(async (error, client, release) => {
        if (error) return console.error('no se ha podido establecer conexion con la base de datos', error.code)
        const SQLQuery = {
            name: "fetch-user",
            rowMode: "array",
            text:`UPDATE estudiante SET nombre='${informacion[1]}' WHERE curso='cello' RETURNING*;`
        }
        const res = await client.query(SQLQuery)
        console.log('registro modificado del estudiante ', res.rows[0])
        release()
        pool.end()
    })
}
if (informacion[0]=='update') {
    update()
}
//node index.js update 'Georgina Nuñez'

//eliminar los datos de un estudiante de la base de datos
async function borrar(){
    pool.connect(async (error, client, release) => {
        if (error) return console.error('no se ha podido establecer conexion con la base de datos', error.code)
        const SQLQuery = {
            name: "fetch-user",
            rowMode: "array",
            text:`DELETE FROM estudiante WHERE nombre='${informacion[1]}'`
        }
        const res = await client.query(SQLQuery)
        console.log(`registro del estudiante '${informacion[1]}' borrado con exito`)
    })
}
if (informacion[0]=='borrar') {
    borrar()
}
//node index.js borrar 'Consuelo Gomez'