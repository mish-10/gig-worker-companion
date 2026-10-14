import React, { useState } from 'react';
import {
  AlertCircle,
  Sparkles,
  Copy,
  Check,
  Download,
  RotateCcw,
  Scale,
  Send,
  FileCheck,
  Info,
  Languages,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ComplaintRequest, Platform } from '../types';

const PLATFORMS: Platform[] = [
  'Swiggy',
  'Zomato',
  'Zepto',
  'Blinkit',
  'Uber',
  'Ola',
  'Rapido',
  'Porter',
  'Urban Company',
  'Amazon Flex',
  'Other',
];

const DISPUTE_TYPES = [
  {
    id: 'account_deactivation',
    labelEn: 'Arbitrary Account Suspension / Sudden ID Block',
    labelHi: 'अचानक और बिना कारण आईडी ब्लॉक / सस्पेंड होना',
    sampleDetailsEn:
      'My partner ID was suddenly deactivated without any prior notice or formal hearing after an unverified customer complaint regarding order delivery. I have maintained a 4.8 star rating over 2,000+ completed orders.',
    sampleDetailsHi:
      'मेरी पार्टनर आईडी को बिना किसी पूर्व सूचना या जांच के अचानक बंद कर दिया गया। एक ग्राहक ने झूठी शिकायत की, जबकि मेरा पिछला रेटिंग 4.8 रहा है और मैंने 2000 से अधिक सफल डिलीवरी की हैं।',
  },
  {
    id: 'delayed_payment',
    labelEn: 'Unpaid / Delayed Weekly Payout & Incentive Withheld',
    labelHi: 'साप्ताहिक भुगतान में देरी व इंसेंटिव रोके जाने का विवाद',
    sampleDetailsEn:
      'Weekly payout of ₹4,850 for the cycle ending last Sunday has not been credited to my registered bank account despite app showing completed transfer. Partner support ticket #89421 remains unanswered for 5 days.',
    sampleDetailsHi:
      'पिछले हफ्ते का ₹4,850 का साप्ताहिक भुगतान अभी तक मेरे बैंक खाते में क्रेडिट नहीं हुआ है, जबकि ऐप में ट्रांसफर पूरा दिखा रहा है। सपोर्ट टिकट #89421 पर 5 दिनों से कोई समाधान नहीं मिला है।',
  },
  {
    id: 'unfair_deduction',
    labelEn: 'Wrongful Penalty Deduction for Cancelled / Spill Order',
    labelHi: 'कैंसिल या स्पिल ऑर्डर पर गलत जुर्माना कटौती',
    sampleDetailsEn:
      'A penalty of ₹1,200 was deducted from my payout for an order cancellation caused entirely by merchant packaging defect (soup leak). I had uploaded photo proof of defective restaurant packaging at the pick-up counter.',
    sampleDetailsHi:
      'रेस्तरां द्वारा पैकेजिंग ढीली होने के कारण सूप लीक हो गया था, जिसकी फोटो मैंने पिकअप के समय ही अपलोड कर दी थी। इसके बावजूद कंपनी ने मेरे पे-आउट से ₹1,200 की अनुचित पेनल्टी काट ली है।',
  },
  {
    id: 'insurance_denial',
    labelEn: 'Platform Group Accident Insurance Claim Delay / Rejection',
    labelHi: 'ऑन-ड्यूटी एक्सीडेंट बीमा क्लेम में देरी या लापरवाही',
    sampleDetailsEn:
      'I met with a road accident while carrying an active order on 5th October. Hospital admission bills of ₹32,000 were submitted with MLC and platform ticket ID, but the partner insurance team has not initiated cashless settlement.',
    sampleDetailsHi:
      '5 अक्टूबर को एक्टिव ऑर्डर ले जाते समय मेरा सड़क एक्सीडेंट हुआ था। अस्पताल के ₹32,000 के बिल और एमएलसी रिपोर्ट जमा करने के बावजूद बीमा कंपनी ने क्लेम प्रोसेस नहीं किया है।',
  },
  {
    id: 'fare_mismatch',
    labelEn: 'Trip Fare Distance Mismatch / Toll & Rain Surge Denied',
    labelHi: 'ट्रिप किराया दूरी विसंगति / टोल व बारिश सर्ज न मिलना',
    sampleDetailsEn:
      'Completed a 16 km rain peak ride, but payout calculated only base 8 km without rain surge incentive or reimbursement of ₹85 toll paid at toll plaza via FASTag.',
    sampleDetailsHi:
      'बारिश के दौरान 16 किमी की लंबी राइड पूरी की, लेकिन किराया केवल 8 किमी का दिया गया और फास्टैग से कटे ₹85 के टोल का भी रिफंड नहीं दिया गया।',
  },
];

export const ComplaintGeneratorView: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const [platform, setPlatform] = useState<Platform>('Swiggy');
  const [workerName, setWorkerName] = useState('Ramesh Kumar');
  const [workerId, setWorkerId] = useState('SWIG-BLR-89214');
  const [city, setCity] = useState('Bengaluru, Karnataka');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [disputeType, setDisputeType] = useState('account_deactivation');
  const [disputeDate, setDisputeDate] = useState(new Date().toISOString().split('T')[0]);
  const [amountInDispute, setAmountInDispute] = useState('1200');
  const [incidentDetails, setIncidentDetails] = useState(
    DISPUTE_TYPES[0].sampleDetailsEn
  );
  const [complaintLanguage, setComplaintLanguage] = useState<'en' | 'hi'>('en');

  // Generation state
  const [generatedComplaint, setGeneratedComplaint] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleDisputeTypeChange = (typeId: string) => {
    setDisputeType(typeId);
    const selected = DISPUTE_TYPES.find((d) => d.id === typeId);
    if (selected) {
      setIncidentDetails(
        complaintLanguage === 'hi' ? selected.sampleDetailsHi : selected.sampleDetailsEn
      );
    }
  };

  const handleLanguageSwitch = (lang: 'en' | 'hi') => {
    setComplaintLanguage(lang);
    const selected = DISPUTE_TYPES.find((d) => d.id === disputeType);
    if (selected) {
      setIncidentDetails(
        lang === 'hi' ? selected.sampleDetailsHi : selected.sampleDetailsEn
      );
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMessage(null);

    const disputeTypeObj = DISPUTE_TYPES.find((d) => d.id === disputeType);
    const disputeTypeName =
      complaintLanguage === 'hi'
        ? disputeTypeObj?.labelHi || disputeType
        : disputeTypeObj?.labelEn || disputeType;

    const payload: ComplaintRequest = {
      platform,
      workerName,
      workerId,
      city,
      phoneNumber,
      disputeType: disputeTypeName,
      disputeDate,
      amountInDispute,
      incidentDetails,
      language: complaintLanguage,
    };

    const controller = new AbortController();
    const timeoutTimer = setTimeout(() => controller.abort(), 25000);

    try {
      const response = await fetch('/api/generate-complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutTimer);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Server returned error status ${response.status}`
        );
      }

      const data = await response.json();
      setGeneratedComplaint(data.complaint || 'No complaint text generated.');
    } catch (err: any) {
      clearTimeout(timeoutTimer);
      console.error('Complaint generation error:', err);
      // Fallback structured legal template if offline or error
      const fallbackNotice =
        complaintLanguage === 'hi'
          ? `विषय: औपचारिक शिकायत एवं अंतिम नोटिस - अवैध आईडी निलंबन / बकाया भुगतान विवाद (पार्टनर आईडी: ${workerId})\n\nसेवा में,\nशिकायत निवारण अधिकारी (Grievance Officer),\n${platform} India Pvt. Ltd.\n\nमहोदय/महोदया,\n\nमैं, ${workerName} (पार्टनर आईडी: ${workerId}, शहर: ${city}, फोन: ${phoneNumber}), ${platform} के साथ एक पंजीकृत डिलीवरी/ड्राइवर पार्टनर हूँ।\n\nदिनांक ${disputeDate} को मुझे निम्नलिखित गंभीर समस्या का सामना करना पड़ा:\n"${incidentDetails}"\nविवादित राशि: ₹${amountInDispute || 'लागू नहीं'}\n\nकानूनी आधार व प्राकृतिक न्याय के सिद्धांत:\n1. सूचना प्रौद्योगिकी (मध्यवर्ती दिशानिर्देश) नियमावली 2021 की धारा 11 के तहत शिकायत निवारण अधिकारी का दायित्व है कि वह किसी भी अनुचित कार्रवाई पर कामगार को निष्पक्ष सुनवाई का अवसर दे।\n2. बिना किसी ठोस जांच और लिखित कारण के आईडी ब्लॉक करना या गलत कटौती करना उपभोक्ता संरक्षण अधिनियम 2019 एवं सामाजिक सुरक्षा संहिता के तहत अनुचित व्यापार व्यवहार की श्रेणी में आता है।\n\nमांग:\nमैं विनम्रतापूर्वक अनुरोध करता हूँ कि उपरोक्त मामले की निष्पक्ष जांच करते हुए आगामी 7 कार्य दिवसों के भीतर समाधान किया जाए। यदि इस अवधि में कोई ठोस निवारण नहीं होता है, तो मैं इस प्रकरण को राष्ट्रीय उपभोक्ता हेल्पलाइन (NCH 1915), ई-दाखिल और संबंधित राज्य श्रम आयुक्त कार्यालय में आधिकारिक रूप से दर्ज करने के लिए बाध्य होऊंगा।\n\nसंलग्नक:\n1. ऐप ऑर्डर/ट्रिप का स्क्रीनशॉट\n2. सपोर्ट चैट टिकट आईडी\n3. बैंक पासबुक / टीडीएस स्टेटमेंट\n\nभवदीय,\n${workerName}\nपार्टनर आईडी: ${workerId}\nमोबाइल: ${phoneNumber}`
          : `SUBJECT: FORMAL GRIEVANCE & LEGAL NOTICE: ${disputeTypeName.toUpperCase()} (PARTNER ID: ${workerId})\n\nDATE: ${new Date().toLocaleDateString('en-GB')}\n\nTO,\nThe Resident Grievance Officer,\n${platform} India Operations,\nCorporate Redressal Division.\n\nCOMPOUND COMPLAINANT DETAILS:\nPartner Name: ${workerName}\nRegistered Worker ID: ${workerId}\nCity / Hub Location: ${city}\nRegistered Mobile Number: ${phoneNumber}\n\nDEAR GRIEVANCE OFFICER,\n\nI am writing to formally register an urgent grievance regarding unfair platform treatment and financial dispute arising on ${disputeDate}.\n\nFACTUAL SUMMARY OF THE GRIEVANCE:\n${incidentDetails}\nDisputed Amount Involved: ₹${amountInDispute || '0'}\n\nSTATUTORY AND LEGAL GROUNDS:\n1. Non-compliance with Rule 11 of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, which obligates platform intermediaries to redress partner grievances within 15 days.\n2. Violation of Principles of Natural Justice (Audi Alteram Partem): Suspending active worker livelihood or levying punitive financial deductions without prior written notice, documentary disclosure, or right of fair hearing.\n3. Unfair trade practices as defined under Section 2(47) of the Consumer Protection Act, 2019 and provisions safeguarding gig workers under the Code on Social Security, 2020.\n\nDEMAND FOR RESOLUTION:\nI request you to immediately:\n1. Investigate and reverse the wrongful penalty / restore active partner status within 7 business days.\n2. Credit the withheld amount of ₹${amountInDispute || '0'} to my registered bank account.\n\nNOTICE OF ESCALATION:\nPlease take notice that failure to resolve this complaint within 7 working days will compel me to escalate this matter to the National Consumer Helpline (NCH - 1915), Ministry of Consumer Affairs e-Daakhil portal, and the State Labour Commissioner.\n\nSincerely,\n${workerName}\nPartner ID: ${workerId}\nContact: ${phoneNumber}`;

      setGeneratedComplaint(fallbackNotice);
      setErrorMessage(
        `Gemini AI Server Notice: ${err?.message || 'Connection issue'}. Loaded verified legal statutory template for your dispute.`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedComplaint);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedComplaint], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Grievance_${platform}_${workerId}_${disputeDate}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('complaintTitle')}
            </h1>
            <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Scale className="w-3.5 h-3.5" />
              Legal Standard Drafts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{t('complaintSubtitle')}</p>
        </div>

        {/* Output Language Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <span className="text-slate-500 px-2">Draft Language:</span>
          <button
            type="button"
            onClick={() => handleLanguageSwitch('en')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              complaintLanguage === 'en'
                ? 'bg-white text-blue-700 font-bold shadow-2xs'
                : 'text-slate-600'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => handleLanguageSwitch('hi')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              complaintLanguage === 'hi'
                ? 'bg-white text-emerald-700 font-bold shadow-2xs'
                : 'text-slate-600'
            }`}
          >
            हिन्दी
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Column (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-600" />
              <span>{language === 'hi' ? 'विवाद की जानकारी' : 'Dispute Parameters'}</span>
            </h3>
            <span className="text-[10px] text-slate-400">Step 1 of 2</span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-3.5">
            {/* Platform & Dispute Type */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  {t('platform')}
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as Platform)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Dispute Date
                </label>
                <input
                  type="date"
                  value={disputeDate}
                  onChange={(e) => setDisputeDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
                />
              </div>
            </div>

            {/* Dispute Category Selector */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Dispute Nature / Category
              </label>
              <select
                value={disputeType}
                onChange={(e) => handleDisputeTypeChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
              >
                {DISPUTE_TYPES.map((dt) => (
                  <option key={dt.id} value={dt.id}>
                    {complaintLanguage === 'hi' ? dt.labelHi : dt.labelEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Worker Identity Details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Worker Name
                </label>
                <input
                  type="text"
                  required
                  value={workerName}
                  onChange={(e) => setWorkerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Partner / Rider ID
                </label>
                <input
                  type="text"
                  required
                  value={workerId}
                  onChange={(e) => setWorkerId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Registered Mobile
                </label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  City & State
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Disputed Amount (₹) (If financial penalty/unpaid fare)
              </label>
              <input
                type="number"
                min="0"
                value={amountInDispute}
                onChange={(e) => setAmountInDispute(e.target.value)}
                placeholder="e.g. 1200"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold"
              />
            </div>

            {/* Incident description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700">
                  Incident Description & Facts
                </label>
                <span className="text-[10px] text-slate-400">Be factual & clear</span>
              </div>
              <textarea
                rows={4}
                required
                value={incidentDetails}
                onChange={(e) => setIncidentDetails(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-blue-200" />
                  <span>{t('generating')}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>{t('generateLetter')}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output & Escalation Guide Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {language === 'hi' ? 'तैयार औपचारिक शिकायत पत्र' : 'Generated Dispute Notice Draft'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {language === 'hi'
                    ? 'आप इसे आवश्यकतानुसार एडिट कर सकते हैं और सीधे कॉपी या डाउनलोड कर सकते हैं।'
                    : 'Fully editable. Copy directly or download to email your platform Grievance Officer.'}
                </p>
              </div>

              {generatedComplaint && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
                    title="Copy letter"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-lg transition-colors"
                    title="Download text file"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Textarea for generated output */}
            <textarea
              rows={16}
              value={
                generatedComplaint ||
                (language === 'hi'
                  ? 'बाईं तरफ फॉर्म भरकर "शिकायत पत्र तैयार करें" बटन दबाएं। जेमिनी 3.8 Flash कानून सम्मत औपचारिक शिकायत पत्र तैयार करेगा।'
                  : 'Fill the dispute details on the left and click "Generate Formal Complaint" to generate a legal-grade dispute notice citing IT Rules Section 11, Consumer Protection Act, and Natural Justice.')
              }
              onChange={(e) => setGeneratedComplaint(e.target.value)}
              placeholder="Your generated legal complaint draft will appear here..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-mono text-slate-800 leading-relaxed focus:bg-white focus:border-blue-400 outline-none resize-y"
            />
          </div>

          {/* Grievance Escalation Steps */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4" />
              <span>
                {language === 'hi'
                  ? 'शिकायत भेजने व कानूनी समाधान की 3 स्तरीय प्रक्रिया'
                  : '3-Tier Escalation Protocol for Indian Gig Workers'}
              </span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-white/10 p-3 rounded-xl space-y-1">
                <span className="font-bold text-blue-300 block">Tier 1: Platform Level</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Email this notice to the Grievance Officer (grievance@platform.com) with order
                  screenshots and ticket ID. Give 7 working days to resolve.
                </p>
              </div>

              <div className="bg-white/10 p-3 rounded-xl space-y-1">
                <span className="font-bold text-emerald-300 block">Tier 2: Consumer Helpline</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Call National Consumer Helpline <strong>1915</strong> or file on{' '}
                  <strong className="text-white">consumerhelpline.gov.in</strong>. Mention
                  arbitrary deduction or unfair account blocking.
                </p>
              </div>

              <div className="bg-white/10 p-3 rounded-xl space-y-1">
                <span className="font-bold text-rose-300 block">Tier 3: Labour Commissioner</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Submit a copy of this notice to your District Labour Conciliation Officer under the
                  Code on Social Security or State Gig Worker Welfare Board.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
