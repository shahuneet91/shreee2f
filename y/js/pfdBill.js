
$(document).ready(function () {
  var tempBill = window.localStorage.getItem('bill');
  var bill =  JSON.parse(tempBill);
  createPdfBill(bill);
});


function createPdfBill(bill){
  debugger;
  $("#pdfInvNumber").text(bill.billId);
   
  var billItems = bill.items;
  $("#pdfItems").empty();
     for (var i = 0; i <= billItems.length-1; i++) {
       $("#pdfItems").append(
         '<tr>'+
         '<td><span>'+ billItems[i].name +' ('+billItems[i].sku+')'+'</span></td>'+
         '<td><span>'+ billItems[i].qty+'</span></td>'+
         '<td>&#8377;  </span><span>'+ billItems[i].price+'</span></td>'+
         '<td><span>'+ billItems[i].percent+'</span></td>'+
         '<td><span>&#8377;  </span><span>'+ billItems[i].discPrice+'</span></td>'+
         '<tr>'
       );
     }

     $("#pdfCustomerName").text(bill.customerName);
     //$("#pdfCustomerName").text(bill.customerName);
     $("#pdfInveDate").text(bill.billDate);
     $("#pdfAmountDue").text(bill.billAmount);
     $("#pdfAmountTotal").text(bill.totalPrice);
     $("#pdfTotalDiscount").text(bill.totalDiscount);
     $("#pdfTotal").text(bill.billAmount);
     $("#pdfCustomerAdd1").text(bill.customerAdd1);
     $("#pdfCustomerAdd2").text(bill.customerAdd2);
  }