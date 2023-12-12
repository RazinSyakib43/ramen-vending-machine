const prices = {
  Item1: 10000,
  Item2: 10000,
  Item3: 10000,
  ItemA: 10000,
  ItemB: 10000,
  ItemC: 10000,
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
  cell2.innerHTML = `$${price.toFixed(2)}`;
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
    if (change > 0) {
      displayOutput(`Change: $${change.toFixed(2)}`);
    } else {
      displayOutput("Transaction successful. Enjoy your items!");
      resetVendingMachine();
    }
  }
}

document.querySelectorAll(".money-option").forEach(function (moneyOption) {
  moneyOption.addEventListener("click", function () {
    // Remove the 'selected' class from all money options
    document.querySelectorAll(".money-option").forEach(function (option) {
      option.classList.remove("selected");
    });

    // Add the 'selected' class to the clicked money option
    moneyOption.classList.add("selected");
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
