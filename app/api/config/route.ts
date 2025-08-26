import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { promises as fs } from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(process.cwd(), 'config', 'settings.json');

function verifyAdminAuth(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'default-secret') as any;
    return decoded.role === 'admin' ? decoded : null;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Read config file
    try {
      const configData = await fs.readFile(CONFIG_FILE, 'utf-8');
      const config = JSON.parse(configData);
      return NextResponse.json(config);
    } catch (error) {
      // Return default config if file doesn't exist
      const defaultConfig = {
        storeName: 'Mi Ferretería',
        logo: '',
        primaryColor: '#3B82F6',
        secondaryColor: '#64748B',
        accentColor: '#D946EF'
      };
      return NextResponse.json(defaultConfig);
    }
  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = verifyAdminAuth(request);
    if (!auth) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const config = await request.json();
    
    // Ensure config directory exists
    const configDir = path.dirname(CONFIG_FILE);
    try {
      await fs.mkdir(configDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Save config to file
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));

    return NextResponse.json({
      message: 'Configuration saved successfully',
      config
    });
  } catch (error) {
    console.error('Error saving config:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}