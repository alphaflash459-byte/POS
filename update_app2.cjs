const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const oldLogin = `  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setUserRole(loggedInUser.role as 'admin' | 'user');
    setActiveUserId(loggedInUser.id);
    showToast(\`ស្វាគមន៍ \${loggedInUser.username}!\`, 'success');
  };`;

const newLogin = `  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setUserRole(loggedInUser.role as 'admin' | 'user');
    setActiveUserId(loggedInUser.id);
    if (loggedInUser.role === 'admin') {
      setCurrentTab('admin');
    } else {
      setCurrentTab('pos');
    }
    showToast(\`ស្វាគមន៍ \${loggedInUser.username}!\`, 'success');
  };`;

code = code.replace(oldLogin, newLogin);

const oldHeader = `        <Header
          shopSettings={shopSettings}
          sheetsWebhookUrl={sheetsWebhookUrl}
          onOpenShopSettings={() => setIsShopSettingsOpen(true)}
          onOpenDonate={() => setIsDonateOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          user={user}
        />`;

const newHeader = `        {userRole !== 'admin' && (
          <Header
            shopSettings={shopSettings}
            sheetsWebhookUrl={sheetsWebhookUrl}
            onOpenShopSettings={() => setIsShopSettingsOpen(true)}
            onOpenDonate={() => setIsDonateOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            user={user}
          />
        )}`;

code = code.replace(oldHeader, newHeader);

// Now for AdminPanel rendering
const oldAdminRender = `{currentTab === 'admin' && userRole === 'admin' && (
              <AdminPanel
                onSetActiveUser={setActiveUserId}
                activeUserId={activeUserId}
                onToast={showToast}
              />
            )}`;

const newAdminRender = `{currentTab === 'admin' && userRole === 'admin' && (
              <div className="md:mt-0 mt-8">
                <AdminPanel
                  onSetActiveUser={setActiveUserId}
                  activeUserId={activeUserId}
                  onToast={showToast}
                />
              </div>
            )}`;

code = code.replace(oldAdminRender, newAdminRender);

fs.writeFileSync('src/App.tsx', code);
