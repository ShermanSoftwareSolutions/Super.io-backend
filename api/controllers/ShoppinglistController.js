/**
 * ShoppinglistController
 *
 * @description :: Server-side logic for managing shoppinglists
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  find: function (req, res) {
    Shoppinglist
      .find({userId: req.userId})
      .populate('lines')
      .then(function (shoppinglists) {
        shoppinglists.map(function (item, id) {
          var listLength = item.lines.length;
          shoppinglists[id].lines = undefined;
          shoppinglists[id].count = listLength;
        });

        return res.json(shoppinglists);
      })
  },

  findOne: function (req, res) {
    Shoppinglist
      .findOne({id: req.params.id, userId: req.userId})
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

  create: function (req, res) {
    var list = {
      title: req.body.title,
      userId: req.userId
    };

    if (list.title == '')
      return res.status(422).json('Invalid input');

    Shoppinglist
      .create(list)
      .then(function (newList) {
        return res.json(newList);
      });
  },

  delete: function (req, res) {
    var list = {
      id: req.params.id
    };

    if (list.id == '')
      return res.status(422).json('Invalid input');

    Shoppinglist
      .destroy({id: list.id, userId: req.userId})
      .then(function (list) {
        if (!list)
          return res.status(422).json('Invalid input');

        return res.json(list);
      });
  },

  addProduct: function (req, res) {
    var line = {
      shoppinglistId: req.params.listId,
      productId: req.params.productId,
      amount: req.body.amount
    };

    if (line.shoppinglistId == '' || line.productId == '' || line.amount == '')
      return res.status(422).json('Invalid input');

    Shoppinglist.findOne({id: line.shoppinglistId}).then(function (list) {
      if (!list)
        return res.status(422).json('Invalid input');

      Product.findOne({id: line.productId}).then(function (product) {
        if (!product)
          return res.status(422).json('Invalid input');

        ShoppinglistLine
          .create(line)
          .then(function (newLine) {
            return res.json(newLine);
          })
      })
    });
  },

  changeAmount: function (req, res) {
    var line = {
      shoppinglistId: req.params.listId,
      productId: req.params.productId,
      amount: req.body.amount
    };

    if (line.shoppinglistId == '' || line.productId == '' || !(line.amount >= 0))
      return res.status(422).json('Invalid input');

    if (line.amount == 0) {
      ShoppinglistLine
        .destroy({shoppinglistId: line.shoppinglistId, productId: line.productId})
        .then(function (line) {
          if (!line)
            return res.status(422).json('Invalid input');

          return res.json(line);
        });
    } else {
      ShoppinglistLine
        .update({shoppinglistId: line.shoppinglistId, productId: line.productId},
        {amount: line.amount})
        .then(function (line) {
          if (!line)
            return res.status(422).json('Invalid input');

          return res.json(line);
        });
    }
  }
};

