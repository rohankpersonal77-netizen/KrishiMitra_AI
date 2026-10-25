import React from 'react';
import { WifiOff, AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useOffline } from '../context/OfflineContext';
import { useLanguage } from '../context/LanguageContext';
import { useFarm } from '../context/FarmContext';

export default function OfflineBanner() {
  const { isOffline, isSimulatedOffline, toggleSimulatedOffline, lastSyncTime } = useOffline();
  const { t } = useLanguage();
  const { refreshWeather, weatherLoading } = useFarm();

  if (!isOffline) return null;

  const formattedTime = lastSyncTime
    ? new Date(lastSyncTime).toLocaleTimeString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Earlier today';

  return (
    <div className="bg-amber-500 text-amber-950 px-4 py-2 border-b border-amber-600/30 text-xs sm:text-sm font-medium shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-center sm:text-left">
          <WifiOff className="w-4 h-4 flex-shrink-0 text-amber-900" />
          <span>
            <strong>{t('offline.banner_warning')}</strong>
            <span className="ml-1 opacity-90">({t('offline.last_sync')} {formattedTime})</span>
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {isSimulatedOffline && (
            <button
              onClick={toggleSimulatedOffline}
              className="bg-amber-900 text-amber-100 hover:bg-amber-950 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors"
            >
              Exit Offline Preview
            </button>
          )}

          <button
            onClick={refreshWeather}
            disabled={weatherLoading}
            className="flex items-center space-x-1 underline hover:text-amber-900 disabled:opacity-50 text-xs"
          >
            <RefreshCw className={`w-3 h-3 ${weatherLoading ? 'animate-spin' : ''}`} />
            <span>{t('common.retry')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
