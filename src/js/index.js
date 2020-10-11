import _ from 'lodash';
import '../css/style.css';
import planetinfo from '../data/planet-info.json5';
import Main from './main';

function init() {
  console.log(planetinfo.bodies[0].name);

  const container = document.getElementById('appContainer');
  new Main(container);
}

init();