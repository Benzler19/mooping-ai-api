const express = require("express"),
  app = express(),
  APP_CONFIG = require("./configs/app");

require("./configs/express")(app);
require("./routes")(app);

app.listen(APP_CONFIG.port, () => {
  console.log(`Server is running on port ${APP_CONFIG.port}.`);
});
