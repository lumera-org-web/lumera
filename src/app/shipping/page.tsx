'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, ArrowLeft, Clock, ShieldCheck, MapPin, PackageCheck } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';

export default function ShippingPolicyPage() {
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
            <Truck size={16} />
            <span>{isAr ? 'الشحن والتوصيل السريع بالمملكة' : 'Saudi Express Logistics'}</span>
          </div>
          <h1 className="policy-title">
            {isAr ? 'سياسة الشحن والتوصيل' : 'Shipping & Delivery Policy'}
          </h1>
          <p className="policy-last-updated">
            {isAr
              ? 'توصيل فاخر ومضمون لجميع مدن ومناطق المملكة العربية السعودية'
              : 'Secure, temperature-controlled delivery across all Kingdom of Saudi Arabia destinations'}
          </p>
        </div>

        {/* Content Body */}
        <div className="policy-content-card">
          {isAr ? (
            <div className="policy-body-ar" dir="rtl">
              <section className="policy-section">
                <h2>١. التغطية الجغرافية والتوصيل داخل المملكة</h2>
                <p>
                  تفخر <strong>دار لوميرا (LUMÉRA)</strong> بتقديم خدمات شحن وتوصيل سريعة وفاخرة تغطي كافة أرجاء المملكة العربية السعودية، بما يشمل كافة المدن والمحافظات والمراكز عبر أسطولنا المحلي وشركائنا المعتمدين من كبرى شركات الشحن اللوجستي المرخصة (سمسا إكسبريس، أرامكس، البريد السعودي سبل).
                </p>
              </section>

              <section className="policy-section">
                <h2>٢. مدد ومواعيد التوصيل المتوقعة</h2>
                <div className="policy-table-wrapper">
                  <table className="policy-table">
                    <thead>
                      <tr>
                        <th>المنطقة / المدينة</th>
                        <th>المدة الزمنية المتوقعة</th>
                        <th>ملاحظات الخدمة</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>مدينة جدة</strong> (المركز الرئيسي)</td>
                        <td>خلال ٢٤ - ٤٨ ساعة عمل</td>
                        <td>توصيل فوري للطلبات المؤكدة قبل الساعة ٢ ظهراً</td>
                      </tr>
                      <tr>
                        <td><strong>الرياض، مكة المكرمة، المدينة المنورة</strong></td>
                        <td>خلال ٢ - ٣ أيام عمل</td>
                        <td>شحن سريع مع تتبع فوري للشحنة</td>
                      </tr>
                      <tr>
                        <td><strong>المنطقة الشرقية</strong> (الدمام، الخبر، الظهران، الجبيل)</td>
                        <td>خلال ٢ - ٤ أيام عمل</td>
                        <td>توصيل معتمد ومباشر حتى باب المنزل</td>
                      </tr>
                      <tr>
                        <td><strong>باقي مدن ومحافظات المملكة</strong></td>
                        <td>خلال ٣ - ٥ أيام عمل</td>
                        <td>تغطية شاملة لجميع مناطق المملكة دون استثناء</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="policy-hint">
                  * تُحسب أيام العمل من السبت إلى الخميس (باستثناء أيام الجمعة والعطلات الرسمية والأعياد الوطنية بالمملكة).
                </p>
              </section>

              <section className="policy-section">
                <h2>٣. رسوم الشحن والتوصيل المجاني</h2>
                <ul>
                  <li><strong>الشحن المجاني الفاخر:</strong> نمنح عملاءنا الكرام شحناً مجانياً بالكامل لأي طلب بقيمة <strong>٣٠٠ ريال سعودي أو أكثر</strong> إلى أي وجهة داخل المملكة.</li>
                  <li><strong>رسوم الشحن العادي:</strong> للطلبات التي تقل عن ٣٠٠ ريال، تُطبق رسوم شحن ثابتة ومخفضة قدرها <strong>٢٥ ريال سعودي</strong> فقط.</li>
                  <li><strong>خدمة الدفع عند الاستلام (COD):</strong> في حال اختيار الدفع عند الاستلام، تُضاف رسوم خدمة تحصيل إضافية قدرها <strong>١٥ ريال سعودي</strong> تتقاضاها شركة الشحن.</li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>٤. التغليف الفاخر وحماية العطور</h2>
                <p>
                  نظراً لحساسية العطور ومستحضرات التجميل لدرجات الحرارة والصدمات، يتم تجهيز كافة طلبات لوميرا داخل مستودعاتنا المكيفة بمدينة جدة، وتغليفها بعناية فائقة باستخدام وسائد هوائية ممتصة للصدمات وصناديق لوميرا الفاخرة لضمان وصول العطور بحالتها المثالية وثباتها العطري الكامل.
                </p>
              </section>

              <section className="policy-section">
                <h2>٥. تتبع الشحنات وإشعارات الوصول</h2>
                <p>
                  بمجرد اعتماد تجهيز طلبكم وتسليمه لشركة الشحن، يتلقى العميل رسالة نصية (SMS) وإشعاراً عبر الواتساب والبريد الإلكتروني يحتوي على:
                </p>
                <ul>
                  <li>رقم بوليصة الشحن الرسمية (Tracking Number).</li>
                  <li>رابط التتبع المباشر لحظة بلحظة لمعرفة خط سير الشحنة.</li>
                  <li>بيانات المندوب ووقت التسليم المتوقع.</li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>٦. ضمان الشحن والسلامة</h2>
                <p>
                  تتحمل لوميرا المسؤولية الكاملة عن الشحنة حتى لحظة استلامها من قبل العميل وتوقيع إشعار الاستلام. في حالة حدوث أي تلف أو كسر غير متوقع أثناء النقل والشحن، نلتزم فوراً باستبدال المنتج مجاناً أو استرداد كامل المبلغ دون أي تكلفة إضافية على العميل.
                </p>
              </section>

              <section className="policy-section">
                <h2>٧. التواصل واستفسارات الشحن</h2>
                <div className="policy-info-box">
                  <p><strong>مركز متابعة الطلبات والشحن:</strong></p>
                  <p>العنوان الوطني: مبنى 4605، شارع الحارث ابن النعمان، حي الصفا، الرمز البريدي 23455، جدة، المملكة العربية السعودية (JDSA4605)</p>
                  <p>البريد الإلكتروني: <a href="mailto:concierge@lumera.sa">concierge@lumera.sa</a> / <a href="mailto:Lumera.ksa123@gmail.com">Lumera.ksa123@gmail.com</a></p>
                  <p>خدمة العملاء والواتساب: <a href="tel:+966501234567">+966 50 123 4567</a></p>
                </div>
              </section>
            </div>
          ) : (
            <div className="policy-body-en">
              <section className="policy-section">
                <h2>1. Geographic Coverage Across Saudi Arabia</h2>
                <p>
                  <strong>LUMÉRA Haute Parfumerie</strong> provides white-glove, temperature-controlled delivery across the entire Kingdom of Saudi Arabia. We partner exclusively with premier Saudi-licensed logistics operators (SMSA Express, Aramex, and Saudi Post SPL) to ensure prompt, secure residential and business delivery.
                </p>
              </section>

              <section className="policy-section">
                <h2>2. Estimated Delivery Timelines</h2>
                <div className="policy-table-wrapper">
                  <table className="policy-table">
                    <thead>
                      <tr>
                        <th>Destination</th>
                        <th>Estimated Transit Time</th>
                        <th>Service Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Jeddah</strong> (Fulfillment Hub)</td>
                        <td>24 – 48 business hours</td>
                        <td>Same-day dispatch for orders confirmed before 2:00 PM AST</td>
                      </tr>
                      <tr>
                        <td><strong>Riyadh, Makkah, Madinah</strong></td>
                        <td>2 – 3 business days</td>
                        <td>Express direct ground & air transit with live GPS tracking</td>
                      </tr>
                      <tr>
                        <td><strong>Eastern Province</strong> (Dammam, Khobar, Dhahran)</td>
                        <td>2 – 4 business days</td>
                        <td>Direct door-to-door courier service</td>
                      </tr>
                      <tr>
                        <td><strong>Other Saudi Regions & Governorates</strong></td>
                        <td>3 – 5 business days</td>
                        <td>Full nationwide parcel coverage</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="policy-hint">
                  * Business days are Saturday through Thursday, excluding official Saudi national holidays and Eid celebrations.
                </p>
              </section>

              <section className="policy-section">
                <h2>3. Shipping Fees & Complimentary Threshold</h2>
                <ul>
                  <li><strong>Complimentary Saudi Delivery:</strong> All orders with a total value of <strong>300 SAR or more</strong> qualify for free standard shipping anywhere in the Kingdom.</li>
                  <li><strong>Standard Shipping Fee:</strong> For orders below 300 SAR, a flat delivery fee of <strong>25 SAR</strong> is applied at checkout.</li>
                  <li><strong>Cash on Delivery (COD) Fee:</strong> An additional collection processing fee of <strong>15 SAR</strong> applies if Cash on Delivery is selected.</li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>4. Climate-Controlled Luxury Packaging</h2>
                <p>
                  To preserve delicate olfactory formulations and fine cosmetics, every LUMÉRA parcel is fulfilled inside our climate-controlled Jeddah atelier. Bottles are cushioned with high-density protective material and housed inside LUMÉRA signature presentation boxes.
                </p>
              </section>

              <section className="policy-section">
                <h2>5. Live Order Tracking & Dispatch Alerts</h2>
                <p>
                  Upon handover to our courier carrier, you will receive an automatic dispatch notification via SMS, WhatsApp, and email including:
                </p>
                <ul>
                  <li>Official courier tracking / waybill number (AWB).</li>
                  <li>Direct link for real-time parcel trajectory monitoring.</li>
                  <li>Delivery courier contact details and schedule window.</li>
                </ul>
              </section>

              <section className="policy-section">
                <h2>6. In-Transit Transit Guarantee</h2>
                <p>
                  LUMÉRA assumes 100% legal liability for your parcel until safe handover and customer signature. In the improbable event of transit damage, leakage, or loss, we guarantee immediate complimentary replacement or a full refund back to your payment card.
                </p>
              </section>

              <section className="policy-section">
                <h2>7. Dispatch Inquiries & Support</h2>
                <div className="policy-info-box">
                  <p><strong>Fulfillment & Dispatch Hub:</strong></p>
                  <p>Registered National Address: Building 4605, Al Harith Ibn Al Noaman St, As Safa Dist, Postal Code 23455, Jeddah, Saudi Arabia (JDSA4605)</p>
                  <p>Email: <a href="mailto:concierge@lumera.sa">concierge@lumera.sa</a> / <a href="mailto:Lumera.ksa123@gmail.com">Lumera.ksa123@gmail.com</a></p>
                  <p>Direct Concierge Line / WhatsApp: <a href="tel:+966501234567">+966 50 123 4567</a></p>
                </div>
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
          font-family: var(--font-playfair), serif;
          font-size: 2.25rem;
          font-weight: 600;
          color: #FAF7F2;
          margin-bottom: 0.75rem;
          letter-spacing: 0.02em;
        }

        .policy-last-updated {
          font-size: 0.825rem;
          color: #A89A90;
        }

        .policy-content-card {
          background: #180F0D;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
          padding: 3rem 2.5rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        @media (max-width: 768px) {
          .policy-content-card {
            padding: 2rem 1.25rem;
          }
          .policy-title {
            font-size: 1.75rem;
          }
        }

        .policy-section {
          margin-bottom: 2.5rem;
        }

        .policy-section:last-child {
          margin-bottom: 0;
        }

        .policy-section h2 {
          font-family: var(--font-playfair), serif;
          font-size: 1.35rem;
          color: var(--color-gold-300);
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(200, 162, 101, 0.2);
        }

        .policy-section p {
          font-size: 0.925rem;
          line-height: 1.8;
          color: #D8C7B2;
          margin-bottom: 1rem;
        }

        .policy-section ul {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }

        .policy-body-ar .policy-section ul {
          padding-left: 0;
          padding-right: 1.5rem;
        }

        .policy-section li {
          font-size: 0.925rem;
          line-height: 1.8;
          color: #D8C7B2;
          margin-bottom: 0.5rem;
        }

        .policy-info-box {
          background: rgba(200, 162, 101, 0.06);
          border: 1px solid rgba(200, 162, 101, 0.25);
          border-radius: 4px;
          padding: 1.25rem 1.5rem;
          margin: 1.25rem 0;
        }

        .policy-info-box p {
          margin-bottom: 0.4rem;
          font-size: 0.875rem;
        }

        .policy-info-box a {
          color: var(--color-gold-400);
          text-decoration: underline;
        }

        .policy-table-wrapper {
          overflow-x: auto;
          margin: 1.25rem 0;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 4px;
        }

        .policy-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.85rem;
        }

        .policy-body-ar .policy-table {
          text-align: right;
        }

        .policy-table th {
          background: #241612;
          color: var(--color-gold-400);
          padding: 0.85rem 1rem;
          font-weight: 600;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .policy-table td {
          padding: 0.85rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          color: #D8C7B2;
        }

        .policy-table tr:last-child td {
          border-bottom: none;
        }

        .policy-hint {
          font-size: 0.8rem !important;
          color: #9E8E85 !important;
          font-style: italic;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
}
