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
      .populate('lines', {scanned: true})
      .then(function (productList) {
        if (!productList)
          return res.invalidInput();

        sails.log(JSON.stringify(productList, null, 4));
        
        // The response
        var response = {products: []};
        // To store the id's for the invalid products. Necessary to find the products in the DB later on
        var invalidProductQuery = [];

        // Compare the two lists
        for (var j = 0; j < productList.lines.length; j++) {
          var productFound = false;
          for (var i = 0; !productFound && (i < req.body.products.length); i++) {
            if (req.body.products[i].productId == productList.lines[j].productId) {
              // If the product amounts are not equal, store it for the response
              if (req.body.products[i].amount != productList.lines[j].amount) {
                response.products.push({
                  productId: productList.lines[j].productId,
                  amount: (productList.lines[j].amount - req.body.products[i].amount)
                });
                invalidProductQuery.push(productList.lines[j].productId);
              }

              // Remove the checked products
              req.body.products.splice(i, 1);
              i--;
              productList.lines.splice(j, 1);
              j--;
              productFound = true;
            }
          }
        }

        // A function to add items to the response
        var addFunction = function (item, modifier) {
          response.products.push({productId: item.productId, amount: (modifier * item.amount)});
          invalidProductQuery.push(item.productId);
        };

        // Add the missing items to the response
        req.body.products.forEach(function (item) {
          addFunction(item, -1);
        });

        // Add the extra items to the response
        productList.lines.forEach(function (item) {
          addFunction(item, 1);
        });

        // Check if the response length is zero, if so, everything is fine
        if (response.products.length == 0) {
          return res.ok();
        }

        // Add the names to the response
        Product
          .find({id: invalidProductQuery})
          .then(function (productList) {
            if (!productList)
              return res.invalidInput();

            response.products.forEach(function (item) {
              var nameFound = false;
              for (var i = 0; !nameFound && (i < productList.length); i++) {
                if (item.productId == productList[i].id) {
                  item.title = productList[i].title;
                  productList.splice(i, 1);
                  i--;
                  nameFound = true;
                }
              }
            });
            return res.json(response);
          });
      });
  }
};

