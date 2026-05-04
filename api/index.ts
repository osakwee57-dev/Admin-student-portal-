
import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration - Using environment variables with fallback to internal defaults
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://bannvfxsibavzhflpkcb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhbm52ZnhzaWJhdnpoZmxwa2NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1ODA3MDAsImV4cCI6MjA5MzE1NjcwMH0.PkpsHusxPzNm8d1cRZWBMaxbvsaGR8zdF9gJMUCmnYo';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.log('INFO: Using default Supabase credentials. For production, set SUPABASE_URL and SUPABASE_KEY in settings.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Connection verification helper
async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('schools').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('Supabase Connection Error:', error.message);
    } else {
      console.log('Supabase Connected successfully.');
    }
  } catch (err) {
    console.error('Supabase Connection Exception:', err);
  }
}

const upload = multer({ storage: multer.memoryStorage() });

const app = express();

async function startServer() {
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Health Check
  app.get('/api/status', async (req, res) => {
    let dbStatus = 'connecting';
    try {
      const { error } = await supabase.from('schools').select('count', { count: 'exact', head: true });
      dbStatus = error ? `error: ${error.message}` : 'connected';
    } catch (e) {
      dbStatus = 'exception';
    }
    res.json({ 
      status: 'online', 
      database: dbStatus,
      env: process.env.NODE_ENV,
      cwd: process.cwd()
    });
  });

  // API Routes
  app.post('/api/register-school', async (req: Request, res: Response) => {
    const { schoolName, adminUsername, adminPassword, systemPasscode } = req.body;

    if (systemPasscode !== 'PASS') {
      return res.status(403).json({ error: 'Invalid system passcode' });
    }

    try {
      const schoolCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      const { data, error } = await supabase
        .from('schools')
        .insert([{
          school_name: schoolName,
          admin_username: adminUsername,
          admin_password: adminPassword,
          school_code: schoolCode
        }])
        .select()
        .single();

      if (error) throw error;

      res.json({ 
        success: true, 
        schoolId: data.id,
        schoolName,
        schoolCode 
      });
    } catch (error: any) {
      if (error.message?.includes('unique') || error.code === '23505') {
        res.status(400).json({ error: 'Username or school code already exists' });
      } else {
        console.error('Supabase Error:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
      }
    }
  });

  app.get('/api/schools', async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('id, school_name, school_code, admin_username, created_at');
      
      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/admin-login', async (req: Request, res: Response) => {
    const { username, password, schoolCode } = req.body;

    try {
      const { data: admin, error } = await supabase
        .from('schools')
        .select('*')
        .eq('admin_username', username)
        .eq('admin_password', password)
        .eq('school_code', schoolCode)
        .single();

      if (admin) {
        res.json({
          success: true,
          admin: {
            id: admin.id,
            school_name: admin.school_name,
            admin_username: admin.admin_username,
            school_code: admin.school_code
          }
        });
      } else {
        res.status(401).json({ error: 'Invalid credentials or school code' });
      }
    } catch (error) {
      res.status(401).json({ error: 'Invalid credentials or school code' });
    }
  });

  app.get('/api/students', async (req: Request, res: Response) => {
    const schoolCode = req.query.schoolCode;
    if (!schoolCode) return res.status(400).json({ error: 'School code required' });

    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('school_code', schoolCode);
      
      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/fees', async (req: Request, res: Response) => {
    const { studentId, description, items, pdfUrl, schoolCode } = req.body;

    try {
      const { data, error } = await supabase
        .from('fees')
        .insert([{
          student_id: studentId,
          description: description,
          items: items || null,
          pdf_url: pdfUrl || null,
          amount_paid: 0,
          school_code: schoolCode
        }])
        .select()
        .single();

      if (error) throw error;
      res.json({ success: true, fee: data });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  app.post('/api/results', async (req: Request, res: Response) => {
    const { studentId, pdfUrl, schoolCode } = req.body;

    try {
      const { data, error } = await supabase
        .from('results')
        .insert([{
          student_id: studentId,
          pdf_url: pdfUrl,
          school_code: schoolCode,
          upload_date: new Date()
        }])
        .select()
        .single();

      if (error) throw error;
      res.json({ success: true, result: data });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  app.post('/api/results/upload', upload.single('file'), async (req: any, res: Response) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const schoolCode = req.query.schoolCode;
    const studentId = req.query.studentId;
    if (!schoolCode || !studentId) return res.status(400).json({ error: 'Context required' });

    const fileName = `${Date.now()}_result.pdf`;
    const filePath = `results/${schoolCode}/${studentId}/${fileName}`;

    try {
      const { data, error } = await supabase.storage
        .from('student-files')
        .upload(filePath, req.file.buffer, {
          contentType: 'application/pdf',
          upsert: true
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('student-files')
        .getPublicUrl(filePath);

      res.json({ publicUrl: urlData.publicUrl });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Storage upload failed' });
    }
  });

  app.get('/api/messages', async (req: Request, res: Response) => {
    const schoolCode = req.query.schoolCode;
    if (!schoolCode) return res.status(400).json({ error: 'School code required' });

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('school_code', schoolCode)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/messages', async (req: Request, res: Response) => {
    const { schoolCode, content, type, studentId, adminId } = req.body;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          school_code: schoolCode,
          content: content,
          type: type, // 'general' or 'specific'
          student_id: studentId || null,
          sender_admin: adminId,
          created_at: new Date()
        }])
        .select()
        .single();

      if (error) throw error;
      res.json({ success: true, message: data });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  app.get('/api/students/:id/fees', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const { data, error } = await supabase
        .from('fees')
        .select('*')
        .eq('student_id', id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.patch('/api/fees/:id/status', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const { data, error } = await supabase
        .from('fees')
        .update({ status: status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      res.json({ success: true, fee: data });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  app.delete('/api/messages/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

export default app;
