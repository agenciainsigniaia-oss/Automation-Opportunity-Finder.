-- 1. Activar extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla de Clientes
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  email TEXT UNIQUE,
  industry TEXT,
  status TEXT DEFAULT 'lead',
  urgency TEXT DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de Diagnósticos
CREATE TABLE IF NOT EXISTS diagnostics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  wizard_data JSONB NOT NULL,
  analysis_result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de Cotizaciones
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  diagnostic_id UUID REFERENCES diagnostics(id) ON DELETE CASCADE,
  public_token UUID DEFAULT uuid_generate_v4(),
  status TEXT DEFAULT 'pending',
  total_investment DECIMAL,
  monthly_retainer DECIMAL DEFAULT 0,
  items JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. RLS (Row Level Security) - Desactivado por ahora para MVP rápido,
-- pero se recomienda activarlo antes de producción.
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Políticas simples para permitir lectura anónima en quotes (vistas públicas)
CREATE POLICY "Permitir lectura pública de cotizaciones por token" ON quotes
  FOR SELECT USING (true);

CREATE POLICY "Permitir lectura pública de diagnósticos asociados" ON diagnostics
  FOR SELECT USING (true);

-- Nota: Para escritura, normalmente usarías service_role o autenticación de usuario.
-- Para este prototipo local, permitiremos insert anónimo (¡CUIDADO en producción!)
CREATE POLICY "Permitir insert anónimo en clientes" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir insert anónimo en diagnósticos" ON diagnostics FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir insert anónimo en cotizaciones" ON quotes FOR INSERT WITH CHECK (true);

-- 6. Tabla de Emails Enviados (Historial)
CREATE TABLE IF NOT EXISTS emails_sent (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, sent, failed
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE emails_sent ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir lectura de emails" ON emails_sent FOR SELECT USING (true);
CREATE POLICY "Permitir insert de emails" ON emails_sent FOR INSERT WITH CHECK (true);
