function buttonOperators(value) {
  switch (value) {
    case "plus":
      if (
        document.getElementById("input").value.substr(-1, 1) !== "-" &&
        document.getElementById("input").value.substr(-1, 1) !== "+" &&
        document.getElementById("input").value.substr(-1, 1) !== "/" &&
        document.getElementById("input").value.substr(-1, 1) !== "x" &&
        document.getElementById("input").value !== ""
      )
        document.getElementById("input").value = `${
          document.getElementById("input").value
        }+`;
      else if (document.getElementById("input").value !== "") {
        document.getElementById("input").value = `${document
          .getElementById("input")
          .value.slice(0, -1)}+`;
      } else {
        document.getElementById("input").value = `0+`;
      }
      break;
    case "sub":
      if (
        document.getElementById("input").value.substr(-1, 1) !== "-" &&
        document.getElementById("input").value.substr(-1, 1) !== "+" &&
        document.getElementById("input").value.substr(-1, 1) !== "/" &&
        document.getElementById("input").value.substr(-1, 1) !== "x" &&
        document.getElementById("input").value !== ""
      )
        document.getElementById("input").value = `${
          document.getElementById("input").value
        }-`;
      else if (document.getElementById("input").value !== "") {
        document.getElementById("input").value = `${document
          .getElementById("input")
          .value.slice(0, -1)}-`;
      } else {
        document.getElementById("input").value = `0-`;
      }
      break;
    case "divider":
      if (
        document.getElementById("input").value.substr(-1, 1) !== "-" &&
        document.getElementById("input").value.substr(-1, 1) !== "+" &&
        document.getElementById("input").value.substr(-1, 1) !== "/" &&
        document.getElementById("input").value.substr(-1, 1) !== "x" &&
        document.getElementById("input").value !== ""
      )
        document.getElementById("input").value = `${
          document.getElementById("input").value
        }/`;
      else if (document.getElementById("input").value !== "") {
        document.getElementById("input").value = `${document
          .getElementById("input")
          .value.slice(0, -1)}/`;
      } else {
        document.getElementById("input").value = `0/`;
      }
      break;
    case "multiply":
      if (
        document.getElementById("input").value.substr(-1, 1) !== "-" &&
        document.getElementById("input").value.substr(-1, 1) !== "+" &&
        document.getElementById("input").value.substr(-1, 1) !== "/" &&
        document.getElementById("input").value.substr(-1, 1) !== "x" &&
        document.getElementById("input").value !== ""
      )
        document.getElementById("input").value = `${
          document.getElementById("input").value
        }x`;
      else if (document.getElementById("input").value !== "") {
        document.getElementById("input").value = `${document
          .getElementById("input")
          .value.slice(0, -1)}x`;
      } else {
        document.getElementById("input").value = `0x`;
      }
      break;
  }
}

function buttonProduct(value) {
  document.getElementById("input").value = `${
    document.getElementById("input").value
  }${value}`;
}

function equal() {
  if (
    document.getElementById("input").value.substr(-1, 1) !== "-" &&
    document.getElementById("input").value.substr(-1, 1) !== "+" &&
    document.getElementById("input").value.substr(-1, 1) !== "/" &&
    document.getElementById("input").value.substr(-1, 1) !== "x" &&
    document.getElementById("input").value !== ""
  ) {
    const value = document.getElementById("input").value.split("+");
    var total = 0;
    for (i = 0; value.length > i; i++) {
      total += parseInt(value[i]);
    }
    document.getElementById("input").value = `${total}`;
  }
}
