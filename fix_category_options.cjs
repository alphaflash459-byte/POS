const fs = require('fs');

let modalsCode = fs.readFileSync('src/components/Modals.tsx', 'utf-8');

modalsCode = modalsCode.replace('<option value="ភេសជ្ជៈ">ភេសជ្ជៈ (Drink)</option>', '<option value="ភេសជ្ជៈ">ភេសជ្ជៈ</option>');
modalsCode = modalsCode.replace('<option value="អាហារ">អាហារ (Food)</option>', '<option value="អាហារ">អាហារ</option>');
modalsCode = modalsCode.replace('<option value="នំចម្រុះ">នំចម្រុះ (Snack)</option>', '<option value="នំចម្រុះ">នំចម្រុះ</option>');
modalsCode = modalsCode.replace('<option value="គ្រឿងទេស">គ្រឿងទេស (Groceries)</option>', '<option value="គ្រឿងទេស">គ្រឿងទេស</option>');
modalsCode = modalsCode.replace('<option value="ទូទៅ">ទូទៅ (Other)</option>', '<option value="ទូទៅ">ទូទៅ</option>');

fs.writeFileSync('src/components/Modals.tsx', modalsCode);
