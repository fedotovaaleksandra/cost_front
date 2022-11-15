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
        doneEdit(_id, inputTask.value, inputCosts.value, inputDate.value);
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
      expenses.innerText = toString(sum) + " p.";

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

  const countingSummary = allCosts.reduce((sum, currentValue) => {
    return sum + currentValue.count;
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
    console.log(allCosts);
    render();
  } catch(err) {
    alert("Ошибка вывода расходов");
  }
};

const addNewTask = async () => {
  try {
    const response = await fetch(host, {
      method: "POST",
      body: JSON.stringify({ name: input.value, sum: input.value }),
    });
    const result = await response.json();
    allCosts.push(result);
    input.value = "";
    render();
  } catch(err) {
    alert("ошибка добавления затрат");
  }
};

const onDeleteCost = async (_id) => {
  try {
    const response = await fetch(`${host}/${_id}`, {
      method: "DELETE",
    });
    
    const resume = await response.json();
    if (resume.deletedCount !== 1) {
      alert("ошибка удаления");
      return;
    }
    allCosts = allCosts.filter((item) => _id !== item._id);
    render();
  } catch(err) {
    alert("ошибка удаления")
  }
};

const doneEditCost = async (_id, textCost, sumCost) => {
  try {
    const response = await fetch(`${host}/name/${_id}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: textCost,
        sum: sumCost
      }),
    });
    const result = await response.json();
    allCosts.forEach(elem => {
      if (result._id === elem._id) {
        elem.text = result.text;
      }
    });
    render();
  } catch (err) {
    alert("ошибонька")
  }
};
// const editCost = (_id, name, sum) => {
//   const editedCost = document.getElementById(`textCost-${_id}, textCost-${name}, sumCost-${sum}`);
//   if (!editedCost) {
//     return;
//   }
  
// }
