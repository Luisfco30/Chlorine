const urlBase = "http://189.253.141.193:3000/api/v1/tienda/";
const api = "189.253.137.8";

let cart;

document.addEventListener("DOMContentLoaded", function () {
  const log = JSON.parse(sessionStorage.getItem("user"));
  const logOut = document.querySelector("#log-out");
  const update = document.querySelector('#update-user');
  const carrito = $('#carritoCompras');
  const address = $('#tBodyAddress');
  const compras = $('#accordion');

  if ( compras ) {
    getCompras();

  }

  if ( address ) {
    getAllAddress();

  }

  const wish = document.querySelector('#bodyWhish');

  if ( wish ) {
    getWishList();

  }

  console.log(log);
  if (!log) {
    location.href = "http://localhost:5500/chlorineFront/public/";
  }

  logOut.addEventListener("click", (e) => {
    e.preventDefault();
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
    location.href = "http://localhost:5500/chlorineFront/public/";
  });

  if ( update ) {
    const user = JSON.parse(localStorage.getItem('user'));
    document.querySelector('#txtNombre').value = user.name;
    document.querySelector('#txtUsuario').value = user.alias;
    document.querySelector('#txtCorreo').value = user.email;
    document.querySelector('#txtDescrip').value = user.descrip;
    document.querySelector('#img-avatar').src = user.url;
    document.querySelector('#img-avatar').alt = user.name;

  }

  if(carrito){
    getCart();
  }
});


/*USUARIO*/
function actualizarAvatar(){
  var urlUser = urlBase + "user/avatarUser";
  var avatar = new FormData();
  avatar.append("files", document.querySelector("#imgAvatar").files[0]);
  
  fetch(urlUser, {
    method: "PUT",
    headers: {
      "Authorization": sessionStorage.getItem('user')

    },
    body: avatar
  }).then((response) => {
      return response.json();
  }).then((data) => {
    if ( data.status === 'success' ) {
      sessionStorage.setItem('user', JSON.stringify(data.token));
      localStorage.setItem('user', JSON.stringify(data.dataUser));
      location.reload();
  
    }else {
      console.log(data);

    }
    
  }).catch((err)=>{
      console.log("HA HABIDO UN ERROR", err);
  })
};
function actualizarUsuario(){
  var urlUser = urlBase + "user/updateUser";
  var user = {
    name: document.querySelector("#txtNombre").value,
    email:  document.querySelector("#txtCorreo").value,
    nickname: document.querySelector("#txtUsuario").value,
    descrip: document.querySelector("#txtDescrip").value
  }
  
  fetch(urlUser, {
    method: "PUT",
    headers: {
      'Authorization': sessionStorage.getItem('user'),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  }).then((response) => {
      return response.json();
  }).then((data) => {
    if ( data.status === 'success' ) {
      sessionStorage.setItem('user', JSON.stringify(data.token));
      localStorage.setItem('user', JSON.stringify(data.dataUser));
      location.reload();
  
    } else {
        console.log(data);

      }
     
  }).catch((err)=>{
      console.log("HA HABIDO UN ERROR", err);
  })
};
function deleteUser(){
  var urlUser = urlBase + "user/deleteUser";  
    Swal.fire({
      title: `¿Seguro que desea eliminar al usuario?`,
      showCancelButton: true,
      confirmButtonText: `Si`,
      icon: "info",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var urlUser = urlBase + "user/deleteUser";
        fetch(urlUser, {
          method: "DELETE",
          headers: {
            'Authorization': sessionStorage.getItem("user"),
          }
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log(data);
            if (data.status === "success") {
              Swal.fire("Su cuenta ha sido eliminada!", "", "success");
             location.reload();
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
};

/*/CART USUARIO*/
function getCart(){
  console.log('jojoj')
  var urlUser = urlBase + "user/getCart";
  fetch(urlUser, {
    method: "GET",
    headers: {
      'Authorization': sessionStorage.getItem('user')

    }
  }).then((response) => {
    return response.json();
  }).then((data) => {
    console.log(data);
    if (data.status === "success") {
        if (data.cart.length) {
          cart = data.cart;
          const product = data.cart;
          $("#carritoCompras").empty();
          product.forEach((producto) => {
            var contentProduct = ` <div class="producto-carrito col-6 col-md-4 col-lg-3"> 
                                      <div class="info-producto">
                                          <div class="img-shop" style="background-image: url('${producto.img_url}');"></div>
                                          <p class="name-product">${producto.description}</p>
                                          <p>$${producto.price}/${producto.unit}</p>
                                      </div>
                                      <div class="btn-producto2">
                                          <div class="agregar">
                                              <input type="number" id="cantidadCarrito${producto.id}" class="form-control input-agregar" onchange="updateProductInCart(${producto.price}, ${producto.id})" min="1" max="100">                            
                                          </div>               
                                          <div class="eliminar">
                                              <button class="btn btn-eliminar" onclick="deleteInCart(${producto.id})"> ELIMINAR</button>  
                                          </div>
                                      </div>
                                  </div>`
            $("#carritoCompras").append(contentProduct);
          });
        } else {
          var noProduct = `<div ></div>`;
          $("#carritoCompras").append(noProduct);
        }
    }
  }).catch((err) => {
      console.log("HA HABIDO UN ERROR", err);
  });
};
function addToCart(precio, idProducto){
  var urlUser = urlBase + "user/addToCart";
  var cantidad = $('#cantProductoStore').val
  var subtotalT = cantidad*precio
  var producto = {
    id: idProducto,
    quantity: cantidad,
    subtotal: subtotalT
  }  
  fetch(urlUser, {
    method: "POST",
    headers: {
      'Authorization': sessionStorage.getItem('user'),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(producto)
  }).then((response) => {
    return response.json();
  }).then((data) => {
    console.log(data);
    getCart();
  }).catch((err) => {
    console.log("An error has occured: " + err);
  });
};
function updateProductInCart(precio, idProducto){
  var urlUser = urlBase + "user/updateProductInCart";
  var cantidadCarrito = $(`#cantidadCarrito${idProducto}`).val()
  var subtotalT = cantidadCarrito*precio
  var producto = {
    id: idProducto,
    quantity: cantidadCarrito,
    subtotal: subtotalT
  }
  fetch(urlUser, {
    method: "PUT",
    headers: {
      'Authorization': sessionStorage.getItem('user'),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(producto)
  }).then((response) => {
      return response.json();
  }).then((data) => {
    console.log(data);
    Swal.fire({
      icon: 'success',
      text: 'actualizado correctamente'
    })
    getCart();
  }).catch((err) => {
    console.log("An error has occured: " + err);
  });
};
function deleteInCart(idProduct){
  Swal.fire({
    title: `¿Seguro que desea eliminar el producto?`,
    showCancelButton: true,
    confirmButtonText: `Si`,
    icon: "info",
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      var urlUser = urlBase + "user/deleteInCart";
      const data = {
        id: idProduct,
      };
      fetch(urlUser, {
        method: "DELETE",
        headers: {
          "Authorization": sessionStorage.getItem("user"),
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
            getCart();
          } else {
            Swal.fire("Error!", "", "error");
          }
          getCart();
        })
        .catch((err) => {
          console.log("HA HABIDO UN ERROR: ", err);
        });
    } else if (result.isCanceled) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });
}
function deleteCarrito(){  
  Swal.fire({
    title: `¿Seguro que desea eliminar el carrito?`,
    showCancelButton: true,
    confirmButtonText: `Si`,
    icon: "info",
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      var urlUser = urlBase + "user/deleteCart";
      fetch(urlUser, {
        method: "DELETE",
        headers: {
          'Authorization': sessionStorage.getItem("user"),
        }
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          if (data.status === "success") {
            Swal.fire("Su carrito ha sido eliminada!", "", "success");
           location.reload()
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
};

/*WISH USUARIO*/
function getWishList(){
  var urlUser = urlBase + "user/getWishList";
  fetch(urlUser, {
    method: "GET",
    headers: {
      'Authorization': sessionStorage.getItem('user')

    }
  }).then((response) => {
    return response.json();
  }).then((data) => {
    if (data.status === "success") {
        if (data.wish.length) {
          const product = data.wish;
          $("#bodyWhish").empty();
          product.forEach((producto) => {
            var contentProduct = `<li>
                                    <div class="product-wish">
                                        <img class="img-fluid3" src="${producto.img_url}" alt="img-product">
                                        <p><strong>${producto.description}</strong></p>
                                        <i class="fas fa-trash"></i>
                                    </div>
                                  </li>`;
            $("#bodyWhish").append(contentProduct);
          });
        } else {
          var noProduct = `<div ></div>`;
          $("#bodyWhish").append(noProduct);
        }
    }
  }).catch((err) => {
      console.log("HA HABIDO UN ERROR", err);
  });

}

function deleteWishList(){
  Swal.fire({
    title: `¿Seguro que desea eliminar el wish?`,
    showCancelButton: true,
    confirmButtonText: `Si`,
    icon: "info",
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      var urlUser = urlBase + "user/deleteWish";
      fetch(urlUser, {
        method: "DELETE",
        headers: {
          'Authorization': sessionStorage.getItem("user"),
        }
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          if (data.status === "success") {
            Swal.fire("Su wish ha sido eliminada!", "", "success");
           location.reload();
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
};

/*ADDRESS USUARIO*/
function getAllAddress(){
  var urlUser = urlBase + "user/getAllAddress";
  fetch(urlUser, {
    method: "GET",
    headers: {
      'Authorization': sessionStorage.getItem('user')

    }
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      if (data.status === "success") {
        if (data.address.length) {
          const addresses = data.address;
          console.log(addresses);
          $("#tBodyAddress").empty();
          addresses.forEach((adress) => {
            var contentAddress = `<tr>
                                    <td>${adress.street}</td>
                                    <td>${adress.col}</td>
                                    <td>${adress.city}</td>
                                    <td>${adress.state}</td>
                                    <td>${adress.pc}</td>
                                    <td><button class="btn btn-rosaChlorine" onclick="deleteAddress(${adress.id})">ELIMINAR</button></td>
                                  </tr>`;
            $("#tBodyAddress").append(contentAddress);
            console.log(contentAddress);
          });
        }
      }
    })
    .catch((err) => {
      console.log("HA HABIDO UN ERROR", err);
    });
};
function addAddress(){
  const address = {
    street: $("#txtStreetNum").val(),
    col: $("#txtCol").val(),
    city: $("#txtDeCity").val(),
    category: $("#txtState").val(),
    cp: $("#txtPc").val(),
    state: $('#txtState').val()

  }

  var url = urlBase + "user/addAddress";
  fetch(url, {
    method: "POST",
    headers: {
      'Authorization': sessionStorage.getItem("user"),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(address),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      getAllAddress();
    })
    .catch((err) => {
      console.log("An error has occured: " + err);
    });

};
function deleteAddress(idAddress){  
  Swal.fire({
    title: `¿Seguro que desea eliminar Dirección?`,
    showCancelButton: true,
    confirmButtonText: `Si`,
    icon: "info",
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      var urlUser = urlBase + "user/deleteAddress";
      const data = {
        id: idAddress,
      };
      fetch(urlUser, {
        method: "DELETE",
        headers: {
          "Authorization": sessionStorage.getItem("user"),
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
            getAllAddress();
          } else {
            Swal.fire("Error!", "", "error");
          }
          getAllAddress();
        })
        .catch((err) => {
          console.log("HA HABIDO UN ERROR: ", err);
        });
    } else if (result.isCanceled) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });  
};
        
/*COMPRAS USUARIO*/
function getCompras(){
  var urlUser = urlBase + "user/getAllSoldByUser";
  fetch(urlUser, {
    method: "GET",
    headers: {
      'Authorization': sessionStorage.getItem('user')
    }
  }).then((response) => {
    return response.json();
  }).then((data) => {
    console.log(data);
    if (data.status === "success") {
        if (data.sold.length > 0) {
          const product = data.sold;
          $("#accordion").empty();
          product.forEach((producto) => {
            var contentProduct = `<div class="panel panel-default">
                                    <div class="panel-heading heading-compra p-3 mb-3" role="tab" id="heading0">
                                      <a class="collapsed w-100" role="button" title="" data-toggle="collapse" data-parent="#accordion"
                                      href="#collapse${producto.ID}" aria-expanded="true" aria-controls="collapse${producto.ID}">
                                          <img class="img-fluid2" src="../img/btl-prueba.png" alt="img-product">
                                          <h3 class="panel-title2 ">                       
                                          <a class="collapsed" role="button" title="" data-toggle="collapse" data-parent="#accordion"
                                              href="#collapse${producto.ID}" aria-expanded="true" aria-controls="collapse${producto.ID}">
                                              ${producto.Product}
                                          </a>
                                          </h3> 
                                      </a>
                                    </div>
                                    <div id="collapse${producto.ID}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading0">
                                      <div class="panel-body px-3 mb-4 heading-compra">
                                        <img class="img-fluid2" src="../img/btl-prueba.png" alt="img-product">
                                        <div>
                                          <p>TOTAL: $${producto.Sub_Total}</p>
                                          <p>FECHA: ${producto.Date}</p>
                                          <p>FOLIO: ${producto.ID}</p>
                                        </div>                                  
                                      </div>
                                    </div>
                                  </div>`;
            $("#accordion").append(contentProduct);
          });
        } else {
          var noProduct = `<div >SIN VENTAS BRO</div>`;
          $("#accordion").append(noProduct);
        }
    }
  }).catch((err) => {
      console.log("HA HABIDO UN ERROR", err);
  });
}

function buy() {
  const url = urlBase + 'user/createSold';
  let tol = total();
  function total() {
    let t = 0;
    cart.forEach( product => {
      t += parseFloat(product.sub_total);

    });

    return t;

  }

  console.log(tol, cart.length, cart);

  const data = {
    total: tol,
    cant: cart.length,
    cart: cart

  }

  fetch( url, {
    method: 'POST',
    headers: {
      'Authorization': sessionStorage.getItem('user'),
      'Content-Type': 'application/json'

    },
    body: JSON.stringify(data)
  }).then( response => {
    return response.json()

  }).then( data => {
    console.log(data);
    if ( data.status === 'success' ) {
      Swal.fire({
        icon: 'success',
        text: `Compra elbaorada correctamente Total $${tol}`

      })
      location.reload();

    } else {
      Swal.fire({
        icon: 'error',
        text: JSON.stringify(data.error)

      })

    }

  })

}




