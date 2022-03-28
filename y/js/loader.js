

$(document).ready(function () {
  updateBillBody();
  //debugger;  
  //updateProductsBody();
  //updateCustomerBody();

});

function loadHead(){
  fetch("management-head.html")
    .then((response) => response.text())
    .then(
      (text) => {
        document.getElementById("head").innerHTML = text;
          docBillReady();
      }
    );
}

function updateBillBody(){
  fetch("bill-body.html")
    .then((response) => response.text())
    .then(
      (text) => {
        document.getElementById("body-contents").innerHTML = text;
          docBillReady();
      }
    );
}


function updateProductsBody() {
    fetch("product-body.html")
    .then((prdResponse) => prdResponse.text())
    .then((prdBodyTxt) => {
      document.getElementById("body-contents").innerHTML = prdBodyTxt;
      fetch("product-form.html")
      .then((prdForm) => prdForm.text())
      .then(
        (prdFormTxt) => {
          document.getElementById("add-product").innerHTML = prdFormTxt;
          fetch("product-grid.html")
          .then((gridResponse) => gridResponse.text())
          .then(
            (gridTxt) => {
                document.getElementById("product-table").innerHTML = gridTxt;
                productDocumentReady();
              }
          )
        }
      )
    })
}

function updateMasterBody(){
  fetch("master-body.html")
    .then((response) => response.text())
    .then(
      (text) => {
        document.getElementById("body-contents").innerHTML = text;
        docCatagoryReady();
        docBrandReady();
      }
    )
    
}


function updateCustomerBody(){
  fetch("customer.html")
    .then((response) => response.text())
    .then(
      (text) => {
        document.getElementById("body-contents").innerHTML = text;
        preLoadCustomer();
        bindPopup();
      }
    )
    
}
