import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

// Custom Vite plugin to handle backend API endpoints in development
function apiPlugin(): Plugin {
  return {
    name: 'theen-api-handler',
    configureServer(server) {
      server.middlewares.use('/api/send-attendance-report', async (req, res) => {
        if (req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk) => {
            bodyStr += chunk;
          });

          req.on('end', async () => {
            try {
              const data = JSON.parse(bodyStr || '{}');
              const adminEmail = process.env.THEEN_ADMIN_EMAIL || 'theeninstitute@gmail.com';
              
              // Backend transactional notification log
              console.log('==================================================');
              console.log('[THEEN BACKEND EMAIL DISPATCH]');
              console.log(`To: ${adminEmail}`);
              console.log(`Subject: ${data.subject || 'THEEN Attendance Report'}`);
              console.log(`Teacher: ${data.teacherName} (${data.teacherId})`);
              console.log(`Records Count: ${data.records?.length || 0}`);
              console.log('==================================================');

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  success: true,
                  message: `Attendance report successfully sent to ${adminEmail}`,
                  recipient: adminEmail,
                  timestamp: new Date().toISOString(),
                })
              );
            } catch (err: any) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(
                JSON.stringify({
                  success: false,
                  message: err?.message || 'Failed to dispatch email report',
                })
              );
            }
          });
        } else {
          res.statusCode = 405;
          res.end(JSON.stringify({ message: 'Method Not Allowed' }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
