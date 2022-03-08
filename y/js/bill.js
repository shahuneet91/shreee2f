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

function docBillReady() {
  allProducts = dbProducts;
  createNewBill();
  createBillId();
}

function createBillId() {
  var date = new Date();
  document.getElementById("billDate").valueAsDate = new Date();
  var id = date.getTime();
  $("#billId").text(id);
}

function removeItem(id) {
  var itemName = $("#lbl-" + id).text();
  var temp = itemName.split("(");
  var sku = temp[1].replace(")", "");
  var prdIndex = billItems.findIndex((x) => x.sku == sku);
  billItems.splice(prdIndex,1)
  $("#item-"+id).remove();
  calculateTotal();
}

function addItem(itemCount) {
   $("#div-popup-"+itemCount).removeAttr("style");
   var item = $("#lbl-" + itemCount).text();
   if (!(item == "" || item == undefined)) {
     createNewLineItem();
   }else{
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
        var qty = 1
        if(doc.qty != undefined){
          qty = doc.qty;
        }
      totalPrice = parseFloat(totalPrice) + (parseFloat(doc.price) * qty);
      totalDiscount = parseFloat(totalDiscount) + parseFloat(doc.percent);
      
    });
    totalPrice = parseFloat(totalPrice).toFixed(2);
    totalDiscount = (parseFloat(totalDiscount).toFixed(2)/billItems.length).toFixed(2);
    totalDiscountedPrice = (((100-parseFloat(totalDiscount).toFixed(2)) * parseFloat(totalPrice)) / 100).toFixed(2);
  }
  
  $("#totalPrice").text(totalPrice);
  $("#totalDiscountPercent").text(totalDiscount);
  $("#totalDiscountedPrice").text(totalDiscountedPrice);
}

function createNewLineItem(){
  $("#addItem-" + itemCount).hide();
  $("#removeItem-" + itemCount).show();
  $("#divlbl-" + itemCount).show();
  $("#divItemsList-" + itemCount).hide();
  createItem();
  loadPrdouctsDd();
  bindSelect();
  $('#billItem').animate({scrollTop: $('#billItem').prop("scrollHeight")}, 1000);
}

function createNewBill(){
  debugger;
  $("#billItems").empty();
  createItem();
  loadPrdouctsDd();
  bindSelect();
  calculateTotal();
}

function loadPrdouctsDd(){
  var loadPrd = setInterval(function () {
    if (!allProducts.length == 0) {
      allProducts.forEach((doc) => {
        if (doc.name != undefined && doc.sku != undefined) {
          displayProducts.push(doc.name + " (" + doc.sku+")");
          var item = new billItem(
            doc.sku,
            doc.name,
            doc.price,
            doc.percent,
            doc.discountPrice,
            1,
          )
          products.push(item);
        }
      });
      $("#itemsList-"+ itemCount).select2({
        data: displayProducts,
      });
      clearInterval(loadPrd);
    }
  }, 500);
}

function bindSelect() {
  $("#itemsList-" + itemCount).on("select2:select", function (e) {
    var selectedItem = e.target.value;
    var id = e.target.getAttribute("id").split("-");
    var itemNum = id[1];

    var temp = selectedItem.split("(");
    var sku = temp[1].replace(")", "");

    $("#lbl-" + itemNum).text(selectedItem);
    $("#divlbl-" + itemNum).show();
    $("#divItemsList-" + itemNum).hide();

    var prd = dbProducts.find((x) => x.sku == sku);
    prd.qty = 1;
    billItems.push(prd);

    if (prd != undefined) {
      $("#lblOprice-" + itemNum).text(prd.price);
      $("#ipDiscount-" + itemNum).val(prd.percent);
      $("#lblDprice-" + itemNum).text(prd.discPrice);
      calculateTotal();
    }
    addItem(itemNum);
  });
}


function createItem() {
  itemCount = itemCount + 1;
  // $("#billItem").append(
  //   '<li id="item-' +
  //     itemCount +
  //     '">' +
  //     '<div class="row temp-border item" style="height: 40px;">' +
  //     '<div class="row col-md-7 address-search">' +
  //     '<div class="col-md-10" id="divlbl-' +
  //     itemCount +
  //     '">' +
  //     '<span id="lbl-' +
  //     itemCount +
  //     '" onClick="editItem(' +
  //     itemCount +
  //     ')" style="padding-left:5%;"></span>' +
  //     "</div>" +
  //     '<div class="col-md-10" id="divItemsList-' +
  //     itemCount +
  //     '" style="padding-left:5%;">' +
  //     '<select id="itemsList-' +
  //     itemCount +
  //     '" class="input" style="width:300px;">' +
  //     "</select>" +
  //     "</div>" +
  //     '<div class="col-md-1 div-qty" id="divQty">' +
  //     '<input type="text" class="ip-qty input" id="qty-' +
  //     itemCount +
  //     '">' +
  //     "</div>" +
  //     '<div class="col-md-1 div-action-btn" id="divbtn">' +
  //     '<button id="removeItem-' +
  //     itemCount +
  //     '" class="btn btn-primary btnAddItem remove-' +
  //     itemCount +
  //     '" onClick="removeItem(' +
  //     itemCount +
  //     ')">' +
  //     '<img class="btnAddIcon" src="https://img.icons8.com/fluency/48/000000/minus.png"/>' +
  //     "</button>" +
  //     "</div>" +
  //     "</div>" +
  //     '<div class="col-md-2 price">' +
  //     '<span>&#8377; <span id="lblOprice-' +
  //     itemCount +
  //     '">0</span></span>' +
  //     "</div>" +
  //     '<div class="col-md-1 price">' +
  //     '<input type="text" class="ip-qty input" id="ipDiscount-' +
  //     itemCount +
  //     '">' +
  //     ' %</span>' +
  //     "</div>" +
  //     '<div class="col-md-2 price">' +
  //     '<span>&#8377; <span id="lblDprice-' +
  //     itemCount +
  //     '">0</span></span>' +
  //     "</div>" +
  //     "</div>" +
  //     "</li>"
  // );



  $("#billItems").append('<tr id="item-'+itemCount+'">'+
          '<td scope="row" class="bill-border col-md-1">'+itemCount+'</td>'+
          '<td scope="col" class="bill-border col-md-6">'+
              '<div id="divlbl-'+itemCount+'">'+
                  '<span id="lbl-'+itemCount+'" onClick="editItem(itemCount)"></span>'+
              '</div>'+
              '<div id="divItemsList-'+itemCount+'">'+
                  '<select id="itemsList-'+itemCount+'" class="input bill-form-item">'+
                  '</select>'+
              '</div>'+
          '</td>'+
          '<td scope="col" class="bill-border col-md-1">'+
              '<button id="removeItem-'+itemCount+'" class="btn btn-primary btnAddItem remove-'+itemCount+'" onClick="removeItem(itemCount)">'+
                  '<img class="btnAddIcon" src="https://img.icons8.com/fluency/48/000000/minus.png" />'+
              '</button>'+
          '</td>'+
          '<td scope="col" class="bill-border col-md-1">'+
              '<input type="text" class="ip-qty input" id="qty-'+itemCount+'">'+
          '</td>' +
          '<td scope="col" class="bill-border col-md-2">&#8377; '+
              '<span id="lblOprice-'+itemCount+'">0</span>'+
          '</td>'+
          '<td scope="col" class="bill-border col-md-1">'+
              '<input type="text" class="ip-qty input" id="ipDiscount-'+itemCount+'">%</span>'+
          '</td>'+
          '<td scope="col" class="bill-border col-md-2"> &#8377; '+
             '<span id="lblDprice-'+itemCount+'">0</span>'+
          '</td>'+
        '</tr>'
  );

  $("#addItem-" + itemCount).hide();
  $("#removeItem-" + itemCount).hide();
  $("#divlbl-" + itemCount).hide();
  $("#qty-" + itemCount).val(1);

  $("#qty-" + itemCount).keypress(function (e) {
    var qty = $("#"+itemCount).val();
    $("#lbl-" + itemCount).text(qty);
    var prd = bilItems[id];
    prd.qty = qty;
    billItems.splice(itemCount,1,prd);
    calculateTotal();
  });
}

function billAction(){
  const billId = $("#billId").text();
  const billDate = $("#billDate").val();
  const customerName = $("#customerName").val();
  const customerAdd1 = $("#customerAdd1").val();
  const customerAdd2 = $("#customerAdd2").val();

  const totalPrice = $("#totalPrice").text();
  const totalDiscount = $("#totalDiscountPercent").text();
  const billAmount = $("#totalDiscountedPrice").text();
  const paid = true;
  const employee = $("#spName").val();

  newBill = new bill(
    billId,
    billDate,
    customerName,
    customerAdd1,
    customerAdd2,
    billItems,
    totalPrice,
    totalDiscount,
    billAmount,
    paid,
    employee
  );

}

function saveBill() {
  
  billAction();
  
  // db.collection("bills").add({
  //  billId : newBill.billId,
  //  billDate : newBill.billDate,
  //  customerName : newBill.customerName,
  //  customerAdd : newBill.customerAdd,
  //  items : newBill.billItems,
  //  totalPri : newBill.totalPrice,
  //  totalDisount : newBill.totalDiscount,
  //  billAmount : newBill.billAmount,
  //  paid : newBill.paid,
  //  employee : newBill.employee
  // });
}

function printBill(){
  saveBill();
  var tempBill = JSON.stringify(newBill);
  window.localStorage.setItem('bill',tempBill);

  window.open("./bill-pdf.html", "_blank");
  return false;
}


