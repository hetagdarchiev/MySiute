import {randomBytes} from 'node:crypto';
import {writeFileSync} from 'node:fs';
const admin=randomBytes(24).toString('base64url');
try{writeFileSync(new URL('.env',import.meta.url),`POSTGRES_PASSWORD=${randomBytes(32).toString('base64url')}\nADMIN_PASSWORD=${admin}\nPUBLIC_ORIGIN=http://localhost:3000\n`,{flag:'wx',mode:0o600});console.log('Created .env. Your admin password:',admin);console.log('Save this password. Run: docker compose up --build -d');}catch(e){if(e.code==='EEXIST'){console.log('.env already exists. Existing credentials were preserved.')}else throw e}
