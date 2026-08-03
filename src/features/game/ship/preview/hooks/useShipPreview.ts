import { useState, useEffect, useMemo } from 'react';
import { fetchShipPreview } from '@/services/shipPreviewService';
import { joinShip, requestToJoinShip, cancelJoinRequest } from '@/services/shipService';
import { sortMembers, canJoinShip } from '../utils/shipPreviewUtils';

export function useShipPreview(
  shipId,
  user,
  updateUser,
  fetchUserData,
  t,
  onNavigateToShip,
  onJoinRequestCancelled?: () => void | Promise<void>
) {
  const [clubData, setShipData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [joinError, setJoinError] = useState(null);
  const [joinSuccess, setJoinSuccess] = useState(null);

  useEffect(() => {
    if (shipId) {
      setLoading(true);
      setError(null);
      fetchShipPreview(shipId)
        .then((data) => {
          if (data) {
            setShipData(data);
          } else {
            setError('Could not load ship data');
          }
        })
        .catch((err) => {
          console.error('Error loading ship preview:', err);
          setError('An error occurred while loading the ship');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [shipId]);

  const sortedMembers = useMemo(() => {
    return sortMembers(clubData?.members);
  }, [clubData?.members]);

  const canJoin = useMemo(() => {
    return canJoinShip(user, clubData);
  }, [user, clubData]);

  const refreshShipData = () => {
    if (!shipId) return;
    fetchShipPreview(shipId)
      .then((data) => {
        if (data) {
          setShipData(data);
        }
      })
      .catch((err) => {
        console.error('Error refreshing ship preview:', err);
      });
  };

  const handleJoinShip = async () => {
    if (!clubData) return;
    
    setJoinError(null);
    setJoinSuccess(null);
    setActionLoading(true);
    
    if (clubData.requiresInvitation) {
      const result = await requestToJoinShip(clubData.id, setActionLoading);
      
      if (result.success) {
        setJoinSuccess(t('joinRequestSent'));
        refreshShipData();
        setTimeout(() => {
          setJoinSuccess(null);
        }, 5000);
      } else {
        setJoinError(result.message);
      }
    } else {
      const result = await joinShip(clubData.id, fetchUserData, setActionLoading);
      
      if (result.success) {
        if (fetchUserData) {
          await fetchUserData();
        }

        setTimeout(() => {
          if (onNavigateToShip) {
            onNavigateToShip(clubData.id);
          }
        }, 100);
      } else {
        setJoinError(result.message);
      }
    }
  };

  const handleCancelJoinRequest = async () => {
    if (!clubData) return;
    
    setJoinError(null);
    setJoinSuccess(null);
    setActionLoading(true);
    
    const result = await cancelJoinRequest(clubData.id, setActionLoading);
    
    if (result.success) {
      setJoinSuccess(t('joinRequestCancelled'));
      refreshShipData();
      if (typeof onJoinRequestCancelled === 'function') {
        void onJoinRequestCancelled();
      }
      setTimeout(() => {
        setJoinSuccess(null);
      }, 3000);
    } else {
      setJoinError(result.message);
    }
  };

  return {
    clubData,
    loading,
    error,
    actionLoading,
    joinError,
    joinSuccess,
    sortedMembers,
    canJoin,
    handleJoinShip,
    handleCancelJoinRequest,
    refreshShipData
  };
}
