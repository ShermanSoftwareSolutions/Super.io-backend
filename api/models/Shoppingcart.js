/**
* Shoppingcart.js
*
* @description :: Represents the shoppingcart of an user
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName: 'shoppingcarts',
  identity: 'Shoppingcart',

  attributes: {
    userId: {
      type: 'integer',
      required: true
    },
    shoppinglistId: {
      type: 'integer',
      required: true
    },
    lines: {
      collection: 'ShoppingcartLine',
      via: 'shoppingcartId'
    }
  }
};

