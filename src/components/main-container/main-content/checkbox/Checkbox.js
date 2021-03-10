import "./Checkbox.css";

function Checkbox() {
  const input = document.createElement("input");
  input.className = "btn-checkbox";
  input.setAttribute("type", "checkbox");
  input.style.display = "none";

  return input;
}

export default Checkbox;
