import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";

const categories = [
  { num: "01", label: "Advanced Handicrafts & Handicraft Design", desc: "Centres providing advanced skill development in traditional and contemporary handicraft techniques, helping artisans build export-ready products." },
  { num: "02", label: "Videography & Filmmaking", desc: "Professional training facilities for visual storytelling, video production, and digital content creation — supporting Meghalaya's growing creative economy." },
  { num: "03", label: "Advanced Packaging & Packaging Design", desc: "Training in modern packaging technologies and design thinking, enabling entrepreneurs to enhance shelf appeal and meet national retail standards." },
  { num: "04", label: "New Technologies", desc: "Covering App Development, Artificial Intelligence, and emerging digital tools — helping Meghalaya's entrepreneurs stay competitive in the digital economy." },
  { num: "05", label: "Wildcard Category", desc: "Open to advanced tourism, nursery development and spawn production, traditional tribal healing and medicines, and other high-impact sectors unique to Meghalaya." },
];

const funding = [
  { type: "Non-Refundable Grant", amount: "Up to ₹20 Lakhs", desc: "Direct grant for qualified training centre proposals — no repayment required." },
  { type: "Zero-Interest Loan", amount: "Up to ₹30 Lakhs", desc: "Zero-interest loan with up to 1 year moratorium and a 5-year repayment period." },
  { type: "Total Support", amount: "Up to ₹50 Lakhs", desc: "Combined grant and loan support per selected training centre proposal." },
];

export default function TrainingCentresPage() {
  return (
    <>
      <Navbar />
      <PageHero
        breadcrumb="Sector"
        title="Training Centre Establishment"
        subtitle="Financial support for local entrepreneurs setting up advanced, innovation-based training facilities in Meghalaya."
      />

      {/* Intro */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 max-w-3xl">
          <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">The Programme</p>
          <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug mb-5">
            Training Centre Establishment Competition
          </h2>
          <p className="text-[13px] text-gray-600 leading-[1.8] mb-4">
            Training and Capacity Building is a core component for every entrepreneur to build the necessary skills across technical and business aspects to build a sustainable and successful enterprise. At this point, the availability of high-quality training facilities in Meghalaya is very limited — and in certain sectors, non-existent.
          </p>
          <p className="text-[13px] text-gray-600 leading-[1.8] mb-4">
            For high-quality advanced training in most sectors, entrepreneurs currently have to travel long distances and spend significant amounts. PRIME is changing this by financially supporting local entrepreneurs to establish world-class training centres right here in Meghalaya.
          </p>
          <p className="text-[13px] text-gray-600 leading-[1.8]">
            The best proposals are selected through a transparent competition process — awarding up to <strong className="text-[#111111]">₹50 Lakhs</strong> per selected training centre.
          </p>
        </div>
      </section>

      {/* Funding breakdown */}
      <section className="bg-[#f9f9f9] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-12">
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Financial Support</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug">
              Funding available per selected centre
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {funding.map((f) => (
              <div key={f.type} className="bg-white border border-gray-100 rounded p-7">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">{f.type}</p>
                <p className="text-[34px] font-black text-[#9EC84A] leading-none mb-2">{f.amount}</p>
                <p className="text-[12px] text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-xl mb-12">
            <p className="text-[#9EC84A] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Eligible Sectors</p>
            <h2 className="text-[26px] md:text-[32px] font-black text-[#111111] leading-snug">
              Competition categories
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            {categories.map((c) => (
              <div key={c.num} className="flex items-start gap-6 p-6 rounded border border-gray-100 hover:border-[#9EC84A]/30 transition-colors">
                <span className="text-[#9EC84A] font-black text-sm shrink-0 mt-0.5">Category {c.num}</span>
                <div>
                  <h3 className="text-[14px] font-bold text-[#111111] mb-1">{c.label}</h3>
                  <p className="text-[12px] text-gray-500 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0d0d0d] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-[28px] md:text-[36px] font-black text-white mb-4">Have a training centre idea?</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">
            Submit your proposal and compete for up to ₹50 Lakhs in financial support to establish an advanced training centre in Meghalaya.
          </p>
          <a
            href="mailto:info@primemeghalaya.com"
            className="inline-block px-9 py-3 rounded-sm bg-[#9EC84A] text-white text-sm font-semibold hover:bg-[#8BB53F] transition-colors"
          >
            Get in touch
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
