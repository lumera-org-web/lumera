'use client';

import React from 'react';
import Link from 'next/link';
import { RotateCcw, ArrowLeft, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';

export default function RefundPolicyPage() {
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
            <RotateCcw size={16} />
            <span>{isAr ? 'حماية المستهلك - وزارة التجارة السعودية' : 'Ministry of Commerce Compliant'}</span>
          </div>
          <h1 className="policy-title">
            {isAr ? 'سياسة الاستبدال والاسترجاع والإلغاء' : 'Returns, Exchanges & Refund Policy'}
          </h1>
          <p className="policy-last-updated">
            {isAr ? 'وفقاً لنظام التجارة الإلكترونية ولائحته التنفيذية في المملكة العربية السعودية' : 'Pursuant to the Saudi eCommerce Law and Consumer Protection Directives'}
          </p>
        </div>

        {/* Content Body */}
        <div className="policy-content-card">
          {isAr ? (
            <div className="policy-body-ar" dir="rtl">
              <section className="policy-section">
                <h2>١. حق المستهلك في الاسترجاع والاستبدال</h2>
                <p>
                  حرصاً منا على رضاكم التام وامتثالاً لنظام التجارة الإلكترونية الصادر عن وزارة التجارة في المملكة العربية السعودية، يحق لعميل متجر <strong>لوميرا (LUMÉRA)</strong> استرجاع أو استبدال المنتجات المشتراة خلال <strong>سبعة (٧) أيام</strong> من تاريخ استلام الشحنة، وفق الضوابط والاشتراطات الموضحة أدناه.
                </p>
              </section>

              <section className="policy-section">
                <h2>٢. شروط استرجاع العطور ومستحضرات التجميل</h2>
                <p>
                  نظراً لطبيعة منتجاتنا الفاخرة وحفاظاً على معايير الصحة العامة وسلامة المنتجات، يُشترط لقبول الاسترجاع أو الاستبدال ما يلي:
                </p>
                <ul>
                  <li>أن يكون المنتج في حالته الأصلية المغلفة وغير مستخدم إطلاقاً.</li>
                  <li>أن يكون الغلاف السلوفاني الشفاف وباركود المنتج والملصقات الأمنية المصنعية سليمة ومغلقة تماماً ولم يتم فكها أو العبث بها.</li>
                  <li>أن تكون العبوة الكرتونية الفاخرة وكافة الملحقات والهدايا الترويجية المرفقة بحالتها الأصلية.</li>
                  <li>إرفاق الفاتورة الإلكترونية الأصلية أو رقم الطلب المعتمد.</li>
                </ul>
                <div className="policy-notice-box">
                  <strong>ملاحظة هامة وفق المادة الثالثة عشرة من لائحة نظام التجارة الإلكترونية:</strong> لا يحق للمستهلك استرجاع أو استبدال منتجات العطور ومستحضرات التجميل والعناية الشخصية بعد فك غلافها أو فتح السديلة لأسباب تتعلق بالصحة العامة والسلامة.
                </div>
              </section>

              <section className="policy-section">
                <h2>٣. المنتجات المعيبة أو المتضررة أثناء الشحن</h2>
                <p>
                  في حال وصول منتج به عيب مصنعي أو تعرض للتلف أثناء الشحن، تتحمل لوميرا المسؤولية الكاملة وتوفر للعميل أحد الخيارات التالية مجاناً:
                </p>
                <ul>
                  <li>استبدال المنتج فوراً بمنتج جديد وشحنه للعميل على نفقة المتجر بالكامل دون أي رسوم إضافية.</li>
                  <li>استرجاع كامل قيمة الطلب بما في ذلك رسوم الشحن المدفوعة إلى وسيلة الدفع الأصلية.</li>
                </ul>
                <p>
                  يُرجى إشعار خدمة العملاء خلال <strong>٤٨ ساعة</strong> من استلام الطلب مع إرفاق صور واضحة توضح التلف عبر الواتساب أو البريد الإلكتروني.
                </p>
              </section>

              <section className="policy-section">
                <h2>٤. آلية استرداد الأموال وفترة المعالجة</h2>
                <p>
                  تتم إعادة المبالغ المستحقة للعميل حصرياً إلى نفس وسيلة الدفع الإلكترونية التي تم السداد بها (مدى، أبل باي، فيزا، ماستركارد) عبر بوابة الدفع الإلكتروني <strong>ميسر (Moyasar)</strong>:
                </p>
                <ul>
                  <li><strong>فحص الشحنة المرتجعة:</strong> يتم فحص الطرد فور وصوله لمستودعاتنا في جدة والتأكد من سلامة الغلاف الأصلي خلال ٢-٣ أيام عمل.</li>
                  <li><strong>إيداع المبلغ:</strong> يتم إيداع المبلغ المالي المسترجع إلى حساب العميل البنكي خلال <strong>٥ إلى ١٤ يوم عمل</strong>، وذلك تبعاً لسياسات البنك السعودي المصدر للبطاقة.</li>
                  <li><strong>الطلبات المدفوعة نقداً عند الاستلام:</strong> تتم استعادة قيمتها عبر تحويل بنكي رسمي إلى الحساب البنكي (الآيبان IBAN) للعميل داخل المملكة العربية السعودية.</li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>٥. رسوم الشحن الخاصة بالاسترجاع</h2>
                <ul>
                  <li><strong>في حالة العيب أو الخطأ من المتجر:</strong> يتحمل متجر لوميرا كافة تكاليف الشحن والاسترجاع بنسبة ١٠٠٪.</li>
                  <li><strong>في حالة رغبة العميل بالاسترجاع (دون عيب في المنتج):</strong> يتحمل العميل رسوم بوليصة الاسترجاع الفعلية لشركة الشحن (٢٥ ريال سعودي)، وتُخصم من إجمالي المبلغ المسترد.</li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>٦. خطوات تقديم طلب الاسترجاع</h2>
                <p>لتقديم طلب استرجاع سلس، يُرجى اتباع الخطوات التالية:</p>
                <ol>
                  <li>التواصل مع فريق العناية بالعملاء عبر الواتساب: <a href="tel:+966501234567">+966 50 123 4567</a> أو البريد: <a href="mailto:concierge@lumera.sa">concierge@lumera.sa</a>.</li>
                  <li>تزويدنا برقم الطلب (مثل LUM-884219) وصورة المنتج وحالة الغلاف.</li>
                  <li>سيقوم فريقنا بإصدار بوليصة شحن استرجاع سريعة عبر شركة الشحن المعتمدة لاستلام الطرد من عنوانكم.</li>
                </ol>
              </section>
            </div>
          ) : (
            <div className="policy-body-en">
              <section className="policy-section">
                <h2>1. Consumer Rights & Statutory Scope</h2>
                <p>
                  At <strong>LUMÉRA</strong>, your absolute satisfaction is our standard. In full compliance with the Saudi eCommerce Law issued by the Ministry of Commerce and Consumer Protection Directives, our clients are entitled to exchange or return eligible luxury products within <strong>seven (7) calendar days</strong> of receiving the parcel.
                </p>
              </section>

              <section className="policy-section">
                <h2>2. Return Conditions for Fragrances & Luxury Cosmetics</h2>
                <p>
                  Due to the delicate nature of luxury perfumery, cosmetics, and skincare, and in accordance with Saudi public health standards, returns and exchanges are subject to the following criteria:
                </p>
                <ul>
                  <li>The product must be completely unused, pristine, and in its original luxury condition.</li>
                  <li>The outer cellophane seal, luxury presentation box, holographic barcodes, and factory security ribbons must remain fully intact and unopened.</li>
                  <li>The original electronic invoice or confirmed order number must accompany the return request.</li>
                </ul>
                <div className="policy-notice-box">
                  <strong>Important Notice Under Article 13 of Saudi eCommerce Regulations:</strong> For health, hygiene, and consumer safety protection, perfumes, lipsticks, and skincare formulations cannot be returned once their protective hygiene seals or cellophane wraps have been unsealed.
                </div>
              </section>

              <section className="policy-section">
                <h2>3. Defective, Damaged or Incorrect Shipments</h2>
                <p>
                  If an item arrives damaged during transit or possesses a verified manufacturing imperfection, LUMÉRA accepts 100% full accountability. Clients may select:
                </p>
                <ul>
                  <li>An immediate, complimentary expedited replacement dispatched at zero cost to the client.</li>
                  <li>A 100% complete refund including all shipping fees paid, refunded directly to the original payment card.</li>
                </ul>
                <p>
                  Please notify our concierge within <strong>48 hours</strong> of delivery with photographic evidence via WhatsApp or email.
                </p>
              </section>

              <section className="policy-section">
                <h2>4. Refund Processing & Timelines (Moyasar)</h2>
                <p>
                  All refunds are credited strictly to the original electronic payment method (Mada, Apple Pay, Visa, Mastercard) via our licensed payment processor <strong>Moyasar</strong>:
                </p>
                <ul>
                  <li><strong>Inspection:</strong> Once received at our Jeddah fulfillment facility, returned items are inspected within 2–3 business days.</li>
                  <li><strong>Credit Timeline:</strong> Refund transactions are processed immediately and reflect in the client&apos;s bank account within <strong>5 to 14 business days</strong>, depending on the issuing Saudi bank.</li>
                  <li><strong>Cash on Delivery (COD) Refunds:</strong> Transferred via direct Saudi bank wire (IBAN) to the customer&apos;s verified account.</li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>5. Return Shipping Costs</h2>
                <ul>
                  <li><strong>Faulty / Defective Shipments:</strong> 100% covered by LUMÉRA.</li>
                  <li><strong>Change of Mind (Intact & Sealed):</strong> A standard carrier return fee of 25 SAR will be deducted from the total refunded amount.</li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>6. How to Initiate a Return</h2>
                <p>To initiate a return with our concierge:</p>
                <ol>
                  <li>Contact concierge customer care via WhatsApp at <a href="tel:+966501234567">+966 50 123 4567</a> or email <a href="mailto:concierge@lumera.sa">concierge@lumera.sa</a>.</li>
                  <li>Provide your order reference (e.g. LUM-884219) and reason for return.</li>
                  <li>Our team will issue an express prepaid courier pickup label to collect the parcel from your doorstep.</li>
                </ol>
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

        .policy-section ul, .policy-section ol {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .policy-body-ar .policy-section ul, .policy-body-ar .policy-section ol {
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

        .policy-notice-box {
          background: rgba(200, 162, 101, 0.08);
          border-left: 3px solid var(--color-gold-400);
          padding: 1rem 1.25rem;
          margin: 1.25rem 0;
          border-radius: 2px;
          font-size: 0.85rem;
          line-height: 1.6;
          color: #E7DDCE;
        }

        .policy-body-ar .policy-notice-box {
          border-left: none;
          border-right: 3px solid var(--color-gold-400);
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
