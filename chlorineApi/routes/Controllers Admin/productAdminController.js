const router = require("express").Router();
const multipart = require("connect-multiparty");

// MiddleWare
const MiddleWare = multipart({
  uploadDir: __dirname.split("routes")[0] + "public/docs",
});

const conn = require("../DB/conn");
const jwt = require("../Middleware/JwtAuth");

// Create
router.post("/createProduct", MiddleWare, (req, res) => {
  const token = req.header("Authorization").replace(/"/g, "");
  let jwtA = new jwt(token);
  const user = jwtA.getToken({}, false);

  console.log(req.files.files.path);
  const ruta = "http://localhost:3000/docs/" + req.files.files.path.split('docs')[1].substr(1);
  console.log(ruta);

  const query = "CALL stp_createProduct(?,?,?,?,?,?)";
  const dataQuery = [
    req.body.descrip,
    req.body.price,
    req.body.unit,
    req.body.category,
    ruta,
    req.body.off
  ];

  if (user.user.login) {
    conn.query(query, dataQuery, (error, response) => {
      if (error) {
        const data = {
          status: "error",
          code: 400,
          error: error,
          message: "Error en la bd",
        };

        console.log(data);
        res.send(data, data.code);
      } else {
        const data = {
          status: "success",
          code: 200,
          product: response[0],
        };

        res.send(data, data.code);
      }
    });
  } else {
    const data = {
      estatus: "error",
      code: 400,
      message: "No esta logeado",
    };

    res.send(data, data.code);
  }
});

// Update
router.put("/updateProduct", (req, res) => {
  const token = req.header("Authorization").replace(/"/g, "");
  let jwtA = new jwt(token);
  const user = jwtA.getToken({}, false);

  const query = "CALL stp_updateProduct(?,?,?,?,?,?)";
  const dataQuery = [
    req.body.id,
    req.body.descrip,
    req.body.price,
    req.body.unit,
    req.body.off,
    req.body.category
    
  ];
  console.log(dataQuery);

  if (user.user.login) {
    conn.query(query, dataQuery, (error, response) => {
      if (error) {
        const data = {
          status: "error",
          code: 400,
          error: error,
          message: "Error en la bd",
        };

        res.send(data, data.code);
      } else {
        const data = {
          status: "success",
          code: 200,
          product: response[0],
        };

        res.send(data, data.code);
      }
    });
  } else {
    const data = {
      estatus: "error",
      code: 400,
      message: "No esta logeado",
    };

    res.send(data, data.code);
  }
});

// Delete
router.delete("/deleteProduct", (req, res) => {
    const token = req.header("Authorization").replace(/"/g, "");
    let jwtA = new jwt(token);
    const user = jwtA.getToken({}, false);

  const query = "CALL stp_deletePRoduct(?)";
  const dataQuery = [req.body.id];

  if (user.user.login) {
    conn.query(query, dataQuery, (error, response) => {
      if (error) {
        const data = {
          status: "error",
          code: 400,
          error: error,
          message: "Error: Error en la bd",
        };

        res.send(data, data.code);
      } else if (response[0]) {
        const data = {
          status: "error",
          code: 400,
          message: "Error: no se elimino correctamente",
        };

        res.send(data, data.code);
      } else {
        const data = {
          status: "success",
          code: 200,
          message: "Success: se elimino correctamente",
          product: response[0],
        };

        res.send(data, data.code);
      }
    });
  } else {
    const data = {
      estatus: "error",
      code: 400,
      message: "Error: No esta logeado",
    };

    res.send(data, data.code);
  }
});

// get all
router.get("/getAllProduct", (req, res) => {
  const query = "CALL stp_getAllProduct()";

  conn.query(query, (error, response) => {
    if (error) {
      const data = {
        status: "error",
        code: 400,
        error: error,
        message: "Error en la bd",
      };

      res.send(data, data.code);
    } else {
      const data = {
        status: "success",
        code: 200,
        message: "Consulta hecha correctamente",
        product: response[0],
      };

      res.send(data, data.code);
    }
  });
});

// get bestSellers
router.get("/getBestSellers", (req, res) => {
  const query = "CALL stp_getBestSellersProduct()";

  conn.query(query, (error, response) => {
    if (error) {
      const data = {
        status: "error",
        code: 400,
        error: error,
        message: "Error en la bd",
      };

      res.send(data, data.code);
    } else {
      const data = {
        status: "success",
        code: 200,
        message: "Consulta hecha correctamente",
        product: response[0],
      };

      res.send(data, data.code);
    }
  });
});

// get off
router.get("/getOffProduct", (req, res) => {
  const query = "CALL stp_getOffProduct()";

  conn.query(query, (error, response) => {
    if (error) {
      const data = {
        status: "error",
        code: 400,
        error: error,
        message: "Error en la bd",
      };

      res.send(data, data.code);
    } else {
      const data = {
        status: "success",
        code: 200,
        message: "Consulta hecha correctamente",
        product: response[0],
      };

      res.send(data, data.code);
    }
  });
});

// get for categories
router.get("/getByCategory/:id", (req, res) => {
  const query = "CALL stp_getByCategory(?)";
  const dataQuery = [req.params.id];

  conn.query(query, dataQuery, (error, response) => {
    if (error) {
      const data = {
        status: "error",
        code: 400,
        error: error,
        message: "Error en la bd",
      };

      res.send(data, data.code);
    } else {
      const data = {
        status: "success",
        code: 200,
        message: "Consulta hecha correctamente",
        product: response[0],
      };

      res.send(data, data.code);
    }
  });
});

router.get( '/getProductById/:id', ( req, res ) => {
  const query = "CALL stp_getProductById(?)";
  const dataQuery = [req.params.id];

  conn.query(query, dataQuery, (error, response) => {
    if (error) {
      const data = {
        status: "error",
        code: 400,
        error: error,
        message: "Error en la bd",
      };

      res.send(data, data.code);
    } else {
      const data = {
        status: "success",
        code: 200,
        message: "Consulta hecha correctamente",
        product: response[0],
      };

      res.send(data, data.code);
    }
  });

});

module.exports = router;
