/**
* Product.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  tableName: 'products',

  attributes: {
    title: {
      type: 'string',
      required: true,
      size: 45
    },
    price: {
      type: 'float',
      required: true
    },
    image: {
      type: 'text'
    },
    salesTax: {
      type: 'string',
      enum: ['6', '21'],
      required: true
    }
  }
};

