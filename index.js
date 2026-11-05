const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const startTime = new Date();

app.use(express.json());

// Вспомогательная функция для генерации данных о сервисе
function getServiceInfo() {
  const uptimeSeconds = Math.floor((Date.now() - startTime.getTime()) / 1000);
  return {
    status: 'online',
    message: 'Базовая инфраструктура успешно развернута в облачной платформе Render (PaaS)',
    lab: {
      number: 1,
      title: 'Развертывание базовой инфраструктуры в облачной платформе',
      discipline: 'ТГиОВ'
    },
    platform: {
      provider: process.env.RENDER ? 'Render.com (Cloud PaaS)' : (process.env.NETLIFY ? 'Netlify (Serverless PaaS)' : 'Localhost / PaaS-ready'),
      instanceId: process.env.RENDER_INSTANCE_ID || (process.env.NETLIFY ? 'netlify-fn' : 'local-dev'),
      serviceId: process.env.RENDER_SERVICE_ID || (process.env.SITE_NAME || 'local-service'),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development'
    },
    runtime: {
      serverStartTime: startTime.toISOString(),
      currentTime: new Date().toISOString(),
      uptimeSeconds: uptimeSeconds
    },
    endpoints: [
      { method: 'GET', path: '/', description: 'Главная страница (HTML дашборд или JSON при ?format=json)' },
      { method: 'GET', path: '/api/info', description: 'Информация о сервисе и инфраструктуре (JSON)' },
      { method: 'GET', path: '/health', description: 'Проверка работоспособности (Healthcheck)' }
    ]
  };
}

// Главная конечная точка GET /
app.get('/', (req, res) => {
  const info = getServiceInfo();

  // Если клиент запросил JSON (через query или заголовок Accept)
  if (req.query.format === 'json' || (req.headers.accept && req.headers.accept.includes('application/json'))) {
    return res.json(info);
  }

  // По умолчанию возвращаем интерактивную HTML-страницу
  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Лабораторная работа №1 — ТГиОВ</title>
  <style>
    :root {
      --bg: #0f172a;
      --card-bg: #1e293b;
      --border: #334155;
      --text: #f8fafc;
      --muted: #94a3b8;
      --primary: #38bdf8;
      --success: #22c55e;
      --accent: #818cf8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 2rem 1rem;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .container {
      width: 100%;
      max-width: 760px;
      background: var(--card-bg);
      border-radius: 16px;
      border: 1px solid var(--border);
      padding: 2.5rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(34, 197, 94, 0.15);
      color: var(--success);
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 1.25rem;
    }
    .badge-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--success);
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: .4; transform: scale(0.9); }
    }
    h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      color: var(--muted);
      font-size: 1rem;
      margin-bottom: 1.75rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .info-card {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1rem;
    }
    .info-card .label {
      font-size: 0.75rem;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .info-card .value {
      font-size: 1rem;
      font-weight: 600;
      color: var(--primary);
    }
    .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: var(--text);
    }
    .endpoints-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }
    .endpoint-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid var(--border);
      border-radius: 8px;
    }
    .endpoint-path {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: monospace;
      font-size: 0.95rem;
    }
    .method-get {
      background: rgba(56, 189, 248, 0.2);
      color: var(--primary);
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 0.75rem;
    }
    .btn {
      display: inline-block;
      text-decoration: none;
      background: var(--primary);
      color: #0f172a;
      font-weight: 600;
      font-size: 0.85rem;
      padding: 6px 12px;
      border-radius: 6px;
      transition: all 0.2s ease;
    }
    .btn:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    .footer {
      border-top: 1px solid var(--border);
      padding-top: 1.25rem;
      font-size: 0.85rem;
      color: var(--muted);
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge">
      <span class="badge-dot"></span>
      <span>Служба активна (Cloud PaaS)</span>
    </div>
    <h1>Лабораторная работа №1</h1>
    <p class="subtitle">Развертывание базовой инфраструктуры в облачной платформе Render</p>

    <div class="grid">
      <div class="info-card">
        <div class="label">Платформа</div>
        <div class="value">${info.platform.provider}</div>
      </div>
      <div class="info-card">
        <div class="label">Среда выполнения</div>
        <div class="value">Node.js ${info.platform.nodeVersion}</div>
      </div>
      <div class="info-card">
        <div class="label">Время работы (Uptime)</div>
        <div class="value">${info.runtime.uptimeSeconds} сек.</div>
      </div>
    </div>

    <h2 class="section-title">Доступные конечные точки (Endpoints)</h2>
    <ul class="endpoints-list">
      <li class="endpoint-item">
        <div class="endpoint-path">
          <span class="method-get">GET</span>
          <span>/</span>
        </div>
        <a class="btn" href="/?format=json" target="_blank">Открыть как JSON</a>
      </li>
      <li class="endpoint-item">
        <div class="endpoint-path">
          <span class="method-get">GET</span>
          <span>/api/info</span>
        </div>
        <a class="btn" href="/api/info" target="_blank">Перейти к API</a>
      </li>
      <li class="endpoint-item">
        <div class="endpoint-path">
          <span class="method-get">GET</span>
          <span>/health</span>
        </div>
        <a class="btn" href="/health" target="_blank">Health Check</a>
      </li>
    </ul>

    <div class="footer">
      <span>Курс: Технологии глобальных и отраслевых веб-служб (ТГиОВ)</span>
      <span>Серверное время: ${new Date().toLocaleTimeString()}</span>
    </div>
  </div>
</body>
</html>`;

  res.send(html);
});

// Дополнительный endpoint для получения чистых данных в JSON
app.get('/api/info', (req, res) => {
  res.json(getServiceInfo());
});

// Endpoint для проверки состояния (Healthcheck)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.floor((Date.now() - startTime.getTime()) / 1000),
    timestamp: new Date().toISOString()
  });
});

// Запуск HTTP-сервера при прямом вызове (локально или на Render)
if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(`[OK] Сервер успешно запущен на http://${HOST}:${PORT}`);
    console.log(`[OK] Режим окружения: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Экспорт для поддержки serverless функций (Netlify / Vercel / AWS Lambda)
module.exports = app;

