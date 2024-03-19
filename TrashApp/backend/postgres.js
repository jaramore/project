// DB CONNECTION

require('dotenv').config();


const Pool = require('pg').Pool


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    idleTimeoutMillis: 5000,
});

const setMapTable = (request, response) => {
  const longitude = request.body.backlong;
  const latitude = request.body.backlat;
  console.log(request.body.backlong)

  pool.query('INSERT INTO map (longitude, latitude) VALUES ($1, $2) RETURNING locationid', [longitude,latitude], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send()
  })
}

//USERS

const registerUser = (request, response) => {
    const first = request.body.backFname;
    const last = request.body.backLname;
    const email = request.body.backEmail;
    const pass = request.body.backPassword;
    

pool.query("SELECT * FROM users WHERE email = $1", [email], (error, results) => {
    if (error) {
        throw error;
    }

    if (results.rows.length > 0) {
        console.log('email already registered.')
        
        
    }else {
        pool.query('INSERT INTO users ("email", "password", "firstName", "lastName") VALUES ($1, $2, $3, $4)', [email, pass, first, last],(error, results) => {
            if (error) {
                throw error
            }
            response.status(201).send('User registered successfully.');
        })
    };
});

}

const loginUser = (request, response) => {
    const email = request.body.backEmail;
    const pass = request.body.backPassword;

    pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, pass], async (error, results) => {
      if (error) {
        throw error
      }
      //response.status(200).json(results.rows)
      if (results.rows.length > 0){
        response.status(200).json(results.rows)
        //if (bcrypt.compare(pass, result[0].pass) = true){ would like to use this to compare passwords
        console.log("login was successful");
        //}
      } else {
        console.log("you suck buddy, you messed something up"); //this means email or password was either wrong or doesnt exist
        response.status(200).json(results.rows)
        
      }
    });

    
  }
module.exports = {
    setMapTable,
    registerUser,
    loginUser
}