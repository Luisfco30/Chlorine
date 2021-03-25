const urlBase = "http://189.253.141.193:3000/api/v1/panel/";
const ip = '189.253.137.8';

document.addEventListener("DOMContentLoaded", function () {
    

});

const login = () => {
    const data = {
        name: $('#name').val(),
        password: $('#pass').val()

    }

    const url = urlBase + 'user/loginAdmin'

    fetch( url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify(data)
        }
    ).then( response => {
        return response.json();

    }).then( data => {
        console.log(data.status);
        if ( data.status === 'success' ) {
            localStorage.setItem('user', JSON.stringify(data.user));
            sessionStorage.setItem('user', JSON.stringify(data.token));
            location.href = "http://localhost:5500/chlorinePanel/public/";

        } else {
            Swal.fire({
                title: data.status,
                text: data.message,
                icon: 'error'

            });

        }

    }).catch( error => {
        console.log(error);

    });

}