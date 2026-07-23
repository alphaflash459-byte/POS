import React, { useState, useRef, useEffect } from 'react';
import { Upload, CheckCircle2, Shield, Calendar, CreditCard, Loader2, X } from 'lucide-react';
import { User, SubscriptionRequest } from '../types';
import { doc, updateDoc, setDoc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { APP_ID } from '../App';

interface SubscriptionScreenProps {
  user: User;
  onSuccess: () => void;
  onLogout: () => void;
}

const PLANS = [
  { id: 'daily', name: 'ប្រចាំថ្ងៃ', price: 0.5, days: 1, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  { id: 'monthly', name: 'ប្រចាំខែ', price: 10, days: 30, color: 'bg-blue-50 text-blue-600 border-blue-200' },
  { id: 'yearly', name: 'ប្រចាំឆ្នាំ', price: 60, days: 365, color: 'bg-purple-50 text-purple-600 border-purple-200' },
];

const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

export default function SubscriptionScreen({ user, onSuccess, onLogout }: SubscriptionScreenProps) {
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'artifacts', APP_ID, 'subscription_requests'),
      where('userId', '==', user.id)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const requests: SubscriptionRequest[] = [];
      snapshot.forEach((d) => {
        requests.push({ id: d.id, ...d.data() } as SubscriptionRequest);
      });

      const userPendingRequest = requests.find(req => req.status === 'pending');
      
      if (userPendingRequest) {
        setIsPending(true);
      } else {
        setIsPending(false);
        if (user.subscriptionEnd && new Date(user.subscriptionEnd) > new Date()) {
          onSuccess();
        } else {
          const userRejectedRequest = requests.find(req => req.status === 'rejected');
          if (userRejectedRequest) {
            setError('សំណើរបស់អ្នកត្រូវបានបដិសេធ សូមពិនិត្យមើលវិក្កយបត្រម្ដងទៀត។');
          }
        }
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching requests:", error);
      setIsLoading(false);
    });

    return () => unsub();
  }, [user.id, user.subscriptionEnd, onSuccess]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selected);
      setError(null);
    }
  };

  const handleVerify = async () => {
    if (!preview) {
      setError('សូមបញ្ចូលរូបភាពវិក្កយបត្រ (Upload receipt image)');
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      let compressedReceipt = preview;
      if (preview.startsWith('data:image/')) {
        compressedReceipt = await compressImage(preview);
      }

      const reqId = Date.now().toString();
      await setDoc(doc(db, 'artifacts', APP_ID, 'subscription_requests', reqId), {
        id: reqId,
        userId: user.id,
        username: user.username,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        price: selectedPlan.price,
        days: selectedPlan.days,
        receiptImage: compressedReceipt,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      
      setIsPending(true);
    } catch (err) {
      console.error(err);
      setError('មានបញ្ហាក្នុងការផ្ញើសំណើ សូមព្យាយាមម្ដងទៀត!');
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-khmer">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-4">កំពុងរង់ចាំការពិនិត្យ</h2>
          <p className="text-slate-600 mb-8">
            សំណើបង់ប្រាក់របស់អ្នកកំពុងត្រូវបានពិនិត្យដោយអ្នកគ្រប់គ្រង។ សូមរង់ចាំបន្តិច!
          </p>
          <button
            onClick={onLogout}
            className="w-full py-4 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            ចាកចេញ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-slate-50 flex flex-col items-center justify-center p-2 md:p-4 font-khmer overflow-hidden">
      <div className="w-full max-w-4xl max-h-full bg-white rounded-2xl md:rounded-3xl shadow-2xl shadow-slate-200/50 flex flex-col overflow-hidden">
        {/* Header Section */}
        <div className="bg-slate-900 p-4 md:p-8 text-center relative shrink-0">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400 via-slate-900 to-slate-900"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 md:w-16 h-16 md:h-16 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-4 backdrop-blur-sm border border-white/10 shadow-xl">
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />
            </div>
            <h1 className="text-xl md:text-3xl font-black text-white mb-1 md:mb-2 tracking-tight">ការជាវសេវាកម្ម (Subscription)</h1>
            <p className="text-slate-400 font-medium text-xs md:text-base max-w-lg mx-auto">សូមជ្រើសរើសកញ្ចប់សេវាកម្ម និងបញ្ជាក់ការបង់ប្រាក់របស់អ្នក</p>
          </div>
        </div>

        <div className="p-4 md:p-8 flex-grow overflow-y-auto">
          {step === 1 ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
              {/* Plans */}
              <div className="mb-4 md:mb-6 flex-grow">
                <h3 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 md:mb-4 px-2">១. ជ្រើសរើសកញ្ចប់សេវាកម្ម</h3>
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  {PLANS.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`relative flex flex-col items-center justify-center p-3 md:p-6 rounded-xl md:rounded-2xl border-2 transition-all duration-200 ${
                        selectedPlan.id === plan.id
                          ? plan.color + ' ring-2 md:ring-4 ring-offset-1 md:ring-offset-2 ring-slate-100 shadow-md md:shadow-lg scale-[1.02] z-10'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:shadow-md hover:bg-slate-50'
                      }`}
                    >
                      {selectedPlan.id === plan.id && (
                        <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-6 h-6 md:w-8 md:h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-md text-white border-2 md:border-4 border-white">
                          <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" />
                        </div>
                      )}
                      <div className={`font-bold mb-1 md:mb-2 text-[10px] md:text-base text-center ${selectedPlan.id === plan.id ? 'opacity-90' : ''}`}>{plan.name}</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm md:text-xl font-bold opacity-60">$</span>
                        <span className="text-lg md:text-4xl font-black tracking-tight">{plan.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-row gap-2 md:gap-4 pt-3 md:pt-4 border-t border-slate-100 mt-auto shrink-0">
                <button
                  onClick={onLogout}
                  className="px-4 py-3 md:px-8 md:py-4 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl md:rounded-2xl transition-colors text-sm md:text-base"
                >
                  ចាកចេញ
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3 md:py-4 font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl md:rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] text-sm md:text-lg whitespace-nowrap"
                >
                  បន្តទៅការទូទាត់ប្រាក់
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
              {/* Payment Details */}
              <div className="mb-2 md:mb-4 flex-grow flex flex-col">
                <div className="flex items-center justify-between mb-2 md:mb-4 px-1 md:px-2">
                  <h3 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider">២. ការទូទាត់ប្រាក់</h3>
                  <div className="text-[10px] md:text-sm font-bold text-blue-600 bg-blue-50 px-2 md:px-3 py-1 rounded-full">
                    {selectedPlan.name} (${selectedPlan.price})
                  </div>
                </div>
                
                <div className="flex flex-row gap-2 md:gap-4 flex-grow min-h-0">
                  {/* QR Code Column */}
                  <div className="flex-1 bg-slate-50 rounded-xl md:rounded-3xl p-2 md:p-4 border border-slate-100 flex flex-col items-center justify-center">
                    <div className="mb-1 md:mb-2 font-black text-slate-800 text-[10px] md:text-lg flex items-center gap-1 md:gap-2 text-center leading-tight">
                      Wing Bank KHQR
                    </div>
                    <div 
                      className="w-full max-w-[100px] md:max-w-[200px] aspect-square bg-white rounded-lg md:rounded-2xl shadow-sm overflow-hidden flex items-center justify-center p-1.5 md:p-3 border border-slate-200 mb-1 md:mb-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setIsQrModalOpen(true)}
                    >
                      <img 
                        src="https://drive.google.com/thumbnail?id=1Lj-ygEw2HBzW-2No0nPT24TqWArF4EkP&sz=w1000" 
                        alt="Payment QR Code" 
                        className="w-full h-full object-contain" 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/400x400/png?text=Wing+KHQR";
                        }}
                      />
                    </div>
                    <div className="text-center mt-auto md:mt-0">
                      <p className="text-slate-600 font-medium mb-0 md:mb-1 text-[8px] md:text-sm leading-tight">ស្កេនដើម្បីបង់ប្រាក់</p>
                      <p className="text-sm md:text-2xl font-black text-blue-600 leading-none">${selectedPlan.price.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Upload Column */}
                  <div className="flex-1 flex flex-col h-full">
                    <div className="mb-1 md:mb-2 text-slate-600 leading-tight md:leading-relaxed text-[8px] md:text-sm">
                      សូមវេរលុយ <strong className="text-blue-600 font-black">${selectedPlan.price}</strong> រួចបញ្ជូលរូបភាពវិក្កយបត្រ។
                    </div>
                    
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex-grow border-2 border-dashed rounded-xl md:rounded-3xl p-2 md:p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group overflow-hidden min-h-[80px] md:min-h-[150px] ${
                        preview 
                          ? 'border-blue-400 bg-blue-50/50 shadow-inner' 
                          : 'border-slate-300 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-300'
                      }`}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileSelect} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      {preview ? (
                        <div className="relative w-full max-w-[80px] md:max-w-[160px] h-full mx-auto group-hover:scale-105 transition-transform flex items-center justify-center">
                          <img src={preview} alt="Receipt preview" className="rounded-lg md:rounded-2xl shadow-md border-2 md:border-4 border-white h-full max-h-[100px] md:max-h-[200px] object-contain aspect-[3/4]" />
                          <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 bg-emerald-500 text-white rounded-full p-1 md:p-1.5 shadow-lg border-2 border-white">
                            <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" />
                          </div>
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg md:rounded-xl flex items-center justify-center text-white text-[8px] md:text-sm font-bold backdrop-blur-sm">
                            ប្ដូររូបភាព
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="w-8 h-8 md:w-12 md:h-12 bg-white shadow-sm border border-slate-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-1 md:mb-2 group-hover:scale-110 transition-transform">
                            <Upload className="w-4 h-4 md:w-6 md:h-6" />
                          </div>
                          <p className="text-slate-700 font-bold text-[8px] md:text-sm mb-0.5 md:mb-1 leading-tight">បញ្ចូលរូបភាព</p>
                          <p className="text-slate-400 text-[8px] md:text-xs font-medium leading-tight">JPG, PNG</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-2 md:mb-4 p-2 md:p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-bold flex items-center gap-2 md:gap-3 animate-in fade-in slide-in-from-bottom-2">
                  <Shield className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex flex-row gap-2 md:gap-4 pt-3 md:pt-4 border-t border-slate-100 mt-auto shrink-0">
                <button
                  onClick={() => setStep(1)}
                  disabled={isVerifying}
                  className="px-4 py-3 md:px-8 md:py-4 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl md:rounded-2xl transition-colors disabled:opacity-50 text-sm md:text-base whitespace-nowrap"
                >
                  ថយក្រោយ
                </button>
                <button
                  onClick={handleVerify}
                  disabled={isVerifying || !preview}
                  className="flex-1 py-3 md:py-4 font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl md:rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none flex items-center justify-center gap-1 md:gap-2 text-sm md:text-lg whitespace-nowrap"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 md:w-6 md:h-6 animate-spin" />
                      <span className="truncate">កំពុងបញ្ជូន...</span>
                    </>
                  ) : (
                    <span className="truncate">បញ្ជូនសំណើបង់ប្រាក់</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsQrModalOpen(false)}>
          <div className="relative max-w-full max-h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setIsQrModalOpen(false)}
              className="absolute -top-12 right-0 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="bg-white p-4 md:p-6 rounded-3xl shadow-2xl flex flex-col items-center max-h-[85vh]">
              <div className="font-black text-slate-800 text-xl md:text-2xl mb-4">
                Wing Bank KHQR
              </div>
              <img 
                src="https://drive.google.com/thumbnail?id=1Lj-ygEw2HBzW-2No0nPT24TqWArF4EkP&sz=w1000" 
                alt="Payment QR Code Full" 
                className="w-auto h-auto max-w-[90vw] max-h-[60vh] object-contain rounded-xl border border-slate-200" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/600x600/png?text=Wing+KHQR";
                }}
              />
              <div className="mt-4 text-center">
                <p className="text-slate-600 font-medium mb-1">ស្កេនដើម្បីបង់ប្រាក់</p>
                <p className="text-2xl md:text-3xl font-black text-blue-600">${selectedPlan.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
