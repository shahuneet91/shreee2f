
$(document).ready(function(){

  var phoneNumber = '+919045493049';

function resize() {
  if ($(window).width() < 700) {
    $("#filter").addClass("collapse");
    $("#categoryFilter").addClass("collapse");
    $("#priceFilter").addClass("collapse");
    $("#brandFilter").addClass("collapse");
    $("#topSelling").addClass("collapse");
  }
}

//watch window resize
$(window).on("load", function () {
  resize();
});

//var allProducts = [];
var products = [];
var hotProducts = [];
var order;
var min_price = 0;
var max_price = 500000;
var filteredProducts = [];
var productsLoaded = false;
// var serverLink="";
// var imgLink="/y";
// var server = false;
// if(server==false){
//   serverLink = "/y";
//   imgLink="";
// }

//Load Products Data
/*$.get(".."+serverLink+"/products.csv", function (data) {
   var lines = data.split("\n");
  for (var i = 1; i < lines.length; i++) {
    var currentline = lines[i].split(",");
    allProducts.push(
      new product(
        currentline[0],
        currentline[1],
        currentline[2],
        parseInt(currentline[3]),
        currentline[4],
        parseInt(currentline[5]),
        currentline[6],
        currentline[7],
        currentline[8],
        parseInt(currentline[3]) - (parseInt(currentline[3]) * parseInt(currentline[5])) / 100
      )
    );
  }
});*/
  /*****************   Loading Master Data Section Start **************/

 

  /****Load Filters Master Data Start*****/
  var catBrandInterval = setInterval(function () {
    if (categoryList.length > 0 && products.length > 0) {
      loadFilters();
      //populate search categories
      populateSearchCategories();
      clearInterval(catBrandInterval);
    }
  }, 500);

  var setUrls;
  var loadPage = setInterval(function () {
    if (!(dbProducts.length == 0)) {
      setUrls = setInterval(function () {
        $.each(dbProducts, function () {
          getFileUrl(this.imageName);
        });
      }, 500);
    } else if (dbProducts.length == 0 && !(allProducts.length == 0)) {
      clearInterval(setUrls);
      loadHome();
      clearInterval(loadPage);
    }
  }, 500);


  function loadHome(){
    debugger;
    //Load Product Master Data
    products = allProducts;
    //Load Hot Products
    loadHotProducts();

    /*****************   Populating UI Section Start **************/
    //populate products
    populateProducts();
    //populate top selling products
    populateHotProducts();
    // populate paginations
    populatePagination();
    //populate Products and Filters
    populateFilters();
  }
 
  /****Load Filters Master Data End*****/



function getFileUrl(filename) {
  //create a storage reference
  var storage = firebase.storage().ref(filename);
  //get file url
  storage
    .getDownloadURL()
    .then(function (url) {
      //console.log(url);
      removeTempProd(filename,url);
    })
    .catch(function (error) {
      console.log("error encountered");
      removeTempProd(filename,"");
    });
}

function removeTempProd(filename, url) {
  $.each(dbProducts, function () {
    if (this.imageName == filename) {
      var p = this;
      if (!(url == "")) {
        p.imageUrl = url;
      }
      allProducts.push(p);
      var pIndex = dbProducts.findIndex((c) => c.name === p.name);
      dbProducts.splice(pIndex, 1);
    }
  });
}

function loadFilters() {
  for (var p in products) {
    var catIndex = categoryList.findIndex(
      (c) => c.name === allProducts[p].category
    );
    if (catIndex >= 0) {
      categoryList[catIndex].count += 1;
    }

    var brandIndex = brandList.findIndex(
      (b) => b.name === allProducts[p].brand
    );
    if (brandIndex >= 0) {
      brandList[brandIndex].count += 1;
    }
  }
}

function loadHotProducts() {
  $.each(allProducts, function () {
    if (this.hot == true || this.hot == 'TRUE') {
      hotProducts.push(this);
    }
  });
}

function applyFilter() {
  
  var tempProducts = [];

  var catFilter = [];
  var brandFilter = [];
  filteredProducts = [];
  $.each(categoryList, function () {
    if (this.filter == true || this.filter == 'TRUE') {
      catFilter.push(this.name);
    }
  });

  $.each(brandList, function () {
    if (this.filter == true || this.filter == 'TRUE') {
      brandFilter.push(this.name);
    }
  });

  if (catFilter.length > 0) {
    $.each(allProducts, function () {
      if (catFilter.indexOf(this.category) != -1) {
        tempProducts.push(this);
      }
    });
  } else {
    tempProducts = allProducts;
  }

  if (brandFilter.length > 0) {
    
    $.each(tempProducts, function () {
      
      if (brandFilter.indexOf(this.brand) != -1) {
        
        filteredProducts.push(this);
      }
    });
    
  } else {
    
    filteredProducts = tempProducts;
  }

  filterByPice(filteredProducts);
  products = filteredProducts;
  resetProductsNoCatagoryOrBrandFilter();
}

function filterByPice(productsList) {

  var tempProducts = [];
  $.each(productsList, function () {
    if (
      parseInt(this.discountedPrice) >= parseInt(min_price) &&
      parseInt(this.discountedPrice) <= parseInt(max_price)
    ) {
      tempProducts.push(this);
    }
  });
  filteredProducts = tempProducts;
}

function resetProductsNoCatagoryOrBrandFilter() {
  var categoryIndex = categoryList.findIndex((c) => c.filter == true);
  var brandIndex = brandList.findIndex((b) => b.filter == true);
  if (!(categoryIndex >= 0 || brandIndex >= 0)) {
    filterByPice(allProducts);
    products = filteredProducts;
  }
}

function filterProducts() {
  applyFilter();
  populateProducts();
  populatePriceFilter();
}

function resetFilters() {
  $.each(categoryList, function () {
    this.filter = false;
  });

  $.each(brandList, function () {
    this.filter = false;
  });
debugger;
resetPriceFilter();
}

function resetPriceFilter(){

  min_price = 0;
  max_price = 500000;

  $("#price-min").val(min_price);
  $("#price-max").val(max_price);
  var priceSlider = document.getElementById('price-slider');
	priceSlider.noUiSlider.set([min_price, max_price]);
}

function setFilter(id, isfilter) {
  var categoryIndex = categoryList.findIndex((c) => c.name === id);
  var brandIndex = brandList.findIndex((b) => b.name === id);
  if (categoryIndex >= 0) {
    categoryList[categoryIndex].filter = isfilter;
  }
  if (brandIndex >= 0) {
    brandList[brandIndex].filter = isfilter;
  }
}

function resetHome() {
  debugger;
  resetFilters();
  loadHome();
}

function setHotProducts() {
  products = hotProducts;
  resetFilters();
  populateProducts();
  populateFilters();
}

function populateProducts(page) {
  if (products.length > 0) {
    var productsPerPage  = $(window).width() < 480 ? 2 :8;
    $("#productDiv").empty();
    sortProducts(order);
    var startAt = 1;
    var endAt = productsPerPage;
    var showingProducts = productsPerPage;

    if (page == undefined) {
      startAt = 1;
      if (products.length < productsPerPage) {
        endAt = products.length;
      }
    } else {
      startAt = (parseInt(page) - 1) * productsPerPage;

      if (products.length - startAt < productsPerPage) {
        endAt = products.length;
        showingProducts = products.length - startAt + 1;
      } else {
        endAt = startAt + productsPerPage -1;
        showingProducts = productsPerPage;
      }
    }

    if(parseInt(page)==1){
      startAt = 1;
      endAt = endAt + 1;
    }

    for (var p = startAt - 1; p < endAt; p++) {
      $("#productDiv").append(
        '<div class="col-md-3 col-xs-6">' +
          '<div class="product">' +
          '<div id='+products[p].name+' class="product-img">' +
          '<img src='+products[p].imageUrl+' alt="">' +
          "</div>" +
          '<div class="product-body">' +
          '<p class="product-category">' +
          products[p].category +
          "</p>" +
          '<h3 class="product-name"><a href="#">' +
          products[p].name +
          "</a></h3>" +
          '<h4 class="product-price">&#x20B9; ' +
          products[p].discountedPrice +
          '&nbsp<del class="product-old-price">&#x20B9;  ' +
          products[p].price +
          "</del></h4>" +
          "</div>" +
          '<div class="add-to-cart">' +
          '<button class="add-to-cart-btn sendMessage" id="'+products[p].name+'">'+
          '<i class="fa fa-whatsapp sendMessage"></i> Send Message</button>' +
          "</div>" +
          "</div>" +
          "</div>"
      );
    }
    $("#productQty").text(
      "SHOWING " + showingProducts + " - " + products.length + " PRODUCTS."
    );

    populatePagination(productsPerPage, page);
    
    bindWhatspp();
  }
}

function populatePagination(productsPerPage, page) {
  if (!(productsPerPage == undefined)) {
    var maxPageCount = 3;
    if(page==undefined){
      page = 1;
    }
    var pages = 0;
    $("#pagination").empty();
    
    if (products.length > 0) {
   
      var currentPage = parseInt(page)+1;
      $("#pagination").append(
        '  <span class="store-qty active">Currrent Page:&nbsp&nbsp&nbsp'+page+"</span>"
      );

      if (products.length <= productsPerPage) {
        pages = 1;
        $("#pagination").append(
          '  <li class="nextPage active" value="'+i+'">' + i + "</li>"
        );
      } else {
        pages = Math.ceil(products.length / productsPerPage);
        for (var i = 1; i <= pages && i<=maxPageCount; i++) {
          if (parseInt(page) == i) {
            $("#pagination").append(
              '  <li class="nextPage active" value="'+i+'">' + i + "</li>"
            );
          } else {
            $("#pagination").append(
              '  <li><a href="#" class="nextPage" value="'+i+'">' + i + "</a></li>"
            );
          }
        }

        if (parseInt(pages) > maxPageCount && parseInt(page) < pages ) {
          var caretPage;
          if (parseInt(page) > maxPageCount) {
            caretPage = parseInt(page) + 1;
          } else {
            caretPage = parseInt(maxPageCount) + 1;
          }

          if(parseInt(page)>maxPageCount){
            $("#pagination").append(
              '  <li class="nextPage fa fa-angle-right active" value="'+caretPage+'">'+ "</li>"
            );
          }else{
          $("#pagination").append(
            '  <li class="nextPage fa fa-angle-right" value="'+caretPage+'">'+ "</li>"
          );
         }
        }
      }
    }
  }
}

function populateFilters() {
  $("#categoryFilter").empty();
  for (var c in categoryList) {
    $("#categoryFilter").append(
      '<div class="input-checkbox">' +
        '<input type="checkbox" id="' +
        categoryList[c].name +
        '">' +
        '<label for="' +
        categoryList[c].name +
        '">' +
        "<span></span>" +
        categoryList[c].name +
        "<small>  (" +
        categoryList[c].count +
        ")</small>" +
        "</label>" +
        "</div>"
    );
    $("#" + categoryList[c].name + "").prop("checked", categoryList[c].filter);
  }

  $("#brandFilter").empty();
  for (var b in brandList) {
    $("#brandFilter").append(
      '<div class="input-checkbox">' +
        '<input type="checkbox" id="' +
        brandList[b].name +
        '" />' +
        '<label for="' +
        brandList[b].name +
        '">' +
        "<span></span>" +
        brandList[b].name +
        "<small>  (" +
        brandList[b].count +
        ")</small>" +
        "</label>" +
        "</div>"
    );
    $("#" + brandList[b].name + "").prop("checked", brandList[b].filter);
  }
}

function populateHotProducts() {
  $("#topSelling").empty();
  for (var p in hotProducts) {
    $("#topSelling").append(
      '<div class="product-widget">' +
        '<div class="product-img">' +
        '<img src='+products[p].imageUrl+' alt="" />' +
        "</div>" +
        '<div class="product-body">' +
        '<p class="product-category">' +
        products[p].category +
        "</p>" +
        '<h3 class="product-name">' +
        '<a href="#">' +
        products[p].name +
        "</a>" +
        "</h3>" +
        '<h4 class="product-price">&#x20B9;  ' +
        products[p].discountedPrice +
        '&nbsp <del class="product-old-price">&#x20B9;  ' +
        products[p].price +
        "</del>" +
        "</h4>" +
        "</div>" +
        "</div>"
    );
  }
}

function populatePriceFilter() {
  $("#price-min").val(min_price);
  $("#price-max").val(max_price);
}

function populateSearchCategories() {
  $("#searchCat").empty();
  $("#searchCat").append('<option value="All">ALL</option>');
  for (var c in categoryList) {
    $("#searchCat").append(
      ' <option value="' +
        categoryList[c].name +
        '">' +
        categoryList[c].name +
        "</option>"
    );
  }
}

function search(cat, val) {
  var matchedProducts = [];
  val = val.toUpperCase();
  if (val == undefined || val == "") {
    products = allProducts;
  } else {
    if (cat == "All" || cat == undefined) {
      $.each(allProducts, function () {
        if (
          this.name.toUpperCase().indexOf(val) >= 0 ||
          this.category.toUpperCase().indexOf(val) >= 0 ||
          this.brand.toUpperCase().indexOf(val) >= 0||
          this.discountedPrice.toString().indexOf(val) >= 0
        ) {
          matchedProducts.push(this);
        }
      });
    } else {
      $.each(allProducts, function () {
        if (
          (this.brand == cat || this.category == cat) &&
          this.name.toUpperCase().indexOf(val) >= 0
        ) {
          
          matchedProducts.push(this);
        }
      });
    }
    products = matchedProducts;
  }
  populateProducts();
}

function sortProducts(order) {
  if (order == "LH") {
    products.sort(function (a, b) {
      return a.discountedPrice - b.discountedPrice;
    });
  } else if (order == "HL") {
    products.sort(function (a, b) {
      return b.discountedPrice - a.discountedPrice;
    });
  } else {
    products.sort(function (a, b) {
      return a.rank - b.rank;
    });
  }
}

$(document).on("change", 'input[type="checkbox"]', function () {
  var id = $(this).attr("id");
  var isChecked = $(this).is(":checked");
  setFilter(id, isChecked);
  filterProducts();
});

$(document).on('click', '.nextPage', function(){ 
  var page = $(this).attr("value");
  populateProducts(page);
});

$(".linkFilter").click(function (e) {
  resetFilters();
  var id = this.text;
  setFilter(id, true);
  filterProducts();
  populateFilters();
});

$(".home").click(function (e) {
  debugger;
  resetHome();
});

$(".hot").click(function (e) {
  setHotProducts();
});

$("#btnSearch").click(function () {
  ipSearch = $("#ipSearch").val();
  search(searchCat, ipSearch);
});

$("#ipSearch").on("input", function () {
  var ipSearch = $("#ipSearch").val();
  var searchCat = $("#searchCat").val();
  if (!(ipSearch == undefined)) {
    search(searchCat, ipSearch);
  }
});

$("#sorting").change(function () {
  order = $("#sorting").val();
  populateProducts();
});

$("#price-min").change(function () {
  min_price = parseInt($("#price-min").val());
  max_price = parseInt($("#price-max").val());
  filterProducts();
});

$("#price-max").change(function () {
  min_price = parseInt($("#price-min").val());
  max_price = parseInt($("#price-max").val());
  filterProducts();
});

var priceSlider = document.getElementById("price-slider");
if (priceSlider) {
  priceSlider.noUiSlider.on("update", function () {
    min_price = parseInt($("#price-min").val());
    max_price = parseInt($("#price-max").val());
    filterProducts();
  });
}

function bindWhatspp() {
  $(".sendMessage").on("click", function () {
    var id = $(this).attr("id");
    var product;
    $.each(allProducts, function () {
      if (this.name == id) {
        product = this;
      }
    });
    var message =
      "Hi I would like to know more about product " +
      id +
      "%0a which is listed for %E2%82%B9" +
      product.discountedPrice;
    var url =
      "https://api.whatsapp.com/send?phone=" +
      phoneNumber +
      "&text=%20" +
      message +
      "%0a Click here to see the product image https://shreeetof.web.app/img/" +
      product.name +
      ".png";
    window.open(url, "_blank");
  });
}

});