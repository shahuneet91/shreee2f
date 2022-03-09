// const brandAddedMsg = document.querySelector("div[id=brandAddedMsg]");
// const brandUpdatedMsg = document.querySelector("div[id=brandUpdatedMsg]");
// const brandDeletedMsg = document.querySelector("div[id=brandDeletedMsg]");

// const updateBrandBtn = document.getElementById("updateBrand");
// const addBrandBtn = document.getElementById("addBrand");
// const cancelBrandBtn = document.getElementById("cancelBrand");

function docBrandReady(){
  var allBrnadInterval = setInterval(function () {
    if (brandList.length > 0) {
      $.each(brandList, function () {
        populateAllBrands(this);
      });
      clearInterval(allBrnadInterval);
    }
  }, 500);
}

function populateAllBrands(doc) {
    $("#brands-table").append(`<tr id="${doc.id}">
					 <td>${doc.name}</td>
					 <td style="text-align: end !important; padding-right: 8%;"><a href="javascript:void(0)" class="editBrand fa fa-edit" id="${
             doc.id
           }"></a> | <a href="javascript:void(0)" class="delBrand fa fa-trash" id="${doc.id}"></a></td>
	             </tr>`);

    $(".delBrand").click((e) => {
      e.stopImmediatePropagation();
      $('#brandAddedMsg').css('display', 'none');
      $('#brandUpdatedMsg').css('display', 'none')
      $('#brandDeletedMsg').css('display', 'block')
      var id = e.target.id;
      db.collection("brands").doc(id).delete();
      var removeIndex = brandList.findIndex((x) => x.id == id);
      brandList.splice(removeIndex, 1);
      setTimeout(function () {
        $('#brandDeletedMsg').remove();
      }, 5000);
      resetForm();
    });

    $(".editBrand").click((e) => {
      e.stopImmediatePropagation();
      resetMsg();
      var id = e.target.id;
      var brand = brnadList.find(x=> x.id = id);
      $("#brand").val(brand.name);
      $("#id_edit_brand").val(doc.id);
      $('#addBrandBtn').css('display', 'none');
      $('#updateBrandBtn').css('display', 'block')
      $('#cancelBrandBtn').css('display', 'block')
    });
  }

  $("#updateBrand").on("click", () => {
    $('#brandAddedMsg').css('display', 'none');
    $('#brandUpdatedMsg').css('display', 'none')
    $('#brandDeletedMsg').css('display', 'block')
    var id = $("#id_edit_brand").val();
    var updatedBrand = new brand(($("#brand").val()), 0, false);
    db.collection("brands")
      .doc(id)
      .set(
        {
          brand: updatedBrand.name,
        },
        {
          merge: true,
        }
      );
    var brandIndex = brandList.findIndex(x=>x.id == id);
    brandList.splice(brandIndex,1,updatedBrand);
    setTimeout(function () {
      $('#brandUpdatedMsg').remove();
    }, 5000);
    resetForm();
  });

$("#cancelBrand").on("click", () => {
  e.stopImmediatePropagation();
  resetMsg();
  resetForm();
});

$("#add-brand").on("submit", (e) => {
  e.preventDefault();
  $('#brandDeletedMsg').css('display', 'none');
  $('#brandUpdatedMsg').css('display', 'none')
  var newBrand = new brand(($("#brand").val()), 0, false);
  db.collection("brands").add({
    brand: newBrand.name,
    added_at: Date(),
  });
  brandList.push(newBrand);
  $('#brandAddedMsg').css('display', 'block');
  setTimeout(function () {
    $('#brandAddedMsg').remove();
  }, 5000);
  resetForm();
});

function resetForm() {
  $("#brand").val("");
  $('#addBrandBtn').css('display', 'block');
  $('#updateBrandBtn').css('display', 'none')
  $('#cancelBrandBtn').css('display', 'none')
  resetMsg();
}

function resetMsg() {
  $('#brandAddedMsg').css('display', 'none');
  $('#brandUpdatedMsg').css('display', 'none')
  $('#brandDeletedMsg').css('display', 'none')
}