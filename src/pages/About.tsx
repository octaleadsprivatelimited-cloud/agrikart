import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Eye, Building2 } from "lucide-react";
import imgWho from "@/assets/about-who.jpg";
import imgMission from "@/assets/about-mission.jpg";
import imgValues from "@/assets/about-values.jpg";

export default function About() {
  const { t } = useTranslation();
  const values = t("about.values", { returnObjects: true }) as { name: string; desc: string }[];

  return (
    <>
      <PageHeader title={t("about.title")} subtitle={t("about.who")} />

      <section className="bg-[#fcfdfc] py-12 sm:py-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Bento grid */}
          <div className="grid auto-rows-min grid-cols-1 gap-4 sm:gap-6 md:grid-cols-4 lg:grid-cols-6">
            {/* Who We Are — large hero block */}
            <article className="group relative overflow-hidden rounded-3xl border border-[#a0c49d]/20 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl sm:rounded-[2.5rem] md:col-span-4 md:min-h-[420px] lg:col-span-4 lg:row-span-2 lg:min-h-[520px]">
              <img
                src={imgWho}
                alt={t("about.whoTitle")}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a3c2a]/90 via-[#1a3c2a]/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white sm:p-10 lg:p-12">
                <span className="mb-3 inline-block rounded-full border border-white/20 bg-[#a0c49d]/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md sm:mb-4">
                  {t("about.whoTitle")}
                </span>
                <h2 className="font-display text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                  {t("about.whoTitle")}
                </h2>
                <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-white/90 sm:mt-4 sm:text-base">
                  {t("about.who")}
                </p>
              </div>
            </article>

            {/* Our Vision — dark high contrast */}
            <article className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-[#1a3c2a] p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl sm:rounded-[2.5rem] sm:p-10 md:col-span-2 lg:col-span-2 lg:row-span-2 lg:min-h-[520px] lg:p-12">
              <div className="relative z-10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#a0c49d]/30 bg-[#a0c49d]/20 sm:mb-8 sm:h-14 sm:w-14">
                  <Eye className="h-6 w-6 text-[#a0c49d] sm:h-7 sm:w-7" />
                </div>
                <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                  {t("about.visionTitle")}
                </h2>
                <p className="mt-4 font-medium leading-relaxed text-white/80 sm:mt-6">
                  {t("about.vision")}
                </p>
              </div>
              <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-[#a0c49d]/10 blur-3xl transition-colors duration-500 group-hover:bg-[#a0c49d]/20" />
            </article>

            {/* Our Mission — landscape with image */}
            <article className="group relative overflow-hidden rounded-3xl border border-[#a0c49d]/20 bg-[#f0f4f2] transition-all duration-500 hover:shadow-xl sm:rounded-[2.5rem] md:col-span-4 lg:col-span-3">
              <div className="flex h-full flex-col sm:flex-row">
                <div className="sm:w-2/5">
                  <img
                    src={imgMission}
                    alt={t("about.missionTitle")}
                    loading="lazy"
                    className="h-48 w-full object-cover sm:h-full sm:min-h-[200px]"
                  />
                </div>
                <div className="flex flex-col justify-center p-6 sm:w-3/5 sm:p-8">
                  <h2 className="font-display text-xl font-bold text-[#1a3c2a] sm:text-2xl">
                    {t("about.missionTitle")}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#2d5a3d]">
                    {t("about.mission")}
                  </p>
                </div>
              </div>
            </article>

            {/* Company info */}
            <article className="group relative flex items-center overflow-hidden rounded-3xl border border-[#a0c49d]/30 bg-white p-6 transition-all duration-500 hover:shadow-xl sm:rounded-[2.5rem] sm:p-8 md:col-span-4 lg:col-span-3">
              <div className="flex items-center gap-5 sm:gap-6">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-[#f0f4f2] sm:h-16 sm:w-16">
                  <Building2 className="h-7 w-7 text-[#2d5a3d] sm:h-8 sm:w-8" />
                </div>
                <div>
                  <h2 className="font-display text-base font-bold leading-tight text-[#1a3c2a] sm:text-lg">
                    {t("brandFull")}
                  </h2>
                  <p className="mt-1 font-mono text-[11px] tracking-wider text-[#5a8a5c] sm:text-xs">
                    {t("cin")}
                  </p>
                  <p className="mt-2 text-sm text-[#2d5a3d]">
                    Registered Office: Hyderabad, Telangana, India
                  </p>
                </div>
              </div>
            </article>

            {/* Our Values — wide editorial */}
            <article className="mt-4 overflow-hidden rounded-3xl border border-[#a0c49d]/10 bg-white shadow-sm sm:mt-8 sm:rounded-[3rem] md:col-span-4 lg:col-span-6">
              <div className="grid min-h-[400px] grid-cols-1 lg:grid-cols-5">
                <div className="relative min-h-[220px] lg:col-span-2">
                  <img
                    src={imgValues}
                    alt={t("about.valuesTitle")}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex flex-col justify-center bg-[#1a3c2a]/50 p-8 backdrop-blur-[2px] sm:p-12">
                    <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
                      {t("about.valuesTitle")}
                    </h2>
                    <p className="mt-3 font-medium leading-relaxed text-white/85 sm:mt-4">
                      The principles that define how we build for the future of Indian agriculture.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-8 bg-white p-8 sm:grid-cols-2 sm:gap-10 sm:p-10 lg:col-span-3 lg:p-14">
                  {values.map((v) => (
                    <div key={v.name} className="space-y-2">
                      <div className="mb-3 h-1 w-8 rounded-full bg-[#a0c49d]" />
                      <h3 className="font-display text-base font-bold text-[#1a3c2a] sm:text-lg">
                        {v.name}
                      </h3>
                      <p className="text-sm leading-relaxed text-[#5a8a5c]">{v.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
