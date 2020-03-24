import printMe from './print';

function component(): HTMLDivElement {
    const element = document.createElement('div');
    const btn = document.createElement('button');

    btn.innerHTML = 'Click me and check the console!';
    btn.onclick = printMe;

    element.appendChild(btn);
    return element;
  }

  document.body.appendChild(component());