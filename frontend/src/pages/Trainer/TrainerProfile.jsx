import React from "react";
import { User, Phone, Mail, Award, Dumbbell, Activity, Briefcase, Calendar } from "lucide-react";
import { useMyPTDetail } from "@/hooks/queries/useTraining";

const measurementFields = [
  { key: "height",  label: "Chiều cao",  unit: "cm" },
  { key: "weight",  label: "Cân nặng",   unit: "kg" },
  { key: "chest",   label: "Vòng ngực",  unit: "cm" },
  { key: "waist",   label: "Vòng bụng",  unit: "cm" },
  { key: "bicep",   label: "Bắp tay",    unit: "cm" },
  { key: "forearm", label: "Cẳng tay",   unit: "cm" },
  { key: "thigh",   label: "Đùi",        unit: "cm" },
  { key: "calf",    label: "Bắp chuối",  unit: "cm" },
];

const TrainerProfile = () => {
  const { data: pt, isLoading, isError } = useMyPTDetail();

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="text-gray-500 dark:text-gray-400 text-sm">Đang tải...</div>
      </div>
    );
  }

  if (isError || !pt) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
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

  const awards = (pt.achievements || "")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  const experiencePoints = (pt.professional_profile || "")
    .split(/\.\s+/)
    .map((s) => s.trim().replace(/\.$/, ""))
    .filter(Boolean);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 pb-10">
      {/* ── HERO CARD ─────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/50 border-2 border-blue-200 dark:border-blue-800 flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-blue-300 shrink-0">
          {initials}
        </div>

        {/* Name + tagline */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{pt.full_name || "—"}</h1>
            <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
              Trainer
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-md">
            {pt.professional_profile?.split(/\.\s+/)[0] || "Huấn luyện viên thể hình"}
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-3 shrink-0">
          {[
            { icon: Briefcase, value: pt.experience_years ? `${pt.experience_years} năm` : "—", label: "Kinh nghiệm" },
            { icon: Award,     value: awards.length,  label: "Giải thưởng" },
            { icon: Calendar,  value: birthYear,      label: "Năm sinh" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-xl min-w-[80px]">
              <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              <span className="text-base font-bold text-gray-900 dark:text-white">{value}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3-COL INFO ────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Liên hệ */}
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
            <User className="h-3.5 w-3.5" /> Thông tin liên hệ
          </h3>
          <div className="space-y-3">
            {[
              { icon: Phone, label: "Số điện thoại", value: pt.phone },
              { icon: Mail,  label: "Email",          value: pt.email },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{value || "—"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hồ sơ chuyên môn */}
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
            <Dumbbell className="h-3.5 w-3.5" /> Hồ sơ chuyên môn
          </h3>
          <div className="space-y-2.5">
            {experiencePoints.length > 0 ? (
              experiencePoints.map((point, i) => (
                <div key={i} className="flex gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{point}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400">Chưa có thông tin.</p>
            )}
          </div>
        </div>

        {/* Giải thưởng */}
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
            <Award className="h-3.5 w-3.5" /> Giải thưởng & Chứng chỉ
          </h3>
          <div className="space-y-2.5">
            {awards.length > 0 ? (
              awards.map((award, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{i + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{award}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400">Chưa có thông tin.</p>
            )}
          </div>
        </div>
      </div>

      {/* ── SỐ ĐO THỂ HÌNH ────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
          <Activity className="h-3.5 w-3.5" /> Số đo thể hình
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {measurementFields.map(({ key, label, unit }) => (
            <div
              key={key}
              className="bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-xl p-4 text-center"
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {bodyIndex[key] != null ? (
                  <>
                    {bodyIndex[key]}
                    <span className="text-xs font-normal text-gray-400 ml-0.5">{unit}</span>
                  </>
                ) : "—"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;
