const { MDCCheckbox } = mdc.checkbox;
const { MDCFormField } = mdc.formField;
const { MDCRadio } = mdc.radio;
const { MDCList } = mdc.list;
const { MDCDrawer } = mdc.drawer;

const selector = ".mdc-card__primary-action";
const ripples = [].map.call(document.querySelectorAll(selector), function (el) {
  return new MDCRipple(el);
});

const list = new MDCList(document.querySelector(".mdc-list"));
// list.wrapFocus = true;
const drawer = new MDCDrawer(document.querySelector(".mdc-drawer"));
const button = document.querySelector("#menu");
button.addEventListener("click", () => {
  drawer.open = !drawer.open;
});

const filterRipples = [].map.call(
  document.querySelectorAll(".filter-button"),
  (el) => {
    new MDCRipple(el);
  }
);

const checkboxes = [].map.call(
  document.querySelectorAll(".mdc-checkbox"),
  (el) => {
    return new MDCCheckbox(el);
  }
);

const formFieldsCheckboxes = [].map.call(
  document.querySelectorAll(".mdc-form-field-checkboxes"),
  (el) => {
    return new MDCFormField(el);
  }
);

formFieldsCheckboxes.map((el, index) => {
  el.input = checkboxes[index];
});

const radios = [].map.call(document.querySelectorAll(".mdc-radio"), (el) => {
  return new MDCRadio(el);
});

const formFieldsRadios = [].map.call(
  document.querySelectorAll(".mdc-form-field-radios"),
  (el) => {
    return new MDCFormField(el);
  }
);

formFieldsRadios.map((el, index) => {
  el.input = radios[index];
});

pages = $(".pageswitcher").children("a");
dot_count = 0;
for (x of pages) {
  if (x.text == "·") {
    dot_count++;
    x.style.display = "none";
  }
}
dots = 0;
for (x of pages) {
  if (x.text == "·" && dots < 5) {
    x.style.display = "";
    dots++;
  }
}
dots = 0;
for (x of pages.get().reverse()) {
  if (x.text == "·" && dots < 5) {
    x.style.display = "";
    dots++;
  }
}
// console.log(pages.get().reverse())

const QuerySearch = (query, category, callback) => {
  $.post(
    "/api/getproducts",
    {
      search: query,
      category: category,
    },
    callback
  );
};

const gridContainer = $(".grid-container");
var allproducts = gridContainer.contents();
const searchInput = $("#search");
const searchButton = $("#search-icon");
// console.log(allproducts)

const renderProducts = ({ status, data }) => {
  // console.log(re111s)
  if (status !== "OK") return;
  NProgress.done();
  if (data.length == 0) {
    // console.log('val ' + $("#search").val().trim() + ', data empty')
    var error =
      '<div class="noItemsFound"><h2>Oops, No Items matching your search were found!</h2><hr></div>';
    if (!$(".main-content").has(".noItemsFound").length)
      $(".main-content").append(error);
    $(".grid-container").empty();
  } else {
    // console.log('val ' + $("#search").val().trim() + ', res not empty')
    const html = data.reduce((prev, item) => {
      return `${prev}<div class="mdc-card">
        <div class="mdc-card__primary-action">
          <div
            class="mdc-card__media mdc-card__media--square"
            style="
              background-image: url(${item.img});
            "
            data-redirect="/productPage/${item.prodID}"
          ></div>
          <div class="mdc-card__ripple"></div>
        </div>
        <div class="mdc-card-wrapper__text-section">
          <div class="card__title">${item.prodName.substring(0, 45)}...</div>
        </div>
        <div class="mdc-card__actions">
          <div class="priceTag">&#x20B9;${item.minPrice}.00</div>
          <div class="mdc-card__action-icons">
            <button
              class="
                material-icons
                mdc-icon-button
                mdc-card__action mdc-card__action--icon
              "
              title="Share"
            >
              add_shopping_cart
            </button>
          </div>
        </div>
      </div>`;
    }, "");
    $(".noItemsFound").remove();
    gridContainer.empty();
    gridContainer.append(html);
    $(".pageswitcher").hide();
    $(".mdc-card__primary-action").on("click", redirectToProductPage);
  }
};

searchButton.click(function () {
  if (searchInput.val().trim() == "") {
    if (allproducts.length == 0) {
      // console.log('val empty, productslist empty')
      var error =
        '<div class="noItemsFound"><h2>Oops, No Items matching your search were found!</h2><hr></div>';
      gridContainer.empty();
      $(".main-content").append(error);
    } else {
      // console.log('val empty, productslist not empty')
      $(".noItemsFound").remove();
      if (!gridContainer.contents().length) gridContainer.append(allproducts);
      $(".pageswitcher").slideDown();
    }
  } else {
    NProgress.start();
    QuerySearch(searchInput.val().trim(), $("#category").val(), renderProducts);
  }
});

searchInput.keypress(function (e) {
  if (e.keyCode == 13) {
    $("#search-icon").click();
  }
});

const fetchFilteredProducts = async (body) => {
  const resp = await fetch("/api/filter", {
    headers: { "Content-Type": "application/json" },
    method: "post",
    body: body,
  });
  const data = resp.json();
  return data;
};

const filterForm = document.querySelector("#filter");
filterForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  NProgress.start();
  const formData = new FormData(filterForm);
  const body = JSON.stringify(Object.fromEntries(formData));
  const data = await fetchFilteredProducts(body);
  renderProducts(data);
  drawer.open = false;
});

const redirectToProductPage = (e) => {
  const url = e.target.getAttribute("data-redirect");
  // console.log(url);
  const a = document.createElement("a");
  a.href = url;
  a.style = "display: none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

$(".mdc-card__primary-action").on("click", redirectToProductPage);
