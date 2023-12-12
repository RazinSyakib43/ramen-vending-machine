const prices = {
  tori1: 15000,
  Item2: 10000,
  tsuke1: 30000,
  ItemA: 10000,
  ItemB: 10000,
  ItemC: 10000,
};

const changeStock = {
  5000: 20,
  10000: 20,
  20000: 20,
  50000: 20,
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
  cell2.innerHTML = `Rp. ${price.toFixed(2)}`;
}

function updateChangeStock(change) {
  for (let denomination in changeStock) {
    const numNotes = Math.floor(change / parseInt(denomination));
    const remainingStock = changeStock[denomination] - numNotes;
    changeStock[denomination] = Math.max(remainingStock, 0);
    change -= numNotes * parseInt(denomination);
  }
}

function displayChangeOutput(change) {
  const changeOutputElement = document.getElementById("changeOutput");

  if (change > 0) {
    let changeHtml = "<p>Change:</p><ul>";

    for (let denomination in changeStock) {
      const numNotes = Math.floor(change / parseInt(denomination));
      if (numNotes > 0) {
        changeHtml += `<li>${numNotes} x Rp. ${denomination}</li>`;
      }
      change -= numNotes * parseInt(denomination);
    }

    changeHtml += "</ul>";
    changeOutputElement.innerHTML = changeHtml;
  } else {
    changeOutputElement.innerHTML = ""; // Clear the change output if no change
  }
}

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
    displayOutput("Please enter a valid amount.");
    return;
  }

  if (providedMoney < totalSelectedPrice) {
    displayOutput("Insufficient funds. Please provide more money.");
  } else {
    const change = providedMoney - totalSelectedPrice;

    // Check if there is enough change in the stock
    if (change > 0 && isChangeAvailable(change)) {
      updateChangeStock(change);
      displayChangeOutput(change);
      displayOutput("Transaction successful. Enjoy your items!");
      resetVendingMachine();
    } else if (change > 0) {
      displayOutput("Sorry, the vending machine doesn't have enough change.");
    } else {
      displayOutput("Transaction successful. Enjoy your items!");
      resetVendingMachine();
    }
  }
}

function isChangeAvailable(change) {
  for (let denomination in changeStock) {
    const numNotes = Math.floor(change / parseInt(denomination));
    if (numNotes > changeStock[denomination]) {
      return false;
    }
    change -= numNotes * parseInt(denomination);
  }
  return change === 0;
}

document.querySelectorAll(".money-option").forEach(function (moneyOption) {
  moneyOption.addEventListener("click", function () {
    // Remove the 'selected' class from all money options
    document.querySelectorAll(".money-option").forEach(function (option) {
      option.classList.remove("selected");
    });

    // Add the 'selected' class to the clicked money option
    moneyOption.classList.add("selected");

    const selectedMoneyImage = moneyOption.querySelector("img").cloneNode(true);
    document.getElementById("selectedMoneyImage").innerHTML = "";
    document
      .getElementById("selectedMoneyImage")
      .appendChild(selectedMoneyImage);
  });
});

function cancelTransaction() {
  resetVendingMachine();
}

function resetVendingMachine() {
  document.getElementById("money").value = "";
  document.getElementById("output").innerText = "";
  selectedItemsTable.innerHTML = "";
}

function displayOutput(message) {
  document.getElementById("output").innerText = message;
}
