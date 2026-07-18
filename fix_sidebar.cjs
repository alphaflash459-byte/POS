const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');

// replace the double else
code = code.replace(/  \} else \{\n    navItems = \[\n      \{ id: 'pos'[\s\S]*?\];\n  \} else \{/, `  } else {`);

fs.writeFileSync('src/components/Sidebar.tsx', code);
