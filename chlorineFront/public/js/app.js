const urlBase = "http://189.253.141.193:3000/api/v1/tienda/";
const ip = "189.253.137.8";

window.onload = () => {
  $(".aniview").AniView();

  const name = document.querySelector("#btn-user");
  const register = document.querySelector("#registro-user");
  const login = document.querySelector("#login");
  let logOut;

  const log = JSON.parse(sessionStorage.getItem("user"));
  const user = JSON.parse(localStorage.getItem("user"));

  if (name) {
    if (!log) {
      name.innerHTML = "¿Ya tienes Cuenta?";
    } else {
      name.innerHTML = user.alias;
      $(".dropdown-menu").empty();
      const dropDown = `<a class="dropdown-item" href="./usuario/configuraciones.html">Configuraciones <i class="fas fa-users-cog"></i></a>
                        <a class="dropdown-item" href="./usuario/carrito.html">Carrito <i class="fas fa-shopping-bag"></i></a>
                        <a class="dropdown-item" href="./usuario/wish.html">Wish List <i class="fas fa-stream"></i></a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" id="log-out" href="#">Cerrar Sesión <i class="fas fa-sign-out-alt"></i></a>`;
      $(".dropdown-menu").append(dropDown);
      logOut = document.querySelector("#log-out");
    }
  }

  if (register) {
    register.addEventListener("click", () => {
      const url = urlBase + "user/createUser";
      const data = {
        name: document.querySelector("#name").value,
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value,
        nickname: document.querySelector("#nickname").value,
      };

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.status === "success") {
            sessionStorage.setItem("user", JSON.stringify(data.token));
            localStorage.setItem("user", JSON.stringify(data.dataUser));
            location.href = "http://localhost:5500/chlorineFront/public/";
          } else {
            alert(`No se pudo crear el usuario: ${data.message}`);
            console.log(data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  if (login) {
    login.addEventListener("click", () => {
      const url = urlBase + "user/loginUser";
      const data = {
        email: document.querySelector("#log-email").value,
        password: document.querySelector("#lo-password").value,
      };

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.status === "success") {
            console.log(data);
            sessionStorage.setItem("user", JSON.stringify(data.token));
            localStorage.setItem("user", JSON.stringify(data.user));
            location.href = "http://localhost:5500/chlorineFront/public/";
          } else {
            alert(`No se pudo logear el usuario: ${data.message}`);
            console.log(data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  if (logOut) {
    logOut.addEventListener("click", (e) => {
      e.preventDefault();
      sessionStorage.removeItem("user");
      localStorage.removeItem("user");
      location.href = "http://localhost:5500/chlorineFront/public/";
    });
  }

  var ofertas = $("#offerProducto");
  if(ofertas){
    getOffProduct()
  }

  var productoTienda = $("#productoTienda");

  if (productoTienda) {
    showProductsTienda();
  }
};
/*TIENDA*/
function showProductsTienda() {
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
          $("#productoTienda").empty();
          product.forEach((producto) => {
            var contentProduct = ` <div class="producto col-6 col-sm-6 col-md-3">
                                      <div class="info-producto">
                                        <div class="img-shop" style="background-image: url('${producto.img_url}');"></div>
                                        <p class="name-product">${producto.description}</p>
                                        <p>$${producto.price}/${producto.unit}</p>
                                      </div>
                                      <div class="btn-producto">
                                        <input type="number" class="form-control input-agregar" min="1" max="100" id="cantProductoStore${producto.id}">
                                        <div class="btn-producto3">                
                                          <button class="btn btn-star">
                                            <img class="star-shop" onclick="addToWishList(${producto.id})" src="../public/img/star_store.svg" alt="">
                                          </button>
                                          <button class="btn btn-car">
                                            <img class="car-shop" onclick="addToCart(${producto.price},${producto.id})" src="../public/img/car-store.svg" alt="">
                                          </button>                
                                        </div>
                                      </div>              
                                  </div>`;
            $("#productoTienda").append(contentProduct);
          });
        } else {
          var noProduct = `<div class="noProd" >NO HAY PRODUCTOS REGISTRADOS</div>`;
          $("#productoTienda").append(noProduct);
        }
      }
    })
    .catch((err) => {
      console.log("HA HABIDO UN ERROR", err);
    });
}

function getByCategory(idCategoria) {
  console.log(idCategoria);
  var urlUser = urlBase + "product/getByCategory/" + idCategoria;
  fetch(urlUser, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      if (data.status === "success") {
        if (data.product.length > 0) {
          const product = data.product;
          console.log(data, product);
          $("#productoTienda").empty();
          product.forEach((producto) => {
            var contentProduct = `<div class="producto col-6 col-sm-6 col-md-3">
                                      <div class="info-producto">
                                        <div class="img-shop" style="background-image: url('${producto.img_url}');"></div>
                                        <p class="name-product">${producto.description}</p>
                                        <p>$${producto.price}/${producto.unit}</p>
                                      </div>
                                      <div class="btn-producto">
                                        <input type="number" class="form-control input-agregar" min="1" max="100" id="cantProductoStore${producto.id}">
                                        <div class="btn-producto3">                
                                          <button class="btn btn-star">
                                            <img class="star-shop" onclick="addToWishList(${producto.id})" src="../public/img/star_store.svg" alt="">
                                          </button>
                                          <button class="btn btn-car">
                                            <img class="car-shop" onclick="addToCart(${producto.price},${producto.id})" src="../public/img/car-store.svg" alt="">
                                          </button>                
                                        </div>
                                      </div>              
                                  </div>`;
            $("#productoTienda").append(contentProduct);
          });
        } else {
          console.log("hola");
          $("#productoTienda").empty();
          var noProduct = `<div class="noProd col-12" >NO HAY PRODUCTOS REGISTRADOS</div>`;
          console.log(noProduct);
          $("#productoTienda").append(noProduct);
        }
      }
    })
    .catch((err) => {
      console.log("HA HABIDO UN ERROR", err);
    });
}
function addToWishList(idProducto) {
  var urlUser = urlBase + "user/addToWishList";
  var producto = {
    idProduct: idProducto,
  };

  fetch(urlUser, {
    method: "POST",
    headers: {
      Authorization: sessionStorage.getItem("user"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(producto),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if ( data.status === 'success' ) {
        Swal.fire({
          icon: 'success',
          text: 'Agregado'
        })

      } else {
        Swal.fire({
          icon: 'error',
          text: `${data.error}`
        })

      }
    })
    .catch((err) => {
      console.log("An error has occured: " + err);
    });
}

function addToCart(precio, idProducto) {
  console.log(idProducto, precio);
  var urlUser = urlBase + "user/addToCart";
  var cantidad = parseInt($(`#cantProductoStore${idProducto}`).val());
  var subtotalT = cantidad * precio;
  var producto = {
    id: idProducto,
    quantity: cantidad,
    subtotal: parseFloat(subtotalT.toFixed(2)),
  };
  console.log(producto);
  fetch(urlUser, {
    method: "POST",
    headers: {
      Authorization: sessionStorage.getItem("user"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(producto),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if ( data.status === 'success' ) {
        Swal.fire({
          icon: 'success',
          text: 'Agregado Correctamente'
        })

      } else {
        Swal.fire({
          icon: 'error',
          text: JSON.stringify(data.error)

        })

      }
      console.log(data);
    })
    .catch((err) => {
      console.log("An error has occured: " + err);
    });
}
function getBestSellersProduct() {
  var user = $("#productoTienda");
  var urlUser = urlBase + "product/getBestSellersProduct";
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
          $("#productoTienda").empty();
          product.forEach((producto) => {
            var contentProduct = `<div class="producto col-6 col-sm-6 col-md-3">
                                    <div class="info-producto">
                                      <div class="img-shop" style="background-image: url('${producto.img_url}');"></div>
                                      <p class="name-product">${producto.description}</p>
                                      <p>$${producto.price}/${producto.unit}</p>
                                    </div>
                                    <div class="btn-producto">
                                      <input type="number" class="form-control input-agregar" min="1" max="100" id="cantProductoStore${producto.id}">
                                      <div class="btn-producto3">                
                                        <button class="btn btn-star">
                                          <img class="star-shop" onclick="addToWishList(${producto.id})" src="../public/img/star_store.svg" alt="">
                                        </button>
                                        <button class="btn btn-car">
                                          <img class="car-shop" onclick="addToCart(${producto.price},${producto.id})" src="../public/img/car-store.svg" alt="">
                                        </button>                
                                      </div>
                                    </div>              
                                </div>`;
            $("#productoTienda").append(contentProduct);
          });
        } else {
          var noProduct = `<div class="noProd" >NO HAY PRODUCTOS REGISTRADOS</div>`;
          $("#productoTienda").append(noProduct);
        }
      }
    })
    .catch((err) => {
      console.log("HA HABIDO UN ERROR", err);
    });
}
function getOffProduct() {
  var user = $("#offerProducto");
  var urlUser = urlBase + "product/getOffProduct";
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
          $("#offerProducto").empty();
          product.forEach((producto) => {
            var contentProduct = `<div class="producto col-6 col-sm-6 col-md-3">
                                    <div class="info-producto">
                                      <div class="img-shop" style="background-image: url('${producto.img_url}');"></div>
                                      <p class="name-product">${producto.description}</p>
                                      <p>$${producto.price}/${producto.unit}</p>
                                    </div>
                                    <div class="btn-producto">
                                      <input type="number" class="form-control input-agregar" min="1" max="100" id="cantProductoStore${producto.id}">
                                      <div class="btn-producto3">                
                                        <button class="btn btn-star">
                                          <img class="star-shop" onclick="addToWishList(${producto.id})" src="../public/img/star_store.svg" alt="">
                                        </button>
                                        <button class="btn btn-car">
                                          <img class="car-shop" onclick="addToCart(${producto.price},${producto.id})" src="../public/img/car-store.svg" alt="">
                                        </button>                
                                      </div>
                                    </div>              
                                </div>`;
            $("#offerProducto").append(contentProduct);
          });
        } else {
          var noProduct = `<div class="noProd" >NO HAY OFERTAS AÚN</div>`;
          $("#offerProducto").append(noProduct);
        }
      }
    })
    .catch((err) => {
      console.log("HA HABIDO UN ERROR", err);
    });
}


function newsletter() {
  const url = urlBase + 'user/newsletter';
  const data = {
    email: document.querySelector('#news').value

  }

  fetch( url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'

    },
    body: JSON.stringify(data) 
  }).then( response => {
    return response.json()

  }).then( data => {
    if ( data.status === 'success') {
      Swal.fire({
        icon: 'success',
        text: 'Registrado al Newsletter'
      })

    } else {
      Swal.fire({
        icon: 'error',
        text: 'No se pudo registrar'
      })

    }

  }).catch( error => {
    console.log(error);

  })

}