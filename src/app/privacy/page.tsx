'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';

export default function PrivacyPolicyPage() {
  const { locale } = useLocale();
  const isAr = locale === 'ar';

  return (
    <div className="policy-page-wrapper">
      <div className="container-lumera policy-container">
        {/* Navigation Breadcrumb */}
        <div className="policy-breadcrumb">
          <Link href="/" className="policy-back-link">
            <ArrowLeft size={14} className={isAr ? 'rotate-180' : ''} />
            <span>{isAr ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </Link>
        </div>

        {/* Header */}
        <div className="policy-header">
          <div className="policy-badge">
            <ShieldCheck size={16} />
            <span>{isAr ? 'نظام حماية البيانات الشخصية السعودي' : 'Saudi PDPL Compliant'}</span>
          </div>
          <h1 className="policy-title">
            {isAr ? 'سياسة الخصوصية وسرية المعلومات' : 'Privacy & Data Protection Policy'}
          </h1>
          <p className="policy-last-updated">
            {isAr ? 'آخر تحديث: أكتوبر 2026 · متوافق مع أنظمة المملكة العربية السعودية' : 'Last Updated: October 2026 · Compliant with the Kingdom of Saudi Arabia'}
          </p>
        </div>

        {/* Content Body */}
        <div className="policy-content-card">
          {isAr ? (
            <div className="policy-body-ar" dir="rtl">
              <section className="policy-section">
                <h2>١. المقدمة والترحيب</h2>
                <p>
                  أهلاً بكم في متجر <strong>لوميرا (LUMÉRA)</strong>، وجهتكم الأولى للعطور الفاخرة ومستحضرات التجميل والعناية الراقية في المملكة العربية السعودية. نولي في لوميرا اهتماماً بالغاً بخصوصية وسرية بيانات عملائنا الكرام، ونلتزم التزاماً تاماً بنظام حماية البيانات الشخصية (PDPL) الصادر بالمرسوم الملكي في المملكة العربية السعودية ولوائحه التنفيذية.
                </p>
              </section>

              <section className="policy-section">
                <h2>٢. بيانات مشغل المتجر والهوية الرسمية</h2>
                <p>
                  يتم تشغيل وإدارة متجر لوميرا الإلكتروني وفق الأنظمة والقوانين المرعية في المملكة العربية السعودية:
                </p>
                <div className="policy-info-box">
                  <p><strong>اسم المتجر التجاري:</strong> لوميرا (LUMÉRA)</p>
                  <p><strong>المشغل المسجل:</strong> سهير الله عبدالسلام (Sahadullah Abdulssalam)</p>
                  <p><strong>العنوان الوطني المعتمد:</strong> مبنى رقم 4605، شارع الحارث ابن النعمان، حي الصفا، الرمز البريدي 23455، جدة، المملكة العربية السعودية</p>
                  <p><strong>العنوان الوطني المختصر:</strong> JDSA4605</p>
                  <p><strong>رقم إثبات العنوان الوطني:</strong> 1095366853</p>
                  <p><strong>البريد الإلكتروني الرسمي:</strong> concierge@lumera.sa / Lumera.ksa123@gmail.com</p>
                  <p><strong>خدمة العملاء والواتساب:</strong> 966501234567+</p>
                </div>
              </section>

              <section className="policy-section">
                <h2>٣. البيانات الشخصية التي نقوم بجمعها</h2>
                <p>لتقديم أرقى مستويات الخدمة وإيصال طلباتكم بدقة فائقة، نقوم بجمع البيانات التالية بالقدر اللازم فقط:</p>
                <ul>
                  <li><strong>بيانات الهوية والتواصل:</strong> الاسم الكامل، رقم الجوال السعودي، وعنوان البريد الإلكتروني.</li>
                  <li><strong>بيانات التوصيل والعنوان الوطني:</strong> المدينة، الحي، اسم الشارع، رقم المبنى، الرمز البريدي، والتعليمات الخاصة بالتوصيل.</li>
                  <li><strong>بيانات الطلبات والمعاملات:</strong> تفاصيل المنتجات المشتراة، تاريخ الطلب، وقيمته الإجمالية بالريال السعودي.</li>
                  <li><strong>بيانات الدفع الإلكتروني:</strong> تتم معالجة جميع المدفوعات عبر بوابات دفع إلكترونية معتمدة ومرخصة من البنك المركزي السعودي (ساما SAMA) مثل بوابة ميسر (Moyasar)، ومدى (Mada)، وأبل باي (Apple Pay). <em>نحن في لوميرا لا نطلع ولا نقوم بتخزين أي أرقام بطاقات ائتمانية أو رموز سرية في خوادمنا على الإطلاق.</em></li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>٤. الغرض من معالجة البيانات</h2>
                <p>نستخدم بياناتكم الشخصية حصرياً للأغراض التالية:</p>
                <ul>
                  <li>معالجة طلبات الشراء وتأكيدها وإصدار الفواتير الرسمية.</li>
                  <li>تسليم وتوصيل الطرود الفاخرة إلى باب منزلكم عبر شركات الشحن السريع المعتمدة في المملكة.</li>
                  <li>إرسال تحديثات حالة الشحنة وأرقام التتبع عبر الرسائل النصية، والبريد الإلكتروني، والواتساب.</li>
                  <li>تقديم خدمة العملاء والدعم الفني والاستشارات العطرية الخاصة.</li>
                  <li>الامتثال للمتطلبات النظامية والقانونية في المملكة العربية السعودية.</li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>٥. سرية وأمان البيانات ومشاركتها مع أطراف ثالثة</h2>
                <p>
                  نلتزم بعدم بيع أو تأجير أو مقايضة بياناتكم الشخصية مع أي طرف ثالث لأغراض تسويقية. لا تتم مشاركة أي جزء من البيانات إلا مع الشركاء الموثوقين واللازمين لتنفيذ الطلب:
                </p>
                <ul>
                  <li><strong>بوابات الدفع المرخصة (Moyasar):</strong> لإتمام عملية السداد بأمان وتشفير 256-bit SSL متوافق مع معايير PCI-DSS.</li>
                  <li><strong>شركات الشحن والتوصيل المعتمدة:</strong> لمشاركة الاسم ورقم الهاتف والعنوان فقط لغرض تسليم الشحنة.</li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>٦. حقوق المستخدم بموجب نظام حماية البيانات الشخصية السعودي</h2>
                <p>يحق لك كعميل بموجب الأنظمة السعودية ممارسة الحقوق التالية في أي وقت بمراسلتنا:</p>
                <ul>
                  <li>الحق في العلم والاطلاع على كيفية معالجة بياناتك.</li>
                  <li>الحق في الوصول إلى بياناتك الشخصية المخزنة لدينا وطلب نسخة منها.</li>
                  <li>الحق في تصحيح أو تحديث أي بيانات غير دقيقة.</li>
                  <li>الحق في طلب إتلاف أو مسح بياناتك الشخصية متى ما انتهى الغرض منها نظاماً.</li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>٧. ملفات تعريف الارتباط (Cookies)</h2>
                <p>
                  يستخدم متجر لوميرا ملفات تعريف الارتباط الضرورية لتحسين تجربة التسوق وحفظ محتويات حقيبة التسوق والمفضلة وتخصيص اللغة المختارة (العربية / الإنجليزية). يمكنك التحكم بملفات الكوكيز من خلال إعدادات متصفحك.
                </p>
              </section>

              <section className="policy-section">
                <h2>٨. التواصل والاستفسارات</h2>
                <p>
                  لأي استفسارات بخصوص سياسة الخصوصية أو لممارسة حقوقك، يسعد فريق العناية بالعملاء بخدمتكم عبر البريد الإلكتروني: <a href="mailto:concierge@lumera.sa">concierge@lumera.sa</a> أو هاتفياً / واتساب على: <a href="tel:+966501234567">+966 50 123 4567</a>.
                </p>
              </section>
            </div>
          ) : (
            <div className="policy-body-en">
              <section className="policy-section">
                <h2>1. Introduction & Overview</h2>
                <p>
                  Welcome to <strong>LUMÉRA</strong>, your premier Saudi destination for curated haute perfumery, luxury cosmetics, and exquisite skincare rituals. We are firmly committed to safeguarding the privacy, confidentiality, and security of our clients&apos; personal information in strict compliance with the Saudi Personal Data Protection Law (PDPL) enacted by Royal Decree in the Kingdom of Saudi Arabia.
                </p>
              </section>

              <section className="policy-section">
                <h2>2. Merchant Identity & Official Saudi National Address</h2>
                <p>
                  LUMÉRA operates electronically under the regulatory framework of the Kingdom of Saudi Arabia:
                </p>
                <div className="policy-info-box">
                  <p><strong>Trade Name:</strong> LUMÉRA (لوميرا)</p>
                  <p><strong>Registered Operator:</strong> Sahadullah Abdulssalam (سهير الله عبدالسلام)</p>
                  <p><strong>Official National Address:</strong> Building 4605, Al Harith Ibn Al Noaman St, As Safa District, Postal Code 23455, Jeddah, Kingdom of Saudi Arabia</p>
                  <p><strong>Short National Address Code:</strong> JDSA4605</p>
                  <p><strong>National Address Proof Number:</strong> 1095366853</p>
                  <p><strong>Official Concierge Email:</strong> concierge@lumera.sa / Lumera.ksa123@gmail.com</p>
                  <p><strong>Customer Care & WhatsApp:</strong> +966 50 123 4567</p>
                </div>
              </section>

              <section className="policy-section">
                <h2>3. Personal Data We Collect</h2>
                <p>To process and deliver your luxury orders with absolute precision, we collect only the necessary data:</p>
                <ul>
                  <li><strong>Identity & Contact Information:</strong> Full name, Saudi mobile number, and email address.</li>
                  <li><strong>Delivery & National Address Details:</strong> City, district, street name, building number, postal code, and specific delivery coordinates.</li>
                  <li><strong>Order & Transaction History:</strong> Products ordered, order timestamps, and total order value in Saudi Riyals (SAR).</li>
                  <li><strong>Payment Card Information:</strong> All electronic payments are processed through secure, SAMA-authorized payment gateways (Moyasar, Mada, Apple Pay, Visa, Mastercard). <em>LUMÉRA never stores, accesses, or processes your raw credit/debit card numbers or CVV codes on our servers.</em></li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>4. Purpose of Data Processing</h2>
                <p>Your personal information is collected and processed exclusively to:</p>
                <ul>
                  <li>Fulfill, verify, and dispatch your luxury orders.</li>
                  <li>Coordinate express courier delivery across Jeddah and all regions of Saudi Arabia.</li>
                  <li>Send shipment tracking updates via SMS, email, and WhatsApp notifications.</li>
                  <li>Provide dedicated customer support and bespoke fragrance consultations.</li>
                  <li>Comply with Saudi legal, tax, and consumer protection regulations.</li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>5. Data Confidentiality & Third-Party Disclosure</h2>
                <p>
                  We never sell, rent, or trade your personal information. Data is disclosed only to essential, trusted operational partners:
                </p>
                <ul>
                  <li><strong>Authorized Payment Gateways (Moyasar):</strong> For encrypted 256-bit SSL transaction processing compliant with PCI-DSS.</li>
                  <li><strong>Certified Courier Partners:</strong> Strictly for physical delivery of your parcels.</li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>6. Your Rights Under Saudi PDPL</h2>
                <p>Under the Saudi Personal Data Protection Law, you hold the following rights:</p>
                <ul>
                  <li>The right to be informed about how your personal data is collected and processed.</li>
                  <li>The right to access and request a copy of your personal data held by us.</li>
                  <li>The right to request correction, updating, or completion of any inaccurate data.</li>
                  <li>The right to request destruction or erasure of your personal data when no longer legally required.</li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>7. Cookies & Session Storage</h2>
                <p>
                  LUMÉRA utilizes essential cookies to preserve your shopping bag contents, wishlist preferences, and locale settings (Arabic / English). You may manage or disable cookies via your browser settings at any time.
                </p>
              </section>

              <section className="policy-section">
                <h2>8. Contact & Data Protection Officer</h2>
                <p>
                  For privacy inquiries or to exercise your statutory rights, please contact our concierge team at <a href="mailto:concierge@lumera.sa">concierge@lumera.sa</a> or via phone/WhatsApp at <a href="tel:+966501234567">+966 50 123 4567</a>.
                </p>
              </section>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .policy-page-wrapper {
          background-color: #110907;
          min-height: 85vh;
          padding: 3rem 1rem 6rem 1rem;
          color: #FAF7F2;
        }

        .policy-container {
          max-width: 860px;
          margin: 0 auto;
        }

        .policy-breadcrumb {
          margin-bottom: 2rem;
        }

        .policy-back-link {
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

        .policy-back-link:hover {
          opacity: 0.8;
        }

        .policy-header {
          margin-bottom: 2.5rem;
          text-align: center;
        }

        .policy-badge {
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

        .policy-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 0.75rem;
          line-height: 1.15;
        }

        .policy-last-updated {
          color: #9E8E85;
          font-size: 0.825rem;
        }

        .policy-content-card {
          background-color: #190F0C;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          padding: 2.75rem;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
        }

        .policy-section {
          margin-bottom: 2.25rem;
        }

        .policy-section:last-child {
          margin-bottom: 0;
        }

        .policy-section h2 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.45rem;
          font-weight: 600;
          color: var(--color-gold-400);
          margin-bottom: 0.85rem;
          letter-spacing: 0.02em;
        }

        .policy-section p {
          color: #D8C7B2;
          font-size: 0.925rem;
          line-height: 1.75;
          margin-bottom: 0.85rem;
        }

        .policy-section ul {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .policy-body-ar .policy-section ul {
          padding-left: 0;
          padding-right: 1.5rem;
        }

        .policy-section li {
          color: #D8C7B2;
          font-size: 0.9rem;
          line-height: 1.75;
          margin-bottom: 0.5rem;
        }

        .policy-section a {
          color: var(--color-gold-400);
          text-decoration: underline;
        }

        .policy-info-box {
          background: #120907;
          border: 1px solid rgba(200, 162, 101, 0.25);
          border-radius: 3px;
          padding: 1.25rem 1.5rem;
          margin: 1rem 0;
        }

        .policy-info-box p {
          margin-bottom: 0.45rem;
          font-size: 0.85rem;
          color: #E7DDCE;
        }

        .policy-info-box p:last-child {
          margin-bottom: 0;
        }

        @media (max-width: 768px) {
          .policy-page-wrapper {
            padding: 1.75rem 1rem calc(5.5rem + env(safe-area-inset-bottom, 0px)) 1rem;
          }

          .policy-content-card {
            padding: 1.5rem 1.25rem;
          }

          .policy-section h2 {
            font-size: 1.25rem;
          }

          .policy-section p, .policy-section li {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}
