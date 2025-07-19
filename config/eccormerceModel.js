import pg from "pg";
import "dotenv/config"




const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Exclusive Eccomerce",
    password: "Lahnreey",
    port: 4000,
})

export default db;
