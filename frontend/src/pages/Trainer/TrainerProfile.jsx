import React from "react";
import { User, Phone, Mail, Award, Dumbbell, Activity, Briefcase, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useMyPTDetail } from "@/hooks/queries/useTraining";
import { useMyEmployee, useUpdateMyEmployee } from "@/hooks/queries/useEmployees";
import AvatarUpload from "@/components/Common/AvatarUpload";
import { toast } from "@/utils/toast";
import {
  slideUpVariants, cardVariants, staggerContainerVariants, sectionStaggerVariants,
} from "@/lib/animations";

const MEASUREMENT_KEYS = [
  { key: "height", unit: "cm" },
  { key: "weight", unit: "kg" },
  { key: "chest", unit: "cm" },
  { key: "waist", unit: "cm" },
  { key: "bicep", unit: "cm" },
  { key: "forearm", unit: "cm" },
  { key: "thigh", unit: "cm" },
  { key: "calf", unit: "cm" },
];

const TrainerProfile = () => {
  const { t } = useTranslation('trainer');
  const { data: pt, isLoading, isError } = useMyPTDetail();
  const { data: employeeMe } = useMyEmployee();
  const updateMeMutation = useUpdateMyEmployee();

  const handleAvatarUploaded = (url) => {
    if (!employeeMe) return;
    updateMeMutation.mutate(
      { ...employeeMe, avatar: url },
      {
        onError: () => toast.error(t('profile.avatar_error')),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400 text-sm">{t('profile.loading')}</div>
      </div>
    );
  }

  if (isError || !pt) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-red-500 text-sm">{t('profile.error')}</div>
      </div>
    );
  }

  const birthYear = pt.dob ? new Date(pt.dob).getFullYear() : "—";

  let bodyIndex = {};
  try { bodyIndex = JSON.parse(pt.body_index || "{}"); } catch { bodyIndex = {}; }

  const awards = (pt.achievements || "").split(";").map((s) => s.trim()).filter(Boolean);

  const experiencePoints = (pt.professional_profile || "")
    .split(/\.\s+/)
    .map((s) => s.trim().replace(/\.$/, ""))
    .filter(Boolean);

  const awardColors = [
    { bg: "bg-yellow-50 dark:bg-yellow-900/20", text: "text-yellow-600 dark:text-yellow-400", border: "border-yellow-200 dark:border-yellow-800/50" },
    { bg: "bg-slate-50 dark:bg-slate-800/40", text: "text-slate-500 dark:text-slate-400", border: "border-slate-200 dark:border-slate-700" },
    { bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-600 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800/50" },
  ];

  return (
    <motion.div
      className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto no-scrollbar"
      variants={sectionStaggerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ── HERO ─────────────────────────────────────────── */}
      <motion.div
        variants={slideUpVariants}
        className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden shrink-0"
      >
        <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />
        <div className="p-6 flex flex-col lg:flex-row items-center lg:items-start gap-6">
          <div className="shrink-0">
            <AvatarUpload
              avatarUrl={employeeMe?.avatar || null}
              onUploaded={handleAvatarUploaded}
              size="lg"
            />
          </div>
          <div className="flex-1 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{pt.full_name || "—"}</h1>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                Trainer
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
              {pt.professional_profile?.split(/\.\s+/)[0] || t('profile.default_bio')}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center lg:justify-end shrink-0">
            {[
              { icon: Briefcase, value: pt.experience_years ? `${pt.experience_years} ${t('profile.stats.experience_unit')}` : "—", label: t('profile.stats.experience') },
              { icon: Award, value: awards.length || "—", label: t('profile.stats.awards') },
              { icon: Calendar, value: birthYear, label: t('profile.stats.birth_year') },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 px-4 py-3 bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 rounded-xl text-center">
                <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span className="text-base font-bold text-gray-900 dark:text-white leading-none">{value}</span>
                <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── MAIN GRID ────────────────────────────────────── */}
      <motion.div
        variants={staggerContainerVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Left — Professional profile */}
        <motion.div
          variants={cardVariants}
          custom={0}
          className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col overflow-hidden"
        >
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4 shrink-0">
            <Dumbbell className="h-3.5 w-3.5" /> {t('profile.professional_section')}
          </h3>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {experiencePoints.length > 0 ? (
              <div className="space-y-3">
                {experiencePoints.map((point, i) => (
                  <div
                    key={i}
                    className="flex gap-3 p-4 bg-blue-50/60 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30 hover:bg-blue-100/40 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">{t('profile.no_professional_info')}</div>
            )}
          </div>
        </motion.div>

        {/* Right column stacked */}
        <motion.div variants={cardVariants} custom={1} className="flex flex-col gap-6 min-h-0">

          {/* Contact */}
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
              <User className="h-3.5 w-3.5" /> {t('profile.contact_section')}
            </h3>
            <div className="space-y-3">
              {[
                { icon: Phone, label: t('profile.contact_phone'), value: pt.phone },
                { icon: Mail, label: t('profile.contact_email'), value: pt.email },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 p-3.5 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="w-9 h-9 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0 shadow-sm">
                    <Icon className="h-4.5 w-4.5 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{value || "—"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Awards */}
          <div className="flex-1 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col overflow-hidden min-h-0">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4 shrink-0">
              <Award className="h-3.5 w-3.5" /> {t('profile.awards_section')}
            </h3>
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {awards.length > 0 ? (
                <div className="space-y-3">
                  {awards.map((award, i) => {
                    const color = awardColors[i] ?? awardColors[2];
                    return (
                      <div
                        key={i}
                        className={`flex items-start gap-3 p-3.5 rounded-lg border ${color.bg} ${color.border} hover:shadow-sm transition-shadow`}
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
                <div className="h-full flex items-center justify-center text-xs text-gray-400">{t('profile.no_awards')}</div>
              )}
            </div>
          </div>

        </motion.div>
      </motion.div>

      {/* ── BODY MEASUREMENTS ────────────────────────────── */}
      <motion.div
        variants={slideUpVariants}
        className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl px-6 py-5 shadow-sm"
      >
        <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
          <Activity className="h-3.5 w-3.5" /> {t('profile.measurements_section')}
        </h3>
        <motion.div
          variants={staggerContainerVariants}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {MEASUREMENT_KEYS.map(({ key, unit }, i) => (
            <motion.div
              key={key}
              variants={cardVariants}
              custom={i}
              whileHover={{ scale: 1.04, y: -2 }}
              className="bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-xl py-3 px-3 text-center hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 leading-tight font-medium">{t(`profile.measurements.${key}`)}</div>
              <div className="text-lg font-bold text-gray-900 dark:text-white leading-none">
                {bodyIndex[key] != null ? (
                  <>
                    {bodyIndex[key]}
                    <span className="text-xs font-normal text-gray-400 ml-1">{unit}</span>
                  </>
                ) : (
                  <span className="text-gray-300 dark:text-gray-600">—</span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

    </motion.div>
  );
};

export default TrainerProfile;
