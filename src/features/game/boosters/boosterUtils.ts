const DEFAULT_BASE_ENERGY_CAPACITY = 100;

export const isExpired = (expiresAt) => {
  if (!expiresAt) return true;
  return new Date(expiresAt) < new Date();
};

export const formatTimeRemaining = (diff, t) => {
  if (diff <= 0) return t('expired');
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return t('timeRemainingDaysHours', { days, hours });
  if (hours > 0) return t('timeRemainingHoursMinutes', { hours, minutes });
  return t('timeRemainingMinutes', { minutes });
};

export const getTimeRemaining = (userBoosterId, expiresAt, timeRemaining) => {
  if (!expiresAt) return '';
  
  const diff = timeRemaining[userBoosterId] !== undefined 
    ? timeRemaining[userBoosterId] 
    : (new Date(expiresAt).getTime() - new Date().getTime());
  
  return diff;
};

export const hasActiveBoosterForTemplate = (userBoosters, template) => {
  if (!template) return false;
  return userBoosters?.some(
    ub => ub.boosterTemplate?.type === template.type &&
          ub.boosterTemplate?.tier === template.tier &&
          !isExpired(ub.expiresAt)
  );
};

export const hasActiveBoosterForType = (userBoosters, boosterType) => {
  if (!boosterType) return null;
  return userBoosters?.find(
    ub => ub.boosterTemplate?.type === boosterType &&
          !isExpired(ub.expiresAt)
  );
};

export const formatPrice = (price, useGold, t) => {
  if (useGold) {
    if (price === 1) {
      return `${price} ${t('goldSingular')}`;
    } else if (price >= 2 && price <= 4) {
      return `${price} ${t('goldPlural')}`;
    } else {
      return `${price} ${t('goldGenitive')}`;
    }
  } else {
    if (price === 1) {
      return `${price} ${t('diamondsingular')}`;
    } else if (price >= 2 && price <= 4) {
      return `${price} ${t('diamondsPlural')}`;
    } else {
      return `${price} ${t('diamondsGenitive')}`;
    }
  }
};

export const calculateCapacityWithBoosters = (userCapacities, userBoosters) => {
  const baseEnergyCapacity = DEFAULT_BASE_ENERGY_CAPACITY;
  const baseTrainingCapacity = 10;
  const baseFightCapacity = 10;

  let energyBoost = 0;
  let trainingBoost = 0;
  let fightBoost = 0;

  if (userBoosters && Array.isArray(userBoosters)) {
    userBoosters.forEach(ub => {
      if (!isExpired(ub.expiresAt) && ub.boosterTemplate) {
        const type = ub.boosterTemplate.type;
        const effectAmount = ub.boosterTemplate.effectAmount || 0;

        switch (type) {
          case 'ENERGY':
            energyBoost = Math.max(energyBoost, effectAmount);
            break;
          case 'TRAINING_POINTS':
            trainingBoost = Math.max(trainingBoost, effectAmount);
            break;
          case 'DUEL_POINTS':
            fightBoost = Math.max(fightBoost, effectAmount);
            break;
          default:
            break;
        }
      }
    });
  }

  const rawEnergy =
    userCapacities?.energyPoints ?? baseEnergyCapacity + energyBoost;

  return {
    energyPoints: rawEnergy,
    trainingPoints: userCapacities?.trainingPoints ?? (baseTrainingCapacity + trainingBoost),
    fightPoints: userCapacities?.fightPoints ?? (baseFightCapacity + fightBoost),
  };
};
