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
  }
};

