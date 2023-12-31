const prices = {
  ToriShioRamen: 20000,
  ToriShoyuRamen: 20000,
  TsukemenRamen: 20000,
  AburaSobaChicken: 20000,
};

let changeStock = {
  5000: 5,
  10000: 5,
  20000: 5,
  50000: 5,
};

const selectedItemsTable = document
  .getElementById("selectedItems")
  .getElementsByTagName("tbody")[0];

function selectItem(type, itemName) {
  const price = prices[itemName];
  const row = selectedItemsTable.insertRow(selectedItemsTable.rows.length);
  const cell1 = row.insertCell(0);
  const cell2 = row.insertCell(1);
  cell1.innerHTML = itemName;
  cell2.innerHTML = `${formatNumber(price)}`;
  document.getElementById("itemButton").disabled = true;
  document.getElementById("itemButton1").disabled = true;
  document.getElementById("itemButton2").disabled = true;
  document.getElementById("itemButton3").disabled = true;
}

function formatNumber(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
}

function updateChangeStock(change) {
  let updatedStock = { ...changeStock };

  const sortedDenominations = Object.keys(updatedStock).sort((a, b) => b - a);

  for (let denomination of sortedDenominations) {
    const numNotes = Math.floor(change / parseInt(denomination));
    const remainingStock = updatedStock[denomination] - numNotes;
    updatedStock[denomination] = Math.max(remainingStock, 0);
    change -= numNotes * parseInt(denomination);
  }

  changeStock = updatedStock;

  displayChangeStockOutput();
}

function displayChangeStockOutput() {
  const changeStockOutputElement = document.getElementById("changeStockOutput");
  let changeStockHtml = "<p>Stok Uang Kembalian:</p><ul>";

  for (let denomination in changeStock) {
    changeStockHtml += `<li>${formatNumber(denomination)}: ${
      changeStock[denomination]
    } notes</li>`;
  }

  changeStockHtml += "</ul>";
  changeStockOutputElement.innerHTML = changeStockHtml;
}

let selectedMoneyValue = null;

document.querySelectorAll(".money-option").forEach(function (moneyOption) {
  moneyOption.addEventListener("click", function () {
    document.querySelectorAll(".money-option").forEach(function (option) {
      option.classList.remove("selected");
    });

    moneyOption.classList.add("selected");
    selectedMoneyValue = moneyOption.dataset.value;

    const selectedMoneyImage = moneyOption.querySelector("img").cloneNode(true);
    document.getElementById("selectedMoneyImage").innerHTML = "";
    document
      .getElementById("selectedMoneyImage")
      .appendChild(selectedMoneyImage);
  });
});

const initialChangeStock = { ...changeStock };

function processVending() {
  const selectedMoneyElement = document.querySelector(".money-option.selected");

  if (!selectedMoneyElement) {
    displayOutput("Please select a money option.");
    return;
  }

  const providedMoney = parseFloat(selectedMoneyElement.dataset.value);

  const selectedItems = Array.from(selectedItemsTable.rows).map(
    (row) => row.cells[0].innerHTML
  );
  const totalSelectedPrice = selectedItems.reduce(
    (total, item) => total + prices[item],
    0
  );

  if (isNaN(providedMoney) || providedMoney < 0) {
    alert("Please enter a valid amount.");
    return;
  }

  if (providedMoney < totalSelectedPrice) {
    alert("Dana tidak mencukupi. Mohon sediakan lebih banyak uang.");
  } else {
    const change = providedMoney - totalSelectedPrice;
    if (change > 0 && isChangeAvailable(change)) {
      updateChangeStock(change);
      displayChangeOutput(change);
      alert("Transaksi Berhasil! Silahkan menikmati makanan/minuman anda!");

      disableFoodMenuButtons();

      setTimeout(() => {
        resetVendingMachine();
        enableFoodMenuButtons();
      }, 5000);
    } else if (change > 0) {
      alert("Stok Uang Kembalian di Vending Machine telah habis.");
    } else {
      alert(
        "Uang Pas dan Transaksi Berhasil! Silahkan menikmati makanan/minuman anda!"
      );
      resetVendingMachine();
    }
  }
}


function isChangeAvailable(change) {
  let remainingChange = change;

  const sortedDenominations = Object.keys(changeStock).sort((a, b) => b - a);

  for (let denomination of sortedDenominations) {
    const numNotes = Math.floor(remainingChange / parseInt(denomination));
    if (numNotes > changeStock[denomination]) {
      return false;
    }
    remainingChange -= numNotes * parseInt(denomination);
  }

  return remainingChange === 0;
}

function displayChangeOutput(change) {
  const changeOutputElement = document.getElementById("changeOutput");

  if (change > 0) {
    let changeHtml = "<p>Uang Kembalian:</p><ul>";

    const sortedDenominations = Object.keys(changeStock).sort((a, b) => b - a);

    for (let denomination of sortedDenominations) {
      const numNotes = Math.floor(change / parseInt(denomination));
      if (numNotes > 0) {
        changeHtml += `<li>${numNotes} x ${formatNumber(denomination)}</li>`;
      }
      change -= numNotes * parseInt(denomination);
    }

    changeHtml += "</ul>";
    changeOutputElement.innerHTML = changeHtml;
  } else {
    changeOutputElement.innerHTML = "";
  }
}

document
  .getElementById("cancelButton")
  .addEventListener("click", cancelTransaction);

function cancelTransaction() {
  const selectedMoneyElement = document.querySelector(".money-option.selected");

  if (selectedMoneyElement) {
    selectedMoneyElement.classList.remove("selected");
  }

  document.getElementById("selectedMoneyImage").innerHTML = "";

  resetVendingMachine();
}

function disableFoodMenuButtons() {
  document.getElementById("itemButton").disabled = true;
  document.getElementById("itemButton1").disabled = true;
  document.getElementById("itemButton2").disabled = true;
  document.getElementById("itemButton3").disabled = true;
}

function enableFoodMenuButtons() {
  document.getElementById("itemButton").disabled = false;
  document.getElementById("itemButton1").disabled = false;
  document.getElementById("itemButton2").disabled = false;
  document.getElementById("itemButton3").disabled = false;
}

function resetVendingMachine() {
  document.getElementById("output").innerText = "";

  const selectedItemsTable = document
    .getElementById("selectedItems")
    .getElementsByTagName("tbody")[0];
  selectedItemsTable.innerHTML = "";

  const changeOutputElement = document.getElementById("changeOutput");
  changeOutputElement.innerHTML = "";

  enableFoodMenuButtons();
}

displayChangeStockOutput();

function displayChangeStockOutput() {
  const changeStockOutputElement = document.getElementById("changeStockOutput");
  let changeStockHtml = "<p>Stok Uang Kembalian</p><ul>";

  for (let denomination in changeStock) {
    changeStockHtml += `<li>${formatNumber(denomination)}: ${
      changeStock[denomination]
    } notes</li>`;
  }

  changeStockHtml += "</ul>";
  changeStockOutputElement.innerHTML = changeStockHtml;
}

displayChangeStockOutput();
