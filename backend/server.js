import "dotenv/config";
import app from "./app.js";
import connectToDB from "./config/db.js";

connectToDB();

const port = process.env.PORT || 5000;

app.listen(port ,()=>{
   console.log(`Server is running on port ${port}`);
})