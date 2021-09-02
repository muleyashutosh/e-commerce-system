const { MDCSnackbar } = mdc.snackbar;

const onload = async (body) => {
  const data = await fetch(`/api/productDetail/${id}`);
  const resp = await data.json();
  return resp;
};

const addedSnackbar = new MDCSnackbar(
  document.querySelector(".added-snackbar")
);

const addToCart = async (event, id) => {
  try {
    NProgress.start();
    const button = event.path[1];
    button.disabled = true;
    const resp = await fetch(`/api/addToCart/${id}`, {
      method: "POST",
    });
    const data = await resp.json();
    // button.disabled = false;
    NProgress.done();
    addedSnackbar.open();
    button.disabled = true;
    console.log(data);
  } catch (e) {
    console.log(e);
  }
};
let product = [];
const gridContainer = $(".grid-container");
onload().then((resp) => {
  product = resp.data[0];
  console.log(product);

  let desc = product["prodDesc"].split(". ").reduce((prev, item) => {
    return `${prev}<li>${item}</li>`;
  }, "");
  const html = `<div class='grid-item' id='${product["prodID"]}'>
                    <img src="${product["img"]}" alt="">
                    <div class='details'>
                      <div class='title'>
                        ${product["prodName"]}
                      </div>
                      <div class='priceTag'>
                      &#x20B9;
                        ${product["minPrice"]}
                      </div>   
                      <div>
                      <ul>
                        ${desc}
                      </ul>
                      </div>
                      <div class = 'buttonsContainer' >
                        <button class="mdc-button mdc-button--raised button">
                          <span class="mdc-button__ripple"></span>
                          <i class="material-icons mdc-button__icon" aria-hidden="true">
                              bolt
                          </i>
                          <span class="mdc-button__label">BUY NOW</span>
                        </button>
                        <button class="mdc-button mdc-button--raised button addToCart" onClick=addToCart(event,'${
                          product.prodID
                        }') ${product.inCart ? "disabled" : ""}>
                          <span class="mdc-button__ripple"></span>
                          <i class="material-icons mdc-button__icon" aria-hidden="true">
                              add_shopping_cart
                          </i>
                          <span class="mdc-button__label">Add To Cart</span>
                        </button>
                      </div>
                    </div>                 
                </div>`;

  gridContainer.append(html);

  [].map.call(document.querySelectorAll(".mdc-button"), (el) => {
    new MDCRipple(el);
  });
});
