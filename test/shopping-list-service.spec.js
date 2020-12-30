const ShoppingListService = require("../src/shopping-list-service");
const knex = require("knex");

describe(`Shopping list service object`, function () {
  let db;
  let testShoppingList = [
    {
      id: 1,
      name: "banana",
      price: "2.50",
      date_added: new Date("2029-01-22T16:28:32.615Z"),
      checked: true,
      category: "Snack",
    },
    {
      id: 2,
      name: "cereal",
      price: "4.00",
      date_added: new Date("1919-12-22T16:28:32.615Z"),
      checked: false,
      category: "Breakfast",
    },
    {
      id: 3,
      name: "chicken",
      price: "7.00",
      date_added: new Date("1979-10-24T16:28:32.615Z"),
      checked: true,
      category: "Main",
    },
  ];

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.DB_URL,
    });
  });

  before(() => db("shopping_list").truncate());

  afterEach(() => db("shopping_list").truncate());

  after(() => db.destroy());

  context(`Given 'shopping_list' has data`, () => {
    beforeEach(() => {
      return db.into("shopping_list").insert(testShoppingList);
    });
    it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
      // test that ArticlesService.getAllItems gets data from table
      return ShoppingListService.getAllItems(db).then((actual) => {
        expect(actual).to.eql(
          testShoppingList.map((item) => ({
            ...item,
            date_added: new Date(item.date_added),
          }))
        );
      });
    });
    it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
      const itemId = 3;
      return ShoppingListService.deleteItem(db, itemId)
        .then(() => ShoppingListService.getAllItems(db))
        .then((allItems) => {
          // copy the test items array without the "deleted" article
          const expected = testShoppingList.filter(
            (item) => item.id !== itemId
          );
          expect(allItems).to.eql(expected);
        });
    });
    it(`updateItem() updates an item from the 'shopping_list' table`, () => {
      const idOfItemToUpdate = 3;
      const newItemData = {
        name: "Bologna",
        price: "100.00",
        date_added: new Date(),
        checked: false,
        category: "Lunch",
      };
      return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
        .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
        .then((item) => {
          expect(item).to.eql({
            id: idOfItemToUpdate,
            ...newItemData,
          });
        });
    });
    it(`getById() resolves an item by id from 'shopping_list' table`, () => {
      const thirdId = 3;
      const thirdTestItem = testShoppingList[thirdId - 1];
      return ShoppingListService.getById(db, thirdId).then((actual) => {
        expect(actual).to.eql({
          id: thirdId,
          name: thirdTestItem.name,
          price: thirdTestItem.price,
          date_added: thirdTestItem.date_added,
          checked: thirdTestItem.checked,
          category: thirdTestItem.category,
        });
      });
    });
  });

  context(`Given 'shopping_list' has no data`, () => {
    it(`getAllItems() resolves an empty array`, () => {
      return ShoppingListService.getAllItems(db).then((actual) => {
        expect(actual).to.eql([]);
      });
    });

    it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
      const newItem = {
        name: "new item",
        price: "1.00",
        date_added: new Date("1979-10-24T16:28:32.615Z"),
        checked: true,
        category: "Main",
      };
      return ShoppingListService.insertItem(db, newItem).then((actual) => {
        expect(actual).to.eql({
          id: 1,
          name: newItem.name,
          price: newItem.price,
          date_added: newItem.date_added,
          checked: newItem.checked,
          category: newItem.category,
        });
      });
    });
  });
});
