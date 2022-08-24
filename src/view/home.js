import {
  observer,
  savePost,
  onGetPost,
  deletePost,
  getPost,
  updatePost,
  serverTime,
  logOut,
  /* logOut, */
} from '../firebase/auth.js';

const home = {
  template: () => { /* Backticks: Permiten concatenar y trabajar con cadenas */
    const homeTemplate = `   
    <section class="home container-wrapper">
      <div class="header-home">
        <h1>HELP TASTER</h1>

        <div class="description-img">
        <div class="nav">
          <div class="home-nav">
            <button id="btn-home-nav" class="btn-nav">
              <img src="./img/recipe (Stroke).png">Home</button>
          </div>
          <div class="publicar-nav">
            <button id="btn-publicar-nav" class="btn-nav">
              <img src="./img/photo_camera.png">Publicar
            </button>
          </div>
          <div class="buscar-nav">
            <button id="btn-buscar-nav" class=" btn-nav">
              <img src="./img/search.png">Buscar</button>
          </div>
        </div>

        </div>
        <div class="menu-salir">
            <button class="img-salir" >
            <img class="photo-user" src="" referrerpolicy="no-referrer">
            <img src="./img/expand_more.png">
            </button> 
            <ul class= "opciones-btn-salir opciones-menu">
              <li><button class = "cerrar-sesion menu">Cerrar sesión</button></li>
              <li><button class = "cancelar menu">Cancelar</button></li>
            </ul>
          </div>
      </div>

      <div class = "wrapper" >
        <div class = "container-publi container-perfil" >
          <div>
          <img class="photo-user-perfil" src="" referrerpolicy="no-referrer">
          </div>
          <span><strong id='currentName'></strong></span>
          <h3 class= "descripcion">Descripción</h3>
          <span>Me gusta la cocina , soy  aficionad@. 
          La comida Peruana es mi favorita, ya que esta dentro de los primeros lugares gastronomicos del mundo.
          Quiero ampliar mi conocimiento respecto a los mejores restaurantes del Perú. 
          Mis platos  favoritos son el chaufa y el picante de camarones a la tacneña. Recomiendame tú lugar fovorito!! </span>
          <div class = "iconosFollow">
            <img src = "./img/group.png">
            <span> 23 followers  3 following </span>
          </div>
        </div>

        <div id = "contentPost" class = "content-post"></div>
      </div>

      
      <div class="modal-container">
        <div class="modal no-verified-email">
          <form id="create-post" class="create-post">
            <label><input type="text" id = "name-restaurant" class="name-restaurant" placeholder="Restaurante"></label>
            <textarea id="publicacion" class="publicacion" placeholder="¿Por qué nos recomiendas este lugar?"></textarea>
              <div class="iconos-post">
                <div>
                  <span class="material-symbols-outlined">image</span>
                </div>
                <button id="btn-publicar" class="btn-primary btn-publicar">Publicar</button>
                <button class="btn-primary btn-close-modal">Cancelar</button>
              </div>
          </form>
        </div>
      </div>
    </section>
    `;

    const divRegister = document.createElement('div');
    divRegister.classList.add('registers'); // add class in style css
    divRegister.innerHTML = homeTemplate;
    return divRegister;
  },

  init: () => {
    // Creando post
    const containerPost = document.querySelector('#contentPost');
    const postForm = document.querySelector('.create-post'); // form modal
    /* console.log(postForm); */
    const nameRestaurant = document.querySelector('#name-restaurant');
    const post = document.querySelector('.publicacion'); // texto de publicación
    const modalPublication = document.querySelector('.modal-container'); // div modal
    let currentUser;

    // Traer el nombre de usuario, (el observador)
    function authCallBack(user) {
      currentUser = user; // Usuario actual
      const userPerfil = document.querySelector('#currentName');
      userPerfil.innerHTML = currentUser.displayName;

      const photoUser = document.querySelector('.photo-user');
      const photoUserPerfil = document.querySelector('.photo-user-perfil');

      photoUser.setAttribute('src', user.photoURL); // Cambia el contenido src x la foto
      photoUserPerfil.setAttribute('src', user.photoURL);
      if (user.photoURL == null) {
        photoUser.setAttribute('src', './img/photo-user.png'); // img x defecto
        photoUserPerfil.setAttribute('src', './img/photo-user.png'); // img x defecto
      }
    }
    observer(authCallBack); // al observer le paso la fx

    // Función para desplegar botones (cerrar sesión)
    const menuDesplegableSalir = document.querySelector('.img-salir');
    menuDesplegableSalir.addEventListener('click', (event) => {
      const btnCerrarSesion = event.target.closest('.menu-salir').querySelector('.opciones-btn-salir');
      if (btnCerrarSesion.classList.contains('show-logout')) {
        btnCerrarSesion.classList.remove('show-logout');
      } else {
        btnCerrarSesion.classList.add('show-logout');
      }
    });

    const btnSalir = document.querySelector('.cerrar-sesion');
    btnSalir.addEventListener('click', () => {
      logOut();
    });

    const btnCancelar = document.querySelector('.cancelar');
    btnCancelar.addEventListener('click', (event) => {
      const btnCerrarSesion = event.target.closest('.menu-salir').querySelector('.opciones-btn-salir');
      btnCerrarSesion.classList.remove('show-logout');
    });

    // funciones para bloquear y activar scroll del modal
    function blockScroll() {
      document.querySelector('.container-wrapper').classList.add('hidden-scroll');
    }

    function activateScroll() {
      document.querySelector('.container-wrapper').classList.remove('hidden-scroll');
    }

    // funcion para mostrar modal
    function showModal(configModal = {}) { // le doy como atributo el cofig de mi modal
      const noopFunction = () => {};
      const btnCloseModal = document.querySelector('.btn-close-modal');

      const {
        continueText = 'Publicar',
        clickContinue = noopFunction,
        beforeLoad = noopFunction,
        onClose = noopFunction,
      } = configModal;

      document.getElementById('btn-publicar').innerText = continueText; // reemplazamos según lo q queremos

      document.getElementById('btn-publicar').addEventListener('click', clickContinue);
      btnCloseModal.addEventListener('click', onClose);

      beforeLoad();

      modalPublication.classList.add('show-modal-publication');// Esta en nav.css
      // Se muestra el show modal
    }

    // funcion para remover modal
    function removeModal(clickContinue = () => {}) {
      postForm['btn-publicar'].removeEventListener('click', clickContinue);

      modalPublication.classList.remove('show-modal-publication');
      activateScroll();
    }

    // Menú desplegable
    function menuPublication() {
      const menusDesplegables = document.querySelectorAll('.img-tree-dots');
      menusDesplegables.forEach((menuDesplegable) => {
        menuDesplegable.addEventListener('click', (event) => {
          const btnMenu = event.target.closest('.menu-desplegable').querySelector('.btn-edit-delete'); // btns edit,delete
          if (btnMenu.classList.contains('show-menu')) { // class show.menu
            btnMenu.classList.remove('show-menu');
          } else {
            btnMenu.classList.add('show-menu');
          }
        });
      });
    }

    // Eliminando post
    function deletePostFinal() {
      const btnsDelete = containerPost.querySelectorAll('.btn-delete');
      btnsDelete.forEach((btn) => {
        btn.addEventListener('click', (event) => { // del evento quiero el target-dataset-id
          deletePost(event.target.dataset.id);
        });
      });
    }

    // Función editar post
    function editPostFinal() {
      const btnsEdit = containerPost.querySelectorAll('.btn-edit');

      btnsEdit.forEach((btn) => {
        btn.addEventListener('click', async (event) => {
          const editId = event.target.dataset.id;

          // función para
          const clickContinue = (e) => {
            e.preventDefault();

            const content = post.value; // contenido del post
            /* console.log(content); */
            updatePost(editId, { content });

            removeModal(clickContinue); // elimina el evento
            postForm.reset();
          };

          // Editando el post
          showModal({
            continueText: 'Guardar', // cambiar el nombre del btn
            beforeLoad: async () => {
              const doc = await getPost(editId);
              const publication = doc.data();
              post.value = publication.content;
              blockScroll();
            },
            clickContinue,
            onClose: () => {
              removeModal(clickContinue);
            },
          });
        });
      });
    }

    // Contador de likes
    function counterLike() {
      const btnLikes = document.querySelectorAll('.btn-likes');
      btnLikes.forEach((btnLike) => {
        btnLike.addEventListener('click', async (event) => {
          const elementBtnLike = event.target.closest('.btn-likes'); // elemento al que se le hace click
          const idPost = elementBtnLike.dataset.id;
          const docPost = await getPost(idPost); // recibe como argumento 1 id
          const publication = docPost.data(); // convertirlo en 1 obj de Js
          const likes = publication.likes; // array de usuarios que le dieron like

          if (likes.includes(currentUser.uid)) { // quita like
            const filterLikes = likes.filter((idLike) => idLike !== currentUser.uid);
            updatePost(idPost, { likes: filterLikes });
            /* likeImg.setAttribute('src', '../img/corazon.png');
            console.log(likeImg, 'dentro del if'); */
          } else {
            updatePost(idPost, { likes: [...likes, currentUser.uid] }); // agrega like
            // likeImg.setAttribute('src', '../img/corazonActivo.png');
          }
        });
      });
    }

    // Haciendo el post
    onGetPost((querySnapshot) => { // Cuando ocurra 1 cambio te mando los nuevos dts
      let html = '';

      querySnapshot.forEach((doc) => {
        // Si el userID del post no es igual al id del currentUser no muestro el boton de eliminar
        const contentPost = doc.data();
        /* console.log(contentPost); */
        const avatarUser = contentPost.avatar === null ? './img/photo-user-blanco.png' : contentPost.avatar;
        const isLiked = contentPost.likes.includes(currentUser.uid);
        /* console.log(contentPost.userID, currentUser.uid); */

        html += ` 
        <div class="container-publi">
          <div class="container-publi-img">

            ${contentPost.userID === currentUser.uid ? `<div class="menu-desplegable" >
              <button class="img-tree-dots" >
                <img src="./img/menu-desplegable.png">
              </button>
              <ul class="btn-edit-delete">
                <li><button type="button" class="btn-edit menu" data-id="${doc.id}">Editar</button></li>
                <li><button type="button" class="btn-delete menu" data-id="${doc.id}">Eliminar</button></li>
              </ul>
            </div>` : ''}

            <div class="content-publi">            
              <img class="photo-user-post" src="${avatarUser}" referrerpolicy="no-referrer">
              <div>
              <p class="user-publi">${contentPost.userName}</p>
              <span class="time-publi">${contentPost.datePost.toDate().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div class="info-publi">
            <h4>${contentPost.title} 🍴🥄</h4>
            <p class="description">${contentPost.content}</p>

            <div class="interacciones">
              <button class="btn-interaccion btn-likes" data-id="${doc.id}"> 
              <img class="like-img" src='${isLiked ? './img/corazonActivo.png' : './img/corazon.png'}'>
              <span class="conteo">${contentPost.likes.length}</span>
              </button>
              <button class="btn-interaccion">
              <img src = "./img/coment.png">
              <span class = "conteo comentarios">364</span>
              </button>
            </div>
          </div>
        </div>
        `;
      });
      containerPost.innerHTML = html;
      menuPublication();
      deletePostFinal();
      editPostFinal();
      counterLike();
    });

    // evento cuando le dan click al boton del nav-publicar
    const btnPublicarNav = document.querySelector('#btn-publicar-nav');
    btnPublicarNav.addEventListener('click', () => {
      const clickContinue = (event) => { // clickContinue de la linea 110
        event.preventDefault();

        const userPublication = post.value;
        const userRestaurant = nameRestaurant.value;

        savePost({
          content: userPublication,
          title: userRestaurant,
          userName: currentUser.displayName,
          userID: currentUser.uid,
          avatar: currentUser.photoURL,
          urlImage: '',
          likes: [],
          commets: [],
          datePost: serverTime,
        });
        removeModal();
        postForm.reset();
      };

      showModal({
        beforeLoad: () => { // antes de mostrarte bloquea el scroll
          blockScroll(); // bloquea el scroll
        },
        clickContinue,
        onClose: () => {
          removeModal(clickContinue);
        },
      });
    });
  },
};

export default home;
