const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const profileContent = `                  <p className="text-[11px] font-bold text-emerald-600 mb-5 z-10">
                    ☁️ Cloud Synced (Your products and sales history are backed up securely)
                  </p>
                  <div className="flex flex-col gap-2 w-full z-10 px-4">
                    {userRole !== 'admin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileOpen(false);
                          setIsShopSettingsOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs md:text-sm active:scale-95 transition shadow-sm w-full flex items-center justify-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        កំណត់ហាង (Shop Settings)
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout();
                        setIsProfileOpen(false);
                      }}
                      className="bg-rose-100 hover:bg-rose-200 text-rose-600 font-bold py-2.5 px-6 rounded-xl text-xs md:text-sm active:scale-95 transition shadow-sm w-full flex items-center justify-center gap-2"
                    >
                      ចាកចេញពីគណនី
                    </button>
                  </div>`;

code = code.replace(/                  <p className="text-\[11px\] font-bold text-emerald-600 mb-5 z-10">\n                    ☁️ Cloud Synced \(Your products and sales history are backed up securely\)\n                  <\/p>[\s\S]*?ចាកចេញពីគណនី\n                  <\/button>/, profileContent);

fs.writeFileSync('src/App.tsx', code);
