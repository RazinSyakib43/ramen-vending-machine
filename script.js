const prices = {
  Item1: 5000,
  Item2: 7000,
  Item3: 10000,
  ItemA: 2000,
  ItemB: 3000,
  ItemC: 4000,
};

function selectItem(type, itemName) {
  const price = prices[itemName];
  const selectedItemList = document
    .getElementById("selectedItemsList")
    .getElementsByTagName("ul")[0];

  const listItem = document.createElement("li");
  listItem.textContent = `${itemName} - Rp. ${price}`;
  selectedItemList.appendChild(listItem);
}

function addDenomination(value) {
  const moneyInput = document.getElementById("money");

  if (value === 1000) {
    displayOutput("Sorry, this vending machine does not accept money of Rp1,000.");
    setTimeout(() => {
      clearErrorOutput();
    }, 2000);
    return;
  }

  moneyInput.value = (parseFloat(moneyInput.value) || 0) + value;
}

function clearErrorOutput() {
  displayOutput("");
}

function processVending() {
  const providedMoney = parseFloat(document.getElementById("money").value);
  const selectedItems = Array.from(selectedItemsTable.rows).map((row) => row.cells[0].innerHTML);
  const totalSelectedPrice = selectedItems.reduce((total, item) => total + prices[item], 0);

  if (isNaN(providedMoney) || providedMoney < 0) {
    displayOutput("Please enter a valid amount.");
    return;
  }

  if (totalSelectedPrice === 0) {
    displayOutput(`Transaction canceled. Returning Rp${providedMoney.toLocaleString()}`);
    setTimeout(() => {
      resetVendingMachine();
    }, 2000);
    return;
  }

  const availableDenominations = [2000, 5000, 10000, 20000, 50000, 100000];

  const roundedTotalSelectedPrice = Math.ceil(totalSelectedPrice / 1000) * 1000;

  if (providedMoney < roundedTotalSelectedPrice) {
    displayOutput("Insufficient funds. Please provide more money.");
  } else {
    const change = providedMoney - roundedTotalSelectedPrice;

    const changeDenominations = [];
    let remainingChange = change;
    for (let denomination of availableDenominations.reverse()) {
      const count = Math.floor(remainingChange / denomination);
      if (count > 0) {
        changeDenominations.push(`${count}x Rp${denomination.toLocaleString()}`);
        remainingChange %= denomination;
      }
    }

    if (changeDenominations.length > 0) {
      displayOutput(`Kembalian: ${changeDenominations.join(", ")}`);
      setTimeout(() => {
        displayOutput("Transaction successful. Enjoy your items!");
      }, 2000);
      setTimeout(() => {
        resetVendingMachine();
      }, 3000);
    } else {
      displayOutput("Transaction successful. Enjoy your items!");
      setTimeout(() => {
        resetVendingMachine();
      }, 2000);
    }
  }
}

function cancelTransaction() {
  const providedMoney = parseFloat(document.getElementById("money").value);

  if (providedMoney > 0) {
    displayOutput(`Transaction canceled. Returning Rp${providedMoney.toLocaleString()}`);
    setTimeout(() => {
      resetVendingMachine();
    }, 2000);
  } else {
    resetVendingMachine();
  }
}

function resetVendingMachine() {
  document.getElementById("money").value = "";
  document.getElementById("output").innerText = "";
  document
    .getElementById("selectedItemsList")
    .getElementsByTagName("ul")[0].innerHTML = "";
  displayChangeStockOutput();
}

function displayOutput(message) {
  document.getElementById("output").innerText = message;
}
