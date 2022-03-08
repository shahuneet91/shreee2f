



// const x = document.querySelector('div[id=showalert]');
// const z = document.querySelector('div[id=showalert2]');
// const y = document.querySelector('div[id=showalert3]');
// const f = document.querySelector('div[id=showFileAlert]');
//const edit = $('#update');

// const update = document.getElementById('update');
// const add = document.getElementById('add');
// const cancel = document.getElementById('cancel');

var files = [];
var fileName;
var uploadSuccess = false;

var allProducts = [];

function productDocumentReady(){
  var prdInterval = setInterval(function () {
    if (dbProducts.length > 0) {
      $.each(dbProducts, function () {
        polpulateAllProducts(this);
      });
      clearInterval(prdInterval);
    }
  }, 500);

  var prdCatInterval = setInterval(function () {
    if (categoryList.length > 0) {
      $.each(categoryList, function () {
        setCategoryOptions(this);
      });
      clearInterval(prdCatInterval);
    }
  }, 500);

  var prdBrandInterval = setInterval(function () {
    
    if (brandList.length > 0) {
      $.each(brandList, function () {
        setBrandOptions(this);
      });
      clearInterval(prdBrandInterval);
    }
  }, 500);
}

function polpulateAllProducts(doc) {
  
  var imageName = "";
  var id = "";
  if (doc.imageName == undefined) {
    imageName = "";
    id = "";
  } else {
    id = doc.imageName;
    imageName = doc.imageName;
  }

    $('#products-table').append(`<tr class="prdct-tbl" id="${doc.id}">
          <td class="prdct-tbl" style="width:100px">${doc.sku}</td>
					<td class="prdct-tbl" style="width:160px">${doc.name}</td>
					<td class="prdct-tbl" style="width:160px">${doc.category}</td>
					<td class="prdct-tbl" style="width:100px">${doc.brand}</td>
					<td class="prdct-tbl" style="width:100px">${doc.price}</td>
          <td class="prdct-tbl" style="width:50px">${doc.discount}</td>
          <td class="prdct-tbl" style="width:30px">${doc.percent}</td>
          <td class="prdct-tbl" style="width:50px">${doc.hot}</td>
          <td class="prdct-tbl" style="width:50px">${doc.latest}</td>
          <td class="prdct-tbl" style="width:20px">${doc.rank}</td>
          <td class="prdct-tbl" style="width:100px">${doc.discPrice}</td>
          <td class="prdct-tbl" style="width:100px"><a href="#" class="imgLink" onClick="openImage("${imageName}");" id="${imageName}">${imageName}</a>
          <td class="prdct-tbl" style="width:80px"><a href="javascript:void(0)" class="edit fa fa-edit" id="${doc.id}"></a> | <a href="javascript:void(0)" class="del fa fa-trash" id="${doc.id}"></a></td>
          </tr>`);

    $(".del").click((e) => {
      e.stopImmediatePropagation();
      debugger;
      $("#apa").css('display', 'none');
      $("#dpa").css('display', 'none');
      $("#upa").css('display', 'block');
      var id = e.target.id;
      db.collection("products").doc(id).delete();
      var delIndex = dbProducts.findIndex(x=> x.id == id);
      dbProducts.splice(delIndex,1)
      $("#"+id).remove();
      resetForm();
    });


    $(".edit").click((e) => {
      e.stopImmediatePropagation();
      debugger;
      $('#apa').css('display', 'none');
      $('#upa').css('display', 'none');
      $('#dpa').css('display', 'none');
      var id = e.target.id;
      var doc = dbProducts.find((x) => x.id == id);
      $("#sku").val(doc.sku);
      $("#productName").val(doc.name);
      $("#category").val(doc.category);
      $("#brand").val(doc.brand);
      $("#price").val(doc.price);
      $("#discount").prop("checked", doc.discount);
      $("#discountPercent").val(doc.percent);
      $("#hot").prop("checked", doc.hot);
      $("#latest").prop("checked", doc.latest);
      $("#rank").val(doc.rank);
      $("#discountPrice").val(doc.discPrice);
      $("#imageName").val(doc.imageName);
      $("#id_edit").val(doc.id);
      $('#add').css('display', 'none');
      $('#update').css('display', 'block');
      $('#cancel').css('display', 'block');
    });

    $(".imgLink").click((e) => {
      e.stopImmediatePropagation();
      var fileName = e.target.id;
      if (fileName != undefined && fileName != "" && fileName.length > 0) {
        getFileUrl(fileName);
      }
    });
    

}


function getFileUrl(fileName) {
  if (!(fileName == undefined)) {
    //console.log("fileName is: " + fileName);
    var storage = firebase.storage().ref(fileName);
    storage
      .getDownloadURL()
      .then(function (url) {
        //console.log(url);
        //console.log("filename: " + filename);
        window.open(url, "_blank");
      })
      .catch(function (error) {
        console.log("error encountered");
      });
    //create a storage reference
  }
}

function setCategoryOptions(doc) {
  $("#category").append(
    ` <option value="${doc.name}">${doc.name}</option>`
  );
}

function setBrandOptions(doc) {
    $("#brand").append(
      ` <option value="${doc.name}">${doc.name}</option>`
    );
  }

$("#cancel").on("click", (e) => {
  e.stopImmediatePropagation();
  $('#apa').css('display', 'none');
  $('#upa').css('display', 'none');
  $('#dpa').css('display', 'none');
  resetForm()
});

function updateProduct() {
  debugger;
  $("#apa").css("display", "none");
  $("#dpa").css("display", "none");

  var id = $("#id_edit").val();
  var updateIndex = dbProducts.findIndex((x) => x.id == id);
  uploadFile($("#sku").val());
  debugger;
  var updatedPrd = new product(
    id,
    $("#sku").val(),
    $("#productName").val(),
    $("#category").val(),
    $("#brand").val(),
    parseInt($("#price").val()),
    $("#discount").is(":checked"),
    parseInt($("#discountPercent").val()),
    $("#hot").is(":checked"),
    $("#latest").is(":checked"),
    $("#rank").val(),
    parseInt($("#discountPrice").val()),
    $("#sku").val()
  );

  db.collection("products").doc(id).set(
    {
      sku: updatedPrd.sku,
      name: updatedPrd.name,
      category: updatedPrd.category,
      brand: updatedPrd.brand,
      price: updatedPrd.price,
      discount: updatedPrd.discount,
      percent: updatedPrd.percent,
      hot: updatedPrd.hot,
      latest: updatedPrd.latest,
      rank: updatedPrd.rank,
      discountPrice: updatedPrd.discPrice,
      imageName: updatedPrd.imageName,
    },
    {
      merge: true,
    }
  );

  dbProducts.splice(updateIndex, 1, updatedPrd);
  $("#upa").css("display", "block");
  setTimeout(function () {
    $("#upa").remove();
  }, 5000);

  resetForm();
  debugger;
  $(id).html(`<tr class="prdct-tbl" id="${id}">
  <td class="prdct-tbl" style="width:100px">${updatedPrd.sku}</td>
  <td class="prdct-tbl" style="width:160px">${updatedPrd.name}</td>
  <td class="prdct-tbl" style="width:160px">${updatedPrd.category}</td>
  <td class="prdct-tbl" style="width:100px">${updatedPrd.brand}</td>
  <td class="prdct-tbl" style="width:100px">${updatedPrd.price}</td>
  <td class="prdct-tbl" style="width:50px">${updatedPrd.discount}</td>
  <td class="prdct-tbl" style="width:30px">${updatedPrd.percent}</td>
  <td class="prdct-tbl" style="width:50px">${updatedPrd.hot}</td>
  <td class="prdct-tbl" style="width:50px">${updatedPrd.latest}</td>
  <td class="prdct-tbl" style="width:20px">${updatedPrd.rank}</td>
  <td class="prdct-tbl" style="width:100px">${updatedPrd.discPrice}</td>
  <td class="prdct-tbl" style="width:100px"><a href="${url}" id="${imageName}">${imageName}</a>
  <td class="prdct-tbl" style="width:80px"><a href="javascript:void(0)" class="edit fa fa-edit" id="${id}"></a> | <a href="javascript:void(0)" class="del fa fa-trash" id="${doc.id}"></a></td>
  </tr>`);
}

function addProduct(){
  $('#apa').css('display', 'none');
  $('#upa').css('display', 'none');
  $('#dpa').css('display', 'block');
  addNewProduct();
  resetForm();
};

function addNewProduct() {

  var newProduct = new product(
    $("#sku").val(),
    $("#productName").val(),
    $("#category").val(),
    $("#brand").val(),
    parseInt($("#price").val()),
    $("#discount").is(":checked"),
    parseInt($("#discountPercent").val()),
    $("#hot").is(":checked"),
    $("#latest").is(":checked"),
    $("#rank").val(),
    parseInt($("#discountPrice").val()),
    $("#sku").val()
  );
  db.collection("products").add(
    {
      sku: updatedPrd.sku,
      name: updatedPrd.name,
      category: updatedPrd.category,
      brand: updatedPrd.brand,
      price: updatedPrd.price,
      discount: updatedPrd.discount,
      percent: updatedPrd.percent,
      hot: updatedPrd.hot,
      latest: updatedPrd.latest,
      rank: updatedPrd.rank,
      discountPrice: updatedPrd.discPrice,
      imageName: updatedPrd.imageName,
      added_at: Date(),
  });

  dbProducts.push(newProduct)
  uploadFile($("#sku").val());
  $('#apa').css('display', 'block');
  setTimeout(function () {
  $('#apa').remove();
  }, 5000);
}

function resetForm() {
  $("#sku").val("");
  $("#productName").val("");
  $("#category").val("");
  $("#brand").val("");
  $("#price").val("");
  $("#discount").prop("checked", false);
  $("#discountPercent").val("");
  $("#hot").prop("checked", false);
  $("#latest").prop("checked", false);
  $("#rank").val("");
  $("#discountPrice").val("");
  $("#files").val("");
  $('#add').css('display', 'block');
  $('#update').css('display', 'none');
  $('#cancel').css('display', 'none');
  $('#apa').css('display', 'block');
  $('#upa').css('display', 'block');
  $('#dpa').css('display', 'block');
}


 $("#files").change(function(e){
  files = e.target.files;
  for (let i = 0; i < files.length; i++) {
    //console.log(files[i]);
  }
});

function uploadFile(fileName){
  
  //checks if files are selected
  if (files.length != 0) {
    //Loops through all the selected files
    for (let i = 0; i < files.length; i++) {
      //create a storage reference
      var storage = firebase.storage().ref(fileName);
      //upload file
      var upload = storage.put(files[i]);
      //update progress bar
      upload.on(
        "state_changed",
        function progress(snapshot) {
          // var percentage =
          //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // document.getElementById("progress").value = percentage;
        },function error() {
          alert("error uploading file");
        },function complete() {
          uploadSuccess = true;
        }
      );
    }
  } else {
    $('#showFileAlert').css('display', 'block');
    setTimeout(function() {
      ("#showFileAlert").remove();
  }, 5000);
  }
}

var serverLink="";
var imgLink="/y";
var server = false;
var upload = false;
if(server==false){
  serverLink = "/y";
  imgLink="";
}

$(document).ready(function(){
  uploadData();
});
function uploadData() {
  //Load Products Data
  if (upload) {
    $.get(".." + serverLink + "/products.csv", function (data) {
      var lines = data.split("\n");
      for (var i = 1; i < lines.length; i++) {
        var currentline = lines[i].split(",");
        db.collection("products").add({
          sku: currentline[0],
          name: currentline[1],
          category: currentline[2],
          brand: currentline[3],
          price: currentline[4],
          discount: currentline[5],
          percent: currentline[6],
          hot: currentline[7],
          latest: currentline[8],
          rank: currentline[9],
          discountPrice:
            parseInt(currentline[4]) -
            (parseInt(currentline[4]) * parseInt(currentline[6])) / 100,
        });
      }
    });
  }
}

