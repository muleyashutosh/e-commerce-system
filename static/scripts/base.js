NProgress.configure({ showSpinner: false });
// debugger;
const { MDCRipple } = mdc.ripple;
const { MDCTooltip } = mdc.tooltip;

const { MDCDialog } = mdc.dialog;

const dialogEl = document.querySelector(".mdc-dialog");
const dialog = new MDCDialog(dialogEl);

const tooltips = [].map.call(
  document.querySelectorAll(".mdc-tooltip"),
  (el) => {
    return new MDCTooltip(el);
  }
);

const iconRipples = [].map.call(
  document.querySelectorAll(".mdc-icon-button"),
  (el) => {
    const ripple = new MDCRipple(el);
    ripple.unbounded = true;
    return ripple;
  }
);

const tooltipsCleanup = () => {
  tooltips.map(({ root }) => {
    if (
      root.classList.contains("mdc-tooltip--showing") ||
      root.classList.contains("mdc-tooltip--hide")
    ) {
      root.classList.remove("mdc-tooltip--showing");
      root.classList.remove("mdc-tooltip--hide");
    }
  });
};

setInterval(tooltipsCleanup, 25);

$(() => {
  const floatingSearchToggle = () => {
    const searchfield = $("#searchfield");
    // console.log(searchfield.hasClass('floating-search'))
    if (searchfield.hasClass("floating-search")) {
      searchfield.slideUp(100);
      console.log(searchfield.attr("style"));
      searchfield.attr("style", "");
    } else {
      searchfield.slideDown(50).css("display", "flex");
    }
    searchfield.toggleClass("floating-search");
  };

  $(".search-icon-button").on("click", floatingSearchToggle);

  $("#dropbtn .mdc-icon-button__touch").click(function () {
    $("#drop-content").slideToggle(200);
  });

  $("#search").focusin(function () {
    $("#category").css("border", "2.5px solid #fdc100");
    $("#category").css("border-right", "none");
    $("#search").css("border-top", "2.5px solid #fdc100");
    $("#search").css("border-bottom", "2.5px solid #fdc100");
  });
  $("#search").focusout(function () {
    $("#category").css("border", "none");
    $("#search").css("border", "none");
  });
  $("#category").focusin(function () {
    $("#search").css("border", "2.5px solid #fdc100");
    $("#search").css("border-left", "none");
    $("#search").css("border-right", "none");
    $("#category").css("border", "2.5px solid #fdc100");
    $("#category").css("border-right", "none");
  });

  window.onclick = function (e) {
    if (
      !e.target.matches("#dropbtn") &&
      !e.target.matches("#drop-btn") &&
      !e.target.matches("#drop-btn .mdc-icon-button__touch")
    ) {
      $("#drop-content").slideUp();
    }
  };

  $("#category").change(function () {
    // console.log('resizing')
    $("#resizerOption").html($("#category option:selected").text());
    // console.log($('#resizerOption').width())
    $("#category").width($("#resizerSelect").width());
  });

  $(".logout").click(() => {
    dialog.open();
  });

  $(".logout_button").click(() => {
    const a = document.createElement("a");
    a.href = "/logout";
    a.style = "display: none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
});
