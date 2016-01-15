/**
 * Shoppinglist.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'shoppinglists',
  identity: 'Shoppinglist',

  attributes: {
    userId: {
      type: 'integer',
      required: true
    },
    title: {
      type: 'string',
      size: '255',
      required: true
    },
    lines: {
      collection: 'ShoppinglistLine',
      via: 'shoppinglistId'
    }
  }
};

