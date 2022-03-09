var categoryEnum = {
  Laptops: "Laptops",
  Smartphones: "Smartphones",
  Refrigerator: "Refrigerator",
  Microwave: "Microwave",
  Watches: "Watches",
  Headphones: "Headphones",
};

class category {
  constructor(id, name, count, filter) {
    this.id = id;
    this.name = name;
    this.count = count;
    this.filter = filter;
  }
}
var categoryList = [];
//localStorage.clear();
if (localStorage.getItem("allCategories")) {
  var categoriesCache = window.localStorage.getItem("allCategories");
  if (categoriesCache != undefined && categoriesCache != "[]") {
    //alert("local has cat");
    categoryList = JSON.parse(categoriesCache);
  }
}

if (categoryList.length == 0) {
  //alert("calling db for cat");
  db.collection("categories")
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        categoryList.push(new category(doc.id, doc.data().category, 0, false));
      });
      var categoriesJson = JSON.stringify(categoryList);
      window.localStorage.setItem("allCategories", categoriesJson);
    });
}

// categoryList.push(new category(categoryEnum.Laptops, 0, false));
// categoryList.push(new category(categoryEnum.Smartphones, 0, false));
// categoryList.push(new category(categoryEnum.Refrigerator, 0, false));
// categoryList.push(new category(categoryEnum.Microwave, 0, false));
// categoryList.push(new category(categoryEnum.Watches, 0, false));
// categoryList.push(new category(categoryEnum.Headphones, 0, false));

var brandEnum = {
  Apple: "Apple",
  Samsung: "Samsung",
  LG: "LG",
  Haier: "Haier",
  Bosch: "Bosch",
  Sony: "Sony",
};

class brand {
  constructor(id, name, count, filter) {
    this.id = id;
    this.name = name;
    this.count = count;
    this.filter = filter;
  }
}
var brandList = [];
// brandList.push(new brand(brandEnum.Apple, 0, false));
// brandList.push(new brand(brandEnum.Samsung, 0, false));
// brandList.push(new brand(brandEnum.LG, 0, false));
// brandList.push(new brand(brandEnum.Haier, 0, false));
// brandList.push(new brand(brandEnum.Bosch, 0, false));
// brandList.push(new brand(brandEnum.Sony, 0, false));

if (localStorage.getItem("allBrandList")) {
  var brandsCache = window.localStorage.getItem("allBrandList");
  if (brandsCache != undefined && brandsCache != "[]") {
    //alert("local has brand");
    brandList = JSON.parse(brandsCache);
  }
}

if (brandList.length == 0) {
  //alert("calling db for brand");
  db.collection("brands")
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        brandList.push(new brand(doc.id, doc.data().brand, 0, false));
      });
      var brnadsJson = JSON.stringify(brandList);
      window.localStorage.setItem("allBrandList", brnadsJson);
    });
}

class product {
  constructor(
    id,
    sku,
    name,
    category,
    brand,
    price,
    discount,
    percent,
    hot,
    latest,
    rank,
    disPrice,
    imageName,
    imageUrl
  ) {
    this.id = id,
    this.sku = sku;
    this.name = name;
    this.category = category;
    this.brand = brand;
    this.price = price;
    this.discount = discount;
    this.percent = percent;
    this.hot = hot;
    this.latest = latest;
    this.rank = rank;
    this.discPrice = disPrice;
    this.imageName = imageName;
    this.imageUrl = imageUrl;
  }
}

var dbProducts = [];

if (localStorage.getItem("dbProducts")) {
  var productsCache = window.localStorage.getItem("dbProducts");
  if (productsCache != undefined && productsCache != "[]") {
    //alert("local has products");
    dbProducts = JSON.parse(productsCache);
  }
}

if (dbProducts.length == 0) {
  //alert("calling db for products");
  db.collection("products")
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        dbProducts.push(
          new product(
            doc.id,
            doc.data().sku,
            doc.data().name,
            doc.data().category,
            doc.data().brand,
            parseInt(doc.data().price),
            doc.data().discount,
            parseInt(doc.data().percent),
            doc.data().hot,
            doc.data().latest,
            doc.data().rank,
            parseInt(doc.data().discountPrice),
            doc.data().imageName
          )
        );
      });
      debugger;
      var productsJson = JSON.stringify(dbProducts);
      window.localStorage.setItem("dbProducts", productsJson);
    });
}

class bill {
  constructor(
    billId,
    billDate,
    customerName,
    customerAdd1,
    customerAdd2,
    items,
    totalPrice,
    totalDiscount,
    billAmount,
    paid,
    employee
  ) {
    this.billId = billId;
    this.billDate = billDate;
    this.customerName = customerName;
    this.customerAdd1 = customerAdd1;
    this.customerAdd2 = customerAdd2;
    this.items = items;
    this.totalPrice = totalPrice;
    this.totalDiscount = totalDiscount;
    this.billAmount = billAmount;
    this.paid = paid;
    this.employee = employee;
  }
}

class billItem {
  constructor(sku, name, price, discountPercent, discountPrice, qty) {
    this.sku = sku;
    this.name = name;
    this.price = price;
    this.discountPercent = discountPercent;
    this.discountPrice = discountPrice;
    this.qty = qty;
  }
}

