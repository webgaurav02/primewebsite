import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";

const departments: {
  name: string;
  members: { name: string; role: string; location: string; img?: string }[];
}[] = [
  {
    name: "Senior Leadership",
    members: [
      { name: "Dr. Vijay Kumar D, IAS", role: "Chief Executive Officer", location: "MBMA" },
      { name: "Smt. Saloni Verma, IAS", role: "Executive Director", location: "MBMA" },
      { name: "Shri. D. D. Shira, MCS", role: "Director", location: "MIE", img: "Bryan-Daoba-D-Shira.jpg" },
      { name: "Augustus Suting", role: "General Manager", location: "MBMA" },
      { name: "Smti. Lakshmi Rao", role: "Advisor (Innovation & Entrepreneurship)", location: "" },
    ],
  },
  {
    name: "Incubation & Acceleration",
    members: [
      { name: "Jacqueline Audrey Swer", role: "AVP (Incubation)", location: "PRIME Shillong" },
      { name: "Sadique Mannan", role: "Sector Head", location: "PRIME Shillong", img: "Saddique.jpg" },
      { name: "Mebaailin Blah", role: "Centre Manager", location: "PRIME Jowai" },
      { name: "Merisha Toi", role: "Centre Manager", location: "PRIME Nongpoh" },
      { name: "Rupert Wankhar", role: "Senior Associate (Incubation)", location: "PRIME Shillong" },
      { name: "Amoiphica Surong", role: "Program Associate (Incubation)", location: "PRIME Shillong" },
      { name: "Euphenia Sten", role: "Program Associate (Incubation)", location: "PRIME Shillong" },
      { name: "Pynshailin Rani", role: "Program Associate (Incubation)", location: "PRIME Shillong", img: "Starwell-Rani.jpg" },
      { name: "Hilbirth A. Sangma", role: "Associate (Incubation)", location: "PRIME Tura" },
      { name: "Chingbat A Sangma", role: "Programme Associate (Acceleration)", location: "PRIME Tura" },
      { name: "Raynier Diengdoh", role: "Program Associate (Incubation)", location: "PRIME Shillong" },
    ],
  },
  {
    name: "Funding",
    members: [
      { name: "Iaidon Rumnong", role: "Senior Manager (Funding)", location: "PRIME Shillong" },
      { name: "Mariabiang Lyngdoh", role: "Deputy Manager (Funding)", location: "PRIME Shillong" },
      { name: "Jolene Phankon", role: "Deputy Manager (Funding)", location: "PRIME Shillong" },
      { name: "Nothera Ch Marak", role: "Assistant Manager", location: "PRIME Tura", img: "Nothera.jpg" },
      { name: "Durlov D Sangma", role: "Programme Associate", location: "PRIME Tura", img: "Durlov.jpg" },
    ],
  },
  {
    name: "Media & Communications",
    members: [
      { name: "Pdianghunlin Chyne", role: "Senior Manager (Media & Communications)", location: "PRIME Shillong", img: "Pdiang.jpg" },
      { name: "Andrew Tshering Bareh", role: "Communications Manager", location: "PRIME Shillong", img: "Andrew.jpg" },
      { name: "Melam Rangad", role: "Assistant Manager (Liaison)", location: "PRIME Shillong" },
      { name: "Wankitbok Roy M. Pdah", role: "Assistant Manager", location: "PRIME Shillong", img: "Wankitbok-Roy-M.-Pdah.jpg" },
      { name: "Pelhineal Iangngap", role: "Assistant Manager", location: "PRIME Shillong", img: "Pelhineal-Iangngap.jpg" },
      { name: "Dorikme Momin", role: "Communications Associate", location: "PRIME Tura" },
      { name: "Mark Altrogue CH Marak", role: "Programme Associate", location: "PRIME Tura", img: "Mark-Altroge-CH-Marak.jpg" },
    ],
  },
  {
    name: "PRIME Rural",
    members: [
      { name: "Minha Riyaz Khan", role: "Project Lead", location: "PRIME Rural" },
      { name: "Harshit", role: "Product Development & R&D Manager", location: "PRIME Rural", img: "Harshit.jpg" },
      { name: "Richard Daimary", role: "Marketing Manager", location: "PRIME Rural" },
      { name: "Deimiwan Dylan Ryngksai", role: "Program Associate MIS", location: "PRIME Rural", img: "Deimiwan-Dylan-Ryngksai.jpg" },
      { name: "Jubanylla Gabriella Bang", role: "Manager (Learning & Development)", location: "" },
      { name: "Susmita Hajong", role: "District Coordinator (EGH)", location: "PRIME Rural", img: "Susmita-Hajong.jpg" },
      { name: "Twinkle Pohtam", role: "District Coordinator (Ri-Bhoi)", location: "PRIME Rural", img: "Twinkle-Pohtam.jpg" },
      { name: "Shanbor Sayoo", role: "District Coordinator (EKH / EWKH)", location: "PRIME Rural", img: "Shanbor-Sayoo.jpg" },
      { name: "Anikit R Marak", role: "District Coordinator (NGH / SGH)", location: "PRIME Rural", img: "Anikit-R-Marak.jpg" },
      { name: "John Rangam R Marak", role: "District Coordinator (SWGH / WGH)", location: "PRIME Rural", img: "John-Rangam-R-Marak.jpg" },
      { name: "Ronald Vicky Wanniang", role: "District Coordinator (SWKH / WKH)", location: "PRIME Rural", img: "Ronald-Vicky-Wanniang.jpg" },
      { name: "Dauru Hiwot Paya Lamare", role: "District Coordinator (West & East)", location: "PRIME Rural", img: "Dauru-Hiwot-Paya-Lamare.jpg" },
      { name: "Liankhanlun Guite", role: "Multi Task Assistant", location: "PRIME Rural", img: "Liankhanlun-Guite.jpg" },
      { name: "Emika Mawlong", role: "Multi Task Assistant", location: "PRIME Rural", img: "Emika-Mawlong.jpg" },
      { name: "Wanrilang Tiewla", role: "Driver", location: "PRIME Rural", img: "Wanrilang-Tiewla.jpg" },
    ],
  },
  {
    name: "Business Facilitation",
    members: [
      { name: "Streamlet Sohtun", role: "Assistant Manager (Business Facilitation)", location: "PRIME Shillong" },
      { name: "Priyana R Marak", role: "Deputy Manager (Business Facilitation)", location: "PRIME Tura", img: "Priyana-Marak.jpg" },
      { name: "Sinted Ch Marak", role: "Programme Associate (Business Facilitation)", location: "PRIME Tura" },
      { name: "Littlestar Ryntathiang", role: "Program Associate (Business Facilitation)", location: "PRIME Shillong" },
      { name: "Lakynti Marbaniang", role: "Program Associate", location: "PRIME Shillong" },
    ],
  },
  {
    name: "Monitoring & Evaluation",
    members: [
      { name: "Vareena E. Rymmai", role: "Assistant Manager", location: "PRIME Shillong", img: "Vareena-E.-Rymmai.jpg" },
      { name: "Bame Daai Ryntathiang", role: "Assistant Manager", location: "PRIME Shillong", img: "Bame.jpg" },
      { name: "Camelia M. Fancon", role: "Assistant Manager", location: "PRIME Shillong", img: "Camelia.jpg" },
      { name: "Salmatchi Ch Momin", role: "Assistant Manager", location: "PRIME Tura", img: "Salmatchi.jpg" },
      { name: "Baiahun Lyngdoh", role: "Program Associate", location: "PRIME Shillong", img: "Baiahun.jpg" },
    ],
  },
];

function Avatar({ name, img }: { name: string; img?: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (img) {
    return (
      <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
        <Image
          src={`/assets/team/${img}`}
          alt={name}
          fill
          className="object-cover object-top"
          sizes="48px"
        />
      </div>
    );
  }
  return (
    <div className="w-12 h-12 rounded-full bg-[#2D6A4F]/15 flex items-center justify-center shrink-0">
      <span className="text-[#2D6A4F] font-bold" style={{ fontSize: "var(--text-sm)" }}>
        {initials}
      </span>
    </div>
  );
}

export default function TeamPage() {
  return (
    <>
      <Navbar />
      <PageHero
        breadcrumb="The People"
        title="Meet the PRIME team"
        subtitle="A dynamic mix of government officials, social entrepreneurs, and passionate changemakers — united by one mission."
      />

      <section className="bg-white texture-grid py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col gap-16">
          {departments.map((dept) => (
            <div key={dept.name}>
              <div className="flex items-center gap-6 mb-8">
                <h2 className="font-black text-black uppercase tracking-wider shrink-0" style={{ fontSize: "var(--text-body)" }}>
                  {dept.name}
                </h2>
                <div className="flex-1 h-px bg-black/[0.08]" />
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-black/[0.07] border border-black/[0.07]">
                {dept.members.map((m) => (
                  <div key={m.name} className="flex items-center gap-4 p-5 bg-white hover:bg-[#f5f5f5] transition-colors">
                    <Avatar name={m.name} img={m.img} />
                    <div className="min-w-0">
                      <p className="font-bold text-black truncate" style={{ fontSize: "var(--text-sm)" }}>
                        {m.name}
                      </p>
                      <p className="text-black/50 leading-snug mt-0.5" style={{ fontSize: "var(--text-sm)" }}>
                        {m.role}
                      </p>
                      {m.location && (
                        <p className="text-[#2D6A4F] font-semibold mt-1" style={{ fontSize: "var(--text-label)" }}>
                          {m.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
