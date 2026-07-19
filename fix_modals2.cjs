const fs = require('fs');
let code = fs.readFileSync('src/components/Modals.tsx', 'utf-8');

// Use simple string replacements for the specific English suffixes found
const replacements = [
  ['កែប្រែព័ត៌មានទំនិញ (Edit Item)', 'កែប្រែទំនិញ'],
  ['បន្ថែមទំនិញថ្មី (Add New Item)', 'បន្ថែមទំនិញថ្មី'],
  ['ឈ្មោះទំនិញ (Item Name)', 'ឈ្មោះទំនិញ'],
  ['រូបភាពទំនិញ (Image Asset)', 'រូបភាពទំនិញ'],
  ['លេខកូដ / SKU', 'លេខកូដ'],
  ['ចំនួនស្តុក (In Stock)', 'ចំនួនស្តុក'],
  ['បោះបង់ (Cancel)', 'បោះបង់'],
  ['រក្សាទុកទំនិញ (Save Item)', 'រក្សាទុក'],
  ['បញ្ចូលស្តុកបន្ថែម (Restock Item)', 'បន្ថែមស្តុក'],
  ['ចំនួនបន្ថែមចូលស្តុក (Quantity)', 'ចំនួន'],
  ['មូលហេតុបញ្ជាក់ (Memo Note)', 'ចំណាំ'],
  ['បញ្ជាក់ការបញ្ចូល (Save)', 'រក្សាទុក'],
  ['ការកំណត់ហាង (Shop Profile Tools)', 'ការកំណត់ហាង'],
  ['ឈ្មោះហាង (Shop Name)', 'ឈ្មោះហាង'],
  ['អក្សររត់ពីក្រោម (Subtitle Header)', 'ពាក្យស្លោក'],
  ['លេខទូរស័ព្ទ (Store Contact)', 'លេខទូរស័ព្ទ'],
  ['អាសយដ្ឋាន (Store Location)', 'អាសយដ្ឋាន'],
  ['រូបភាព QR Code (ABA/K-KHQR Scanner asset)', 'រូបភាព QR Code'],
  ['វិក្កយបត្រ (Invoice Slip)', 'វិក្កយបត្រ'],
  ['វិក្កយបត្រលក់ (Order Receipt)', 'វិក្កយបត្រ'],
  ['សរុប (Total)', 'សរុប'],
  ['សរុបរង (Subtotal)៖', 'សរុបរង៖'],
  ['បញ្ចុះតម្លៃ (Discount)៖', 'បញ្ចុះតម្លៃ៖'],
  ['សរុបចុងក្រោយ (NET TOTAL)៖', 'សរុបចុងក្រោយ៖'],
  ['គិតជាប្រាក់រៀល (KHR)៖', 'ប្រាក់រៀល៖'],
  ['ប្រាក់ទទួលបាន (Received)៖', 'ប្រាក់ទទួល៖'],
  ['ប្រាក់អាប់ជូនវិញ (Change)៖', 'ប្រាក់អាប់៖'],
  ['ទូទាត់រហ័សតាម QR Scan (Scan to Pay)', 'ទូទាត់តាម QR Code'],
  ['លុបចេញ (Delete)', 'លុប'],
  ['បោះបង់ (Cancel)', 'បោះបង់']
];

replacements.forEach(([oldStr, newStr]) => {
  code = code.replace(oldStr, newStr);
});

fs.writeFileSync('src/components/Modals.tsx', code);

// Now for POSSection.tsx
let posCode = fs.readFileSync('src/components/POSSection.tsx', 'utf-8');
const posReplacements = [
  ['កន្ត្រកទំនិញ (Cart)', 'កន្ត្រកទំនិញ'],
  ['អតិថិជន (Customer Info)', 'ព័ត៌មានអតិថិជន'],
  ['ការទូទាត់ (Payment Details)', 'ការទូទាត់'],
  ['សរុបរង (Subtotal)៖', 'សរុបរង៖'],
  ['បញ្ចុះតម្លៃ (Discount)៖', 'បញ្ចុះតម្លៃ៖'],
  ['សរុបចុងក្រោយ (Net Total)៖', 'សរុបចុងក្រោយ៖'],
  ['ប្រាក់រៀល (KHR)៖', 'ប្រាក់រៀល៖'],
  ['ប្រាក់ទទួលបាន (Cash Received)៖', 'ប្រាក់ទទួល៖'],
  ['ប្រាក់អាប់ជូនវិញ (Change)៖', 'ប្រាក់អាប់៖'],
  ['បង់ប្រាក់ និងចេញវិក្កយបត្រ (Checkout)', 'ទូទាត់ប្រាក់'],
];
posReplacements.forEach(([oldStr, newStr]) => {
  posCode = posCode.replace(oldStr, newStr);
});
fs.writeFileSync('src/components/POSSection.tsx', posCode);

// Now for InventorySection.tsx
let invCode = fs.readFileSync('src/components/InventorySection.tsx', 'utf-8');
const invReplacements = [
  ['បន្ថែមទំនិញ (Add Item)', 'បន្ថែមទំនិញ'],
  ['បញ្ជីទំនិញនៅក្នុងស្តុក (Inventory Database)', 'បញ្ជីទំនិញ'],
  ['ស្តុកមានកំណត់ (Low Stock)', 'ជិតអស់ពីស្តុក'],
  ['អស់ពីស្តុក (Out of Stock)', 'អស់ពីស្តុក'],
  ['នៅក្នុងស្តុក (In Stock)', 'ក្នុងស្តុក'],
  ['តម្លៃដើម / Cost', 'តម្លៃដើម'],
  ['តម្លៃលក់ / Price', 'តម្លៃលក់'],
  ['ចំនួនស្តុក / Qty', 'ចំនួនស្តុក']
];
invReplacements.forEach(([oldStr, newStr]) => {
  invCode = invCode.replace(oldStr, newStr);
});
fs.writeFileSync('src/components/InventorySection.tsx', invCode);

// Now for LedgerSection.tsx
let ledCode = fs.readFileSync('src/components/LedgerSection.tsx', 'utf-8');
const ledReplacements = [
  ['សៀវភៅកត់ត្រាស្តុកលម្អិត (Inventory Ledger)', 'កំណត់ត្រាស្តុក'],
  ['សម្អាតទិន្នន័យ (Clear)', 'សម្អាតទិន្នន័យ'],
  ['ពេលវេលាចូលស្តុក', 'កាលបរិច្ឆេទ'],
  ['កូដទំនិញ/SKU', 'លេខកូដ'],
  ['ចំនួនបញ្ចូល', 'ចំនួន'],
  ['អ្នកកត់ត្រា', 'អ្នកកត់ត្រា'],
  ['មូលហេតុ/កំណត់ចំណាំ', 'ចំណាំ'],
  ['សកម្មភាព', 'សកម្មភាព']
];
ledReplacements.forEach(([oldStr, newStr]) => {
  ledCode = ledCode.replace(oldStr, newStr);
});
fs.writeFileSync('src/components/LedgerSection.tsx', ledCode);
