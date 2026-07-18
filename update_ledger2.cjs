const fs = require('fs');
let code = fs.readFileSync('src/components/LedgerSection.tsx', 'utf-8');

// Replace date formatting
const oldDate = /<span className="block">\{new Date\(log\.timestamp\)\.toLocaleString\('km-KH', \{ dateStyle: 'short' \}\)\}<\/span>\s*<span className="block text-\[8px\] md:text-\[10px\] font-mono">\{new Date\(log\.timestamp\)\.toLocaleString\('km-KH', \{ timeStyle: 'short' \}\)\}<\/span>/g;
const newDate = `<span className="block">{new Date(log.timestamp).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                            <span className="block text-[8px] md:text-[10px] font-mono mt-0.5">{new Date(log.timestamp).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>`;
code = code.replace(oldDate, newDate);

// Remove SKU
const oldSku = /<span className="text-\[9px\] md:text-\[10px\] text-slate-400 font-bold font-mono block mt-0\.5 truncate">\s*\{log\.sku \|\| '-'\}\s*<\/span>/g;
code = code.replace(oldSku, '');

// Also vertically center the product name more nicely, but removing the margin might be enough.
// Actually, `span className="block font-bold ..."` will just be centered in the td naturally if there's no other content.
// We can remove `block` to make it just inline or keep it. Let's leave it.

fs.writeFileSync('src/components/LedgerSection.tsx', code);
