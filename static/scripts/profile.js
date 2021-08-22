const fabRipple = new MDCRipple(document.querySelector(".mdc-fab"));

var checkc = true,
  checku = true;
window.onload = function () {
  $("#dropbtn").prop("click", "null").off("click");
  $("#drop-btn").removeClass("profile");

  if (payinfo.cardName === "None") {
    document.getElementById("acctname").value = "";
  } else {
    document.getElementById("acctname").value = payinfo.cardName;
  }
  if (payinfo.bankName === "None") {
    document.getElementById("bname").value = "";
  } else {
    document.getElementById("bname").value = payinfo.bankName;
  }
  if (payinfo.cardNum === "None") {
    document.getElementById("cardnum").value = "";
  } else {
    document.getElementById("cardnum").value = payinfo.cardNum;
  }
  if (payinfo.cvv === "None") {
    document.getElementById("cvv").value = "";
  } else {
    document.getElementById("cvv").value = payinfo.cvv;
  }
  if (payinfo.expDate === "None") {
    document.getElementById("expdate").value = "";
  } else {
    document.getElementById("expdate").value = payinfo.expDate;
  }
  if (payinfo.upiID === "None") {
    document.getElementById("upiid").value = "";
  } else {
    document.getElementById("upiid").value = payinfo.upiID;
  }
  if (user.address === "None") {
    document.getElementById("add").value = "";
  } else {
    document.getElementById("add").value = user.address;
  }
  if (user.state === "None") {
    document.getElementById("state").value = "";
  } else {
    document.getElementById("state").value = user.state;
  }
  if (user.pinCode === "None") {
    document.getElementById("pcode").value = "";
  } else {
    document.getElementById("pcode").value = user.pinCode;
  }
  if (user.city === "None") {
    document.getElementById("city").value = "";
  } else {
    document.getElementById("city").value = user.city;
  }

  window.onclick = function (e) {
    // console.log(e.target)
    if (
      !e.target.matches("#dropbtn1") &&
      !e.target.matches("#dropbtn1 .mdc-fab__touch")
    ) {
      if ($("#dropbtn1").attr("open")) {
        $("#drop-content1").fadeOut(100);
        $("#dropbtn1").attr("open", false);
        $("#dropbtn1").attr("close", true);
      }
      // $("#dropbtn1 .mdc-fab__icon").text("add");
    }
  };
};

$("#dropbtn1 .mdc-fab__touch").click(function () {
  if ($("#dropbtn1").attr("open")) {
    $("#dropbtn1").attr("open", false);
    $("#dropbtn1").attr("close", true);
    $("#drop-content1").fadeOut(100);
  } else {
    $("#dropbtn1").attr("open", true);
    $("#dropbtn1").attr("close", false);
    $("#drop-content1").fadeIn(100).css("display", "flex");
  }
  return false;
});

function Card(id) {
  document.getElementById("status").style.display = "none";
  if (id == "card") {
    document.getElementById("Card").style.display = "";
    for (i = 0; i < 2; i++) {
      document.getElementById("Card").getElementsByClassName("input2a")[
        i
      ].required = true;
      document.getElementById("Card").getElementsByClassName("input2b")[
        i
      ].required = true;
    }
    document.getElementById("cvv").required = true;
    document.getElementById("card").style.display = "none";
    if (document.getElementById("UPI").style.display != "none") {
      document.getElementById("addpay").style.display = "none";
      document.getElementById("paymentseparator").style.display = "block";
    }
  } else if (id == "upi") {
    if (checkc) {
      for (i = 0; i < 1; i++) {
        document.getElementById("UPI").getElementsByClassName("input2a")[
          i
        ].required = true;
      }
      document.getElementById("upi").style.display = "none";
    }
    document.getElementById("UPI").style.display = "";
    if (document.getElementById("Card").style.display != "none") {
      document.getElementById("addpay").style.display = "none";
      document.getElementById("paymentseparator").style.display = "block";
    }
  }
}
function Close(id) {
  if (id == "Card") {
    t1 = true;
    for (i = 0; i < 2; i++) {
      var x = document.getElementById("Card").getElementsByClassName("input2a")[
        i
      ];
      var y = document.getElementById("Card").getElementsByClassName("input2b")[
        i
      ];
      x.required = false;
      y.required = false;
      x.value = "";
      y.value = "";
    }
    document.getElementById("cvv").required = false;
    document.getElementById("cvv").value = "";
    document.getElementById("Card").style.display = "none";
    document.getElementById("card").style.display = "";
  } else {
    t2 = true;
    document.getElementById("UPI").style.display = "none";
    for (i = 0; i < 1; i++) {
      var y = document.getElementById("UPI").getElementsByClassName("input2a")[
        i
      ];
      y.required = false;
      y.value = "";
    }
    document.getElementById("upi").style.display = "";
  }
  document.getElementById("addpay").style.display = "";
  document.getElementById("paymentseparator").style.display = "none";
  if (
    document.getElementById("Card").style.display == "none" &&
    document.getElementById("UPI").style.display == "none"
  ) {
    document.getElementById("status").style.display = "";
  }
}
function showPass() {
  var x = document.getElementById("pwd");
  var eye = document.getElementById("eye");
  if (x.type === "password") {
    x.type = "text";
    eye.src =
      "https://ik.imagekit.io/milyzn5unt/e-commerce-system/showPassSelected_Z472MnFZm.svg";
  } else {
    x.type = "password";
    eye.src =
      "https://ik.imagekit.io/milyzn5unt/e-commerce-system/showPassNormal_hI4WkY3i2z.svg";
  }
}
