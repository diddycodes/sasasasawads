import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const filePath = '/tmp/logs.json'; // Vercel only allows writing to /tmp

export default function handler(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const timestamp = new Date().toISOString();

  if (req.method === 'POST') {
    let logs = [];
    if (existsSync(filePath)) {
      logs = JSON.parse(readFileSync(filePath));
    }
    logs.push({ ip, timestamp });
    writeFileSync(filePath, JSON.stringify(logs, null, 2));
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    if (existsSync(filePath)) {
      const logs = readFileSync(filePath);
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).end(logs);
    }
    return res.status(200).json([]);
  }

  res.status(405).end();
}
