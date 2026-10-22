'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, ArrowLeft, ShieldCheck, CheckCircle2, Send, Building2 } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';

export default function ContactPage() {
  const { locale } = useLocale();
  const isAr = locale === 'ar';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate contact form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="contact-page-wrapper">
      <div className="container-lumera contact-container">
        {/* Navigation Breadcrumb */}
        <div className="contact-breadcrumb">
          <Link href="/" className="contact-back-link">
            <ArrowLeft size={14} className={isAr ? 'rotate-180' : ''} />
            <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </Link>
        </div>

        {/* Header */}
        <div className="contact-header">
          <div className="contact-badge">
            <ShieldCheck size={16} />
            <span>{isAr ? 'العنوان الوطني المعتمد · المملكة العربية السعودية' : 'Verified Saudi Merchant Identity'}</span>
          </div>
          <h1 className="contact-title">
            {isAr ? 'تواصل مع دار لوميرا وبيانات المتجر' : 'Contact Us & Merchant Identity'}
          </h1>
          <p className="contact-subtitle">
            {isAr
              ? 'فريق خدمة عملاء لوميرا جاهز للرد على استفساراتكم وتوفير تجربة تسوق استثنائية.'
              : 'Our private concierge and client relations team are at your service for any inquiries.'}
          </p>
        </div>

        {/* Grid Layout: Official Merchant Card + Contact Form */}
        <div className="contact-grid">
          {/* LEFT: Official Merchant Identity & National Address Card */}
          <div className="merchant-identity-card" dir={isAr ? 'rtl' : 'ltr'}>
            <div className="merchant-card-header">
              <Building2 className="text-gold-400" size={24} />
              <div>
                <h3 className="merchant-card-title">
                  {isAr ? 'بيانات المتجر والعنوان الوطني الرسمي' : 'Official Merchant & National Address'}
                </h3>
                <p className="merchant-card-sub">
                  {isAr ? 'مسجل ومثبت رسمياً لدى البريد السعودي سبل' : 'Officially Registered with Saudi Post (SPL)'}
                </p>
              </div>
            </div>

            <div className="merchant-details-list">
              <div className="merchant-detail-item">
                <span className="detail-label">{isAr ? 'الاسم التجاري:' : 'Trade Name:'}</span>
                <span className="detail-value">{isAr ? 'متجر لوميرا للعطور والجمال (LUMÉRA)' : 'LUMÉRA Haute Parfumerie'}</span>
              </div>

              <div className="merchant-detail-item">
                <span className="detail-label">{isAr ? 'المشغل والمسجل القانوني:' : 'Registered Proprietor:'}</span>
                <span className="detail-value">Sahadullah Abdulssalam (سهير الله عبدالسلام)</span>
              </div>

              <div className="merchant-detail-item">
                <span className="detail-label">{isAr ? 'رقم الإثبات / السجل:' : 'Address Proof No.:'}</span>
                <span className="detail-value text-gold-300 font-mono font-semibold">1095366853</span>
              </div>

              <div className="merchant-detail-item">
                <span className="detail-label">{isAr ? 'العنوان الوطني المختصر:' : 'Short Address Code:'}</span>
                <span className="detail-value text-gold-300 font-mono font-semibold">JDSA4605</span>
              </div>

              <div className="merchant-detail-item">
                <span className="detail-label">{isAr ? 'رقم المبنى والشارع:' : 'Building & Street:'}</span>
                <span className="detail-value">
                  {isAr
                    ? 'مبنى 4605، شارع الحارث ابن النعمان، الرقم الفرعي 7616'
                    : 'Building 4605, Al Harith Ibn Al Noaman St, Secondary 7616'}
                </span>
              </div>

              <div className="merchant-detail-item">
                <span className="detail-label">{isAr ? 'الحي والمدينة:' : 'District & City:'}</span>
                <span className="detail-value">
                  {isAr ? 'حي الصفا، الرمز البريدي 23455، مدينة جدة' : 'As Safa Dist., Postal Code 23455, Jeddah'}
                </span>
              </div>

              <div className="merchant-detail-item">
                <span className="detail-label">{isAr ? 'الدولة:' : 'Country:'}</span>
                <span className="detail-value">{isAr ? 'المملكة العربية السعودية' : 'Kingdom of Saudi Arabia'}</span>
              </div>

              <div className="merchant-detail-item">
                <span className="detail-label">{isAr ? 'الحالة الضريبية (ZATCA):' : 'Tax Status (ZATCA):'}</span>
                <span className="detail-value text-[#9E8E85]">
                  {isAr
                    ? 'معفى نظاماً من ضريبة القيمة المضافة لعدم تجاوز حد التسجيل الإلزامي (٣٧٥,٠٠٠ ر.س)'
                    : 'Exempt from mandatory VAT registration under statutory small enterprise threshold (< 375,000 SAR)'}
                </span>
              </div>

              <div className="merchant-detail-item">
                <span className="detail-label">{isAr ? 'بوابة الدفع الإلكتروني:' : 'Payment Gateway:'}</span>
                <span className="detail-value text-gold-300">
                  {isAr ? 'ميسر (Moyasar) - مرخصة من البنك المركزي السعودي SAMA' : 'Moyasar (Licensed by SAMA)'}
                </span>
              </div>
            </div>

            {/* Quick Contact Info */}
            <div className="merchant-channels">
              <div className="channel-box">
                <Mail size={18} className="text-gold-400" />
                <div>
                  <div className="channel-title">{isAr ? 'البريد الإلكتروني' : 'Official Support Email'}</div>
                  <a href="mailto:concierge@lumera.sa" className="channel-link">concierge@lumera.sa</a>
                  <div className="text-[0.72rem] text-[#9E8E85]">Lumera.ksa123@gmail.com</div>
                </div>
              </div>

              <div className="channel-box">
                <Phone size={18} className="text-gold-400" />
                <div>
                  <div className="channel-title">{isAr ? 'خدمة العملاء والواتساب' : 'Concierge & WhatsApp'}</div>
                  <a href="tel:+966501234567" className="channel-link" dir="ltr">+966 50 123 4567</a>
                  <div className="text-[0.72rem] text-[#9E8E85]">
                    {isAr ? 'السبت - الخميس: ٩ ص حتى ١٠ م' : 'Sat – Thu: 9:00 AM – 10:00 PM AST'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Contact Form */}
          <div className="contact-form-card" dir={isAr ? 'rtl' : 'ltr'}>
            <h3 className="form-card-title">
              {isAr ? 'أرسل لنا رسالة أو استفسار' : 'Send Us an Inquiry'}
            </h3>
            <p className="form-card-sub">
              {isAr
                ? 'سيتواصل معكم أحد مستشارينا خلال مدة أقصاها ٢٤ ساعة.'
                : 'A dedicated client relations advisor will respond within 24 hours.'}
            </p>

            {submitted ? (
              <div className="contact-success-box">
                <CheckCircle2 size={40} className="text-gold-400 mb-3" />
                <h4>{isAr ? 'تم استلام رسالتكم بنجاح' : 'Inquiry Received with Pleasure'}</h4>
                <p>
                  {isAr
                    ? 'شكراً لتواصلكم مع دار لوميرا. سنقوم بالرد على بريدكم الإلكتروني في أقرب وقت.'
                    : 'Thank you for reaching out to LUMÉRA. Our concierge team has received your message and will attend to it promptly.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setName('');
                    setEmail('');
                    setPhone('');
                    setSubject('');
                    setMessage('');
                  }}
                  className="btn-lumera-secondary mt-4"
                >
                  {isAr ? 'إرسال رسالة أخرى' : 'Send Another Message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-field-group">
                  <label htmlFor="contact-name">{isAr ? 'الاسم الكامل *' : 'Full Name *'}</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isAr ? 'سارة العتيبي' : 'e.g. Sarah Al-Otaibi'}
                    className="contact-input"
                  />
                </div>

                <div className="form-field-row">
                  <div className="form-field-group">
                    <label htmlFor="contact-email">{isAr ? 'البريد الإلكتروني *' : 'Email Address *'}</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@example.com"
                      className="contact-input"
                    />
                  </div>
                  <div className="form-field-group">
                    <label htmlFor="contact-phone">{isAr ? 'رقم الجوال *' : 'Phone / Mobile *'}</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+966 5X XXX XXXX"
                      dir="ltr"
                      className="contact-input"
                    />
                  </div>
                </div>

                <div className="form-field-group">
                  <label htmlFor="contact-subject">{isAr ? 'موضوع الرسالة *' : 'Subject *'}</label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={isAr ? 'استفسار عن طلب أو منتج' : 'Order or Product Inquiry'}
                    className="contact-input"
                  />
                </div>

                <div className="form-field-group">
                  <label htmlFor="contact-message">{isAr ? 'تفاصيل الرسالة *' : 'Message *'}</label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={isAr ? 'اكتب تفاصيل استفسارك هنا...' : 'How may our concierge assist you today?'}
                    className="contact-input contact-textarea"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-lumera-primary w-full p-4 flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  <span>{loading ? (isAr ? 'جاري الإرسال...' : 'Sending...') : (isAr ? 'إرسال الرسالة' : 'Send Inquiry')}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .contact-page-wrapper {
          background-color: #110907;
          min-height: 85vh;
          padding: 3rem 1rem 6rem 1rem;
          color: #FAF7F2;
        }

        .contact-container {
          max-width: 1140px;
          margin: 0 auto;
        }

        .contact-breadcrumb {
          margin-bottom: 2rem;
        }

        .contact-back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--color-gold-400);
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .contact-back-link:hover {
          opacity: 0.8;
        }

        .contact-header {
          margin-bottom: 3rem;
          text-align: center;
        }

        .contact-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.4rem 0.95rem;
          border-radius: 9999px;
          background: rgba(200, 162, 101, 0.1);
          border: 1px solid var(--color-gold-400);
          color: var(--color-gold-400);
          font-size: 0.725rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          margin-bottom: 1.25rem;
        }

        .contact-title {
          font-family: var(--font-playfair), serif;
          font-size: 2.25rem;
          font-weight: 600;
          color: #FAF7F2;
          margin-bottom: 0.75rem;
          letter-spacing: 0.02em;
        }

        .contact-subtitle {
          font-size: 0.9rem;
          color: #A89A90;
          max-width: 650px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 2.5rem;
        }

        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
          .contact-title {
            font-size: 1.75rem;
          }
        }

        .merchant-identity-card {
          background: #180F0D;
          border: 1px solid rgba(200, 162, 101, 0.25);
          border-radius: 4px;
          padding: 2.25rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .merchant-card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-bottom: 1.25rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .merchant-card-title {
          font-family: var(--font-playfair), serif;
          font-size: 1.15rem;
          color: var(--color-gold-300);
          margin-bottom: 0.25rem;
        }

        .merchant-card-sub {
          font-size: 0.75rem;
          color: #9E8E85;
        }

        .merchant-details-list {
          display: flex;
          flex-col: column;
          gap: 0.9rem;
          margin-bottom: 2rem;
        }

        .merchant-detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          padding-bottom: 0.65rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .detail-label {
          font-size: 0.725rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #8E7D74;
        }

        .detail-value {
          font-size: 0.85rem;
          color: #E8D8C8;
          line-height: 1.5;
        }

        .merchant-channels {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 600px) {
          .merchant-channels {
            grid-template-columns: 1fr;
          }
        }

        .channel-box {
          background: rgba(200, 162, 101, 0.05);
          border: 1px solid rgba(200, 162, 101, 0.2);
          border-radius: 4px;
          padding: 1rem;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .channel-title {
          font-size: 0.725rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #8E7D74;
          margin-bottom: 0.2rem;
        }

        .channel-link {
          font-size: 0.825rem;
          font-weight: 500;
          color: var(--color-gold-300);
          text-decoration: none;
          display: block;
        }

        .channel-link:hover {
          text-decoration: underline;
        }

        .contact-form-card {
          background: #180F0D;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          padding: 2.25rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .form-card-title {
          font-family: var(--font-playfair), serif;
          font-size: 1.35rem;
          color: #FAF7F2;
          margin-bottom: 0.35rem;
        }

        .form-card-sub {
          font-size: 0.8rem;
          color: #9E8E85;
          margin-bottom: 1.5rem;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
        }

        .form-field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 600px) {
          .form-field-row {
            grid-template-columns: 1fr;
          }
        }

        .form-field-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-field-group label {
          font-size: 0.75rem;
          color: #C5B6A8;
          font-weight: 500;
        }

        .contact-input {
          background: #120907;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 2px;
          padding: 0.75rem 0.95rem;
          font-size: 0.85rem;
          color: #FAF7F2;
          outline: none;
          transition: border-color 0.2s;
        }

        .contact-input:focus {
          border-color: var(--color-gold-400);
        }

        .contact-textarea {
          resize: vertical;
          min-height: 110px;
        }

        .contact-success-box {
          text-align: center;
          padding: 3rem 1.5rem;
          background: rgba(200, 162, 101, 0.06);
          border: 1px solid rgba(200, 162, 101, 0.25);
          border-radius: 4px;
        }

        .contact-success-box h4 {
          font-family: var(--font-playfair), serif;
          font-size: 1.35rem;
          color: var(--color-gold-300);
          margin-bottom: 0.5rem;
        }

        .contact-success-box p {
          font-size: 0.85rem;
          color: #D8C7B2;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
