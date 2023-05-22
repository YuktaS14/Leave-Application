const pkg  = require("pg");
const {Client} = pkg;



pkg.types.setTypeParser(1114, function (value) {
  return value
})

pkg.types.setTypeParser(1082, function(value) { 
    return value;
});
const client = new Client({
    host:"localhost",
    timezone: 'Asia/Kolkata',
    user:"postgres",
    port:5432,
    password:'595959',
    database: "students",
});

client.connect()
.then(()=>console.log("Database Connected"))
.catch((e)=>console.log(e));


exports.dbConnect = client;