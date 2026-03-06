const mongoose = require("mongoose");
const dns = require('node:dns/promises')
dns.setServers(['1.1.1.1'])
module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Kết nối thành công");
  } catch (error) {
    console.log("Lỗi kết nối");
  }
};
