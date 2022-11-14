let activeEdit = null;
let allCosts = [];

const host = "http://localhost:8000/";
const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
};

window.onload = () => {
  getCost();
};

const render = () => {
  const content = document.getElementById("content");

  if (content === null) {
    return;

  }

  while (content .firstChild) {
    content.removeChild(content.firstChild);
  }

  allCosts.forEach((item, index) => {
    const { text: storeName, count, date, _id } = item;
    const container = document.createElement("li");
    container.id = `cost-${_id}`;
    container.className = "container";
    
    if (_id === activeEdit) {
      const inputTask = document.createElement("input");
      inputTask.type = "text";
      inputTask.value = storeName;
      container.appendChild(inputTask);

      const inputCosts = document.createElement("input");
      inputCosts.type = "number";
      inputCosts.value = "count";
      container.appendChild(inputCosts);

      
    }
  })
}