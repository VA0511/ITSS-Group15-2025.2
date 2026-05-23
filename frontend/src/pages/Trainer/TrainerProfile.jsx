import React from "react";
import { User, Phone, Mail, Award, Dumbbell, Activity, Briefcase, Calendar } from "lucide-react";
import { useMyPTDetail } from "@/hooks/queries/useTraining";

const measurementFields = [
  { key: "height",  label: "Chiều cao", unit: "cm" },
  { key: "weight",  label: "Cân nặng",  unit: "kg" },
  { key: "chest",   label: "Vòng ngực", unit: "cm" },
  { key: "waist",   label: "Vòng bụng", unit: "cm" },
  { key: "bicep",   label: "Bắp tay",   unit: "cm" },
  { key: "forearm", label: "Cẳng tay",  unit: "cm" },
  { key: "thigh",   label: "Đùi",       unit: "cm" },
  { key: "calf",    label: "Bắp chuối", unit: "cm" },
];

const TrainerProfile = () => {
  const { data: pt, isLoading, isError } = useMyPTDetail();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400 text-sm">Đang tải...</div>
      </div>
    );
  }

  if (isError || !pt) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-red-500 text-sm">Không thể tải thông tin hồ sơ.</div>
      </div>
    );
  }

  const birthYear = pt.dob ? new Date(pt.dob).getFullYear() : "—";
  const initials = pt.full_name
    ? pt.full_name.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase()
    : "PT";

  let bodyIndex = {};
  try { bodyIndex = JSON.parse(pt.body_index || "{}"); } catch { bodyIndex = {}; }

  const awards = (pt.achievements || "").split(";").map((s) => s.trim()).filter(Boolean);

  const experiencePoints = (pt.professional_profile || "")
    .split(/\.\s+/)
    .map((s) => s.trim().replace(/\.$/, ""))
    .filter(Boolean);

  const awardColors = [
    { bg: "bg-yellow-50 dark:bg-yellow-900/20", text: "text-yellow-600 dark:text-yellow-400", border: "border-yellow-200 dark:border-yellow-800/50" },
    { bg: "bg-slate-50 dark:bg-slate-800/40",   text: "text-slate-500 dark:text-slate-400",   border: "border-slate-200 dark:border-slate-700" },
    { bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-600 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800/50" },
  ];

  return (
    <div className="flex-1 p-6 flex flex-col gap-5 overflow-y-auto no-scrollbar">

      {/* ── HERO ─────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden shrink-0">
        <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
        <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/60 dark:to-indigo-900/60 border-2 border-blue-200 dark:border-blue-800 flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-blue-300 shrink-0 shadow-inner">
            {initials}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{pt.full_name || "—"}</h1>
              <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                Trainer
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
              {pt.professional_profile?.split(/\.\s+/)[0] || "Huấn luyện viên thể hình"}
            </p>
          </div>
          <div className="flex gap-2.5 shrink-0">
            {[
              { icon: Briefcase, value: pt.experience_years ? `${pt.experience_years} năm` : "—", label: "Kinh nghiệm" },
              { icon: Award,     value: awards.length || "—",                                     label: "Giải thưởng" },
              { icon: Calendar,  value: birthYear,                                                 label: "Năm sinh" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 px-4 py-3 bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 rounded-xl min-w-[76px] text-center">
                <Icon className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                <span className="text-base font-bold text-gray-900 dark:text-white leading-none">{value}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN GRID ────────────────────────────────────── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-5 min-h-0">

        {/* Left — Professional profile (3/5) */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col overflow-hidden">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4 shrink-0">
            <Dumbbell className="h-3.5 w-3.5" /> Hồ sơ chuyên môn
          </h3>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {experiencePoints.length > 0 ? (
              <div className="space-y-3">
                {experiencePoints.map((point, i) => (
                  <div
                    key={i}
                    className="flex gap-3 p-3.5 bg-blue-50/60 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30"
                  >
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">Chưa có thông tin.</div>
            )}
          </div>
        </div>

        {/* Right column stacked (2/5) */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Contact */}
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm shrink-0">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
              <User className="h-3.5 w-3.5" /> Thông tin liên hệ
            </h3>
            <div className="space-y-2.5">
              {[
                { icon: Phone, label: "Số điện thoại", value: pt.phone },
                { icon: Mail,  label: "Email",          value: pt.email },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0 shadow-sm">
                    <Icon className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-gray-400 dark:text-gray-500">{label}</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{value || "—"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Awards */}
          <div className="flex-1 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm flex flex-col overflow-hidden">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4 shrink-0">
              <Award className="h-3.5 w-3.5" /> Giải thưởng & Chứng chỉ
            </h3>
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {awards.length > 0 ? (
                <div className="space-y-2.5">
                  {awards.map((award, i) => {
                    const color = awardColors[i] ?? awardColors[2];
                    return (
                      <div
                        key={i}
                        className={`flex items-start gap-3 p-3 rounded-xl border ${color.bg} ${color.border}`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${color.bg} border ${color.border}`}>
                          <span className={`text-xs font-bold ${color.text}`}>{i + 1}</span>
                        </div>
                        <p className={`text-sm font-medium leading-snug ${color.text}`}>{award}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-gray-400">Chưa có thông tin.</div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── BODY MEASUREMENTS ────────────────────────────── */}
      <div className="shrink-0 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl px-5 py-4 shadow-sm">
        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
          <Activity className="h-3.5 w-3.5" /> Số đo thể hình
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {measurementFields.map(({ key, label, unit }) => (
            <div
              key={key}
              className="bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-xl py-3 px-2 text-center"
            >
              <div className="text-xs text-gray-400 dark:text-gray-500 mb-1 leading-tight">{label}</div>
              <div className="text-base font-bold text-gray-900 dark:text-white leading-none">
                {bodyIndex[key] != null ? (
                  <>
                    {bodyIndex[key]}
                    <span className="text-xs font-normal text-gray-400 ml-0.5">{unit}</span>
                  </>
                ) : (
                  <span className="text-gray-300 dark:text-gray-600">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default TrainerProfile;
