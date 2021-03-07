import "core-js/stable";
import "regenerator-runtime/runtime";

class App {
  constructor($target) {
    const h1 = document.createElement("h1");
    h1.innerHTML = "app running";
    $target.appendChild(h1);
  }
}

export default App;
