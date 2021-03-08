import "./AddButton.css";

class AddButton {
  constructor({ $target }) {
    this.addBtn = this._template();

    $target.appendChild(this.addBtn);
  }

  _template() {
    const div = document.createElement("div");
    div.className = "btn btn-add";
    div.textContent = "Add";

    return div;
  }
}

export default AddButton;
