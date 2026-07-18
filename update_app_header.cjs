const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/\{userRole !== 'admin' && \(\s*<Header[\s\S]*?\/>\s*\)\}/, `<Header
            shopSettings={shopSettings}
            sheetsWebhookUrl={sheetsWebhookUrl}
            onOpenShopSettings={() => setIsShopSettingsOpen(true)}
            onOpenDonate={() => setIsDonateOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            user={user}
            userRole={userRole}
          />`);

fs.writeFileSync('src/App.tsx', code);
