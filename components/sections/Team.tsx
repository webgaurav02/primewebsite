const team = [
  {
    name: "Alex Morgan",
    role: "CEO & Founder",
    bio: "20 years building high-growth companies across three continents.",
    initials: "AM",
  },
  {
    name: "Jordan Lee",
    role: "Chief Strategy Officer",
    bio: "Former McKinsey partner with deep expertise in digital transformation.",
    initials: "JL",
  },
  {
    name: "Sam Rivera",
    role: "Head of Technology",
    bio: "Led engineering at two unicorn startups before joining Prime.",
    initials: "SR",
  },
  {
    name: "Taylor Kim",
    role: "Head of Clients",
    bio: "Passionate about turning client relationships into long-term partnerships.",
    initials: "TK",
  },
];

export default function Team() {
  return (
    <section id="team" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-[#c9a84c] text-sm font-semibold tracking-widest uppercase mb-4">
            Our People
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0a0f1e] leading-tight">
            The team behind Prime
          </h2>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div
              key={member.name}
              className="group p-6 rounded-2xl border border-gray-100 hover:border-[#c9a84c]/30 hover:shadow-md transition-all"
            >
              {/* Avatar placeholder */}
              <div className="w-16 h-16 rounded-full bg-[#0a0f1e] flex items-center justify-center mb-5">
                <span className="text-[#c9a84c] font-bold text-lg">{member.initials}</span>
              </div>
              <h3 className="text-base font-bold text-[#0a0f1e]">{member.name}</h3>
              <p className="text-[#c9a84c] text-xs font-semibold mb-3">{member.role}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
