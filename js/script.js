const prices = {
  Item1: 5.0,
  Item2: 7.5,
  Item3: 10.0,
  ItemA: 2.5,
  ItemB: 3.0,
  ItemC: 4.5,
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
  const providedMoney = parseFloat(document.getElementById("money").value);
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
