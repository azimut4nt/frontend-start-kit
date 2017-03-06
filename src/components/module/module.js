import random from 'lodash/random';
import './module.scss';

export default class Module {
  constructor(parameters) {
    console.log('Module loaded3', parameters);

    this.name = 'Test module3';
    this.el = document.createElement('div');
    this.el.innerHTML = `test module ${random(23)}`;
  }
}
