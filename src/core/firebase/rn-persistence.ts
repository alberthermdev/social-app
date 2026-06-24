import type { Persistence } from 'firebase/auth';

const STORAGE_AVAILABLE_KEY = '__sak';

type AsyncStorage = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};

export function getReactNativePersistence(storage: AsyncStorage): Persistence {
  const Cls = class {
    readonly type = 'LOCAL' as const;
    static type = 'LOCAL' as const;

    async _isAvailable() {
      try {
        if (!storage) return false;
        await storage.setItem(STORAGE_AVAILABLE_KEY, '1');
        await storage.removeItem(STORAGE_AVAILABLE_KEY);
        return true;
      } catch {
        return false;
      }
    }

    _set(key: string, value: string) {
      return storage.setItem(key, JSON.stringify(value));
    }

    async _get<T>(key: string) {
      const json = await storage.getItem(key);
      return json ? (JSON.parse(json) as T) : null;
    }

    _remove(key: string) {
      return storage.removeItem(key);
    }

    _addListener(_key: string, _listener: () => void) {}
    _removeListener(_key: string, _listener: () => void) {}
  };

  return Cls as unknown as Persistence;
}
