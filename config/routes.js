/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /**
   * User routes
   */
  'POST /user/login': 'UserController.login',
  'POST /user/signup': 'UserController.signup',

  /**
   * Product routes
   */
  'GET /product': 'ProductController.all',
  'GET /product/detail/:id': 'ProductController.find',
  'GET /product/:query': 'ProductController.findQuery',
  'POST /product': 'ProductController.create',

  /**
   * Shoppinglist routes
   */
  'GET /shoppinglist': 'ShoppinglistController.find',
  'GET /shoppinglist/:id': 'ShoppinglistController.findOne',
  'POST /shoppinglist': 'ShoppinglistController.create',
  // Missing an endpoint for editing the shoppinglist's title?
  'DELETE /shoppinglist/:id': 'ShoppinglistController.delete',
  'PUT /shoppinglist/:listId/:productId': 'ShoppinglistController.addProduct',
  'PUT /shoppinglist/amount/:listId/:productId': 'ShoppinglistController.changeAmount',

  /**
   * Shoppingcart routes
   */
  'GET /shoppingcart/:id': 'ShoppingcartController.findOne',
  'POST /shoppingcart': 'ShoppingcartController.create',
  'PUT /shoppingcart': 'ShoppingcartController.scan',
  'PUT /shoppingcart/amount/:shoppingcartId/:productId': 'ShoppingcartController.changeAmount',

  /**
   * Invoice routes
   */
  // POST endpoint to create an invoice
  'POST /invoice' : 'InvoiceController.create',
  'POST /invoice/receipt' : 'InvoiceController.getReceipt',
  'POST /invoice/pay'     : 'InvoiceController.pay',

  /**
   * Check routes
   */
  // POST for creating a checking object of sorts?
  'POST /check' : 'CheckController.check'

};
