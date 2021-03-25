const urlBase = "http://189.253.141.193:3000/api/v1/panel/";
const api = "189.253.137.8";
const array = []
const arrayDatos = []
const array1 = []
const arrayDatos1 = []
let idUpdate;
let product;

document.addEventListener("DOMContentLoaded", function () {
  const log = JSON.parse(sessionStorage.getItem("user"));
  const user = JSON.parse(localStorage.getItem("user"));

  const sold = document.querySelector("#tbodyVentas");
  const product = document.querySelector("#bodyProduct");
  const usuarios = document.querySelector("#tBodyUser");
  const logOut = document.querySelector('#log-out');
  const dash = document.querySelector('#dash');
  console.log(sold, product, usuarios);

  if (sold) {
    mostrarventas();
  }

  if (product) {
    mostrarProductos();
  }

  if (usuarios) {
    console.log(usuarios);
    mostrarUsuarios();
  }

  if (!log) {
    location.href = "http://localhost:5500/chlorinePanel/public/login.html";
  }

  if ( dash ) {
    chartIt();

  }

  //INDEX
  let name = document.querySelector("#user-name-log");

  if (name) {
    name.innerHTML = user.name;
  }

  logOut.addEventListener( 'click', () => {
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    location.href = "http://localhost:5500/chlorinePanel/public/login.html";

  });
});

//*****USUARIO*****
function mostrarUsuarios() {
  var urlUser = urlBase + "cliente/getAllClient";
  fetch(urlUser, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.status === "success") {
        if (data.client.length) {
          const client = data.client;
          $("#tBodyUser").empty();
          client.forEach((cliente) => {
            console.log(cliente.id);
            var contentUser = `<tr>
                                  <td>${cliente.id}</td>
                                  <td>${cliente.nickname}</td>
                                  <td>${cliente.name}</td>
                                  <td>${cliente.email}</td>
                                  <td>******</td>
                                  <td><button class="btn btn-rosaChlorine" onclick="deleteUser(${cliente.id})">ELIMINAR</button></td>
                                </tr>`;
            $("#tBodyUser").append(contentUser);
          });
        }
      }
    })
    .catch((err) => {
      console.log("HA HABIDO UN ERROR", err);
    });
}
function deleteUser(idUser) {
  console.log(idUser);
  Swal.fire({
    title: `¿Seguro que desea eliminar al usuario con id: ${idUser}?`,
    showCancelButton: true,
    confirmButtonText: `Si`,
    icon: "info",
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      var urlUser = urlBase + "cliente/deleteClient";
      const data = {
        id: idUser,
      };
      fetch(urlUser, {
        method: "DELETE",
        headers: {
          Authorization: sessionStorage.getItem("user"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          if (data.status === "success") {
            Swal.fire("Se eliminó Correctamente!", "", "success");
            mostrarUsuarios();
          } else {
            Swal.fire("Error!", "", "error");
          }
        })
        .catch((err) => {
          console.log("HA HABIDO UN ERROR: ", err);
        });
    } else if (result.isCanceled) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });
}

//*****PRODUCTO*****/
function mostrarProductos() {
  var urlProduct = urlBase + "product/getAllProduct";
  fetch(urlProduct, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.status === "success") {
        if (data.product.length) {
          const product = data.product;
          $("#bodyProduct").empty();
          product.forEach((producto) => {
            var contentProduct = `<div class="producto col-6 col-md-4 col-lg-3">
                                      <div class="info-producto">
                                          <div>
                                              <div class="img-shop" style="background-image: url('${producto.img_url}');"></div>
                                              <p class="name-product">${producto.description}</p>
                                              <p>$${producto.price}/${producto.unit}</p>
                                          </div>
                                          <p>ID:${producto.id}</p>
                                      </div>
                                      <div class="btn-producto">
                                          <div class="agregar">
                                            <button onclick="chageIdU(${producto.id})" class="btn btn-agregar" data-toggle="modal" data-target="#mdlEditar">ACTUALIZAR</button>
                                          </div>           
                                          <div class="eliminar">
                                              <button class="btn btn-eliminar" onclick="deleteProduct(${producto.id})">ELIMINAR</button>  
                                          </div>                                   
                                      </div>
                                  </div>`;
            $("#bodyProduct").append(contentProduct);
          });
        } else {
          var noProduct = `<div class="noProd col-12" >NO HAY PRODUCTOS REGISTRADOS</div>`;
          $("#bodyProduct").empty();
          $("#bodyProduct").append(noProduct);
        }
      }
    })
    .catch((err) => {
      console.log("HA HABIDO UN ERROR", err);
    });
}
function addProducto() {
  var product = new FormData();
  product.append("files", document.querySelector("#imgProducto").files[0]);
  product.append("descrip", $("#txtDescripcionProducto").val());
  product.append("unit", $("#txtUnidadProducto").val());
  product.append("price", $("#txtPrecioProducto").val());
  product.append("category", $("#txtCategoriaProducto").val());
  
  if ( document.querySelector('#txtNormal').checked ) {
    product.append('off', 0);

  } else {
    product.append('off', 1);

  }

  var url = urlBase + "product/createProduct";
  fetch(url, {
    method: "POST",
    headers: {
      Authorization: sessionStorage.getItem("user"),
    },
    body: product,
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if ( data.status === 'success' ) {
        console.log(data);
        mostrarProductos();
        Swal.fire({
          icon: 'success',
          text: 'Agregado Correctamente'
        })

      } else {
        Swal.fire({
          icon: 'error',
          text: `Error: ${data.error}`
        })

      }
      
    })
    .catch((err) => {
      console.log("An error has occured: " + err);
    });
}

function chageIdU(id) {
  idUpdate = id;

  const url = urlBase + 'product/getProductById/' + id;

  fetch( url, {
    method: 'GET'
  }).then( response => {
    return response.json();

  }).then( data => {
    if ( data.status === 'success' ) {
      product = data.product[0]

      if ( product.off ) {
        document.querySelector('#EtxtNormal').checked
    
      } else {
        document.querySelector('#EtxtDescuento').checked;
    
      }

      document.querySelector('#EtxtDescripcionProducto').value = product.description;
      document.querySelector('#EtxtUnidadProducto').value = product.unit;
      document.querySelector('#EtxtPrecioProducto').value = product.price;
      document.querySelector('#EtxtCategoriaProducto').value = product.fk_category;

    } else {
      Swal.fire({
        icon: 'error',
        text: 'No se pudo obtener el producto'

      })

    }

  })

}

function getByBestSeller() {
  var user = $("#bodyProduct");
  var urlUser = urlBase + "product/getBestSellers";
  fetch(urlUser, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.status === "success") {
        if (data.product.length) {
          const product = data.product;
          console.log(data);
          $("#bodyProduct").empty();
          product.forEach((producto) => {
            var contentProduct = `<div class="producto col-6 col-md-4 col-lg-3">
                                      <div class="info-producto">
                                          <div>
                                              <div class="img-shop" style="background-image: url('${producto.img_url}');"></div>
                                              <p class="name-product">${producto.description}</p>
                                              <p>$${producto.price}/${producto.unit}</p>
                                          </div>
                                          <p>ID:${producto.id}</p>
                                      </div>
                                      <div class="btn-producto">
                                          <div class="agregar">
                                            <button onclick="chageIdU(${producto.id})" class="btn btn-agregar" data-toggle="modal" data-target="#mdlEditar">ACTUALIZAR</button>
                                          </div>            
                                          <div class="eliminar">
                                              <button class="btn btn-eliminar">ELIMINAR</button>  
                                          </div>                                   
                                      </div>
                                  </div>`;
            $("#bodyProduct").append(contentProduct);
          });
        } else {
          var noProduct = `<div class="noProd" >NO HAY PRODUCTOS REGISTRADOS</div>`;
          $("#bodyProduct").append(noProduct);
        }
      }
    })
    .catch((err) => {
      console.log("HA HABIDO UN ERROR", err);
    });
}
function getByCategory(idCategoria) {
  var urlUser = urlBase + "product/getByCategory/" + idCategoria;
  fetch(urlUser, {
    method: "GET"
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.status === "success") {
        if (data.product.length) {
          const product = data.product;
          console.log(data);
          $("#bodyProduct").empty();
          product.forEach((producto) => {
            var contentProduct = `<div class="producto col-6 col-md-4 col-lg-3">
                                      <div class="info-producto">
                                          <div>
                                              <div class="img-shop" style="background-image: url('${producto.img_url}');"></div>
                                              <p class="name-product">${producto.description}</p>
                                              <p>$${producto.price}/${producto.unit}</p>
                                          </div>
                                          <p>ID:${producto.id}</p>
                                      </div>
                                      <div class="btn-producto">
                                          <div class="agregar">
                                            <button onclick="chageIdU(${producto.id})" class="btn btn-agregar" data-toggle="modal" data-target="#mdlEditar">ACTUALIZAR</button>
                                          </div>              
                                          <div class="eliminar">
                                              <button class="btn btn-eliminar">ELIMINAR</button>  
                                          </div>                                   
                                      </div>
                                  </div>`;
            $("#bodyProduct").append(contentProduct);
          });
        } else {
          $("#bodyProduct").empty();
          var noProduct = `<div class="noProd" >NO HAY PRODUCTOS REGISTRADOS</div>`;          
          $("#bodyProduct").append(noProduct);
        }
      }
    })
    .catch((err) => {
      console.log("HA HABIDO UN ERROR", err);
    });
}
function deleteProduct(idProduct) {
  Swal.fire({
    title: `¿Seguro que desea eliminar el producto con id: ${idProduct}?`,
    showCancelButton: true,
    confirmButtonText: `Si`,
    icon: "info",
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      var urlUser = urlBase + "product/deleteProduct";
      const data = {
        id: idProduct,
      };
      fetch(urlUser, {
        method: "DELETE",
        headers: {
          Authorization: sessionStorage.getItem("user"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          if (data.status === "success") {
            Swal.fire("Se eliminó Correctamente!", "", "success");
            mostrarProductos();
          } else {
            Swal.fire("Error!", "", "error");
          }
        })
        .catch((err) => {
          console.log("HA HABIDO UN ERROR: ", err);
        });
    } else if (result.isCanceled) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });
}
function updateProduct(){
  var urlProduct = urlBase + "product/updateProduct";
  let off;
  if ( document.querySelector('#EtxtNormal').checked ) {
    off =  0;

  } else {
    off = 1;

  }
  const product = {
    id: idUpdate,
    descrip: $("#EtxtDescripcionProducto").val(),
    unit: $("#EtxtUnidadProducto").val(),
    price: $("#EtxtPrecioProducto").val(),
    category: $("#EtxtCategoriaProducto").val(),
    off: off

  }

  fetch(urlProduct, {
    method: "PUT",
    headers: {
      'Authorization': sessionStorage.getItem('user'),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(product)
  }).then((response) => {
      return response.json();
  }).then((data) => {
    if ( data.status === 'success' ) {
      console.log(data);
      mostrarProductos();
      location.reload();
  
    } else {
        console.log(data);

      }
     
  }).catch((err)=>{
      console.log("HA HABIDO UN ERROR", err);
  })
}

//*****VENTAS*****
function mostrarventas() {
  var urlProduct = urlBase + "sold/getAllSold";
  fetch(urlProduct, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.status === "success") {
        if (data.sold.length) {
          const sold = data.sold;
          console.log(sold);
          $("#tbodyVentas").empty();
          sold.forEach((venta) => {
            console.log(venta.ID);
            var contentventa = ` <tr>
              <td>${venta.ID}</td>
              <td>${venta.Date}</td>
              <td>${venta.Name}</td>
              <td class=" alert-success">${venta.Status}</td>
              <td>
                  <button onclick="deleteSold(${venta.ID})" class="btn btn-rosaChlorine">ELIMINAR</button>
              </td>
          </tr>S`;
            $("#tbodyVentas").append(contentventa);
          });
        } else {
          var noVenta = `<div class="noProd" >NO HAY VENTAS REGISTRADAS</div>`;
          $("#tbodyVentas").append(noVenta);
        }
      }
    })
    .catch((err) => {
      console.log("HA HABIDO UN ERROR", err);
    });
}
//-->Funciones Restantes

//*****DASHBOARD*****
async function chartIt() {
  await generarChart1();

  var mychart1 = document.getElementById("ventasWeek").getContext("2d");

  Chart.defaults.global.defaultFontFamily = "Poppins";
  Chart.defaults.global.defaultFontSize = 18;
  Chart.defaults.global.defaultColor = "grey";
  var massPopChart = new Chart(mychart1, {
    type: "line", // Tipos de estadisicas :bar , horizontalBar , pie ,  line , doughnut ,  radar ,  polarArea
    data: {
      labels: array,
      datasets: [
        {
          label: "Ventas",
          data: arrayDatos,

          backgroundColor: "#db6071", //1 Color solido
          //backgroundColor: [ , , , ,], Array para un color especifico por dato

          borderWidth: 1,
          boderColor: "black",
          hoverBorderWidth: 3,
          hoverBoderColor: "black",
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Ventas de esta semana",
        fontSize: 50,
      },
      legend: {
        display: true, // Muestra la leyenda = tru e, false no
        position: "top",
        labels: {
          fontColor: "black",
        },
      },
      layout: {
        padding: {
          left: 50,
          right: 0,
          bottom: 0,
          top: 0,
        },
      },
      tooltips: {
        enabled: true,
      },
    },
  });

  await generarChart2();

  var mychart2 = document.getElementById("ventasMonth").getContext("2d");

  //Globales
  Chart.defaults.global.defaultFontFamily = "Poppins";
  Chart.defaults.global.defaultFontSize = 18;
  Chart.defaults.global.defaultColor = "grey";

  var massPopChart = new Chart(mychart2, {
    type: "line", // Tipos de estadisicas :bar , horizontalBar , pie ,  line , doughnut ,  radar ,  polarArea
    data: {
      labels: array1,
      datasets: [
        {
          label: "Ventas",
          data: arrayDatos1,

          backgroundColor: "#db6071", //1 Color solido
          //backgroundColor: [ , , , ,], Array para un color especifico por dato

          borderWidth: 1,
          boderColor: "black",
          hoverBorderWidth: 3,
          hoverBoderColor: "black",
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "Ventas por meses",
        fontSize: 50,
      },
      legend: {
        display: true, // Muestra la leyenda = tru e, false no
        position: "top",
        labels: {
          fontColor: "black",
        },
      },
      layout: {
        padding: {
          left: 50,
          right: 0,
          bottom: 0,
          top: 0,
        },
      },
      tooltips: {
        enabled: true,
      },
    },
  });

  // var mychart3 = document.getElementById("user").getContext("2d");

  // //Globales
  // Chart.defaults.global.defaultFontFamily = "Poppins";
  // Chart.defaults.global.defaultFontSize = 18;
  // Chart.defaults.global.defaultColor = "grey";

  // var massPopChart = new Chart(mychart3, {
  //   type: "line", // Tipos de estadisicas :bar , horizontalBar , pie ,  line , doughnut ,  radar ,  polarArea
  //   data: {
  //     labels: ["ID", "User ", "Product"],
  //     datasets: [
  //       {
  //         label: "Usuarios",
  //         data: ["1", "1.5", "5"],

  //         backgroundColor: "#db6071", //1 Color solido
  //         //backgroundColor: [ , , , ,], Array para un color especifico por dato

  //         borderWidth: 1,
  //         boderColor: "black",
  //         hoverBorderWidth: 3,
  //         hoverBoderColor: "black",
  //       },
  //     ],
  //   },
  //   options: {
  //     title: {
  //       display: true,
  //       text: "Usuarios nuevos",
  //       fontSize: 50,
  //     },
  //     legend: {
  //       display: true, // Muestra la leyenda = tru e, false no
  //       position: "top",
  //       labels: {
  //         fontColor: "black",
  //       },
  //     },
  //     layout: {
  //       padding: {
  //         left: 50,
  //         right: 0,
  //         bottom: 0,
  //         top: 0,
  //       },
  //     },
  //     tooltips: {
  //       enabled: true,
  //     },
  //   },
  // });

  // var mychart4 = document.getElementById("ganancias").getContext("2d");

  // //Globales
  // Chart.defaults.global.defaultFontFamily = "Poppins";
  // Chart.defaults.global.defaultFontSize = 18;
  // Chart.defaults.global.defaultColor = "grey";

  // var massPopChart = new Chart(mychart4, {
  //   type: "line", // Tipos de estadisicas :bar , horizontalBar , pie ,  line , doughnut ,  radar ,  polarArea
  //   data: {
  //     labels: ["ID", "User ", "Product"],
  //     datasets: [
  //       {
  //         label: "ganancias",
  //         data: ["1", "1.5", "5"],

  //         backgroundColor: "#db6071", //1 Color solido
  //         //backgroundColor: [ , , , ,], Array para un color especifico por dato

  //         borderWidth: 1,
  //         boderColor: "black",
  //         hoverBorderWidth: 3,
  //         hoverBoderColor: "black",
  //       },
  //     ],
  //   },
  //   options: {
  //     title: {
  //       display: true,
  //       text: "Ganancias",
  //       fontSize: 50,
  //     },
  //     legend: {
  //       display: true, // Muestra la leyenda = tru e, false no
  //       position: "top",
  //       labels: {
  //         fontColor: "black",
  //       },
  //     },
  //     layout: {
  //       padding: {
  //         left: 50,
  //         right: 0,
  //         bottom: 0,
  //         top: 0,
  //       },
  //     },
  //     tooltips: {
  //       enabled: true,
  //     },
  //   },
  // });
}

async function generarChart2() {
  for( var i = 0; i < 5; i++ ) {
    array1.push( `${new Date().getFullYear()}-${new Date().getMonth()+1-i}` )

  }

  console.log(array1);
  const url = urlBase + 'sold/getAllSoldByMonth/'

  await array1.forEach( fecha => {
    console.log(fecha);
    fetch( url + fecha, {
      method: 'GET'

    }).then( response => {
      return response.json()

    }).then( data => {
      arrayDatos1.push(data.sold[0]['count(*)']);

    }).catch( error => {
      console.log(error);

    });

  })

}

async function generarChart1() {
  console.log(new Date().getFullYear(), new Date().getDate(), new Date().getMonth()+1);

  for( var i = 0; i < 5; i++ ) {
      array.push( `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()-(i)}` )

  }

  console.log(array);
  const url = urlBase + 'sold/getAllSoldByDate/'

  await array.forEach( fecha => {
    console.log(fecha);
     fetch( url + fecha, {
      method: 'GET'

    }).then( response => {
      return response.json()

    }).then( data => {
      arrayDatos.push(data.sold[0]['count(*)']);

    }).catch( error => {
      console.log(error);

    });

  })

}

function deleteSold( id ) {
  Swal.fire({
    title: `¿Seguro que desea eliminar la venta con id: ${id}?`,
    showCancelButton: true,
    confirmButtonText: `Si`,
    icon: "info",
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      const url = urlBase + 'sold/deleteSoldById/' + id;
      fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: sessionStorage.getItem("user")
        }
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          if (data.status === "success") {
            Swal.fire("Se eliminó Correctamente!", "", "success");
            mostrarProductos();
          } else {
            Swal.fire("Error!", "", "error");
          }
        })
        .catch((err) => {
          console.log("HA HABIDO UN ERROR: ", err);
        });
    } else if (result.isCanceled) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });

}