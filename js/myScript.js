function showLogin(){
  const formhtml = 
    `<label>Usuario: </label>
      <input type='text' id='userName' name='userName'placeholder='Ingrese su usuario' required><br>
      <label>Contraseña: </label>
      <input type='password' id='password' name='password'  placeholder='Ingrese su contraseña' required><br>
      <button onclick='doLogin()'>Iniciar Sesión</button>`;
  console.log(formhtml);
  document.querySelector('#main').innerHTML = formhtml;
}

/**
 * Esta función recolecta los valores ingresados en el formulario
 * y los envía al CGI login.pl
 * La respuesta del CGI es procesada por la función loginResponse
 */
function doLogin(){
  //Extraer valores de entrada
  const userName = document.querySelector("#userName").value;
  const password = document.querySelector("#password").value;
  
  //Validar valores de los input
  if (!userName && !password) {
    return alert("Por favor ingrese un nombre de usuario y contraseña.");
  }

  if (!userName) {
    return alert("Por favor ingrese su nombre de usuario.");
  }

  if (!password) {
    return alert("Por favor ingrese su contraseña.");
  }
  
  const url = new URL("http://192.168.1.23/~alumno/cgi-bin/login.pl");
  url.searchParams.set("userName", userName);
  url.searchParams.set("password", password);

  console.log(url);
  
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.text();
    })
    .then(xml => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "text/xml");
      console.log(xml);
      loginResponse(xmlDoc);
    })
    .catch(error => {
      console.error(error);
      alert("Ocurrió un error al iniciar sesión. Vuelva a intentarlo");
    });
}
/**
 * Esta función recibe una respuesta en un objeto XML
 * Si la respuesta es correcta, recolecta los datos del objeto XML
 * e inicializa la variable userFullName y userKey (e usuario)
 * termina invocando a la funcion showLoggedIn.
 * Si la respuesta es incorrecta, borra los datos del formulario html
 * indicando que los datos de usuario y contraseña no coinciden.
 */
function loginResponse(xml){
  //Seleccionamos el elemento user de la respuesta XML
  const user = xml.querySelector('user');
  console.log(user);

  //Verificamos si el elemento está vacío (es decir, la respuesta es incorrecta)
  if (user.textContent.trim() === '') {
    document.querySelector("#userName").value = "";
    document.querySelector("#password").value = "";
    alert('Los datos que ingresaste no está conectado a una cuenta. Vuelva a intentarlo');
  } else {
    //Extraemos los valores de los elementos hijos de user
    const nombre = user.querySelector('firstName').textContent;
    const apellido = user.querySelector('lastName').textContent;
    const owner = user.querySelector('owner').textContent;
    
    //Inicializamos las variables
    userFullName = `${nombre} ${apellido}`;
    userKey = owner;

    //Mostramos el mensaje de inicio de sesión
    showLoggedIn();
  }
}
/**
 * esta función usa la variable userFullName, para actualizar el
 * tag con id userName en el HTML
 * termina invocando a las functiones showWelcome y showMenuUserLogged
 */
function showLoggedIn(){
  //Actualiza la variable userName
  const userName = document.querySelector('#userName');
  userName.textContent = userFullName;

  //Mostrar mensaje de bienvenida
  try {
    showWelcome();
  } catch (error) {
    console.error('Error al mostrar el mensaje de bienvenida:',error);
  }

  //Mostrar menú para usuarios registrados
  try {
    showMenuUserLogged();
  } catch (error) {
    console.error('Error al mostrar el menú para usuarios registrados:', error);
  }
}
/**
 * Esta función crea el formulario para el registro de nuevos usuarios
 * el fomulario se mostrará en tag div con id main.
 * La acción al presionar el bontón de Registrar será invocar a la 
 * función doCreateAccount
 * */
function showCreateAccount(){
  const html = `
      <label for="userName">Usuario</label>
      <input type="text" id="userName" name="userName" placeholder='Ingrese su usuario' required><br>
      <label for="password">Contraseña</label>
      <input type="password" id="password" name="password" placeholder='Ingrese su contraseña' required><br>
      <label for="firstName">Nombres</label>
      <input type="text" id="firstName" name="firstName" placeholder='Ingrese su nombre' required><br>
      <label for="lastName">Apellidos</label>
      <input type="text" id="lastName" name="lastName" placeholder='Ingrese su Apellido' required><br>
      <button type="submit" onclick="doCreateAccount()">Crear Cuenta</button>
  `;
  document.querySelector('#main').innerHTML = html;
}

/* Esta función extraerá los datos ingresados en el formulario de
 * registro de nuevos usuarios e invocará al CGI register.pl
 * la respuesta de este CGI será procesada por loginResponse.
 */
function doCreateAccount(){
  //Extraer valores de entrada
  const userName = document.querySelector('#userName').value;
  const password = document.querySelector('#password').value;
  const firstName = document.querySelector('#firstName').value;
  const lastName = document.querySelector('#lastName').value;

  console.log(userName + " " + password + " " + lastName + " " + firstName);
  //Validar valores de los input
  if (!userName || !password || !firstName || !lastName){ 
    return alert('Por favor, rellena todos los campos del formulario');
  }

  if (userName.length < 3 || userName.length > 20) {
    document.querySelector('#userName').value = "";
     return alert('El nombre de usuario debe tener entre 3 y 20 caracteres');
  }

  if (password.length < 8) {
    document.querySelector('#password').value = "";
    return alert('La contraseña debe tener al menos 8 caracteres');
  }
  
  const url = new URL("http://192.168.1.23/~alumno/cgi-bin/register.pl");
  url.searchParams.set('userName', userName);
  url.searchParams.set('password', password);
  url.searchParams.set('firstName', firstName);
  url.searchParams.set('lastName', lastName);
  console.log(url);
  
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.text();
    })
    .then(xml => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "text/xml");
      console.log(xmlDoc);
      loginResponse(xmlDoc);
    })
    .catch(error => {
      console.error(error);
      alert("Ocurrió un error al registrase. Vuelva a intentarlo");
    });

}
/*
 * Esta función invocará al CGI list.pl usando el nombre de usuario 
 * almacenado en la variable userKey
 * La respuesta del CGI debe ser procesada por showList
 */
function doList(){
  const url = new URL("http://192.168.1.23/~alumno/cgi-bin/list.pl");
  url.searchParams.set('owner', userKey);
  console.log(url);

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.text();
    })
    .then(xml => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "text/xml");
      console.log(xmlDoc);
      showList(xmlDoc);
    })
    .catch(error => {
      console.error(error);
      alert("Ocurrió un error al listar las páginas. Vuelva a intentarlo");
    });
}

/**
 * Esta función recibe un objeto XML con la lista de artículos de un usuario
 * y la muestra incluyendo:
 * - Un botón para ver su contenido, que invoca a doView.
 * - Un botón para borrarla, que invoca a doDelete.
 * - Un botón para editarla, que invoca a doEdit.
 * En caso de que lista de páginas esté vacia, deberá mostrar un mensaje
 * indicándolo.
 */
function showList(xml){
  const articles = xml.querySelector('articles');
  
  if (articles.textContent.trim() === '') {
    //Añadir el título al elemento main
    document.querySelector('#main').innerHTML = `<h2>No tienes ninguna página creada</h2>`;
  } else {
    document.querySelector('#main').innerHTML = `<h2>Lista de páginas</h2>`;

    for (let i = 0; i < articles.children.length; i++) {
      let title = articles.children[i].children[1].textContent;
      var listElement = `
          <span>${title}</span>
          <button onclick="doView('${userKey}','${title}')">V</button>
          <button onclick="doDelete('${userKey}','${title}')">X</button>
          <button onclick="doEdit('${userKey}','${title}')">E</button><br>
          `;
      document.getElementById("main").innerHTML += listElement;
    }
  }
}

/**
 * Esta función deberá generar un formulario para la creación de un nuevo
 * artículo, el formulario deberá tener dos botones
 * - Enviar, que invoca a doNew 
 * - Cancelar, que invoca doList
 */
function showNew(){
  const formhtml = `
      <label>Título</label>
      <input type="text" id="title" name="titulo" placeholder='Ingrese el título' required><br>
      <label>Texto</label>
      <textarea rows='20' cols='60' id="text" name="texto" required></textarea><br>
      <button onclick="doNew()">Enviar</button>
      <button onclick="doList()">Cancelar</button>
      `;
  document.querySelector('#main').innerHTML = formhtml;
}

/*
 * Esta función invocará new.pl para resgitrar un nuevo artículo
 * los datos deberán ser extraidos del propio formulario
 * La acción de respuesta al CGI deberá ser una llamada a la 
 * función responseNew
 */
function doNew(){
  //Extraer valores de entrada
  const title = document.querySelector('#title').value;
  const text = document.querySelector('#text').value;

  //Validar valores de los input
  if (!title || !text) {
    return alert('Por favor, rellena todos los campos del formulario');
  }

  const url = new URL("http://192.168.1.23/~alumno/cgi-bin/new.pl");
  url.searchParams.set('title', title);
  url.searchParams.set('text', text);
  url.searchParams.set('owner', userKey);
  console.log(url);
  
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.text();
    })
    .then(xml => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "text/xml");
      console.log(xmlDoc);
      responseNew(xmlDoc);
    })
    .catch(error => {
      console.error(error);
      alert("Ocurrió un error al crear la página. Vuelva a intentarlo");
    });
}

/*
 * Esta función obtiene los datos del artículo que se envían como respuesta
 * desde el CGI new.pl y los muestra en el HTML o un mensaje de error si
 * correspondiera
 */
function responseNew(response){
  const article = response.querySelector('article');

  if (article.textContent.trim() === '') {
    document.querySelector('#main').innerHTML = `<h2>Ocurrió un error al crear la página. Vuelva a intentarlo</h2>`;
  } else {
    document.querySelector('#main').innerHTML = `
         <h2>Título: ${article.querySelector('title').textContent}</h2>
         <pre>${article.querySelector('text').textContent}<pre>
         `;
  }
}

/*
 * Esta función invoca al CGI view.pl, la respuesta del CGI debe ser
 * atendida por responseView
 */
function doView(owner, title){
  const url = new URL("http://192.168.1.23/~alumno/cgi-bin/view.pl");
  url.searchParams.set('owner', owner);
  url.searchParams.set('title', title);

  let xhr = new XMLHttpRequest();

  xhr.onload = function () {
    console.log(xhr.responseXML);
    responseView(xhr.responseXML);
  };
  xhr.open("GET", url);
  xhr.send();
}

/*
 * Esta función muestra la respuesta del cgi view.pl en el HTML o 
 * un mensaje de error en caso de algún problema.
 */
function responseView(response){
  const root = response.querySelector("*");
  console.log(root);
  document.querySelector('#main').innerHTML = root.innerHTML;
}

/*
 * Esta función invoca al CGI delete.pl recibe los datos del artículo a 
 * borrar como argumentos, la respuesta del CGI debe ser atendida por doList
 */
function doDelete(owner, title){
  const url = new URL("http://192.168.1.23/~alumno/cgi-bin/delete.pl");
  url.searchParams.set('owner', owner);
  url.searchParams.set('title', title);

  fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    //procesa la respuesta del CGI
    return response.text();
  })
  .then(xml => {
    //utiliza los datos devueltos por el CGI para actualizar la lista de artículos
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    console.log(xmlDoc);
    doList(xmlDoc);
  })
  .catch(error => {
    //maneja cualquier error que ocurra durante la solicitud
    console.error(error);
    alert("Ocurrió un error al eliminar la página. Vuelva a intentarlo");
  });
}

/*
 * Esta función recibe los datos del articulo a editar e invoca al cgi
 * article.pl la respuesta del CGI es procesada por responseEdit
 */
function doEdit(owner, title){
  const url = new URL("http://192.168.1.23/~alumno/cgi-bin/article.pl");
  url.searchParams.set('owner', owner);
  url.searchParams.set('title', title);

  fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    //procesa la respuesta del CGI
    return response.text();
  })
  .then(xml => {
    //utiliza los datos devueltos por el CGI para actualizar la lista de artículos
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    console.log(xmlDoc);
    responseEdit(xmlDoc);
  })
  .catch(error => {
    //maneja cualquier error que ocurra durante la solicitud
    console.error(error);
    alert("Ocurrió un error al eliminar la página. Vuelva a intentarlo");
  });
}

/*
 * Esta función recibe la respuesta del CGI data.pl y muestra el formulario 
 * de edición con los datos llenos y dos botones:
 * - Actualizar que invoca a doUpdate
 * - Cancelar que invoca a doList
 */
function responseEdit(xml){
  const title = xml.querySelector('title').textContent;
  const text = xml.querySelector('text').textContent;
  console.log(title);
  console.log(text);

  const html = `
      <h2>${title}</h2>
      <textarea rows='20' cols='60' id='text'>${text}</textarea><br>
      <button onclick="doUpdate('${title}')">Actualizar</button>
      <button onclick='doList()'>Cancelar</button>
      `;
  document.querySelector('#main').innerHTML = html;
}
/*
 * Esta función recibe el título del artículo y con la variable userKey y 
 * lo llenado en el formulario, invoca a update.pl
 * La respuesta del CGI debe ser atendida por responseNew
 */
function doUpdate(title){
  const text = document.querySelector('#text').value;
  console.log(text);

  const url = new URL("http://192.168.1.23/~alumno/cgi-bin/update.pl");
  url.searchParams.set('title', title);
  url.searchParams.set('owner', userKey);
  url.searchParams.set('text', text);
  
  fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    //procesa la respuesta del CGI
    return response.text();
  })
  .then(xml => {
    //utiliza los datos devueltos por el CGI para actualizar la lista de artículos
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    console.log(xmlDoc);
    responseNew(xmlDoc);
  })
  .catch(error => {
    //maneja cualquier error que ocurra durante la solicitud
    console.error(error);
    alert("Ocurrió un error al actualizar la página. Vuelva a intentarlo");
  });
}
