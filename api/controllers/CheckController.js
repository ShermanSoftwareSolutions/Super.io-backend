/**
 * CheckController
 *
 * @description :: Server-side logic for checking a shoppingcart
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /**
   * Check a customers shopping cart
   * @param req
   * @param res
   */
  check: function (req, res) {
    Shoppingcart
      .findOne({id: req.body.shoppingcartId})
      .populate('lines')
      .then(function (productList) {
        if (!productList)
          return res.invalidInput();

        var validCart = true;
        var validProduct = false;

        if (productList.lines.length == req.body.products.length) {
          for (var j = 0; validCart && (j < productList.lines.length); j++) {
            validProduct = false;
            for (var i = 0; !validProduct && (i < req.body.products.length); i++) {
              if (req.body.products[i].productId == productList.lines[j].productId
                && req.body.products[i].amount == productList.lines[j].amount) {
                validProduct = true;
              }
            }
            if (!validProduct)
              validCart = false;
          }
        } else {
          validCart = false;
        }

        if (validCart)
          return res.ok();
        return res.invalidInput();
      });
  }

};

