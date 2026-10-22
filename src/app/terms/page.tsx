'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, CreditCard, Scale, CheckCircle2 } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';

export default function TermsPage() {
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
            <Scale size={16} />
            <span>{isAr ? 'نظام التجارة الإلكترونية السعودي' : 'Saudi eCommerce Law Compliant'}</span>
          </div>
          <h1 className="policy-title">
            {isAr ? 'الشروط والأحكام وشروط الدفع' : 'Terms & Conditions of Sale'}
          </h1>
          <p className="policy-last-updated">
            {isAr ? 'آخر تحديث: أكتوبر 2026 · المملكة العربية السعودية' : 'Last Updated: October 2026 · Kingdom of Saudi Arabia'}
          </p>
        </div>

        {/* Content Body */}
        <div className="policy-content-card">
          {isAr ? (
            <div className="policy-body-ar" dir="rtl">
              <section className="policy-section">
                <h2>١. شروط الاستخدام والأهلية القانونية</h2>
                <p>
                  مرحباً بكم في متجر <strong>لوميرا (LUMÉRA)</strong>. يخضع استخدامكم للمتجر وإتمامكم لأي عملية شراء لهذه الشروط والأحكام المعتمدة بموجب نظام التجارة الإلكترونية ولائحته التنفيذية في المملكة العربية السعودية. يُعد استخدامكم للمتجر بمثابة إقرار صريح بالموافقة على هذه الشروط دون قيد أو شرط.
                </p>
              </section>

              <section className="policy-section">
                <h2>٢. بيانات الهوية التجارية والعنوان الوطني</h2>
                <div className="policy-info-box">
                  <p><strong>الاسم التجاري:</strong> متجر لوميرا للعطور والجمال (LUMÉRA)</p>
                  <p><strong>المشغل والمالك:</strong> سهير الله عبدالسلام (Sahadullah Abdulssalam)</p>
                  <p><strong>العنوان الوطني المسجل:</strong> مبنى 4605، شارع الحارث ابن النعمان، حي الصفا، الرمز البريدي 23455، جدة، المملكة العربية السعودية</p>
                  <p><strong>العنوان المختصر:</strong> JDSA4605 · رقم إثبات العنوان: 1095366853</p>
                  <p><strong>البريد الإلكتروني للدعم والنزاعات:</strong> concierge@lumera.sa / Lumera.ksa123@gmail.com</p>
                  <p><strong>خدمة العملاء:</strong> 966501234567+</p>
                </div>
              </section>

              <section className="policy-section">
                <h2>٣. الأسعار والعملة وضريبة القيمة المضافة</h2>
                <ul>
                  <li>جميع الأسعار المعروضة في متجر لوميرا مُسعرة رسمياً <strong>بالريال السعودي (SAR / ر.س)</strong>.</li>
                  <li>وفقاً للأنظمة واللوائح الصادرة عن هيئة الزكاة والضريبة والجمارك (ZATCA)، فإن الأسعار المعروضة هي المبالغ الإجمالية المستحقة للدفع، وتخضع للإعفاء الضريبي النظامي للمنشآت المستقلة متى ما كانت ضمن الحدود المقررة نظاماً.</li>
                  <li>يحتفظ المتجر بحق تعديل الأسعار وعروض التخفيض في أي وقت، ولا تسري أي تعديلات سعرية بأثر رجعي على الطلبات المؤكدة مسبقاً.</li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>٤. طرق الدفع المعتمدة وأمان المعاملات (Moyasar)</h2>
                <p>
                  يوفر متجر لوميرا خيارات سداد إلكترونية متعددة وآمنة بالتعاون مع بوابة الدفع الإلكتروني <strong>ميسر (Moyasar)</strong> المرخصة والمعتمدة من البنك المركزي السعودي (SAMA):
                </p>
                <ul>
                  <li><strong>بطاقات مدى (Mada):</strong> بطاقات الصراف الآلي للبنوك السعودية.</li>
                  <li><strong>أبل باي (Apple Pay):</strong> السداد السريع والآمن بنقرة واحدة عبر أجهزة أبل.</li>
                  <li><strong>البطاقات الائتمانية:</strong> فيزا (Visa) وماستركارد (Mastercard).</li>
                  <li><strong>تقسيط المشتريات بدون فوائد:</strong> عبر تابي (Tabby) وتمارا (Tamara) للمواطنين والمقيمين المؤهلين.</li>
                  <li><strong>إس تي سي باي (STC Pay):</strong> المحفظة الرقمية المعتمدة.</li>
                  <li><strong>الدفع عند الاستلام (COD):</strong> متاح داخل مدينة جدة والمدن الرئيسية وفق رسوم خدمة محددة.</li>
                </ul>
                <p>
                  تتم حماية كافة المعاملات المالية بتشفير 256-bit SSL وفق أعلى معايير أمان بطاقات الدفع العالمية (PCI-DSS).
                </p>
              </section>

              <section className="policy-section">
                <h2>٥. أصالة المنتجات والضمان</h2>
                <p>
                  تلتزم لوميرا التزاماً قاطعاً بتقديم عطور ومستحضرات تجميل أصلية ١٠٠٪، مستوردة ومفحوصة بعناية فائقة من المصادر الرسمية وبيوت الجمال العالمية. تضمن لوميرا سلامة المنتج وخلوه من أي عيوب مصنعية عند الاستلام.
                </p>
              </section>

              <section className="policy-section">
                <h2>٦. إتمام الطلبات والإلغاء</h2>
                <ul>
                  <li>يعتبر العقد مبرماً بين المتجر والعميل فور تأكيد الطلب وسداد القيمة عبر بوابة الدفع الإلكتروني أو اختيار خيار الدفع عند الاستلام.</li>
                  <li>يحق للعميل إلغاء الطلب مجاناً قبل خروجه من مستودعاتنا في جدة للشحن. في حال تم شحن الطلب بالفعل، تسري عليه أحكام سياسة الاسترجاع والاستبدال.</li>
                  <li>يحتفظ المتجر بالحق في إلغاء أي طلب لظروف قاهرة مثل نفاذ الكمية المفاجئ أو أخطاء تسعير تقنية غير مقصودة، مع التزامنا بإعادة كامل المبلغ المدفوع فوراً للعميل.</li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>٧. حدود المسؤولية والنزاعات</h2>
                <p>
                  تخضع هذه الشروط والأحكام وتفسر وتنفذ وفقاً للأنظمة والقوانين السارية في <strong>المملكة العربية السعودية</strong>. وتختص المحاكم والجهات القضائية المختصة في مدينة <strong>جدة</strong> بالنظر في أي نزاع قد ينشأ عن تنفيذ أو تفسير هذا العقد.
                </p>
              </section>

              <section className="policy-section">
                <h2>٨. خدمة العملاء والدعم</h2>
                <p>
                  فريقنا متواجد لخدمتكم طيلة أيام الأسبوع عبر البريد: <a href="mailto:concierge@lumera.sa">concierge@lumera.sa</a> أو الواتساب: <a href="tel:+966501234567">+966 50 123 4567</a>.
                </p>
              </section>
            </div>
          ) : (
            <div className="policy-body-en">
              <section className="policy-section">
                <h2>1. Acceptance of Terms & Eligibility</h2>
                <p>
                  Welcome to <strong>LUMÉRA</strong>. By accessing our platform, browsing our luxury catalogue, or placing an order, you agree to be bound by these Terms and Conditions in accordance with the Saudi eCommerce Law and its implementing regulations. If you do not agree to these terms, please refrain from using our services.
                </p>
              </section>

              <section className="policy-section">
                <h2>2. Merchant Identity & Official National Address</h2>
                <div className="policy-info-box">
                  <p><strong>Trade Name:</strong> LUMÉRA Haute Parfumerie (لوميرا)</p>
                  <p><strong>Registered Proprietor:</strong> Sahadullah Abdulssalam (سهير الله عبدالسلام)</p>
                  <p><strong>Official National Address:</strong> Building 4605, Al Harith Ibn Al Noaman St, As Safa District, Postal Code 23455, Jeddah, Kingdom of Saudi Arabia</p>
                  <p><strong>Short Address:</strong> JDSA4605 · Address Proof No.: 1095366853</p>
                  <p><strong>Concierge Email:</strong> concierge@lumera.sa / Lumera.ksa123@gmail.com</p>
                  <p><strong>Direct Helpline & WhatsApp:</strong> +966 50 123 4567</p>
                </div>
              </section>

              <section className="policy-section">
                <h2>3. Pricing, Currency & Taxation</h2>
                <ul>
                  <li>All prices listed on LUMÉRA are officially quoted in <strong>Saudi Arabian Riyals (SAR)</strong>.</li>
                  <li>In accordance with the Zakat, Tax and Customs Authority (ZATCA) regulations, prices reflect total payable amounts and are subject to statutory small business exemption thresholds where applicable.</li>
                  <li>LUMÉRA reserves the right to adjust prices or promotional edits without prior notice. Confirmed orders already processed are exempt from retroactive pricing changes.</li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>4. Payment Methods & Gateway Security (Moyasar)</h2>
                <p>
                  LUMÉRA provides certified, seamless payment integrations powered by <strong>Moyasar Financial Technologies</strong>, fully licensed by the Saudi Central Bank (SAMA):
                </p>
                <ul>
                  <li><strong>Mada Debit Cards:</strong> Standard bank cards issued in the Kingdom of Saudi Arabia.</li>
                  <li><strong>Apple Pay:</strong> Instant, biometric contactless checkout for Apple device users.</li>
                  <li><strong>Credit Cards:</strong> Visa and Mastercard with 3D-Secure authentication.</li>
                  <li><strong>Buy Now, Pay Later:</strong> Interest-free split installments via Tabby and Tamara for qualified residents.</li>
                  <li><strong>STC Pay:</strong> Certified Saudi digital wallet payments.</li>
                  <li><strong>Cash on Delivery (COD):</strong> Available for Jeddah and major Saudi metropolitan areas.</li>
                </ul>
                <p>
                  All online payments are strictly protected by bank-grade 256-bit SSL encryption and PCI-DSS Level 1 compliance.
                </p>
              </section>

              <section className="policy-section">
                <h2>5. Product Authenticity Guarantee</h2>
                <p>
                  LUMÉRA guarantees that every fragrance bottle, cosmetic creation, and skincare ritual offered on our platform is 100% genuine and original, sourced directly from authorized fragrance houses and distributors worldwide.
                </p>
              </section>

              <section className="policy-section">
                <h2>6. Order Placement & Cancellation</h2>
                <ul>
                  <li>An order constitutes a binding sales agreement once payment is authorized or Cash on Delivery is confirmed.</li>
                  <li>Clients may cancel an order free of charge before it is dispatched from our fulfillment facility in Jeddah. Once in transit with courier partners, our Return & Refund Policy applies.</li>
                  <li>LUMÉRA reserves the right to cancel orders in unforeseen circumstances (such as supply stock-outs or typographical pricing errors), with immediate 100% refund to the client.</li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>7. Governing Law & Jurisdiction</h2>
                <p>
                  These Terms and Conditions shall be governed by, construed, and enforced in accordance with the substantive laws of the <strong>Kingdom of Saudi Arabia</strong>. Any disputes arising out of or in connection with these terms shall fall under the exclusive jurisdiction of the competent judicial courts of <strong>Jeddah, Saudi Arabia</strong>.
                </p>
              </section>

              <section className="policy-section">
                <h2>8. Customer Concierge Support</h2>
                <p>
                  For any inquiries regarding our terms, please contact our concierge team at <a href="mailto:concierge@lumera.sa">concierge@lumera.sa</a> or via phone/WhatsApp at <a href="tel:+966501234567">+966 50 123 4567</a>.
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
