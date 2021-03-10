import "./AddButton.css";

function AddButton() {
  const div = document.createElement("div");
  div.className = "btn btn-add";
  div.textContent = "Add";

  return div;
}

export default AddButton;
