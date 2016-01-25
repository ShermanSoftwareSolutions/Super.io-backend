/**
 * InvoiceController
 *
 * @description :: Server-side logic for managing invoices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /**
   * Create a new invoice
   * @param req
   * @param res
   */
  create: function (req, res) {
    var priceExclusive = 0;
    var priceInclusive = 0;

    // Find the corresponding shoppingcart
    Shoppingcart
      .findOne({id: req.body.shoppingcartId})
      .populate('lines')
      .then(function (productList) {
        if (!productList)
          return res.notFound();

        // Get the product id's
        var productIds = [];
        var productAmountMap = {};
        productList.lines.map(function (item) {
          if (item.scanned == true) {
            productIds.push(item.productId);
            productAmountMap[item.productId] = item.amount;
          }
        });

        // Find the products and calculate the incl and excl price
        Product
          .find({id: productIds})
          .then(function (products) {
            products.map(function (item) {
              priceInclusive += item.price * productAmountMap[item.id];
              priceExclusive += (item.price * productAmountMap[item.id]) / (1 + (parseFloat(item.salesTax) / 100));
            })
          }).then(function () {

          var newInvoice = {
            shoppingcartId: req.body.shoppingcartId,
            priceExcl: priceExclusive.toFixed(2),
            priceIncl: priceInclusive.toFixed(2)
          };

          // Create the invoice
          Invoice
            .create(newInvoice)
            .then(function (invoice) {
              return res.json(invoice);
            })
        })
      })
  },

  /**
   * Get the receipt
   * @param req
   * @param res
   */
  getReceipt: function (req, res) {
    Invoice
      .findOne({id: req.body.invoiceId})
      .then(function (invoice) {
        if (!invoice)
          return res.notFound();

        // The total amount of products
        invoice.totalAmount = 0;

        // Sales Tax parts of the final receipt
        invoice.salesTax6Excl = 0;
        invoice.salesTax6ToPay = 0;
        invoice.salesTax21Excl = 0;
        invoice.salesTax21ToPay = 0;

        // Create an array for the products in the invoice
        invoice.products = [];

        // Find the corresponding shoppingcart
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

            // Find all the products and add them to the receipt
            Product
              .find({id: productIds})
              .then(function (products) {
                products.map(function (item) {

                  // Calculate the important information like amount and total price and taxes
                  item.amount = productAmountMap[item.id];
                  item.totalPrice = (item.price * productAmountMap[item.id]);
                  invoice.totalAmount += item.amount;
                  var itemPriceExcl = ((item.price * productAmountMap[item.id]) / (1 + (parseFloat(item.salesTax) / 100)));
                  var itemSalesTaxTotal = (item.price * productAmountMap[item.id]) - itemPriceExcl;

                  // Add taxes to the relevant parts of the receipt
                  if (item.salesTax == 6) {
                    invoice.salesTax6Excl += itemPriceExcl;
                    invoice.salesTax6ToPay += itemSalesTaxTotal;
                  } else {
                    invoice.salesTax21Excl += itemPriceExcl;
                    invoice.salesTax21ToPay += itemSalesTaxTotal;
                  }

                  // Remove useless parts
                  delete item["image"];
                  delete item["createdAt"];
                  delete item["updatedAt"];
                  delete item["salesTax"];
                  delete item["id"];
                  invoice.products.push(item);
                });

                // Clean up the prices
                invoice.salesTax6Excl = invoice.salesTax6Excl.toFixed(2);
                invoice.salesTax6ToPay = invoice.salesTax6ToPay.toFixed(2);
                invoice.salesTax21Excl = invoice.salesTax21Excl.toFixed(2);
                invoice.salesTax21ToPay = invoice.salesTax21ToPay.toFixed(2);

                return res.json(invoice);
              });
          });
      })
  },

  /**
   * Pay for a given invoice
   * @param req
   * @param res
   */
  pay: function (req, res) {
    Invoice
      .findOne({id: req.body.invoiceId})
      .where({paid: false})
      .then(function (invoice) {
        if (!invoice)
          return res.notFound();

        invoice.paid = true;
        invoice.save();

        return res.ok();
      });
  }
}

