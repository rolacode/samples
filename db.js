const {sequelize} = require('sequelize'); // import sequelize

const sequelize = new sequelize('sampledb', 'postgres', 'Rotimi05#', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres'
});


(async () => {
  try {
    await sequelize.authenticate();
    console.log('connection has been established successfully');
  } catch (error) {
    console.log('unable to connect to the database', error);
  }
})();

module.exports = sequelize;
