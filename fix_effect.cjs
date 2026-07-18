const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Find the start of handleLogout
const startIdx = code.indexOf('  const handleLogout = async () => {');
// Find the end of the useEffect
const endIdx = code.indexOf('    return () => unsubscribe();\n  }, []);') + '    return () => unsubscribe();\n  }, []);'.length;

const newEffect = `  const handleLogout = async () => {
    try {
      setUser(null);
      setUserRole(null);
      setActiveUserId(null);
      setProducts([]);
      setSalesHistory([]);
      setStockLogs([]);
      showToast('បានចាកចេញពីគណនី!', 'info');
    } catch (e) {
      showToast('ការចាកចេញបានបរាជ័យ', 'error');
    }
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setUserRole(loggedInUser.role as 'admin' | 'user');
    setActiveUserId(loggedInUser.id);
    showToast(\`ស្វាគមន៍ \${loggedInUser.username}!\`, 'success');
  };

  // Listen to users from Firestore directly
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'artifacts', APP_ID, 'app_users'), (snapshot) => {
      const list: User[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        list.push({ 
          id: d.id, 
          username: data.displayName || data.username || d.id, 
          password: data.password || '12345678',
          role: data.role || 'user',
          ...data
        } as User);
      });
      
      if (list.length === 0) {
        const createAdmin = async () => {
          await setDoc(doc(db, 'artifacts', APP_ID, 'app_users', 'admin'), {
            username: 'Admin',
            displayName: 'Admin',
            role: 'admin',
            password: '12345678',
            createdAt: new Date().toISOString()
          });
        };
        createAdmin();
      } else {
        setUsers(list);
        setIsInitializing(false);
      }
    }, (error) => {
      console.error("Error fetching users", error);
      setIsInitializing(false);
    });
    return () => unsub();
  }, []);`;

code = code.substring(0, startIdx) + newEffect + code.substring(endIdx);
fs.writeFileSync('src/App.tsx', code);
