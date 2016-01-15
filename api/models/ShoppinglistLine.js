/**
 * ShoppinglistLine.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
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

