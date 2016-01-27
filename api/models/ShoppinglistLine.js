/**
 * ShoppinglistLine.js
 *
 * @description :: Represents the product that is in a shoppinglist
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'shoppinglist_lines',
  identity: 'ShoppinglistLine',

  attributes: {
    shoppinglistId: {
      model: 'Shoppinglist'
    },

    productId: {
      model: 'product'
    },

    amount: {
      type: 'integer',
      required: true,
      defaultsTo: 1
    }
  }
};

