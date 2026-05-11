export type EntrepreneurOnboardingData = {
  category?: string;
  name?: string;
  contact_info?: string;
  description?: string;
  img?: string;
};

const STORAGE_KEY = "entrepreneurOnboarding";

export const getOnboardingData = (): EntrepreneurOnboardingData => {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return {};
  }

  try {
    return JSON.parse(stored) as EntrepreneurOnboardingData;
  } catch {
    return {};
  }
};

export const setOnboardingData = (
  updates: EntrepreneurOnboardingData
): EntrepreneurOnboardingData => {
  const next = {
    ...getOnboardingData(),
    ...updates,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
};

export const clearOnboardingData = () => {
  localStorage.removeItem(STORAGE_KEY);
};
