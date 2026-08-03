import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import type { TFunction } from 'i18next';
import {
  canKickMember,
  CrewMemberAvatar,
  RoleIconByNickname,
} from '@/features/game/ship/shipCrewUi';
import type { Member, ShipData } from '@/features/game/ship/shipTypes';
import { Button } from '@/features/game/ship/ShipUi';

type Props = {
  ship: ShipData;
  viewer: Member | undefined;
  canChangeMemberRoles: boolean;
  changeRole: (idx: number, newRole: Member['role']) => void | Promise<void>;
  removeMember: (idx: number) => void | Promise<void>;
  onToggleRequiresInvitation: () => void | Promise<void>;
  invitationSettingLoading: boolean;
  onViewProfile: (userId: string) => void;
  t: TFunction;
  crewJoinActions?: ReactNode;
  previewMode?: boolean;
};

export function ShipViewCrewTab({
  ship,
  viewer,
  canChangeMemberRoles,
  changeRole,
  removeMember,
  onToggleRequiresInvitation,
  invitationSettingLoading,
  onViewProfile,
  t,
  crewJoinActions,
  previewMode = false,
}: Props) {
  const roleOptions: Member['role'][] = ['OWNER', 'MANAGER', 'MEMBER'];
  const isCaptain = viewer?.role === 'OWNER';

  return (
    <div className="space-y-2">
      <h2 className="mb-3 font-heading text-lg font-bold text-foreground">
        {String(t('shipPage.crewTitle'))} ({ship.members.length}/{ship.maxMembers})
      </h2>

      <div className="mb-4 rounded-md border border-border/80 bg-muted/30 p-3">
        <h3 className="mb-2 font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {String(t('shipPage.crewJoinSectionTitle'))}
        </h3>
        {isCaptain ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {ship.requiresInvitation
                  ? String(t('shipPage.crewJoinRestrictedLabel'))
                  : String(t('shipPage.crewJoinOpenLabel'))}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {ship.requiresInvitation
                  ? String(t('invitationRequiredDescription'))
                  : String(t('openStatekDescription'))}
              </p>
            </div>
            <label className="inline-flex shrink-0 cursor-pointer items-center self-start sm:self-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={ship.requiresInvitation}
                disabled={invitationSettingLoading}
                onChange={() => void onToggleRequiresInvitation()}
              />
              <span
                className="relative h-6 w-11 shrink-0 rounded-full bg-muted-foreground/35 transition-colors peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background peer-checked:bg-primary peer-disabled:cursor-not-allowed peer-disabled:opacity-50 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-border after:bg-background after:shadow-sm after:transition-transform peer-checked:after:translate-x-[1.25rem]"
                aria-hidden
              />
            </label>
          </div>
        ) : (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {ship.requiresInvitation
                ? String(t('shipPage.crewJoinRestrictedLabel'))
                : String(t('shipPage.crewJoinOpenLabel'))}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {ship.requiresInvitation
                ? String(t('invitationRequiredDescription'))
                : String(t('openStatekDescription'))}
            </p>
          </div>
        )}
        {crewJoinActions ? <div className="mt-2.5">{crewJoinActions}</div> : null}
      </div>
      {ship.members.map((m, i) => {
        const showRoleSelect = canChangeMemberRoles && m.userId !== ship.currentUserId;
        const kick = canKickMember(viewer, m);
        return (
          <div
            key={m.userId}
            className="flex flex-col gap-3 rounded-md bg-muted/50 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <CrewMemberAvatar avatarName={m.avatarName} name={m.name} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <RoleIconByNickname role={m.role} />
                  <span className="text-sm font-bold text-foreground">{m.name}</span>
                  {showRoleSelect ? (
                    <div className="relative">
                      <select
                        value={m.role}
                        onChange={(e) => void changeRole(i, e.target.value as Member['role'])}
                        className="h-8 min-w-[7.5rem] cursor-pointer appearance-none rounded-md border border-border bg-card py-1 pl-2 pr-7 font-heading text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        {roleOptions.map((roleOpt) => (
                          <option key={roleOpt} value={roleOpt}>
                            {String(t(`shipPage.roles.${roleOpt}`))}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  ) : (
                    <span className="font-heading text-xs text-muted-foreground">
                      {String(t(`shipPage.roles.${m.role}`))}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {String(t('shipPage.levelShort', { level: m.level }))}
                  {!previewMode ? (
                    <>
                      {' · '}
                      {String(
                        t('shipPage.memberContributions', {
                          gold: m.goldContributed,
                          diamonds: m.diamondsContributed,
                        })
                      )}
                    </>
                  ) : null}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
              <Button type="button" size="sm" variant="outline" onClick={() => onViewProfile(m.userId)}>
                {String(t('shipPage.viewButton'))}
              </Button>
              {kick ? (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="border-destructive/60 text-destructive hover:bg-destructive/10"
                  onClick={() => void removeMember(i)}
                >
                  {String(t('shipPage.kickButton'))}
                </Button>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
