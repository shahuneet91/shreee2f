var categoryEnum = {
  Laptops: "Laptops",
  Smartphones: "Smartphones",
  Refrigerator: "Refrigerator",
  Microwave: "Microwave",
  Watches: "Watches",
  Headphones: "Headphones",
};

class category {
  constructor(name, count, filter) {
    this.name = name;
    this.count = count;
    this.filter = filter;
  }
}
var categoryList = [];
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
  constructor(name, count, filter) {
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

db.collection("categories")
  .get()
  .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      categoryList.push(new category(doc.data().category, 0, false));
    });
  });

db.collection("brands")
  .get()
  .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      brandList.push(new category(doc.data().brand, 0, false));
    });
  });

class product {
  constructor(
    sku,
    name,
    category,
    brand,
    price,
    discount,
    dicountPercent,
    hot,
    latest,
    rank,
    discountedPrice,
    imageName,
    imageUrl
  ) {
    this.sku = sku
    this.name = name;
    this.category = category;
    this.brand = brand;
    this.price = price;
    this.discount = discount;
    this.dicountPercent = dicountPercent;
    this.hot = hot;
    this.latest = latest;
    this.rank = rank;
    this.discountedPrice = discountedPrice;
    this.imageName = imageName;
    this.imageUrl = imageUrl;
  }
}

var allProducts = [];
var dbProducts = [];

db.collection("products")
  .get()
  .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      dbProducts.push(
        new product(
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
  });




