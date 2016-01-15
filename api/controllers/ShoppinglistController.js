/**
 * ShoppinglistController
 *
 * @description :: Server-side logic for managing shoppinglists
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find: function (req, res) {
    Shoppinglist
      .find({userId: 1}) // TODO: set to req.userId
      .populate('lines')
      .then(function (shoppinglists) {
        shoppinglists.map(function (item) {
          console.log(item.lines.length);
        });
        return res.json(shoppinglists);
      })
  },

  findOne: function (req, res) {
    Shoppinglist
      .findOne({id: req.params.id, userId: 1}) // TODO: set to req.userId
      .populate('lines')
      .then(function (list) {
        if (!list)
          return res.notFound();

        var productIds = [];
        list.lines.map(function (item, id) {
          item.product = undefined;
          productIds.push(item.productId);
          list.lines[id].product = [];
        });

        Product
          .find({id: productIds})
          .then(function (products) {
            var shoppinglist = list.toObject();
            console.log(list);

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
  }
};

