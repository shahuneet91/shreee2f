

const add_product = $('#add-product');


const x = document.querySelector('div[id=showalert]');
const z = document.querySelector('div[id=showalert2]');
const y = document.querySelector('div[id=showalert3]');
const f = document.querySelector('div[id=showFileAlert]');
//const edit = $('#update');

const update = document.getElementById('update');
const add = document.getElementById('add');
const cancel = document.getElementById('cancel');

var files = [];
var fileName;
var uploadSuccess = false;

$(document).ready(function(){
 /*	db.collection('products').get().then((snapshot) =>{
 		snapshot.docs.forEach(doc => {
 		   //console.log(doc.data());
 		   fetchAllproducts(doc);
 		});
	});*/

    db.collection('categories').get().then((snapshot) =>{
        snapshot.docs.forEach(doc => {
           //console.log(doc.data());
           setCategoryOptions(doc);
        });
   });
   db.collection('brands').get().then((snapshot) =>{
    snapshot.docs.forEach(doc => {
       //console.log(doc.data());
       setBrandOptions(doc);
    });
});
});

function fetchAllproducts(doc) {
  var url = "";
  var imageName = "";
  var id = "";
  if (doc.data().imageName == undefined) {
    url = "#";
    imageName = "";
    id = "";
  } else {
    url = getFileUrl(doc.data().imageName);
    id = doc.data().imageName;
    imageName = doc.data().imageName;
  }
 
    $('#products-table').append(`<tr class="prdct-tbl" id="${doc.id}">
          <td class="prdct-tbl" >${doc.data().sku}</td>
					<td class="prdct-tbl" >${doc.data().name}</td>
					<td class="prdct-tbl" >${doc.data().category}</td>
					<td class="prdct-tbl" >${doc.data().brand}</td>
					<td class="prdct-tbl" >${doc.data().price}</td>
          <td class="prdct-tbl" >${doc.data().discount}</td>
          <td class="prdct-tbl" >${doc.data().percent}</td>
          <td class="prdct-tbl" >${doc.data().hot}</td>
          <td class="prdct-tbl" >${doc.data().latest}</td>
          <td class="prdct-tbl" >${doc.data().rank}</td>
          <td class="prdct-tbl" >${doc.data().discountPrice}</td>
          <td class="prdct-tbl" ><a href="${url}" id="${imageName}">${imageName}</a>
          <td class="prdct-tbl" ><a href="javascript:void(0)" class="edit fa fa-edit" id="${doc.id}"></a> | <a href="javascript:void(0)" class="del fa fa-trash" id="${doc.id}"></a></td>
          </tr>`);

    $(".del").click((e) => {
      e.stopImmediatePropagation();
      z.style.display = "none";
      y.style.display = "none";
      x.style.display = "block";
      var id = e.target.id;
      db.collection("products").doc(id).delete();
      resetForm();
    });


    $(".edit").click((e) => {
      e.stopImmediatePropagation();
      z.style.display = "none";
      y.style.display = "none";
      var id = e.target.id;
      db.collection("products")
        .doc(id)
        .get()
        .then((doc) => {
          $('#sku').val(doc.data().sku),
          $("#productName").val(doc.data().name);
          $("#category").val(doc.data().category);
          $("#brand").val(doc.data().brand);
          $("#price").val(doc.data().price);
          $("#discount").prop("checked", doc.data().discount);
          $("#discountPercent").val(doc.data().percent);
          $("#hot").prop("checked", doc.data().hot);
          $("#latest").prop("checked", doc.data().latest);
          $("#rank").val(doc.data().rank);
          $("#discountPrice").val(doc.data().discountPrice);
          $("#imageName").val(doc.data().imageName);
          $("#id_edit").val(doc.id);
        });
      add.style.display = "none";
      update.style.display = "block";
      cancel.style.display = "block";
    });

    function getFileUrl(filename) {
      if (!(filename == undefined)) {
        //console.log("filename is: " + filename);
        var storage = firebase.storage().ref(filename);
        storage
            .getDownloadURL()
            .then(function (url) {
              //console.log(url);
              //console.log("filename: " + filename);
              $("#" + filename).attr("href", url);
              $("#" + filename).attr("target", "_blank");
            })
            .catch(function (error) {
              console.log("error encountered");
            });
        //create a storage reference
       
      }
    }
}

function setCategoryOptions(doc) {
  $("#category").append(
    ` <option value="${doc.data().category}">${doc.data().category}</option>`
  );
}

function setBrandOptions(doc) {
    $("#brand").append(
      ` <option value="${doc.data().brand}">${doc.data().brand}</option>`
    );
  }

$("#cancel").on("click", (e) => {
  e.stopImmediatePropagation();
  z.style.display = "none";
  y.style.display = "none";
  x.style.display = "none";
  resetForm()
});

$('#update').on('click', () => {
	      z.style.display = 'none';
        x.style.display = 'none';
        y.style.display = 'block';
        var id = $('#id_edit').val();
    db.collection('products').doc(id).set({
        sku: $('#sku').val(),
        name: $('#productName').val(),
        category: $('#category').val(),
        brand: $('#brand').val(),
        price: $('#price').val(),
        discount: $('#discount').is(":checked"),
        percent: $('#discountPercent').val(),
        hot: $('#hot').is(":checked"),
        latest: $('#latest').is(":checked"),
        rank: $('#rank').val(),
        discountPrice: $('#discountPrice').val(),
        imageName: $('#sku').val(),

    }, {
        merge: true
    });
    
    uploadFile($('#sku').val());
    setTimeout(function() {
        y.remove();
    }, 5000);
    resetForm();
});

add_product.on("submit", (e) => {
  e.preventDefault();
  x.style.display = "none";
  y.style.display = "none";
  z.style.display = "block";
  addProduct();
  resetForm();
});

function addProduct() {
  db.collection("products").add({
    name: $("#sku").val(),
    name: $("#productName").val(),
    category: $("#category").val(),
    brand: $("#brand").val(),
    price: $("#price").val(),
    discount: $("#discount").is(":checked"),
    percent: $("#discountPercent").val(),
    hot: $("#hot").is(":checked"),
    latest: $("#latest").is(":checked"),
    rank: $("#rank").val(),
    discountPrice: $("#discountPrice").val(),
    imageName: $("#sku").val(),
    added_at: Date(),
  });
  uploadFile($("#sku").val());
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
  add.style.display = "block";
  update.style.display = "none";
  cancel.style.display = "none";
}

db.collection("products").onSnapshot((snapshot) => {
  let changes = snapshot.docChanges();
    changes.forEach((change) => {
      if (change.type == "added") {
        fetchAllproducts(change.doc);
      } else if (change.type == "removed") {
        var id = change.doc.id;
        $("#" + id).remove();
      } else if (change.type == "modified") {
        var id = change.doc.id;
        $("#" + id).remove();
        fetchAllproducts(change.doc);
      }
    });
});

 document.getElementById("files").addEventListener("change", function (e) {
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
    f.style.display = "block";
    setTimeout(function() {
      f.remove();
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

