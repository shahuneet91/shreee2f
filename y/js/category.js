// const catAddedMsg = document.querySelector("div[id=catAddedMsg]");
// const catUpdateMsg = document.querySelector("div[id=catUpdateMsg]");
// const catDeleteMsg = document.querySelector("div[id=catDeleteMsg]");

// const updateCatBtn = document.getElementById("updateCat");
// const addCatBtn = document.getElementById("addCat");
// const cancelCatBtn = document.getElementById("cancelCat");

function docCatagoryReady(){
  var allCatInterval = setInterval(function () {
    if (categoryList.length > 0) {
      $.each(categoryList, function () {
        populateAllCategories(this);
      });
      clearInterval(allCatInterval);
    }
  }, 500);
}

function populateAllCategories(doc) {
    $("#categories-table").append(`<tr id="${doc.id}">
					 <td>${doc.name}</td>
					 <td style="text-align: end !important; padding-right: 8%;"><a href="javascript:void(0)" class="editCat fa fa-edit" id="${
             doc.id
           }"></a> | <a href="javascript:void(0)" class="delCat fa fa-trash" id="${doc.id}"></a></td>
	             </tr>`);

    $(".delCat").click((e) => {
      e.stopImmediatePropagation();
      var id = e.target.id;
      db.collection("categories").doc(id).delete();
      var catIndex = categoryList.findIndex(x=>x.id = id);
      categoryList.splice(catIndex,1);
      $('#catDeleteMsg').css('display', 'block');
      setTimeout(function () {
        $('#catDeleteMsg').remove();
      }, 5000);
      resetForm();
    });

    $(".editCat").click((e) => {
      e.stopImmediatePropagation();
      resetMsg();
      var id = e.target.id;
      var cat= categoryList.find(x=>x.id = id);
      $("#category").val(cat.name);
      $("#id_edit_cat").val(doc.id);
      $('#addCatBtn').css('display', 'none');
      $('#updateCatBtn').css('display', 'block');
      $('#cancelCatBtn').css('display', 'block');
    });
  }

$("#updateCat").on("click", () => {
  $('#catDeleteMsg').css('display', 'none');
  $('#catAddedMsg').css('display', 'none');
  $('#catUpdateMsg').css('display', 'block');
  var id = $("#id_edit_cat").val();
  var updatedCat = new category($("#category").val(), 0, false);
  db.collection("categories").doc(id).set(
    {
      category: updatedCat.name,
    },
    {
      merge: true,
    }
  );
  var catIndex = categoryList.findIndex((x) => (x.id = id));
  categoryList.splice(catIndex, 1, updatedCat);
  setTimeout(function () {
    $('#catUpdateMsg').remove();
  }, 5000);
  resetForm();
});

$("#add-category").on("submit", (e) => {
  e.preventDefault();
  $('#catDeleteMsg').css('display', 'none');
  var newCat = new category($("#category").val(), 0, false);
  db.collection("categories").add({
    name: newCat.name,
    added_at: Date(),
  });
  categoryList.push(newCat)
  $('#catAddedMsg').css('display', 'block');
  setTimeout(function () {
    $('#catAddedMsg').remove();
  }, 5000);
  resetForm();
});

$("#cancelCat").on("click", () => {
  e.stopImmediatePropagation();
  resetMsg();
  resetForm();
});

function resetForm() {
  $("#category").val("");
  $('#addCat').css('display', 'block');
  $('#updateCat').css('display', 'none');
  $('#cancelCat').css('display', 'none');
  resetMsg();
}

function resetMsg() {
  $('#catAddedMsg').css('display', 'none');
  $('#catDeleteMsg').css('display', 'none');
  $('#catUpdateMsg').css('display', 'none');
}


