import React from "react";
import { useMyPTDetail } from "@/hooks/queries/useTraining";

const measurementFields = [
  { key: "height",  label: "Chiều cao",  unit: "cm" },
  { key: "weight",  label: "Cân nặng",   unit: "kg" },
  { key: "chest",   label: "Ngực",       unit: "cm" },
  { key: "bicep",   label: "Bắp tay",    unit: "cm" },
  { key: "waist",   label: "Bụng",       unit: "cm" },
  { key: "forearm", label: "Cẳng tay",   unit: "cm" },
  { key: "thigh",   label: "Đùi",        unit: "cm" },
  { key: "calf",    label: "Bắp chuối",  unit: "cm" },
];

const awardIcons = ["🥇", "🥈", "🏆", "🎖️", "⭐"];

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

  // achievements: split by ";" → [{name, detail}]
  const awards = (pt.achievements || "")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const dashIdx = s.lastIndexOf(" - ");
      return dashIdx > -1
        ? { name: s.slice(0, dashIdx), detail: s.slice(dashIdx + 3) }
        : { name: s, detail: "" };
    });

  // professional_profile: split by ". " → experience bullet points
  const experiencePoints = (pt.professional_profile || "")
    .split(/\. /)
    .map((s) => s.trim().replace(/\.$/, ""))
    .filter(Boolean);

  return (
    <div className="p-6">
      <div className="max-w-full">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
          Thông tin cá nhân
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Hồ sơ và thông tin chi tiết của huấn luyện viên.
        </p>

        {/* Avatar + Basic Info */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Avatar */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-2xl font-semibold text-blue-600 dark:text-blue-300 border-2 border-blue-200 dark:border-blue-700 mb-4">
              {initials}
            </div>
            <div className="text-center">
              <div className="text-base font-semibold text-gray-900 dark:text-white">
                {pt.full_name || "—"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Năm sinh: {birthYear}
              </div>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                TRAINER
              </span>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              Thông tin cơ bản
            </h3>
            <div className="space-y-3">
              {[
                { label: "Họ và tên",    value: pt.full_name },
                { label: "Năm sinh",     value: birthYear },
                { label: "Số điện thoại",value: pt.phone },
                { label: "Email",        value: pt.email },
                {
                  label: "Kinh nghiệm",
                  value: pt.experience_years
                    ? `${pt.experience_years} năm`
                    : "—",
                },
              ].map(({ label, value }, i, arr) => (
                <div
                  key={label}
                  className={`flex justify-between items-center pb-2 ${
                    i < arr.length - 1
                      ? "border-b border-gray-100 dark:border-gray-700"
                      : ""
                  }`}
                >
                  <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0 mr-4">
                    {label}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white text-right">
                    {value || "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Awards + Experience + Measurements */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Awards */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              Giải thưởng
            </h3>
            <div className="space-y-3">
              {awards.length > 0 ? (
                awards.map((award, i) => (
                  <div key={i} className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 flex items-center justify-center text-sm flex-shrink-0">
                      {awardIcons[i] ?? "🏅"}
                    </div>
                    <div>
                      <div className="text-sm text-gray-900 dark:text-white leading-snug">
                        {award.name}
                      </div>
                      {award.detail && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {award.detail}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400">Chưa có thông tin.</p>
              )}
            </div>
          </div>

          {/* Experience (from professional_profile) */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              Hồ sơ chuyên môn
            </h3>
            <div className="space-y-3">
              {experiencePoints.length > 0 ? (
                experiencePoints.map((point, i) => (
                  <div key={i} className="flex gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">
                      {point}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400">Chưa có thông tin.</p>
              )}
            </div>
          </div>

          {/* Body Measurements */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
              Số đo thể hình
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {measurementFields.map(({ key, label, unit }) => (
                <div key={key} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2.5">
                  <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                    {bodyIndex[key] != null ? (
                      <>
                        {bodyIndex[key]}{" "}
                        <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                          {unit}
                        </span>
                      </>
                    ) : "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-200 dark:border-gray-700 py-3 px-6 bg-white dark:bg-gray-800 text-center text-xs text-gray-500 dark:text-gray-400">
        © 2026 ActiveGym Management System. All rights reserved.
      </footer>
    </div>
  );
};

export default TrainerProfile;
