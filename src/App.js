class App {
  constructor($target) {
    const h1 = document.createElement("h1");
    h1.innerHTML = "app running";
    $target.appendChild(h1);

    this.someFunc();
  }

  async someFunc() {
    try {
      const a = await fetch("ll");

      console.log(a);
    } catch (err) {
      console.log(error);
    }
  }
}

export default App;
