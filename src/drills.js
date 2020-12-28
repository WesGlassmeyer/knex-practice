require("dotenv").config();
const knex = require("knex");

const knexInstance = knex({
  client: "pg",
  connection: process.env.DB_URL,
});

function searchByItemName(searchTerm) {
  knexInstance
    .select("*")
    .from("shopping_list")
    .where("name", "ILIKE", `%${searchTerm}%`)
    .then((result) => {
      console.log("SEARCH TERM", { searchTerm });
      console.log(result);
    });
}

searchByItemName("urger");

function paginateItems(page) {
  const limit = 6;
  const offset = limit * (page - 1);
  knexInstance
    .select("*")
    .from("shopping_list")
    .limit(limit)
    .offset(offset)
    .then((result) => {
      console.log("PAGINATE ITEMS", { page });
      console.log(result);
    });
}

paginateItems(2);

function productsAddedDaysAgo(daysAgo) {
  knexInstance
    .select("id", "name", "price", "date_added", "checked", "category")
    .from("shopping_list")
    .where(
      "date_added",
      ">",
      knexInstance.raw(`now() - '?? days':: INTERVAL`, daysAgo)
    )
    .then((results) => {
      console.log("PRODUCTS ADDED DAYS AGO");
      console.log(results);
    });
}

productsAddedDaysAgo(5);

function costPerCategory() {
  knexInstance
    .select("category")
    .sum("price as total")
    .from("shopping_list")
    .groupBy("category")
    .then((result) => {
      console.log("COST PER CATEGORY");
      console.log(result);
    });
}

costPerCategory();
