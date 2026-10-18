const app = require('./app');

const port = Number(process.env.PORT || 3000);
if (!Number.isSafeInteger(port) || port < 1 || port > 65535) {
  console.error('Geçerli bir PORT değeri girin.');
  process.exit(1);
}

app.listen(port, () => {
  console.log('TaskFlow API çalışıyor: http://localhost:' + port);
});
