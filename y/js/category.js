const add_category = $("#add-category");
const catAddedMsg = document.querySelector("div[id=catAddedMsg]");
const catUpdateMsg = document.querySelector("div[id=catUpdateMsg]");
const catDeleteMsg = document.querySelector("div[id=catDeleteMsg]");

const updateCatBtn = document.getElementById("updateCat");
const addCatBtn = document.getElementById("addCat");
const cancelCatBtn = document.getElementById("cancelCat");

// $(document).ready(function () {
//   db.collection("categories")
//     .get()
//     .then((snapshot) => {
//       snapshot.docs.forEach((doc) => {
//         fetchAllCategories(doc);
//       });
//     });

  
// });

function fetchAllCategories(doc) {
    $("#categories-table").append(`<tr style="width: 75%;" id="${doc.id}">
					 <td>${doc.data().category}</td>
					 <td style="text-align: center !important;"><a href="javascript:void(0)" class="editCat fa fa-edit" id="${
             doc.id
           }"></a> | <a href="javascript:void(0)" class="delCat fa fa-trash" id="${doc.id}"></a></td>
	             </tr>`);

    $(".delCat").click((e) => {
      e.stopImmediatePropagation();
      var id = e.target.id;
      db.collection("categories").doc(id).delete();
      catDeleteMsg.style.display = "block";
      setTimeout(function () {
        catDeleteMsg.remove();
      }, 5000);
      resetForm();
    });

    $(".editCat").click((e) => {
      e.stopImmediatePropagation();
      resetMsg();
      var id = e.target.id;
      db.collection("categories")
        .doc(id)
        .get()
        .then((doc) => {
          $("#category").val(doc.data().category);
          $("#id_edit_cat").val(doc.id);
        });
      addCatBtn.style.display = "none";
      updateCatBtn.style.display = "block";
      cancelCatBtn.style.display = "block";
    });
  }

$("#cancelCat").on("click", () => {
  e.stopImmediatePropagation();
  resetMsg();
  resetForm();
});

$("#updateCat").on("click", () => {
  catDeleteMsg.style.display = "none";
  catAddedMsg.style.display = "none";
  catUpdateMsg.style.display = "block";
  var id = $("#id_edit_cat").val();
  db.collection("categories")
    .doc(id)
    .set(
      {
        category: $("#category").val(),
      },
      {
        merge: true,
      }
    );
  setTimeout(function () {
    catUpdateMsg.remove();
  }, 5000);
  resetForm();
});

add_category.on("submit", (e) => {
  e.preventDefault();
  catDeleteMsg.style.display = "none";
  catDeleteMsg.style.display = "none";
  db.collection("categories").add({
    category: $("#category").val(),
    added_at: Date(),
  });
  catAddedMsg.style.display = "block";
  setTimeout(function () {
    catAddedMsg.remove();
  }, 5000);
  resetForm();
});

function resetForm() {
  $("#category").val("");
  addCat.style.display = "block";
  updateCat.style.display = "none";
  cancelCat.style.display = "none";
  resetMsg();
}

function resetMsg() {
  catAddedMsg.style.display = "none";
  catDeleteMsg.style.display = "none";
  catUpdateMsg.style.display = "none";
}

db.collection("categories").onSnapshot((snapshot) => {
  let changes = snapshot.docChanges();
  changes.forEach((change) => {
    if (change.type == "added") {
      fetchAllCategories(change.doc);
    } else if (change.type == "removed") {
      var id = change.doc.id;
      $("#" + id).remove();
    } else if (change.type == "modified") {
      var id = change.doc.id;
      $("#" + id).remove();
      fetchAllcategories(change.doc);
    }
  });
});
