/**
 * ShoppinglistController
 *
 * @description :: Server-side logic for managing shoppinglists
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /**
   * Finds all the shoppinglists for the user
   *
   * @param req
   * @param res
   */
  find: function (req, res) {
    Shoppinglist
      .find({userId: req.userId})
      .populate('lines')
      .then(function (shoppinglists) {
        return res.json(shoppinglists);
      })
  },

  /**
   * Find a shoppinglist with all it's products
   *
   * @param req
   * @param res
   */
  findOne: function (req, res) {
    Shoppinglist
      .findOne({id: req.params.id, userId: req.userId})
      .populate('lines')
      .then(function (list) {
        if (!list)
          return res.notFound();

        // Get all the product id's that are in this shoppinglist
        var productIds = [];
        list.lines.map(function (item, id) {
          productIds.push(item.productId);
          list.lines[id].product = [];
        });

        // Fetch all the products and append it to the list
        Product
          .find({id: productIds})
          .then(function (products) {
            var shoppinglist = list.toObject();

            products.map(function (productItem) {
              shoppinglist.lines.map(function (listItem, id) {
                if (productItem.id == listItem.productId) {
                  shoppinglist.lines[id].product = productItem;
                }
              })
            });
            return res.json(shoppinglist)
          });
      })
  },

  /**
   * Creates a new shoppinglist
   *
   * @param req
   * @param res
   * @returns {*}
   */
  create: function (req, res) {
    var list = {
      title: req.body.title,
      userId: req.userId
    };

    // Check if the input is not null
    if (list.title == '' || list.title == undefined)
      return res.invalidInput();

    Shoppinglist
      .create(list)
      .then(function (newList) {
        return res.json(newList);
      });
  },

  /**
   * Deletes an shoppinglist with it's id
   *
   * @param req
   * @param res
   * @returns {*}
   */
  delete: function (req, res) {
    var list = {
      id: req.params.id
    };

    // Check if the input is not null
    if (list.id == '' || list.id == undefined)
      return res.invalidInput();

    Shoppinglist
      .destroy({id: list.id, userId: req.userId})
      .then(function (list) {
        if (!list)
          return res.invalidInput();

        return res.json(list);
      });
  },

  /**
   * Fetches a shoppinglist and all it's products
   *
   * @param req
   * @param res
   * @returns {*}
   */
  addProduct: function (req, res) {
    var line = {
      shoppinglistId: req.params.listId,
      productId: req.params.productId,
      amount: req.body.amount
    };

    // Set amount to 1 if it's null
    if (line.amount == '' || line.amount == undefined)
      line.amount = 1;

    // Check if the input is not null
    if (line.shoppinglistId == '' || line.shoppinglistId == undefined || line.productId == '' || line.productId == undefined)
      return res.invalidInput();

    // Check if the shoppinglist exists
    Shoppinglist.findOne({id: line.shoppinglistId}).then(function (list) {
      if (!list)
        return res.invalidInput();

      // Check if the products exist
      Product.findOne({id: line.productId}).then(function (product) {
          if (!product)
            return res.invalidInput();

          // Check whether the input already exists
          ShoppinglistLine
            .find({shoppinglistId: line.shoppinglistId})
            .where({productId: line.productId})
            .then(function (shoppinglistLines) {
              if (shoppinglistLines.length == 0) {
                // Create a new shoppinglist line for the added product
                ShoppinglistLine
                  .create(line)
                  .then(function (newLine) {
                    return res.json(newLine);
                  })
              } else {
                // If it exists, update it
                shoppinglistLines[0].amount += parseInt(line.amount);
                shoppinglistLines[0].save();
                return res.json(shoppinglistLines[0]);
              }
            });
        }
      )
    })
    ;
  },

  /**
   * Changes the amount of a product in a shoppinglist
   *
   * @param req
   * @param res
   * @returns {*}
   */
  changeAmount: function (req, res) {
    var line = {
      shoppinglistId: req.params.listId,
      productId: req.params.productId,
      amount: req.body.amount
    };

    // Check if the input is valid
    if (line.shoppinglistId == '' || line.shoppinglistId == undefined || line.productId == '' || line.productId == undefined || !(line.amount >= 0) || line.amount == undefined || line.amount == '')
      return res.invalidInput();

    // Check if product exists
    Product
      .findOne({id: line.productId})
      .then(function (product) {
        if (!product)
          return res.invalidInput();

        // If the amount is 0, delete the shoppinglist line
        if (line.amount == 0) {
          ShoppinglistLine
            .destroy({shoppinglistId: line.shoppinglistId, productId: line.productId})
            .then(function (line) {
              if (!line)
                return res.invalidInput();

              return res.json(line);
            });
        } else {
          // Otherwise update the amount of shoppinglist line
          ShoppinglistLine
            .update({shoppinglistId: line.shoppinglistId, productId: line.productId},
              {amount: line.amount})
            .then(function (line) {
              if (!line)
                return res.invalidInput();

              return res.json(line);
            });
        }
      });
  }
}
;

