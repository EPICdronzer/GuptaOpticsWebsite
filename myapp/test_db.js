const mongoose = require('mongoose');

// NO dns.setServers needed - we're not using SRV anymore
const uri = "mongodb://opticalgalaxy2012_db_user:AJ6FeUXh5uVXStcA@ac-njsbs3d-shard-00-00.cuqt2h4.mongodb.net:27017,ac-njsbs3d-shard-00-01.cuqt2h4.mongodb.net:27017,ac-njsbs3d-shard-00-02.cuqt2h4.mongodb.net:27017/?authSource=admin&replicaSet=atlas-j0gci4-shard-0&tls=true&appName=Cluster0";

console.log('Connecting with direct mongodb:// URI (no SRV lookup needed)...');
mongoose.connect(uri, { dbName: 'optical' })
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB Atlas!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('FAILED:', err.message);
    process.exit(1);
  });
