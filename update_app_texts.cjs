const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/ព័ត៌មានប្រព័ន្ធ & គណនី \(System Information\)/g, 'ព័ត៌មានគណនី');
code = code.replace(/☁️ Cloud Synced \(Your products and sales history are backed up securely\)/g, '☁️ ទិន្នន័យត្រូវបានរក្សាទុកលើ Cloud');
code = code.replace(/កំណត់ហាង \(Shop Settings\)/g, 'កំណត់ហាង');
code = code.replace(/Store Information/g, 'ព័ត៌មានហាង');

fs.writeFileSync('src/App.tsx', code);
