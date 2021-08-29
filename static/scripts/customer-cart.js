const addButton = document.querySelectorAll(".add-button");
const minusButton = document.querySelectorAll(".minus-button");
const deleteButton = document.querySelectorAll(".delete-button");
const itemsList = document.querySelector(".items-list");
const subtotalValue = document.querySelector(".subtotal-amount");
const subtotalHeading = document.querySelector(".subtotal-heading");

const iconButtonRipple = new MDCRipple(
  document.querySelector(".mdc-icon-button")
);
iconButtonRipple.unbounded = true;

const updateQuantity = async (quantity, id) => {
  try {
    const resp = await fetch(`/api/editCart/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity,
      }),
    });
    const data = await resp.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};

const increaseQuantity = async (event) => {
  const prodID =
    event.target.parentElement.parentElement.parentElement.parentElement.getAttribute(
      "data-prodid"
    );

  const quantityAdjust = event.target.parentElement.parentElement.parentElement;
  const quantityText = quantityAdjust.querySelector(".quantity--text");
  const minusButton = quantityAdjust.querySelector(".minus-button");
  // console.log(quantityText);
  const x = await updateQuantity(+quantityText.innerHTML + 1, prodID);
  quantityText.innerHTML = x.quantity;
  if (x.quantity > 1) {
    minusButton.disabled = false;
  }
  subtotalValue.innerHTML = `&#x20B9;${x.subtotal}.00`;
  console.log(x);
};

const decreaseQuantity = async (event) => {
  const quantityAdjust = event.target.parentElement.parentElement.parentElement;
  const quantityText = quantityAdjust.querySelector(".quantity--text");
  const minusButton = quantityAdjust.querySelector(".minus-button");
  let newValue = +quantityText.innerHTML - 1;
  if (newValue < 1) {
    newValue = 0;
  }
  const prodID =
    event.target.parentElement.parentElement.parentElement.parentElement.getAttribute(
      "data-prodid"
    );

  const x = await updateQuantity(newValue, prodID);
  quantityText.innerHTML = x.quantity;
  if (x.quantity === 1) {
    minusButton.disabled = true;
  }
  subtotalValue.innerHTML = `&#x20B9;${x.subtotal}.00`;
  console.log(x);
};

const removeFromCartAPICall = async (id) => {
  try {
    const resp = await fetch(`/api/removeFromCart/${id}`, {
      method: "DELETE",
    });
    const data = await resp.json();
    // console.log(data);
    return data;
  } catch (e) {
    console.log(e);
  }
};

const removeFromCart = async (event) => {
  const prodID =
    event.target.parentElement.parentElement.parentElement.getAttribute(
      "data-prodid"
    );
  console.log(prodID);
  const listElement = document.querySelector(
    `.list-item[data-prodid="${prodID}"]`
  );
  const x = await removeFromCartAPICall(prodID);
  console.log(x);
  subtotalValue.innerHTML = `&#x20B9;${x.subtotal}.00`;
  subtotalHeading.innerHTML = `Subtotal(${x.length} items):`;
  itemsList.removeChild(listElement);
};

if (addButton.length)
  addButton.forEach((x) => {
    x.addEventListener("click", increaseQuantity);
  });
if (minusButton.length)
  minusButton.forEach((x) => {
    x.addEventListener("click", decreaseQuantity);
  });
if (deleteButton.length)
  deleteButton.forEach((x) => {
    x.addEventListener("click", removeFromCart);
  });
