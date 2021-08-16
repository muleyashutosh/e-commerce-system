const { MDCCheckbox } = mdc.checkbox;
const { MDCFormField } = mdc.formField;
const { MDCRadio } = mdc.radio;
const { MDCList } = mdc.list;
const { MDCDrawer } = mdc.drawer;

const selector = ".mdc-button, .mdc-icon-button, .mdc-card__primary-action";
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

$(document).ready(function () {
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

  document.getElementById("reset").addEventListener("click", function (event) {
    document.getElementById("filter").reset();
    return false;
  });

  const filterRipples = [].map.call(
    document.querySelectorAll(".filter-button"),
    (el) => {
      new MDCRipple(el);
    }
  );

  const initialize_button_Ripples = () => {
    const ripples = [].map.call(
      document.querySelectorAll(".addToCart"),
      (el) => {
        new MDCRipple(el);
      }
    );
  };
  initialize_button_Ripples();

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
    $.ajax({
      method: "post",
      url: "/api/getproducts",
      data: {
        search: query,
        category: category,
      },
      success: callback,
    });
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
        return `${prev}<div class='grid-item mdc-elevation--z2' id='${item["prodID"]}'>
                            <img src="${item["img"]}" alt="">
                            <div>${item["prodName"]}</div>
                            <div class='priceTag'>&#x20B9; ${item["minPrice"]}.00</div>
                            <span class="addCartButtonContainer">
                                <button class="addToCart mdc-button mdc-button--raised">
                                    <span class="mdc-button__ripple"></span>
                                    <i class="material-icons mdc-button__icon" aria-hidden="true">
                                        add_shopping_cart
                                    </i>
                                    <span class="mdc-button__label">Add to Cart</span>
                                </button>
                            </span>
                        </div>`;
      }, "");
      $(".noItemsFound").remove();
      gridContainer.empty();
      gridContainer.append(html);
      $(".pageswitcher").hide();

      initialize_button_Ripples();
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
      QuerySearch(
        searchInput.val().trim(),
        $("#category").val(),
        renderProducts
      );
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
  filterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    NProgress.start();
    const formData = new FormData(filterForm);
    const body = JSON.stringify(Object.fromEntries(formData));
    fetchFilteredProducts(body).then((data) => {
      renderProducts(data);
    });
  });

  const redirectToProductPage = (e) => {
    const url = e.target.getAttribute("data-redirect");
    window.location = url;
  };

  $(".mdc-card__primary-action").on("click", redirectToProductPage);
});
