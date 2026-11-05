const serverless = require('serverless-http');
const app = require('../../index.js');

const handler = serverless(app);

module.exports.handler = async (event, context) => {
  // Устраняем префикс пути serverless-функции, если Netlify вызвал напрямую
  if (event.path && event.path.startsWith('/.netlify/functions/api')) {
    event.path = event.path.replace('/.netlify/functions/api', '') || '/';
  }
  return await handler(event, context);
};
