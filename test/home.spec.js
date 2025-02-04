import * as authFunctions from '../src/firebase/auth';
import home from '../src/view/home.js';

const q = (querySnapshot) => querySnapshot([
  {
    data: () => ({
      avatar: null,
      userID: '123',
      userName: 'Pedro',
      content: 'contenido 1',
      title: 'titulo 1',
      likes: [],
      datePost: {
        toDate: () => new Date(),
      },
    }),
    id: 'doc-1',
  },
  {
    data: () => ({
      avatar: null,
      userID: '124',
      userName: 'Carlos',
      content: 'contenido 2',
      title: 'titulo 2',
      likes: ['id-1', 'id-2'],
      datePost: {
        toDate: () => new Date(),
      },
    }),
    id: 'doc-2',
  },
]);

jest.mock('../src/firebase/auth.js', () => ({
  getPost: jest.fn(),
  observer: jest.fn(),
  onGetPost: jest.fn(),
  savePost: jest.fn(),
  logOut: jest.fn(),
  delete: jest.fn(),
}));

const renderApp = () => {
  window.location.href = '#/home';
  document.body.innerHTML = '';
  document.body.appendChild(home.template());
  home.init();
};

describe('home', () => {
  it('should be a function', () => {
    expect(typeof home.template).toBe('function');
    expect(typeof home.init).toBe('function');
  });

  it('should check template', () => {
    expect(home.template()).toMatchSnapshot();
  });

  it('should render template home', () => {
    jest.spyOn(authFunctions, 'observer').mockImplementationOnce((authCallBack) => authCallBack({ photoURL: null }));
    jest.spyOn(authFunctions, 'onGetPost').mockImplementationOnce(q);
    renderApp();

    const elem = document.querySelector('.description-img');
    expect(elem instanceof HTMLElement).toBeTruthy();

    const userName = document.querySelector('.container-publi .user-publi').textContent;
    expect(userName).toBe('Pedro');
  });

  it('should open and close modal publish post', () => {
    renderApp();

    const modalContainer = document.querySelector('.modal-container');
    const btnPublicarNav = document.querySelector('#btn-publicar-nav');

    expect(modalContainer.classList.contains('show-modal-publication')).toBeFalsy();
    btnPublicarNav.click();
    expect(modalContainer.classList.contains('show-modal-publication')).toBeTruthy();

    const btnCloseModal = document.querySelector('.btn-close-modal');
    expect(modalContainer.classList.contains('show-modal-publication')).toBeTruthy();
    btnCloseModal.click();
    expect(modalContainer.classList.contains('show-modal-publication')).toBeFalsy();
  });

  // Testeando la función menuPublicación

  it('should post edit', () => {
    jest.spyOn(authFunctions, 'observer').mockImplementationOnce((authCallBack) => authCallBack({ photoURL: null, uid: '123' }));
    jest.spyOn(authFunctions, 'onGetPost').mockImplementationOnce(q);
    renderApp();

    const options = document.querySelector('.btn-edit-delete');
    expect(options.classList.contains('show-menu')).toBeFalsy();

    const menuDesplegable = document.querySelector('.img-tree-dots');
    menuDesplegable.click();
    expect(options.classList.contains('show-menu')).toBeTruthy();

    menuDesplegable.click();
    expect(options.classList.contains('show-menu')).toBeFalsy();
  });
  it('should menu close', () => {
    renderApp();
    const optionCloseAp = document.querySelector('.opciones-btn-salir');
    expect(optionCloseAp.classList.contains('show-logout')).toBeFalsy();

    const imgSalir = document.querySelector('.img-salir');
    imgSalir.click();
    expect(optionCloseAp.classList.contains('show-logout')).toBeTruthy();
    imgSalir.click();
    expect(optionCloseAp.classList.contains('show-logout')).toBeFalsy();
  });
  it('should close App', () => {
    const logoutApp = document.querySelector('.cerrar-sesion');
    logoutApp.click();
    expect(window.location.href).toContain('');
  });
});
