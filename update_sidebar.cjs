const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');

const navItemsStart = `  let navItems: { id: string; label: string; icon: any; hasDot?: boolean }[] = [];

  if (userRole === 'admin') {
    navItems = [
      { id: 'admin_dashboard', label: 'ទិដ្ឋភាពរួម', icon: LayoutDashboard },
      { id: 'admin_users', label: 'គណនី', icon: Users },
      { id: 'admin_history', label: 'ប្រវត្តិ', icon: History },
      { id: 'admin_report', label: 'របាយការណ៍', icon: FileBarChart },
    ];
  } else {
    navItems = [
      { id: 'pos', label: 'លក់ទំនិញ', icon: ShoppingCart },
      { id: 'inventory', label: 'ស្តុក', icon: Boxes },
      { id: 'sheets', label: 'Ledger', icon: FileSpreadsheet, hasDot: !!sheetsWebhookUrl },
      { id: 'history', label: 'ប្រវត្តិ', icon: Receipt },
    ];
  }`;

code = code.replace(/  let navItems: \{ id: 'pos' \| 'inventory' \| 'sheets' \| 'history' \| 'admin'; label: string; icon: any; hasDot\?: boolean \}.*?\];\n  \}/s, navItemsStart);

const interfaceReplace = `interface SidebarProps {
  currentTab: string;
  onChangeTab: (tab: any) => void;
  onOpenShopSettings: () => void;
  onOpenDonate: () => void;
  shopSettings: ShopSettings;
  sheetsWebhookUrl: string;
  userRole?: 'admin' | 'user' | null;
}`;

code = code.replace(/interface SidebarProps \{[\s\S]*?userRole\?: 'admin' \| 'user' \| null;\n\}/, interfaceReplace);

const lucideImport = `import { Store, ShoppingCart, Boxes, FileSpreadsheet, Receipt, Settings, Users, LayoutDashboard, History, FileBarChart } from 'lucide-react';`;
code = code.replace(/import \{ Store, ShoppingCart, Boxes, FileSpreadsheet, Receipt, Settings, Users, LayoutDashboard \} from 'lucide-react';/, lucideImport);

fs.writeFileSync('src/components/Sidebar.tsx', code);
