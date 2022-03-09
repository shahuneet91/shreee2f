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
  bindSelect();
}

function createBillId() {
  var date = new Date();
  document.getElementById("billDate").valueAsDate = new Date();
  var id = date.getTime();
  $("#billId").val(id);
}

function removeItem(id) {;
  debugger
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
}

function createNewBill(){
  $("#billItems").empty();
  loadPrdouctsDd();
  calculateTotal();
}

function loadPrdouctsDd(){
  debugger;
  var loadPrd = setInterval(function () {
    if (!allProducts.length == 0) {
      allProducts.forEach((doc) => {
        if (doc.name != undefined && doc.sku != undefined) {
          displayProducts.push(doc.name + " (" + doc.sku+")");
          var item = new itemBill(
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
        var selectedItem = e.target.value;
        var id = e.target.getAttribute("id").split("-");
        var sku = id[1];
        var qty = $("#qty-"+sku).val();
        var prdIndex = billItems.findIndex(x=>x.sku==sku);
        var prd = bilItems[prdIndex];
        prd.qty = qty;
        billItems.splice(prdIndex,1,prd);
        calculateTotal();
      });
  }
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


