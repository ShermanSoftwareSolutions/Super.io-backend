/**
 * InvoiceController
 *
 * @description :: Server-side logic for managing invoices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  create: function (req, res) {
    var priceExclusive = 0;
    var priceInclusive = 0;

    Shoppingcart
      .findOne({id: req.body.shoppingcartId})
      .populate('lines')
      .then(function (productList) {
        if (!productList)
          return res.notFound();

        var productIds = [];
        var productAmountMap = {};
        productList.lines.map(function (item) {
          if (item.scanned == true) {
            productIds.push(item.productId);
            productAmountMap[item.productId] = item.amount;
          }
        });
        sails.log(JSON.stringify(productIds, null, 4));

        Product
          .find({id: productIds})
          .then(function (products) {
            sails.log(JSON.stringify(products, null, 4));
            products.map(function (item) {
              priceInclusive += item.price * productAmountMap[item.id];
              priceExclusive += (item.price * productAmountMap[item.id]) / (1 + (parseFloat(item.salesTax) / 100));
            })
          }).then(function () {
          sails.log("Incl: " + priceInclusive.toFixed(2));
          sails.log("Excl: " + priceExclusive.toFixed(2));
          var newInvoice = {
            shoppingcartId: req.body.shoppingcartId,
            priceExcl: priceExclusive.toFixed(2),
            priceIncl: priceInclusive.toFixed(2)
          };

          Invoice
            .create(newInvoice)
            .then(function (invoice) {
              return res.json(invoice);
            })
        })
      })
  },

  getReceipt: function (req, res) {
    Invoice
      .findOne({id: req.body.invoiceId})
      .where({paid: false})
      .then(function (invoice) {
        if (!invoice)
          return res.notFound();
        sails.log(JSON.stringify(invoice, null, 4));

        invoice.products = [];
        Shoppingcart
          .findOne({id: invoice.shoppingcartId})
          .populate('lines')
          .then(function (productList) {
            var productIds = [];
            var productAmountMap = {};
            productList.lines.map(function (item) {
              if (item.scanned == true) {
                productIds.push(item.productId);
                productAmountMap[item.productId] = item.amount;
              }
            });

            Product
              .find({id: productIds})
              .then(function (products) {
                sails.log(JSON.stringify(products, null, 4));
                products.map(function (item) {
                  item.amount = productAmountMap[item.id];
                  delete item["image"];
                  delete item["createdAt"];
                  delete item["updatedAt"];
                  invoice.products.push(item);
                });
                return res.json(invoice);
              });


          });
      })
  }
}

