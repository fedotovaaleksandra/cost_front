let activeEdit = null;
let allCosts = [];

const host = "http://localhost:5500/cost";
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
    const { name, sum, date, _id } = item;
    const container = document.createElement("li");
    container.id = `cost-${_id}`;
    container.className = "cost-container";
    
    if (_id === activeEdit) {
      const inputTask = document.createElement("input");
      inputTask.type = "text";
      inputTask.value = name;
      container.appendChild(inputTask);

      const inputCosts = document.createElement("input");
      inputCosts.type = "number";
      inputCosts.value = sum;
      container.appendChild(inputCosts);
      const inputDate = document.createElement("input");
      inputDate.type = "date";
      inputDate.value = moment(date).format("YYYY-MM-DD");
      container.appendChild(inputDate);

      const imageDone = document.createElement("img");
      imageDone.src = "icons/done.svg";
      imageDone.alt = "done";
      imageDone.className = "img1";
      const buttonDone = document.createElement("button");
      buttonDone.onclick = () => {
        activeEdit = null;
        doneEditCost(_id, inputTask.value, inputCosts.value, inputDate.value);
      };

      buttonDone.appendChild(imageDone);
      container.appendChild(buttonDone);
    } else {
      const numbering = document.createElement("p");
      numbering.type = "text";
      numbering.className = "result";
      numbering.innerText = `${index + 1}`;
      container.appendChild(numbering);

      const text = document.createElement("p");
      text.type = "text";
      text.className = "result";
      text.innerText = name;

      const dateBuy = document.createElement("p");
      dateBuy.className = "result";
      dateBuy.innerText = moment(date).format("DD.MM.YYYY");

      const expenses = document.createElement("p");
      expenses.innerText = `${sum} p.`;

      container.appendChild(text);
      container.appendChild(dateBuy);
      container.appendChild(expenses);

      const imageEdit = document.createElement("img");
      imageEdit.src = "icons/pen.svg";
      imageEdit.alt = "pen";
      imageEdit.className = "img1";
      const buttonEdit = document.createElement("button");
      buttonEdit.onclick = () => {
        activeEdit = _id;
        render();
      };
      buttonEdit.appendChild(imageEdit);
      container.appendChild(buttonEdit);
    }

    const imageDelete = document.createElement("img");
    imageDelete.src = "icons/trash.svg";
    imageDelete.alt = "delete";
    imageDelete.className = "img1";
    const buttonDelete = document.createElement("button");
    buttonDelete.onclick = () => {
      deleteOneCost(_id);
    };
    buttonDelete.appendChild(imageDelete);
    container.appendChild(buttonDelete);
    content.appendChild(container);
  });
  const all = document.getElementById("all");

  if (all === null) {
    return;
  }

  const countingSummary = allCosts.reduce((summary, currentValue) => {
    return summary + currentValue.sum;
  }, 0);
  all.innerText = `Итого: ${countingSummary} p.`;
};

const getCost = async () => {
  try {
    const response = await fetch(host, {
      method: "GET",
    });
    const result = await response.json();
    allCosts = result;
    render();
  } catch(err) {
    alert("Ошибка вывода расходов");
  }
};

const addNewCost = async () => {
  try {
    const count = document.getElementById("input-cost");
    const input = document.getElementById("input-shop");

    const response = await fetch(host, {
      method: "POST",
      headers,
      body: JSON.stringify(
        { 
          name: input.value, 
          sum: count.value 
        }
      ),
    });
    const result = await response.json();
    allCosts.push(result);
    input.value = "";
    count.value = "";
    render();
  } catch(err) {
    alert(err);
  }
};

const deleteOneCost = async (_id) => {
  try {
    const response = await fetch(`${host}/${_id}`, {
      method: "DELETE",
    });
    
    const result = await response.json();
    if (result.deletedCount === 1) {
    allCosts = allCosts.filter(item => _id !== item._id);
    render();
    } 
  } catch(err) {
    alert("ошибка удаления")
  }
};

const doneEditCost = async (_id, nameShop, sumCost, date) => {
  try {
    const response = await fetch(`${host}/name/${_id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        name: nameShop,
        date: date,
        sum: sumCost,
      }),
    });
    const result = await response.json();
    allCosts.find(elem => {
      if (result._id === elem._id) {
        elem.name = result.name;
        elem.date = result.date;
        elem.sum = result.sum;
      }
    });
    render();
  } catch (err) {
    alert("ошибонька")
  }
};

