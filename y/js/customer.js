var custmr;
var customerId;
var valid = true;

function preLoadCustomer() {
  setAddView();

  $("#cusOperation").change(function () {
    if (this.checked) {
      $("#customerId").val("");
      $("#customerId").prop("readonly", false);
      emptyForm();
      //bindKeyPress();
      setUpdateView();
    } else {
      $("#customerId").prop("readonly", true);
      setAddView();
    }
  });
}

function searchCustomer() {
  var value = $("#customerId").val();
  findCustomer("id", value);
}

function searchCustomerByEmail() {
  var value = $("#email").val();
  findCustomer("email", value);
}

function searchCustomerByPhone() {
  var value = $("#phone1").val();
  findCustomer("phone1", value);
}

function findCustomer(searchParam, val) {
  $("#spinner").show();
  if (val.length > 1) {
    if (searchParam == "id") {
      val = parseInt(val);
    }
    db.collection("customers")
      .where(searchParam, "==", val)
      .get()
      .then((snapshot) => {
        if (snapshot.docs.length == 0) {
          $("#spinner").hide();
          $("#statusFail").show();
          setTimeout(function () {
            $("#statusFail").hide();
          }, 5000);
        } else {
          snapshot.docs.forEach((doc) => {
            var cus = doc.data(); //is never undefined for query doc snapshots
            console.log("customerId => " + cus.id);
            setUpdateView(cus);
          });
        }
      });
  }
}

function register(){
  create(false);
}

function create(update) {
  debugger;
  var date = new Date();
  var gender = $("#customerGender").val();
  var suffix = $("#suffix").val();
  var fName = $("#fName").val();
  var lName = $("#lName").val();
  var email = $("#email").val();
  var phone1 = $("#phone1").val();
  var phone2 = $("#phone2").val();
  var add1 = $("#add1").val();
  var add2 = $("#add2").val();
  var city = $("#city").val();
  var zip = $("#zip").val();
  var state = $("#state").val();
  var custmr = new cust(
    customerId, date, gender, suffix, fName, lName, email, 
    phone1, phone2, add1, add2, city, zip, state
  );
  validate(custmr,update);
}

function validate(customer, update) {
  debugger;
  if (customer.fname == undefined || customer.fname.length == 0) {
    $("#fName").css("border-bottom", "1px solid red");
    setValid(false);
  }

  // if(customer.lname == undefined || customer.lname.length == 0){
  //   $("#lName").css("border-bottom","1px solid red");
  //   setValid(false);
  // }

  // if(customer.phone1 == undefined || customer.phone1.length < 10){
  //   $("#phone1").css("border-bottom","1px solid red");
  //   setValid(false);
  // }

  // if(customer.add1 == undefined || customer.add1.length == 0){
  //   $("#add1").css("border-bottom","1px solid red");
  //   setValid(false);
  // }

  // if(customer.city == undefined || customer.city.length == 0){
  //   $("#city").css("border-bottom","1px solid red");
  //   setValid(false);
  // }

  // if(customer.zip == undefined || customer.zip.length == 0){
  //   $("#zip").css("border-bottom","1px solid red");
  //   setValid(false);
  // }

  // if(customer.state == undefined || customer.state.length == 0){
  //   $("#state").css("border-bottom","1px solid red");
  //   setValid(false);
  // }

  if(valid){
    isCustomerExists(customer, update);
  }
 
}

function isCustomerExists(custmr, update) {
  $("#spinner").show();
  db.collection("customers")
    .where("phone1", "==", custmr.phone1)
    .get()
    .then((snapshot) => {
      debugger;
      if (snapshot.docs.length == 0 && !update) {
        addCustomer(custmr);
      } else {
        if (update) {
          debugger;
          snapshot.docs.forEach((doc) => {
            debugger;
            custmr.id = doc.data().id;
            updateCustomer(doc.id, custmr);
            setUpdateView(custmr);
          });
        } else {
          debugger;
          snapshot.docs.forEach((doc) => {
            debugger;
            $("#spinner").hide();
            $("#statusExists").show();
            setTimeout(function () {
              $("#statusExists").hide();
            }, 5000);
            var cus = doc.data();
            console.log("customerId => " + cus.id);
            
          });
        }
      }
    });
}

function setValid(value) {
  if (valid) {
    valid = value;
  }
}

function update(){
  debugger;
  $("#spinner").hide();
  create(true);
}

function updateCustomer(id, custmr){
  debugger;
  db.collection("customers").doc(id).set(
    {
      addedDate: custmr.addedDate,
      gender: custmr.gender,
      suffix: custmr.suffix,
      fname: custmr.fname,
      lname: custmr.lname,
      email: custmr.email,
      phone1: custmr.phone1,
      phone2: custmr.phone2,
      add1: custmr.add1,
      add2: custmr.add2,
      city: custmr.city,
      zip: custmr.zip,
      state: custmr.state,
    },
    {
      merge: true,
    }).then((snapshot) => {
      debugger;
      $("#spinner").hide();
      $("#statusSuccess").show();
      setTimeout(function () {
        $("#statusSuccess").hide();
      }, 5000);
    });
}

function addCustomer(custmr) {
  db.collection("customers")
    .add({
      id: custmr.id,
      addedDate: custmr.addedDate,
      gender: custmr.gender,
      suffix: custmr.suffix,
      fname: custmr.fname,
      lname: custmr.lname,
      email: custmr.email,
      phone1: custmr.phone1,
      phone2: custmr.phone2,
      add1: custmr.add1,
      add2: custmr.add2,
      city: custmr.city,
      zip: custmr.zip,
      state: custmr.state,
    })
    .then((key) => {
      if (key.id != undefined && key.id != "") {
        $("#spinner").hide();;
        $("#statusSuccess").show();
        setTimeout(function () {
          $("#statusSuccess").hide();
        }, 5000);
      } else {
        $("#statusSuccess").show();
        setTimeout(function () {
          $("#statusSuccess").hide();
        }, 5000);
      }
    })
    .catch((err) => {
      console.log("Error Registering Customer", err);
    });
}

function setUpdateView(customer) {
  //setReadOnly(true);
  $("#btnIdSearch").show();
  $("#btnEmailSearch").show();
  $("#btnPhoneSearch").show();
  $("#registerCus").hide();
  if (customer != undefined && customer.id != undefined) {
   
    $("#updateCus").show();
    setCustomer(customer);
  }

  $("#spinner").hide();
  $("#statusFail").hide();
  $("#statusSuccess").hide();
  $("#statusExists").hide();
}

function setCustomer(customer) {
  $("#customerId").val(customer.id);
  $("#suffix").val(customer.suffix);
  $("#fName").val(customer.fname);
  $("#lName").val(customer.lname);
  $("#customerGender").val(customer.gender);
  $("#email").val(customer.email);
  $("#phone1").val(customer.phone1);
  $("#phone2").val(customer.phone2);
  $("#add1").val(customer.add1);
  $("#add2").val(customer.add2);
  $("#city").val(customer.city);
  $("#zip").val(customer.zip);
  $("#state").val(customer.state);
}

function setAddView() {
  emptyForm();
  $("#btnIdSearch").hide();
  $("#btnEmailSearch").hide();
  $("#btnPhoneSearch").hide();
  $("#updateCus").hide();
  $("#registerCus").show();
  var date = new Date();
  customerId = date.getTime();
  $("#customerId").val(customerId);
}

function emptyForm() {
  $("#customerId").val("");
  $("#suffix").val("Mr.");
  $("#fName").val("");
  $("#lName").val("");
  $("#gender").val("Male");
  $("#email").val("");
  $("#phone1").val("");
  $("#phone2").val("");
  $("#add1").val("");
  $("#add2").val("");
  $("#city").val("");
  $("#zip").val("");
  $("#state").val("");
  $("#spinner").hide();
  $("#statusFail").hide();
  $("#statusSuccess").hide();
  $("#statusExists").hide();
}

