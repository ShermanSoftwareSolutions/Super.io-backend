/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  /**
   * Gets all the products
   *
   * @param req
   * @param res
   */
  all: function (req, res) {
    Product
      .find({})
      .then(function (products) {
        return res.json(products);
      });
  },

  /**
   * Find the product using a query string to search by title
   *
   * @param req
   * @param res
   */
  findQuery: function (req, res) {
    var query = req.params.query;

    Product
      .find({ title: {'like': '%' + query + '%'}})
      .then(function (products) {
        return res.json(products);
      });
  },

  /**
   * Finds the product by id
   *
   * @param req
   * @param res
   */
  find: function (req, res) {
    var id = req.params.id;

    Product
      .findOne(id)
      .then(function (product) {
        if (!product)
          return res.notFound();

        return res.json(product)
      });
  },

  /**
   * Creates a new product
   *
   * @param req
   * @param res
   * @returns {*}
   */
  create: function (req, res) {
    var newProduct = {
      title: req.body.title,
      price: Number(req.body.price),
      image: req.body.image,
      salesTax: req.body.salesTax
    };

    // Check if the input is not null
    if (newProduct.title == '' || newProduct.title == undefined || newProduct.price == '' || newProduct.price == undefined || newProduct.salesTax == undefined || (newProduct.salesTax != '6' && newProduct.salesTax != '21'))
      return res.status(422).json('Invalid input');

    Product
      .create(newProduct)
      .then(function (product) {
        return res.json(product);
      });
  }


};

