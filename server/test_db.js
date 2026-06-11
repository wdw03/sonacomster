const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://saransh827y_db_user:savanop@savan.gkjxafi.mongodb.net/sonacomster')
  .then(() => {
    console.log('Connected to MongoDB');
    process.exit(0);
  })
  .catch(err => {
    console.error('Failed to connect:', err);
    process.exit(1);
  });
