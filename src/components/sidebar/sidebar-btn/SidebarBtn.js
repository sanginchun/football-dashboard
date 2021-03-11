import "./SidebarBtn.css";

function SidebarBtn() {
  const div = document.createElement("div");
  div.className = "btn-sidebar";
  div.innerHTML = `<i class="fa fa-chevron-right"></i>`;

  return div;
}

export default SidebarBtn;
