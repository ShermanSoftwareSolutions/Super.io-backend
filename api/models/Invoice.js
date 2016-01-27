/**
* Invoice.js
*
* @description :: Represents an invoice for a shoppingcarts
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName: 'invoices',

  attributes: {
    shoppingcartId: {
      type: 'integer',
      required: true
    },

    priceExcl: {
      type: 'float',
      required: true
    },

    priceIncl: {
      type: 'float',
      required: true
    },

    paid: {
      type: 'boolean',
      required: true,
      defaultsTo: 0
    }
  }
};

