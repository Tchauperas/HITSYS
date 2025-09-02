require("dotenv").config();
const app = require("./api/app");

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`API is running on port ${process.env.PORT}`);
});