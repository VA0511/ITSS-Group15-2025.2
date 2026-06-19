import React, { useState } from "react";
import { User, Phone, Mail, Award, Dumbbell, Activity, Briefcase, Calendar, Edit2, Check, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useMyPTDetail, useUpdateMyPTDetail } from "@/hooks/queries/useTraining";
import { useMyEmployee, useUpdateMyEmployee } from "@/hooks/queries/useEmployees";
import AvatarUpload from "@/components/Common/AvatarUpload";
import { toast } from "@/utils/toast";
import Button from "@/components/Common/Button";
import Input from "@/components/Common/Input";
import {
  slideUpVariants, cardVariants, staggerContainerVariants,
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
  const { data: pt, isLoading, isError, refetch: refetchPT } = useMyPTDetail();
  const { data: employeeMe, refetch: refetchEmployee } = useMyEmployee();
  const updateMeMutation = useUpdateMyEmployee();
  const updatePTDetailMutation = useUpdateMyPTDetail();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    professionalProfile: "",
    experienceYears: "",
    achievements: "",
    bodyIndex: {},
  });

  const handleAvatarUploaded = (url) => {
    if (!employeeMe) return;
    updateMeMutation.mutate(
      { ...employeeMe, avatar: url },
      {
        onSuccess: () => {
          toast.success(t('profile.edit_success', 'Cập nhật ảnh đại diện thành công'));
          refetchEmployee();
        },
        onError: () => toast.error(t('profile.avatar_error')),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          {t('profile.loading')}
        </div>
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

  const birthYear = pt.dob ? new Date(pt.dob).getFullYear() : "-";
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

  const handleEditClick = () => {
    let bodyIdx = {};
    try {
      bodyIdx = JSON.parse(pt.body_index || "{}");
    } catch (e) {
      bodyIdx = {};
    }
    setFormData({
      fullName: employeeMe?.full_name || pt.full_name || "",
      phone: employeeMe?.phone || pt.phone || "",
      email: employeeMe?.email || pt.email || "",
      professionalProfile: pt.professional_profile || "",
      experienceYears: pt.experience_years || "0",
      achievements: pt.achievements || "",
      bodyIndex: bodyIdx,
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (employeeMe) {
        await updateMeMutation.mutateAsync({
          ...employeeMe,
          full_name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
        });
      }
      await updatePTDetailMutation.mutateAsync({
        professional_profile: formData.professionalProfile,
        experience_years: formData.experienceYears,
        achievements: formData.achievements,
        body_index: JSON.stringify(formData.bodyIndex),
        available_schedule: pt.available_schedule || "",
      });
      toast.success(t('profile.edit_success'));
      setIsEditing(false);
      refetchPT();
      refetchEmployee();
    } catch (error) {
      console.error(error);
      toast.error(t('profile.edit_error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto no-scrollbar">
      {/* ── HERO ────────────────────────────────────────────── */}
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
              disabled={saving}
            />
          </div>
          <div className="flex-1 text-center lg:text-left">
            {isEditing ? (
              <div className="w-full space-y-3 mb-2">
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">
                    Họ và tên PT
                  </label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder={t('profile.placeholder_fullname')}
                    className="max-w-md"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{employeeMe?.full_name || pt.full_name || "-"}</h1>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                  Trainer
                </span>
              </div>
            )}
            {!isEditing && (
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                {pt.professional_profile?.split(/\.\s+/)[0] || t('profile.default_bio')}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 items-center lg:items-end shrink-0">
            {/* Action Buttons */}
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    size="sm"
                    className="rounded-xl px-4"
                    disabled={saving}
                    leftIcon={<X className="h-4 w-4" />}
                  >
                    {t('profile.cancel_btn')}
                  </Button>
                  <Button
                    onClick={handleSave}
                    size="sm"
                    className="rounded-xl px-4 font-bold"
                    isLoading={saving}
                    leftIcon={<Check className="h-4 w-4" />}
                  >
                    {t('profile.save_btn')}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleEditClick}
                  variant="outline"
                  size="sm"
                  className="rounded-xl px-4"
                  leftIcon={<Edit2 className="h-3.5 w-3.5" />}
                >
                  {t('profile.edit_btn')}
                </Button>
              )}
            </div>

            {/* Stats Cards */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-end mt-2">
              <div className="flex flex-col items-center gap-1.5 px-4 py-3 bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 rounded-xl text-center">
                <Briefcase className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      value={formData.experienceYears}
                      onChange={(e) => setFormData(prev => ({ ...prev, experienceYears: e.target.value }))}
                      className="w-12 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded px-1 py-0.5 text-center text-sm font-bold text-gray-900 dark:text-white"
                    />
                    <span className="text-xs text-gray-500">{t('profile.stats.experience_unit')}</span>
                  </div>
                ) : (
                  <span className="text-base font-bold text-gray-900 dark:text-white leading-none">
                    {pt.experience_years ? `${pt.experience_years} ${t('profile.stats.experience_unit')}` : "-"}
                  </span>
                )}
                <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">{t('profile.stats.experience')}</span>
              </div>

              <div className="flex flex-col items-center gap-1.5 px-4 py-3 bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 rounded-xl text-center">
                <Award className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span className="text-base font-bold text-gray-900 dark:text-white leading-none">
                  {isEditing ? (formData.achievements ? formData.achievements.split(";").map((s) => s.trim()).filter(Boolean).length : 0) : (awards.length || "-")}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">{t('profile.stats.awards')}</span>
              </div>

              <div className="flex flex-col items-center gap-1.5 px-4 py-3 bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 rounded-xl text-center">
                <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span className="text-base font-bold text-gray-900 dark:text-white leading-none">{birthYear}</span>
                <span className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">{t('profile.stats.birth_year')}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── MAIN GRID ──────────────────────────────────────── */}
      <motion.div
        variants={staggerContainerVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Left - Professional profile */}
        <motion.div
          variants={cardVariants}
          custom={0}
          className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col overflow-hidden min-h-[320px]"
        >
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4 shrink-0">
            <Dumbbell className="h-3.5 w-3.5" /> {t('profile.professional_section')}
          </h3>
          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
            {isEditing ? (
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {t('profile.placeholder_profile')}
                </label>
                <textarea
                  value={formData.professionalProfile}
                  onChange={(e) => setFormData(prev => ({ ...prev, professionalProfile: e.target.value }))}
                  className="w-full flex-1 p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none min-h-[180px]"
                />
              </div>
            ) : (
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
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('profile.contact_phone')}
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    type="tel"
                    placeholder={t('profile.placeholder_phone')}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('profile.contact_email')}
                  </label>
                  <Input
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    type="email"
                    placeholder={t('profile.placeholder_email')}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { icon: Phone, label: t('profile.contact_phone'), value: employeeMe?.phone || pt.phone },
                  { icon: Mail, label: t('profile.contact_email'), value: employeeMe?.email || pt.email },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 p-3.5 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div className="w-9 h-9 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center shrink-0 shadow-sm">
                      <Icon className="h-4.5 w-4.5 text-blue-500 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">{value || "-"}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Awards */}
          <div className="flex-1 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col overflow-hidden min-h-[220px]">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4 shrink-0">
              <Award className="h-3.5 w-3.5" /> {t('profile.awards_section')}
            </h3>
            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
              {isEditing ? (
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {t('profile.placeholder_achievements')}
                  </label>
                  <textarea
                    value={formData.achievements}
                    onChange={(e) => setFormData(prev => ({ ...prev, achievements: e.target.value }))}
                    className="w-full flex-1 p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none min-h-[120px]"
                  />
                </div>
              ) : (
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
              )}
            </div>
          </div>

        </motion.div>
      </motion.div>

      {/* ── BODY MEASUREMENTS ───────────────────────────────── */}
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
              whileHover={isEditing ? {} : { scale: 1.04, y: -2 }}
              className="bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-xl py-3 px-3 text-center hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 leading-tight font-medium">{t(`profile.measurements.${key}`)}</div>
              {isEditing ? (
                <div className="flex items-center justify-center gap-1">
                  <input
                    type="number"
                    step="any"
                    value={formData.bodyIndex[key] ?? ""}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      bodyIndex: { ...prev.bodyIndex, [key]: e.target.value ? parseFloat(e.target.value) : "" }
                    }))}
                    className="w-16 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded px-1.5 py-0.5 text-center font-bold text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  <span className="text-xs text-gray-400">{unit}</span>
                </div>
              ) : (
                <div className="text-lg font-bold text-gray-900 dark:text-white leading-none">
                  {bodyIndex[key] != null && bodyIndex[key] !== "" ? (
                    <>
                      {bodyIndex[key]}
                      <span className="text-xs font-normal text-gray-400 ml-1">{unit}</span>
                    </>
                  ) : (
                    <span className="text-gray-300 dark:text-gray-600">-</span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TrainerProfile;
