/**
 * ShoppingcartController
 *
 * @description :: Server-side logic for managing shoppingcarts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /**
   * Find a shoppingcart with all it's products
   *
   * @param req
   * @param res
   */
  findOne: function (req, res) {
    Shoppingcart
      .findOne({id: req.params.id, userId: req.userId})
      .populate('lines')
      .then(function (cart) {
        if (!cart)
          return res.notFound();

        // Get all the product id's that are in this shoppingcart
        var productIds = [];
        cart.lines.map(function (item, id) {
          item.product = undefined;
          productIds.push(item.productId);
          cart.lines[id].product = [];
        });

        // Fetch all the products and append it to the cart
        Product
          .find({id: productIds})
          .then(function (products) {
            var shoppingcart = cart.toObject();

            products.map(function (productItem) {
              shoppingcart.lines.map(function (cartItem, id) {
                if (productItem.id == cartItem.productId) {
                  shoppingcart.lines[id].product = productItem;
                }
              })
            });
            return res.json(shoppingcart);
          });
      })
  },

  /**
   * Creates a shoppingcart with the shoppinglist data
   *
   * @param req
   * @param res
   */
  create: function (req, res) {
    var newList = {
      shoppinglistId: req.body.shoppinglistId,
      userId: req.userId
    };

    Shoppinglist
      .findOne({id: newList.shoppinglistId})
      .populate('lines')
      .then(function (list) {
        if (!list)
          return res.status(422).json('Invalid input');

        list = list.toObject();

        // Delete unnecessary attributes from lines
        list.lines.map(function (item) {
          item.shoppingcartId = item.shoppinglistId;
          item.shoppinglistId = undefined;
          item.id = undefined;
          item.createdAt = undefined;
          item.updatedAt = undefined;
        });

        // Create the shoppingcart
        Shoppingcart
          .create(newList)
          .then(function (cart) {
            // Create a shoppingcart line for every existing product in the shoppingcart
            ShoppingcartLine
              .create(list.lines)
              .then(function (cartLines) {
                cart = cart.toObject();
                cart.lines = cartLines;

                return res.json(cart);
              })
          })
      })
  },

  /**
   * Enables the user to scan a product in the shoppingcart
   *
   * @param req
   * @param res
   */
  scan: function (req, res) {
    scannedProduct = {
      shoppingcartId: req.body.shoppingcartId,
      productId: req.body.productId,
      scanned: false,
      amount: 1
    };

    // Check if the product exists
    Product
      .findOne({id: scannedProduct.productId})
      .then(function (product) {
        if (!product)
          return res.status(422).json('Invalid input');

        ShoppingcartLine
          .findOne({shoppingcartId: scannedProduct.shoppingcartId, productId: scannedProduct.productId})
          .then(function (line) {
            // If line has been found, that means that the item is already in the shoppingcart
            if (line) {
              if (line.scanned) {
                // Line has been scanned, so increment the amount by one
                ShoppingcartLine
                  .update({shoppingcartId: scannedProduct.shoppingcartId, productId: scannedProduct.productId},
                    {amount: line.amount = line.amount + 1})
                  .then(function (cartLine) {
                    return cartLine;
                  })
              } else {
                // Line has not been scanned, so set scanned to true
                ShoppingcartLine
                  .update({shoppingcartId: scannedProduct.shoppingcartId, productId: scannedProduct.productId},
                    {scanned: 1})
                  .then(function (cartLine) {
                    return cartLine;
                  })
              }
              return res.json(line)
            } else {
              // Otherwise it is not in the shoppingcart and needs to be added
              ShoppingcartLine
                .create(scannedProduct)
                .then(function (cartLine) {
                  return res.json(cartLine);
                })
            }
          })
      })
  },

  /**
   * Changes the amount of a product in a shoppingcart
   *
   * @param req
   * @param res
   * @returns {*}
   */
  changeAmount: function (req, res) {
    var line = {
      shoppingcartId: req.params.shoppingcartId,
      productId: req.params.productId,
      amount: req.body.amount
    };

    // Check if the input is valid
    if (line.shoppingcartId == '' || line.productId == '' || !(line.amount >= 0))
      return res.status(422).json('Invalid  input');

    // Check if product exists
    Product
      .findOne({id: line.productId})
      .then(function (product) {
        if (!product)
          return res.status(422).json('Invalid input');

        // If the amount is 0, delete the shoppingcart line
        if (line.amount == 0) {
          ShoppingcartLine
            .destroy({shoppingcartId: line.shoppingcartId, productId: line.productId})
            .then(function (cart) {
              if (!cart)
                return res.status(422).json('Invalid input');

              return res.json(cart);
            });
        } else {
          // Otherwise update the amount of shoppingcart line
          ShoppingcartLine
            .update({shoppingcartId: line.shoppingcartId, productId: line.productId},
              {amount: line.amount})
            .then(function (cart) {
              if (!cart)
                return res.status(422).json('Invalid input');

              return res.json(cart);
            });
        }
      });
  }
};

