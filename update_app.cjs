const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  "import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';",
  "import { User } from './types';"
);

code = code.replace(
  "import { auth, db, handleFirestoreError, OperationType } from './firebase.ts';",
  "import { db, handleFirestoreError, OperationType } from './firebase.ts';"
);

code = code.replace(
  "const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);",
  "const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);\n  const [users, setUsers] = useState<User[]>([]);"
);

code = code.replace(
  "const [user, setUser] = useState<FirebaseUser | null>(null);",
  "const [user, setUser] = useState<User | null>(null);"
);

// We need to replace handleLogout and useEffect
const oldEffect = `  const handleLogout = async () => {
    try {
      await signOut(auth);
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

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'artifacts', APP_ID, 'app_users', currentUser.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role as 'admin' | 'user');
          } else {
            setUserRole('user');
          }
          setActiveUserId(currentUser.uid);
        } catch (e) {
          console.error("Failed to get user role", e);
          setUserRole('user');
          setActiveUserId(currentUser.uid);
        }
      } else {
        setUserRole(null);
        setActiveUserId(null);
      }
      setIsInitializing(false);
    });

    return () => unsubscribe();
  }, []);`;

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
          username: data.username || data.displayName || d.id, 
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

code = code.replace(oldEffect, newEffect);

code = code.replace(
  "<LoginScreen onToast={showToast} />",
  "<LoginScreen users={users} onLogin={handleLogin} />"
);

fs.writeFileSync('src/App.tsx', code);
