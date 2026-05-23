import axios from '@/lib/axios';

export const packageService = {
  getPackages: () =>
    axios.get('/packages'),

  getPackageById: (id) =>
    axios.get(`/packages/${id}`),

  createPackage: (data) =>
    axios.post('/packages', data),

  updatePackage: (id, data) =>
    axios.put(`/packages/${id}`, data),

  deletePackage: (id) =>
    axios.delete(`/packages/${id}`),

  updatePackageStatus: (id, isActive) =>
    axios.patch(`/packages/${id}/status`, { is_active: isActive }),

  registerPackage: (packageData) => {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (packageData.duration || 30));

    return axios.post('/subscriptions', {
      package_id: packageData.id,
      registration_date: startDate.toISOString(),
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      status: 'active',
    });
  },

  getMemberPackages: () =>
    axios.get('/members/me/subscriptions'),

  renewPackage: (renewalData) =>
    axios.patch(`/subscriptions/${renewalData.packageId}/renew`, {
      new_end_date: renewalData.newEndDate,
    }),

  upgradePackage: (upgradeData) =>
    axios.patch(`/subscriptions/${upgradeData.subscriptionId}/upgrade`, {
      new_package_id: upgradeData.newPackageId,
      new_end_date: upgradeData.newEndDate,
    }),
};
