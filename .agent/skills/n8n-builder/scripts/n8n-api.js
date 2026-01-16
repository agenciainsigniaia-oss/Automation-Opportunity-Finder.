
import fs from 'fs';
import path from 'path';

// Minimal implementation of dotenv for .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .reduce((acc, line) => {
        const [key, ...value] = line.split('=');
        if (key && value.length) acc[key.trim()] = value.join('=').trim();
        return acc;
    }, {});

const config = {
    apiKey: envConfig.N8N_API_KEY,
    baseUrl: envConfig.N8N_BASE_URL?.replace(/\/$/, '')
};

async function createWorkflow(workflowData) {
    if (!config.apiKey || !config.baseUrl) {
        console.error('ERROR: N8N_API_KEY o N8N_BASE_URL no encontradas en .env.local');
        console.log('Por favor agrega:');
        console.log('N8N_API_KEY=tu_key');
        console.log('N8N_BASE_URL=https://tu-instancia.n8n.cloud');
        process.exit(1);
    }

    try {
        const response = await fetch(`${config.baseUrl}/api/v1/workflows`, {
            method: 'POST',
            headers: {
                'X-N8N-API-KEY': config.apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(workflowData)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(JSON.stringify(data));
        }

        console.log('✅ Workflow creado exitosamente:', data.id);
        return data;
    } catch (error) {
        console.error('❌ Error al crear el workflow:', error.message);
        process.exit(1);
    }
}

// CLI entry point
const args = process.argv.slice(2);
if (args[0] === 'create') {
    let rawData = '';
    if (args[1]) {
        rawData = args[1];
    } else {
        // Read from stdin
        rawData = fs.readFileSync(0, 'utf-8');
    }

    try {
        const json = JSON.parse(rawData);
        createWorkflow(json);
    } catch (e) {
        console.error('❌ JSON inválido o error en la entrada:', e.message);
        process.exit(1);
    }
}
