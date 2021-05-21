NProgress.configure({ showSpinner: false });
const { MDCFormField } = mdc.formField;
const { MDCRadio } = mdc.radio;
const { MDCSnackbar } = mdc.snackbar;

const radios = [].map.call(document.querySelectorAll(".mdc-radio"), (el) => {
  return new MDCRadio(el);
});

const formFields = [].map.call(
  document.querySelectorAll(".mdc-form-field"),
  (el) => {
    return new MDCFormField(el);
  }
);

formFields.map((el, index) => {
  el.input = radios[index];
});

const snackbar = new MDCSnackbar(document.querySelector(".mdc-snackbar"));

const showForm = (id) => {
  if (id === "login") {
    var curr = "login";
    var other = "signup";
    document.getElementById(other + "-btn").style.boxShadow =
      "inset 10px -10px 5px 0px #888888";
    document.getElementById(curr + "-btn").style.boxShadow = "none";
    document.getElementById("forms").style.transform = "translateX(-50%)";
  } else {
    var curr = "signup";
    var other = "login";
    document.getElementById(other + "-btn").style.boxShadow =
      "inset -10px -10px 5px 0px #888888";
    document.getElementById(curr + "-btn").style.boxShadow = "none";
    document.getElementById("forms").style.transform = "translateX(0%)";
  }
  // document.getElementById(curr).style.display = 'block';
  document.getElementById(curr + "-btn").style.backgroundColor = "#e1e6e2";
  document.getElementById(curr + "-btn").style.fontWeight = "bold";
  document.getElementById(other + "-btn").style.backgroundColor = "#a4a6a6";
  // document.getElementById(other).style.display = 'none';
  document.getElementById(other + "-btn").style.fontWeight = "normal";
  document.getElementById("error1").style.display = "none";
};

const showPass = () => {
  var x = document.getElementById("passIn");
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
};

const hide = () => {
  document.getElementById("error").style.display = "none";
  document.getElementById("error1").style.display = "none";
};

const checker2 = (x) => {
  x.style.border = "2px solid #f2a305";
  x.style.transform = "scale(1.03,1.03)";
  var label = document.getElementById(x.id + "Lab");
  // console.log(x.style.transform)
  label.style.zIndex = 1;
  label.style.fontWeight = "bold";
  label.style.top = "-15px";
  label.style.color = "#f2a305";
  label.style.fontSize = "14px";
};

const checker1 = (x) => {
  if (x.value == "") {
    x.style.border = "2px solid #3f3f3f";
    x.style.transform = "scale(1,1)";
    var label = document.getElementById(x.id + "Lab");
    label.zIndex = "-1";
    label.style.color = "#999999";
    label.style.fontWeight = "normal";
    label.style.top = "5px";
  } else if (!x.checkValidity()) {
    x.style.transform = "scale(1.05,1.05)";
    x.style.border = "2px solid #d32710";
    var label = document.getElementById(x.id + "Lab");
    label.style.zIndex = 1;
    label.style.color = "#d32710";
    label.style.fontWeight = "bold";
    label.style.top = "-15px";
    label.style.fontSize = "14px";
  } else if (x.checkValidity()) {
    x.style.border = "2px solid #3f3f3f";
    var label = document.getElementById(x.id + "Lab");
    label.style.color = "#3f3f3f";
    label.style.transform = "scale(1.03,1.03)";
  }
};

const userRadioInputs = document.querySelectorAll(".userRadio");
const orgName = document.getElementById("orgName");
const orgInput = document.getElementById("orgInput");

userRadioInputs.forEach((el) => {
  el.addEventListener("change", (event) => {
    const target = event.target;
    if (target.id === "custoption") {
      orgName.style.display = "none";
      orgInput.required = false;
      orgInput.disabled = true;
    } else {
      orgName.style.display = "block";
      orgInput.required = true;
      orgInput.disabled = false;
    }
  });
});

const fetchLoginRoute = async (body) => {
  const data = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*",
    },
    body: body,
  });
  const resp = await data.json();
  return resp;
};

const fetchRegisterRoute = async (body) => {
  const data = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  });
  const resp = await data.json();
  return resp;
};

const onSignIn = (event) => {
  NProgress.start();
  event.preventDefault();

  const loginForm = document.querySelector("#loginform");
  const data = new FormData(loginForm);
  const body = JSON.stringify(Object.fromEntries(data));
  const loginUser = data.get("loginUser");

  fetchLoginRoute(body).then((data) => {
    const { status } = data;
    switch (status) {
      case "verified": {
        loginUser === "customer"
          ? window.location.replace("/Customerhome")
          : window.location.replace("/sellerHome");
        break;
      }

      case "User Not Found": {
        const invalidUserNameMsg = document.querySelector("#error");
        invalidUserNameMsg.style.display = "block";
        break;
      }

      case "Invalid Credentials": {
        const invalidUserNameMsg = document.querySelector("#error");
        invalidUserNameMsg.style.display = "block";
        break;
      }

      default: {
        snackbar.open();
      }
    }
    NProgress.done();
  });
};

const OnRegister = (event) => {
  NProgress.start();
  event.preventDefault();

  const signupForm = document.querySelector("#signupform");
  const data = new FormData(signupForm);
  const body = JSON.stringify(Object.fromEntries(data));
  const user = data.get("user");
  const error1 = document.querySelector("#error1");
  fetchRegisterRoute(body).then((data) => {
    const { status } = data;
    NProgress.done();
    switch (status) {
      case "User already exists": {
        error1.style.display = "block";
        break;
      }

      case "User registered successfully": {
        user === "customer"
          ? window.location.replace("/Customerhome")
          : window.location.replace("/sellerHome");
        break;
      }

      default: {
        snackbar.open();
      }
    }
  });
};
