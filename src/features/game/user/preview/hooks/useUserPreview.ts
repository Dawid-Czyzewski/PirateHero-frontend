import { useState, useEffect, useMemo } from 'react';
import { fetchUserPreview } from '@/services/userPreviewService';
import { inviteMember, getMyShip, removeMember, cancelInvitation } from '@/services/shipService';
import { calculateTotalStats } from '../utils/userPreviewUtils';
import type { MyShipPayload } from '@/types/ship';

export function useUserPreview(userId, user, updateUser, t) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [inviteError, setInviteError] = useState(null);
  const [inviteSuccess, setInviteSuccess] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isMemberOfMyShip, setIsMemberOfMyShip] = useState(false);
  const [hasInvitation, setHasInvitation] = useState(false);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      setError(null);
      fetchUserPreview(userId)
        .then((data) => {
          if (data) {
            setUserData(data);
            setHasInvitation(Boolean(data.hasInvitation));
          } else {
            setError('Could not load user data');
          }
        })
        .catch((err) => {
          console.error('Error loading user preview:', err);
          setError('An error occurred while loading the profile');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  useEffect(() => {
    if (user) {
      getMyShip()
        .then((clubData: MyShipPayload | null) => {
          if (!clubData) {
            setIsOwner(false);
            setIsMemberOfMyShip(false);
            return;
          }
          const { member, members } = clubData;
          if (member) {
            const owner = member.role === 'OWNER';
            setIsOwner(owner);

            if (owner && userData && members) {
              const isMember = members.some(
                (m) => m.user?.id === userData.id
              );
              setIsMemberOfMyShip(isMember);
            } else {
              setIsMemberOfMyShip(false);
            }
          } else {
            setIsOwner(false);
            setIsMemberOfMyShip(false);
          }
        })
        .catch((err) => {
          console.error('Error checking ship membership:', err);
          setIsOwner(false);
          setIsMemberOfMyShip(false);
        });
    }
  }, [user, userData]);

  const totalStats = useMemo(() => {
    return calculateTotalStats(userData);
  }, [userData]);

  const refreshUserData = () => {
    if (!userId) return;
    fetchUserPreview(userId)
      .then((data) => {
        if (data) {
          setUserData(data);
          setHasInvitation(Boolean(data.hasInvitation));
        }
      })
      .catch((err) => {
        console.error('Error refreshing user preview:', err);
      });
  };

  const refreshShipData = () => {
    getMyShip()
      .then((clubData: MyShipPayload | null) => {
        if (!clubData) {
          setIsOwner(false);
          setIsMemberOfMyShip(false);
          return;
        }
        const { member, members } = clubData;
        if (member) {
          const owner = member.role === 'OWNER';
          setIsOwner(owner);

          if (owner && userData && members) {
            const isMember = members.some(
              (m) => m.user?.id === userData.id
            );
            setIsMemberOfMyShip(isMember);
          } else {
            setIsMemberOfMyShip(false);
          }
        } else {
          setIsOwner(false);
          setIsMemberOfMyShip(false);
        }
      })
      .catch((err) => {
        console.error('Error refreshing ship data:', err);
      });
  };

  const handleInviteMember = async () => {
    if (!userData) return;
    
    setInviteError(null);
    setInviteSuccess(null);
    setActionLoading(true);
    
    const result = await inviteMember(userData.username, user, updateUser, setActionLoading);
    
    if (result.success) {
      setInviteSuccess(t('memberInvitedSuccessfully'));
      refreshShipData();
      refreshUserData();
      setTimeout(() => {
        setInviteSuccess(null);
      }, 3000);
    } else {
      setInviteError(result.message);
    }
  };

  const handleRemoveMember = async () => {
    if (!userData) return;
    
    setInviteError(null);
    setInviteSuccess(null);
    setActionLoading(true);
    
    const result = await removeMember(userData.id, user, updateUser, setActionLoading);
    
    if (result.success === false) {
      setInviteError(result.message);
      return;
    }
    setInviteSuccess(t('memberRemovedSuccessfully'));
    refreshShipData();
    refreshUserData();
    setTimeout(() => {
      setInviteSuccess(null);
    }, 3000);
  };

  const handleCancelInvitation = async () => {
    if (!userData) return;
    
    setInviteError(null);
    setInviteSuccess(null);
    setActionLoading(true);
    
    const result = await cancelInvitation(userData.id, setActionLoading);
    
    if (result.success) {
      setInviteSuccess(t('invitationCancelled'));
      refreshUserData();
      setTimeout(() => {
        setInviteSuccess(null);
      }, 3000);
    } else {
      setInviteError(result.message);
    }
  };

  return {
    userData,
    loading,
    error,
    actionLoading,
    inviteError,
    inviteSuccess,
    isOwner,
    isMemberOfMyShip,
    hasInvitation,
    totalStats,
    handleInviteMember,
    handleRemoveMember,
    handleCancelInvitation
  };
}
