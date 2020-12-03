const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3050;

const app = express();

app.use(bodyParser.json());

// MySql
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'node20_mysql'
});

// Create the table and the first Log
app.post('/create', (req, res) => {
  const sql = 'CREATE TABLE `node20_mysql`.`admper`(ID INT NOT NULL  AUTO_INCREMENT, Concepto TEXT NOT NULL , Monto FLOAT NOT NULL , Fecha DATE NOT NULL , Tipo TEXT NOT NULL ,PRIMARY KEY (ID))';
  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('Not result');
    }
  });
});
  //Put the first Row in the table 
app.post('/first', (req, res) => {

  const sql = 'INSERT INTO admper SET ?';
  const registerObj1 = {
    
    Concepto: "UltimoBalance",
    Monto: 1500,
    Fecha: "",
    Tipo: "in"
  };

  connection.query(sql, registerObj1, error => {
    if (error) throw error;
    res.send('Error');
  });
})

// Route
app.get('/', (req, res) => {
  res.send('Welcome to my API!');
});

// last 10 logs in the table
app.get('/last10', (req, res) => {
  const sql = 'SELECT * FROM admper ORDER BY ID DESC LIMIT 10';

  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('Not result');
    }
  });
});
//Show all the Logs of the Table.
app.get('/get', (req, res) => {
  const sql = 'SELECT * FROM admper';

  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send('Not result');
    }
  });
});

app.get('/get/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM admper WHERE id = ${id}`;
  connection.query(sql, (error, result) => {
    if (error) throw error;

    if (result.length > 0) {
      res.json(result);
    } else {
      res.send('Not result');
    }
  });
});
// Get the sum of all entry logs
app.get('/balance', (req, res) => {
  const sql = 'SELECT id,sum(Monto) as suma FROM `admper` WHERE Tipo="in"';
  connection.query(sql, (error, result) => {
    if (error) throw error;

    if (result.length > 0) {
      res.json(result);
    } else {
      res.send('No Register');
    }
  });
});
// Get the sum of all egress logs
app.get('/balanceEg', (req, res) => {
  const sql = 'SELECT id,sum(Monto) as suma FROM `admper` WHERE Tipo="eg"';
  connection.query(sql, (error, result) => {
    if (error) throw error;

    if (result.length > 0) {
      res.json(result);
    } else {
      res.send('No Register');
    }
  });
})

//add a new log 
app.post('/add', (req, res) => {
  const sql = 'INSERT INTO admper SET ?';

  const registerObj = {
    
    Concepto: req.body.Concepto,
    Monto: req.body.Monto,
    Fecha: req.body.Fecha,
    Tipo: req.body.Tipo
  };

  connection.query(sql, registerObj, error => {
    if (error) throw error;
    res.send('Register created!');
  });
});
// update a Logs by ID
app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { Concepto, Monto, Fecha } = req.body;
  const sql = `UPDATE admper SET Concepto = '${Concepto}', Monto='${Monto}',Fecha='${Fecha}' WHERE id =${id}`;

  connection.query(sql, error => {
    if (error) throw error;
    res.send('Customer updated!');
  });
});

// delete logs by ID
app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM admper WHERE id= ${id}`;

  connection.query(sql, error => {
    if (error) throw error;
    res.send('Delete Register');
  });
});

// Check connect
connection.connect(error => {
  if (error) throw error;
  console.log('Database server running!');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



