/**
 * ShoppingcartController
 *
 * @description :: Server-side logic for managing shoppingcarts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  create: function (req, res) {
    var list = {
      shoppinglistId: req.body.shoppinglistId,
      userId: req.userId
    };

    Shoppinglist
      .findOne({id: list.shoppinglistId})
      .populate('lines')
      .then(function (list) {
        if (!list)
          return res.status(422).json('Invalid input');

        return res.json(list);

        //Shoppingcart
        //  .create(list)
        //  .then(function (cart) {
        //
        //  })
      })
  }

};

