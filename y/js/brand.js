const add_brand = $("#add-brand");
const brandAddedMsg = document.querySelector("div[id=brandAddedMsg]");
const brandUpdatedMsg = document.querySelector("div[id=brandUpdatedMsg]");
const brandDeletedMsg = document.querySelector("div[id=brandDeletedMsg]");

const updateBrandBtn = document.getElementById("updateBrand");
const addBrandBtn = document.getElementById("addBrand");
const cancelBrandBtn = document.getElementById("cancelBrand");

// $(document).ready(function () {
//   db.collection("brands")
//     .get()
//     .then((snapshot) => {
//       snapshot.docs.forEach((doc) => {
//         fetchAllBrands(doc);
//       });
//     });
// });

function fetchAllBrands(doc) {
    $("#brands-table").append(`<tr style="width: 75%;" id="${doc.id}">
					 <td>${doc.data().brand}</td>
					 <td style="text-align: center !important;"><a href="javascript:void(0)" class="editBrand fa fa-edit" id="${
             doc.id
           }"></a> | <a href="javascript:void(0)" class="delBrand fa fa-trash" id="${doc.id}"></a></td>
	             </tr>`);

    $(".delBrand").click((e) => {
      e.stopImmediatePropagation();
      brandAddedMsg.style.display = "none";
      brandUpdatedMsg.style.display = "none";
      brandDeletedMsg.style.display = "block";
      var id = e.target.id;
      db.collection("brands").doc(id).delete();
      setTimeout(function () {
        brandDeletedMsg.remove();
      }, 5000);
      resetForm();
    });

    $(".editBrand").click((e) => {
      e.stopImmediatePropagation();
      resetMsg();
      var id = e.target.id;
      db.collection("brands")
        .doc(id)
        .get()
        .then((doc) => {
          $("#brand").val(doc.data().brand);
          $("#id_edit_brand").val(doc.id);
        });
      addBrandBtn.style.display = "none";
      updateBrandBtn.style.display = "block";
      cancelBrandBtn.style.display = "block";
    });
  }

$("#cancelBrand").on("click", () => {
  e.stopImmediatePropagation();
  resetMsg();
  resetForm();
});

$("#updateBrand").on("click", () => {
  brandAddedMsg.style.display = "none";
  brandDeletedMsg.style.display = "none";
  brandUpdatedMsg.style.display = "block";
  var id = $("#id_edit_brand").val();
  db.collection("brands")
    .doc(id)
    .set(
      {
        brand: $("#brand").val(),
      },
      {
        merge: true,
      }
    );
  setTimeout(function () {
    brandUpdatedMsg.remove();
  }, 5000);
  resetForm();
});

add_brand.on("submit", (e) => {
  e.preventDefault();
  brandDeletedMsg.style.display = "none";
  brandUpdatedMsg.style.display = "none";
  db.collection("brands").add({
    brand: $("#brand").val(),
    added_at: Date(),
  });
  brandAddedMsg.style.display = "block";
  setTimeout(function () {
    brandAddedMsg.remove();
  }, 5000);
  resetForm();
});

function resetForm() {
  $("#brand").val("");
  addBrand.style.display = "block";
  updateBrand.style.display = "none";
  cancelBrand.style.display = "none";
  resetMsg();
}

function resetMsg() {
  brandAddedMsg.style.display = "none";
  brandDeletedMsg.style.display = "none";
  brandUpdatedMsg.style.display = "none";
}

db.collection("brands").onSnapshot((snapshot) => {
  let changes = snapshot.docChanges();
  changes.forEach((change) => {
    if (change.type == "added") {
      fetchAllBrands(change.doc);
    } else if (change.type == "removed") {
      var id = change.doc.id;
      $("#" + id).remove();
    } else if (change.type == "modified") {
      var id = change.doc.id;
      $("#" + id).remove();
      fetchAllBrands(change.doc);
    }
  });
});
