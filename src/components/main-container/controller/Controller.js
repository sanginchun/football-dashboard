import "./Controller.css";

class Controller {
  constructor({ $target, onClickEditBtn, onClickController }) {
    this.controller = this._template();

    this.controller.addEventListener("click", (e) => {
      if (!e.target.closest(".btn-edit")) return;

      this.controller.classList.toggle("editing");
      const isEditing = this.controller.classList.contains("editing");
      e.target.textContent = isEditing ? "Done" : "Edit";

      onClickEditBtn({ isEditing });
    });

    this.controller.addEventListener("click", (e) => {
      if (!e.target.closest(".control-btn")) return;

      const { type } = e.target.dataset;
      let isSelect;
      if (type === "select") {
        isSelect = e.target.checked;
      } else {
        isSelect = undefined;
      }

      onClickController({ type, isSelect });
    });

    $target.appendChild(this.controller);
  }

  _template() {
    const div = document.createElement("div");
    div.className = "controller hide";

    div.innerHTML = `
    <div class="control-btns">
      <label for="select-all"><h4>Select All</h4></label>
      <input class="control-btn" id="select-all" type="checkbox" data-type="select">
      <i class="fas fa-angle-left control-btn" data-type="left"></i>
      <i class="fas fa-angle-right control-btn" data-type="right"></i>
      <i class="fas fa-trash control-btn" data-type="remove"></i>
    </div>
    <div class="btn btn-edit">Edit</div>
    `;

    return div;
  }

  showController() {
    this.controller.classList.remove("hide");
  }
  hideController() {
    this.controller.classList.add("hide");
  }

  toggleSelectAll({ isAll }) {
    this.controller.querySelector(
      `.control-btns .control-btn[data-type="select"]`
    ).checked = isAll;
  }
}

export default Controller;
