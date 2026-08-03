const KEY = 'famegame_mission_start_bases_v1';

export type MissionStartBasesSnapshot = {
  id: string;
  baseGoldReward: number;
  baseExpReward: number;
};

export function writeMissionStartBasesSnapshot(s: MissionStartBasesSnapshot): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(
      KEY,
      JSON.stringify({
        id: String(s.id),
        baseGoldReward: Math.round(Number(s.baseGoldReward)),
        baseExpReward: Math.round(Number(s.baseExpReward)),
      })
    );
  } catch {

  }
}

export function readMissionStartBasesSnapshot(missionId: string): MissionStartBasesSnapshot | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<MissionStartBasesSnapshot>;
    if (p == null || String(p.id) !== String(missionId)) return null;
    return {
      id: String(p.id),
      baseGoldReward: Math.round(Number(p.baseGoldReward)),
      baseExpReward: Math.round(Number(p.baseExpReward)),
    };
  } catch {
    return null;
  }
}

export function clearMissionStartBasesSnapshot(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    
  }
}
