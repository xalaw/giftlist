module.exports.DATABASE_URL= process.env.DATABASE_URL || global.DATABASE_URL || 
`mongodb://${process.env.USER_NAME}:${process.env.PASSWORD}@ds147789.mlab.com:47789/giftlist` || `mongodb://localhost/giftlist`;

module.exports.PORT= process.env.PORT || 3001 
