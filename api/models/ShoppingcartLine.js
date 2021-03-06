/**
 * ShoppingcartLine.js
 *
 * @description :: Represents the product that is in a shoppingcart
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'shoppingcart_lines',
  identity: 'ShoppingcartLine',

  attributes: {
    shoppingcartId: {
      model: 'Shoppingcart'
    },

    productId: {
      model: 'product'
    },

    scanned: {
      type: 'boolean',
      defaultsTo: 0
    },

    amount: {
      type: 'integer',
      required: true,
      defaultsTo: 1
    }
  }
};

