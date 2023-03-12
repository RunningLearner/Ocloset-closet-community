import app from "./src/index";

const port = app.get("port");

app.listen(port, () => {
  console.log(`
    ################################################
    🛡️  Server listening on port: ${port}🛡️
    ################################################
      `);
});
