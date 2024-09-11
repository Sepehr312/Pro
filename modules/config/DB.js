const mongoose = require("mongoose");

const connectDB = async () => { 
  try {
    mongoose.connect(
      "mongodb://painscli_sepehr:sepehr123sepehr@painsclinic.ir/painscli_sepehrDB",
    //   {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    //     useCreateIndex: true,
    //     useFindAndModify: false,
    //   }
    ); 
    // mongoose.Promise = global.Promise;
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
