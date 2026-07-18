const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const loginFunc = `  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setUserRole(loggedInUser.role as 'admin' | 'user');
    setActiveUserId(loggedInUser.id);
    if (loggedInUser.role === 'admin') {
      setCurrentTab('admin_dashboard');
    } else {
      setCurrentTab('pos');
    }
    showToast(\`ស្វាគមន៍ \${loggedInUser.username}!\`, 'success');
  };`;
code = code.replace(/  const handleLogin = \(loggedInUser: User\) => \{[\s\S]*?showToast.*?success.*?;\n  \};/, loginFunc);

const registerFunc = `  const handleRegister = async (username: string, password: string) => {
    try {
      const newUserId = 'user_' + Date.now();
      const newUser = {
        username: username,
        password: password,
        role: 'user',
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'artifacts', APP_ID, 'app_users', newUserId), newUser);
      showToast('គណនីថ្មីត្រូវបានបង្កើតដោយជោគជ័យ!', 'success');
      
      const loggedInUser = { id: newUserId, ...newUser } as User;
      setUser(loggedInUser);
      setUserRole('user');
      setActiveUserId(newUserId);
      setCurrentTab('pos');
    } catch (e) {
      console.error(e);
      showToast('បរាជ័យក្នុងការបង្កើតគណនី!', 'error');
    }
  };`;
code = code.replace(/  const handleRegister = async \(username: string, password: string\) => \{[\s\S]*?showToast.*?error.*?;\n    \}\n  \};/, registerFunc);

const adminRender = `{currentTab.startsWith('admin_') && userRole === 'admin' && (
              <div className="md:mt-0 mt-8">
                <AdminPanel
                  activeTab={currentTab.replace('admin_', '')}
                  onSetActiveUser={setActiveUserId}
                  activeUserId={activeUserId}
                  onToast={showToast}
                />
              </div>
            )}`;
code = code.replace(/\{currentTab === 'admin' && userRole === 'admin' && \([\s\S]*?<\/div>\s*\)\}/, adminRender);

fs.writeFileSync('src/App.tsx', code);
