/**
 * Shoppinglist.js
 *
 * @description :: Represents the shoppinglist of an user
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

