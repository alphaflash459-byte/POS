const fs = require('fs');
let posCode = fs.readFileSync('src/components/POSSection.tsx', 'utf-8');

const regex = /function CartQtyInput[\s\S]*?return \(/;
const fixedComp = `import { useEffect } from 'react';\n\nfunction CartQtyInput({ item, onSetQty, onRemove }: { item: CartItem, onSetQty: (id: number, qty: number) => void, onRemove: (id: number) => void }) {
  const [localVal, setLocalVal] = useState<string>(item.quantity.toString());

  useEffect(() => {
    if (parseInt(localVal) !== item.quantity) {
      setLocalVal(item.quantity.toString());
    }
  }, [item.quantity]);

  return (`

posCode = posCode.replace(regex, fixedComp);
// Since useState is already imported in POSSection.tsx, we can just use useEffect.
// Actually, useEffect might not be imported if I just added it randomly, let's fix imports.
posCode = posCode.replace("import { useEffect } from 'react';\n\n", ""); // remove my hack
if (!posCode.includes('useEffect')) {
    posCode = posCode.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");
}
fs.writeFileSync('src/components/POSSection.tsx', posCode);

