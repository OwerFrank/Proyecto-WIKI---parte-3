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
