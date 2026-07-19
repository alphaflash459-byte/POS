const fs = require('fs');
let posCode = fs.readFileSync('src/components/POSSection.tsx', 'utf-8');

posCode = posCode.replace(/import \{ useState \} from 'react';/, "import { useState, useEffect } from 'react';");
fs.writeFileSync('src/components/POSSection.tsx', posCode);
