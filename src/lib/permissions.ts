export type PermissionType = 'location' | 'camera' | 'phone';
export type PermissionState = 'granted' | 'denied' | 'prompt';

export interface PermissionStatus {
  location: PermissionState;
  camera: PermissionState;
  phone: PermissionState;
}

// Global permission state store
let currentStatus: PermissionStatus = {
  location: 'prompt',
  camera: 'prompt',
  phone: 'prompt',
};

// Listeners
type StatusListener = (status: PermissionStatus) => void;
const listeners: Set<StatusListener> = new Set();

export const subscribePermissionStatus = (listener: StatusListener) => {
  listeners.add(listener);
  listener(currentStatus);
  return () => {
    listeners.delete(listener);
  };
};

const notify = () => {
  listeners.forEach((l) => l(currentStatus));
};

export const checkPermission = async (type: PermissionType): Promise<PermissionState> => {
  try {
    if (type === 'location') {
      if (typeof window !== 'undefined' && navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: 'geolocation' as any });
        currentStatus.location = result.state as PermissionState;
      }
    }
  } catch (err) {
    console.log('Check permission error:', err);
  }
  return currentStatus[type];
};

export const requestPermission = async (type: PermissionType): Promise<boolean> => {
  try {
    if (type === 'location') {
      if (typeof window !== 'undefined' && navigator.geolocation) {
        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            () => {
              currentStatus.location = 'granted';
              notify();
              resolve(true);
            },
            () => {
              currentStatus.location = 'denied';
              notify();
              resolve(false);
            },
            { timeout: 8000 }
          );
        });
      }
    }

    if (type === 'camera' || type === 'phone') {
      currentStatus[type] = 'granted';
      notify();
      return true;
    }
  } catch (err) {
    console.error('Request permission error:', err);
  }
  return false;
};
