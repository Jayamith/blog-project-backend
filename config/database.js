const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connected = mongoose.connect(
      "mongodb+srv://jayamithpriyankara:G35ZhdvaPwVVsU7i@blog-project-v1.xda7opf.mongodb.net/blog-project-v1?retryWrites=true&w=majority&appName=blog-project-v1"
    );
    console.log("DB Connected")
  } catch (error) {}
};

module.exports = connectDB;

//G35ZhdvaPwVVsU7i
//jayamithpriyankara
