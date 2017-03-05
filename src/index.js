import random from 'lodash/random';
import Module from './components/module/module';

const module = new Module();

console.log(module.name, random(42));
