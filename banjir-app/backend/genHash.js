const bcrypt = require('bcryptjs');
bcrypt.hash('123', 10).then(hash => {
  console.log('Hash:', hash);
  console.log('\nSQL:');
  console.log(`UPDATE users SET password = '${hash}' WHERE email = 'admin@banjir.com';`);
});