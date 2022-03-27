let itemCount = 0;
var dialog;  
var allProducts = [];
var displayProducts = ["Select Item"];

var products = ["Select Item"];

var totalPrice = 0;
var totalDiscount = 0;
var totalDiscountedPrice = 0;

var billItems = []

var newBill;

var billExists = false;

var docId;

function docBillReady() {
  preHide();
  allProducts = dbProducts;
  createNewBill();
  bindSelect();
}

function preHide() {
  $("#billSpinner").hide();
  $("#billStatusFail").hide();
  $("#billStatusSuccess").hide();
  $("#billStatusExists").hide();
  $("#billStatusInvalid").hide();
  $("#btnPrint").hide();
}

function createNewBill(){
  $("#billItems").empty();
  var date = new Date();
  document.getElementById("billDate").valueAsDate = date;
  var id = date.getTime();
  $("#billId").val(id);
  newBill = new bill(date.toDateString(), id, "", "", "", "", "", "", "", "", "");
  loadPrdouctsDd();
  //calculateTotal();
}

function removeItem(id) {
  var itemName = $("#lbl-" + id).text();
  var temp = itemName.split("(");
  var sku = temp[1].replace(")", "");
  var prdIndex = billItems.findIndex((x) => x.sku == sku);
  billItems.splice(prdIndex, 1);
  $("#item-" + id).remove();
  calculateTotal();
}

function addItem(itemCount) {
  $("#div-popup-" + itemCount).removeAttr("style");
  var item = $("#lbl-" + itemCount).text();
  if (!(item == "" || item == undefined)) {
    createNewLineItem();
  } else {
  }
}

function editItem(id) {
  $("#divItemsList-" + id).show();
  $("#divlbl-" + id).hide();
}

function setItem(id) {
  var itemName = $("#ip-" + id).val();
  if (!(itemName == "" || itemName == undefined)) {
    $("#lbl-" + id).text(itemName);
    $("#divItemsList-" + id).hide();
    $("#divlbl-" + id).show();
    $("#addItem-" + id).show();
  }
}

function calculateTotal() {
  if (billItems.length > 0) {
    totalPrice = 0;
    totalDiscount = 0;
    totalDiscountedPrice = 0;
    billItems.forEach((doc) => {
      var qty = 1;
      if (doc.qty != undefined) {
        qty = doc.qty;
      }
      totalPrice = parseFloat(totalPrice) + parseFloat(doc.price) * qty;
      totalDiscount = parseFloat(totalDiscount) + parseFloat(doc.percent);
    });
    totalPrice = parseFloat(totalPrice).toFixed(2);
    totalDiscount = (
      parseFloat(totalDiscount).toFixed(2) / billItems.length
    ).toFixed(2);
    totalDiscountedPrice = (
      ((100 - parseFloat(totalDiscount).toFixed(2)) * parseFloat(totalPrice)) /
      100
    ).toFixed(2);
  }

  $("#totalPrice").text(totalPrice);
  $("#totalDiscountPercent").text(totalDiscount);
  $("#totalDiscountedPrice").text(totalDiscountedPrice);
}

function createNewLineItem() {
  $("#addItem-" + itemCount).hide();
  $("#removeItem-" + itemCount).show();
  $("#divlbl-" + itemCount).show();
  $("#divItemsList-" + itemCount).hide();
  createItem();
}

function loadPrdouctsDd() {
  var loadPrd = setInterval(function () {
    if (!allProducts.length == 0) {
      allProducts.forEach((doc) => {
        if (doc.name != undefined && doc.sku != undefined) {
          displayProducts.push(doc.name + " (" + doc.sku + ")");
          var item = new itemBill(
            doc.sku,
            doc.name,
            doc.price,
            doc.percent,
            doc.discountPrice,
            1
          );
          products.push(item);
        }
      });
      $("#selectItemsList").select2({
        data: displayProducts,
      });
      clearInterval(loadPrd);
    }
  }, 500);
}

function bindSelect() {
  $("#selectItemsList").on("select2:select", function (e) {
    var selectedItem = $("#select2-selectItemsList-container").text();
    var temp = selectedItem.split("(");
    var sku = temp[1].replace(")", "");
    var prd = dbProducts.find((x) => x.sku == sku);
    prd.qty = 1;
    billItems.push(prd);
    createItem(prd);
    calculateTotal();
  });
}

function createItem(item) {
  if(item!=undefined){
    var sku = item.sku;
      $("#billItems").append('<tr id='+sku+'>'+
              '<td scope="row" class="bill-border col-md-1">'+billItems.length+'</td>'+
              '<td scope="col" class="bill-border col-md-6">'+
                      '<span id="lbl-'+sku+'">'+item.name+'</span>'+
              '</td>'+
              '<td scope="col" class="bill-border col-md-1">'+
                  '<button id="removeItem-'+sku+'" class="btn btn-primary btnAddItem remove-'+sku+'" onClick="removeItem('+sku+')">'+
                      '<img class="btnAddIcon" src="https://img.icons8.com/fluency/48/000000/minus.png" />'+
                  '</button>'+
              '</td>'+
              '<td scope="col" class="bill-border col-md-1">'+
                  '<input type="text" class="ip-qty input" id="qty-'+sku+'" value='+item.qty+'>'+
              '</td>' +
              '<td scope="col" class="bill-border col-md-2">&#8377; '+
                  '<span id="lblOprice-'+sku+'">'+item.price+'</span>'+
              '</td>'+
              '<td scope="col" class="bill-border col-md-1">'+
                  '<input type="text" class="ip-qty input" id="ipDiscount-'+sku+'" value='+item.percent+'> <span> %</span>'+
              '</td>'+
              '<td scope="col" class="bill-border col-md-2"> &#8377; '+
                '<span id="lblDprice-'+sku+'">'+item.discPrice+'</span>'+
              '</td>'+
            '</tr>'
      );

      $("#qty-" + sku).keypress(function (e) {
        debugger;
        var qty = $("#qty-"+sku).val();
        if(qty != undefined && qty != ""){
          //var selectedItem = e.target.value;
          var id = e.target.getAttribute("id").split("-");
          var sku = id[1];
          var prdIndex = billItems.findIndex(x=>x.sku==sku);
          var prd = bilItems[prdIndex];
          prd.qty = parseInt(qty);
          billItems.splice(prdIndex,1,prd);
          calculateTotal();
        }
      });
  }
}

function fillBill() {
  const totalPrice = $("#totalPrice").text();
  const totalDiscount = $("#totalDiscountPercent").text();
  const billAmount = $("#totalDiscountedPrice").text();
  const paid = true;
  const employee = $("#spName").val();

  newBill.items = billItems;
  newBill.totalPrice = parseFloat(totalPrice).toFixed(2);
  newBill.totalDiscount = parseFloat(totalDiscount).toFixed(2);
  newBill.billAmount = parseFloat(billAmount).toFixed(2);
  newBill.paid = paid;
  newBill.employee = employee;
}

function validateBill(bill) {
  if (
    bill.customer == undefined ||
    bill.customerId == undefined ||
    bill.customerId == "" ||
    bill.items.length == 0 ||
    bill.totalPrice == undefined ||
    bill.totalPrice == "" ||
    bill.totalDiscount == undefined ||
    bill.totalDiscount == "" ||
    bill.billAmount == undefined ||
    bill.billAmount == ""
  ) {
    return false;
  }
  return true;
} 


function saveBill() {
  $("#billSpinner").show();
  fillBill();
  debugger;
  if (validateBill(newBill)) {
    if (billExists) {
      updateDb();
    } else {
      saveDb();
    }
  } else {
    $("#billStatusInvalid").show();
    setTimeout(function () {
      $("#billStatusInvalid").hide();
    }, 5000);
  }
}

function saveDb() {
  debugger;
  db.collection("bills")
    .add({
      billDate: newBill.billDate,
      billId: newBill.billId,
      customerId: newBill.customerId,
      customerName: newBill.customer.fname,
      customer: newBill.customer,
      items: newBill.items,
      totalPrice: newBill.totalPrice,
      totalDiscount: newBill.totalDiscount,
      billAmount: newBill.billAmount,
      paid: newBill.paid,
      employee: newBill.employee,
    })
    .then((snapshot) => {
      debugger;
      $("#billStatusSuccess").show();
      setTimeout(function () {
        $("#billStatusSuccess").hide();
      }, 5000);
      $("#btnSave").hide();
      $("#btnPrint").show();
      $("#billSpinner").hide();
    });
}

function updateDb() {
  debugger;
  db.collection("bills")
    .doc(docId)
    .set(
      {
        billDate: newBill.billDate,
        billId: newBill.billId,
        customerId: newBill.customerId,
        customerName: newBill.customer.fname,
        customer: newBill.customer,
        items: newBill.items,
        totalPrice: newBill.totalPrice,
        totalDiscount: newBill.totalDiscount,
        billAmount: newBill.billAmount,
        paid: newBill.paid,
        employee: newBill.employee,
      },
      {
        merge: true,
      }
    )
    .then((snapshot) => {
      debugger;
      $("#billStatusSuccess").show();
      setTimeout(function () {
        $("#billStatusSuccess").hide();
      }, 5000);
      $("#btnSave").hide();
      $("#btnPrint").show();
      $("#billSpinner").hide();
    });
}

function printBill() {
  debugger;
  var tempBill = JSON.stringify(newBill);
  window.localStorage.setItem("bill", tempBill);

  window.open("./bill-pdf.html", "_blank");
  return false;
}

function findBillCustomer() {
  var phone = $("#phone").val();
  $("#billSpinner").show();
  if (phone.length > 1) {
    db.collection("customers")
      .where("phone1", "==", phone)
      .get()
      .then((snapshot) => {
        $("#billSpinner").hide();
        if (snapshot.docs.length == 0) {
          $("#billStatusFail").show();
          setTimeout(function () {
            $("#billStatusFail").hide();
          }, 5000);
        } else {
          snapshot.docs.forEach((doc) => {
            var cus = doc.data();
            console.log("customerId => " + cus.id);
            setBillCustomer(cus);
          });
        }
      });
  }
}


function findBill() {
  var billId = $("#billId").val();
  $("#billSpinner").show();
  billId = parseInt(billId);
  if (billId != undefined && billId > 1) {
    db.collection("bills")
      .where("billId", "==", billId)
      .get()
      .then((snapshot) => {
        $("#billSpinner").hide();
        if (snapshot.docs.length == 0) {
          $("#billStatusInvalid").show();
          setTimeout(function () {
            $("#billStatusInvalid").hide();
          }, 5000);
        } else {
          snapshot.docs.forEach((doc) => {
            docId = doc.id;
            var bill = doc.data();
            debugger;
            setBill(bill);
            billExists = true;
          });
        }
      });
  }
}

function setBill(bill) {
  debugger;
  newBill = bill;
  newBill.billDate = new Date(bill.billDate);
  document.getElementById("billDate").valueAsDate = newBill.billDate;
  $("#billId").val(bill.billId);
  $("#totalPrice").text(bill.totalPrice);
  $("#totalDiscountPercent").text(bill.totalDiscount);
  $("#totalDiscountedPrice").text(bill.billAmount);
  $("#spName").val();
  setBillCustomer(bill.customer);
  $("#billItems").empty();
  billItems = bill.items;
  billItems.forEach((item) => {
    createItem(item);
  });
}

function setBillCustomer(customer) {
  $("#customerId").val(customer.id);
  $("#fName").val(customer.fname);
  $("#lName").val(customer.lname);
  $("#email").val(customer.email);
  $("#phone").val(customer.phone1);
  $("#add1").val(customer.add1);
  $("#add2").val(customer.add2);
  $("#city").val(customer.city);
  $("#zip").val(customer.zip);
  $("#state").val(customer.state);

  $("#billStatusSuccess").show();
  setTimeout(function () {
    $("#billStatusSuccess").hide();
  }, 5000);
  newBill.customer = customer;
  newBill.customerId = customer.id;
}
