const services = [
  {
    number: "01",
    title: "Business Consulting",
    description:
      "End-to-end strategic consulting that helps you navigate complexity and find the clearest path forward.",
    tags: ["Strategy", "Transformation", "Advisory"],
  },
  {
    number: "02",
    title: "Digital Solutions",
    description:
      "Technology that works for your business — from custom platforms to digital process automation.",
    tags: ["Product", "Engineering", "Automation"],
  },
  {
    number: "03",
    title: "Brand & Marketing",
    description:
      "Identity and narrative that positions you distinctly in your market and resonates with your audience.",
    tags: ["Branding", "Content", "Growth"],
  },
  {
    number: "04",
    title: "Talent & Culture",
    description:
      "Build the teams and culture that sustain your growth — hiring, onboarding, and retention frameworks.",
    tags: ["HR", "Culture", "Leadership"],
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 lg:py-32 bg-[#f9fafb]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-4">
            What We Do
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0a0f1e] leading-tight">
            Services built around your goals
          </h2>
        </div>

        {/* Service cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((svc) => (
            <div
              key={svc.number}
              className="group p-8 rounded-2xl bg-white border border-gray-100 hover:border-[#c9a84c]/40 hover:shadow-lg transition-all duration-300"
            >
              <span className="text-[#c9a84c] text-xs font-bold tracking-widest">
                {svc.number}
              </span>
              <h3 className="text-xl font-bold text-[#0a0f1e] mt-3 mb-3">
                {svc.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                {svc.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {svc.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 group-hover:bg-[#c9a84c]/10 group-hover:text-[#c9a84c] transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
