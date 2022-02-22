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
categoryList.push(new category(categoryEnum.Laptops, 0, false));
categoryList.push(new category(categoryEnum.Smartphones, 0, false));
categoryList.push(new category(categoryEnum.Refrigerator, 0, false));
categoryList.push(new category(categoryEnum.Microwave, 0, false));
categoryList.push(new category(categoryEnum.Watches, 0, false));
categoryList.push(new category(categoryEnum.Headphones, 0, false));



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
brandList.push(new brand(brandEnum.Apple, 0, false));
brandList.push(new brand(brandEnum.Samsung, 0, false));
brandList.push(new brand(brandEnum.LG, 0, false));
brandList.push(new brand(brandEnum.Haier, 0, false));
brandList.push(new brand(brandEnum.Bosch, 0, false));
brandList.push(new brand(brandEnum.Sony, 0, false));



class product {
  constructor(
    name,
    category,
    brand,
    price,
    discount,
    dicountPercent,
    hot,
    latest,
    rank,
    discountedPrice
  ) {
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
  }
}
