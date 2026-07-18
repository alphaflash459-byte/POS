const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const loginCall = `<LoginScreen users={users} onLogin={handleLogin} />`;
const newLoginCall = `<LoginScreen users={users} onLogin={handleLogin} onRegister={handleRegister} />`;
code = code.replace(loginCall, newLoginCall);

const loginFunc = `  const handleLogin = (loggedInUser: User) => {
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
  };

`;

code = code.replace(loginFunc, loginFunc + '\n' + registerFunc);

fs.writeFileSync('src/App.tsx', code);
