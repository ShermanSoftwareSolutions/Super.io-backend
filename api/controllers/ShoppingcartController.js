/**
 * ShoppingcartController
 *
 * @description :: Server-side logic for managing shoppingcarts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

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

  scan: function (req, res) {
    scannedProduct = {
      shoppingcartId: req.body.shoppingcartId,
      productId: req.body.productId,
      scanned: false,
      amount: 1
    };

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
  }
};

