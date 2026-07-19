const fs = require('fs');
let posCode = fs.readFileSync('src/components/POSSection.tsx', 'utf-8');

const inputComponent = `function CartQtyInput({ item, onSetQty, onRemove }: { item: CartItem, onSetQty: (id: number, qty: number) => void, onRemove: (id: number) => void }) {
  const [localVal, setLocalVal] = useState<string>(item.quantity.toString());

  // sync from props if changed externally
  if (parseInt(localVal) !== item.quantity && localVal !== '') {
    // but we don't want to override while typing.
  }

  return (
    <input
      type="number"
      min="1"
      value={localVal}
      onChange={(e) => {
        setLocalVal(e.target.value);
        const val = parseInt(e.target.value);
        if (!isNaN(val) && val > 0) {
          onSetQty(item.product.id, val);
        }
      }}
      onBlur={() => {
        const val = parseInt(localVal);
        if (isNaN(val) || val <= 0) {
          onRemove(item.product.id);
        }
      }}
      className="w-full text-center text-xs font-bold text-slate-800 font-sans bg-slate-50 border border-slate-200/60 p-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100"
    />
  );
}
`;

// Insert it before POSSection
posCode = posCode.replace('export default function POSSection', inputComponent + '\nexport default function POSSection');

const regex = /<div className="flex items-center flex-shrink-0 w-16">[\s\S]*?<\/div>/;
const newUsage = `<div className="flex items-center flex-shrink-0 w-16">
                        <CartQtyInput 
                          item={item} 
                          onSetQty={onSetCartQty} 
                          onRemove={(id) => onUpdateCartQty(id, -item.quantity)} 
                        />
                      </div>`;

posCode = posCode.replace(regex, newUsage);
fs.writeFileSync('src/components/POSSection.tsx', posCode);

