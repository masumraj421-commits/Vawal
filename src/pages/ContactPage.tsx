import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, Mail, MapPin, MessageSquare, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      showToast('সকল তথ্য পূরণ করুন');
      return;
    }

    setIsSent(true);
    showToast('ধন্যবাদ! আপনার বার্তাটি আমরা পেয়েছি। দ্রুত যোগাযোগ করা হবে।');
    setName('');
    setPhone('');
    setMessage('');
    setTimeout(() => setIsSent(false), 4000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <span className="text-xs font-bold text-[#C59B27] uppercase tracking-wider">
          সাহায্য ও অনুসন্ধান
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#14422D] mt-1 mb-2">
          যোগাযোগ ও গ্রাহক সেবা
        </h1>
        <p className="text-xs sm:text-sm text-[#5A5043]">
          পণ্য অর্ডার, বাল্ক ক্রয় অথবা যেকোনো পরামর্শের জন্য আমাদের সাথে যোগাযোগ করতে পারেন।
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-[#E8E3D9] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#14422D] pb-3 border-b border-[#F0EBE0]">
              যোগাযোগের মাধ্যম
            </h2>

            <div className="flex items-start gap-3 text-xs">
              <div className="w-9 h-9 rounded-lg bg-[#EBF4EF] text-[#14422D] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-[#1F2937] font-semibold">হেড অফিস ও ডিসপ্যাচ হাব:</strong>
                <p className="text-[#5A5043] leading-relaxed mt-0.5">
                  বীর উজলী বাজার, কাপাসিয়া, গাজীপুর-১৭৩০, বাংলাদেশ।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <div className="w-9 h-9 rounded-lg bg-[#EBF4EF] text-[#14422D] flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-[#1F2937] font-semibold">সরাসরি ফোন করুন:</strong>
                <a href="tel:01742578679" className="text-[#14422D] hover:underline font-mono text-xs block mt-0.5">
                  ০১৭৪২৫৭৮৬৭৯
                </a>
                <a href="tel:01302257761" className="text-[#14422D] hover:underline font-mono text-xs block">
                  ০১৩০২২৫৭৭৬১
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <div className="w-9 h-9 rounded-lg bg-[#EBF4EF] text-[#14422D] flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-[#1F2937] font-semibold">ইমেইল:</strong>
                <a href="mailto:Masumraj421@gmail.com" className="text-[#14422D] hover:underline mt-0.5 block">
                  Masumraj421@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <div className="w-9 h-9 rounded-lg bg-[#EBF4EF] text-[#14422D] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-[#1F2937] font-semibold">কাস্টমার সাপোর্ট সময়:</strong>
                <p className="text-[#5A5043] mt-0.5">
                  প্রতিদিন সকাল ৯:০০ টা থেকে রাত ১০:০০ টা পর্যন্ত (শুক্রবার সহ)।
                </p>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Chat card */}
          <div className="bg-[#14422D] text-white p-5 rounded-2xl shadow-xs">
            <h3 className="text-sm font-bold text-[#E9C46A] mb-1">হোয়াটসঅ্যাপে চ্যাট করুন</h3>
            <p className="text-xs text-[#C2DDD0] mb-3 leading-relaxed">
              সরাসরি হোয়াটসঅ্যাপে পণ্যের ছবি দেখতে বা দ্রুত অর্ডার কনফার্ম করতে মেসেজ পাঠান।
            </p>
            <a
              href="https://wa.me/8801742578679?text=Assalamu%20Alaikum,%20I%20want%20to%20order%20from%20Bhawal%20Fresh%20Food"
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-[#C59B27] hover:bg-[#b0871d] text-[#14422D] font-bold px-4 py-2 rounded-lg text-xs transition-colors shadow-xs"
            >
              হোয়াটসঅ্যাপ শুরু করুন &rarr;
            </a>
          </div>
        </div>

        {/* Right Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E8E3D9] p-6 sm:p-8 shadow-xs">
          <h2 className="text-base font-bold text-[#14422D] mb-4 pb-3 border-b border-[#F0EBE0]">
            আমাদের বার্তা পাঠান
          </h2>

          {isSent ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-700" />
              <h3 className="text-base font-bold">বার্তা সফলভাবে পাঠানো হয়েছে!</h3>
              <p className="text-xs text-emerald-700">
                ধন্যবাদ। ভাওয়াল ফ্রেশ ফুড প্রতিনিধি খুব শীঘ্রই আপনার দেওয়া নম্বরে যোগাযোগ করবেন।
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#2E2820] mb-1.5">আপনার নাম *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: রাশেদুল করিম"
                  className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5 focus:outline-none focus:border-[#14422D]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#2E2820] mb-1.5">মোবাইল নম্বর *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="যেমন: 017xxxxxxxx"
                  className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5 font-mono focus:outline-none focus:border-[#14422D]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#2E2820] mb-1.5">আপনার বার্তা বা অনুসন্ধান *</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="আপনি কি জানতে চান বিস্তারিত লিখুন..."
                  className="w-full bg-[#FAF8F5] border border-[#E8E3D9] rounded-lg p-2.5 focus:outline-none focus:border-[#14422D]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#14422D] hover:bg-[#0E3020] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Send className="w-4 h-4 text-[#C59B27]" />
                <span>বার্তা পাঠান</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
