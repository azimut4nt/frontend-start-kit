// import Module from './components/module/module';

let Module;

function showModule() {
  Module = require('./components/module/module').default;  // eslint-disable-line global-require
  const module = new Module();
  document.body.appendChild(module.el);
  console.log(module.name);
}

showModule();

module.hot.accept('./components/module/module', () => {
  document.body.removeChild(module.el)
  Module = require('./components/module/module').default; // eslint-disable-line global-require
  showModule();
});

