import "./DatePicker.css";

export const DatePicker = function (dateArr) {
  const select = document.createElement("select");
  select.className = "date-picker";
  select.innerHTML = dateArr
    .map((date) => {
      return `<option value="${date}">${date}</option>`;
    })
    .join("");

  return select;
};
