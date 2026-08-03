export const calculateLevelUp = (currentLevel, currentExp, expToAdd) => {
  if (!currentLevel) return null;

  const newExp = currentExp + expToAdd;
  const expToNextLevel = currentLevel.expToNextLevel;

  if (newExp >= expToNextLevel) {
    const nextLevelNumber = parseInt(currentLevel.name) + 1;
    const excessExp = newExp - expToNextLevel;
    const estimatedExpToNext = expToNextLevel * 1.5;
    
    return {
      name: String(nextLevelNumber),
      expToNextLevel: estimatedExpToNext,
      excessExp: excessExp
    };
  }

  return null;
};
