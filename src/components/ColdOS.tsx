import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface AppWindow {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}

interface DockApp {
  id: string;
  title: string;
  icon: string;
  color: string;
}

const ColdOS = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [windows, setWindows] = useState<AppWindow[]>([]);
  const [highestZIndex, setHighestZIndex] = useState(100);
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  const dockApps: DockApp[] = [
    { id: 'home', title: 'Главная', icon: 'Home', color: 'from-blue-400 to-blue-600' },
    { id: 'apps', title: 'Приложения', icon: 'Grid3x3', color: 'from-cyan-400 to-cyan-600' },
    { id: 'settings', title: 'Параметры', icon: 'Settings', color: 'from-purple-400 to-purple-600' },
    { id: 'files', title: 'Файлы', icon: 'FolderOpen', color: 'from-indigo-400 to-indigo-600' },
    { id: 'system', title: 'Система', icon: 'Monitor', color: 'from-sky-400 to-sky-600' },
    { id: 'wallpaper', title: 'Обои', icon: 'Image', color: 'from-teal-400 to-teal-600' },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const flakes = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setSnowflakes(flakes);
  }, []);

  const openApp = (app: DockApp) => {
    const existingWindow = windows.find(w => w.id === app.id);
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        setWindows(windows.map(w => 
          w.id === app.id ? { ...w, isMinimized: false, zIndex: highestZIndex + 1 } : w
        ));
        setHighestZIndex(prev => prev + 1);
      } else {
        focusWindow(app.id);
      }
    } else {
      const newWindow: AppWindow = {
        id: app.id,
        title: app.title,
        icon: app.icon,
        isOpen: true,
        isMinimized: false,
        zIndex: highestZIndex + 1,
      };
      setWindows([...windows, newWindow]);
      setHighestZIndex(prev => prev + 1);
    }
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
  };

  const minimizeWindow = (id: string) => {
    setWindows(windows.map(w => w.id === id ? { ...w, isMinimized: true } : w));
  };

  const focusWindow = (id: string) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, zIndex: highestZIndex + 1 } : w
    ));
    setHighestZIndex(prev => prev + 1);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#1a2d4f] to-[#0d1b2e]">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBpZD0iZyIgY3g9IjUwJSIgY3k9IjUwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzBFQTVFOSIgc3RvcC1vcGFjaXR5PSIwLjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwRUE1RTkiIHN0b3Atb3BhY2l0eT0iMCIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=')] opacity-30"></div>
      
      {snowflakes.map(flake => (
        <div
          key={flake.id}
          className="absolute w-2 h-2 bg-white rounded-full opacity-60 animate-pulse pointer-events-none"
          style={{
            left: `${flake.x}%`,
            top: `${flake.y}%`,
            animationDelay: `${flake.delay}s`,
            filter: 'blur(1px)',
          }}
        />
      ))}

      <div className="absolute top-0 left-0 right-0 h-8 bg-black/20 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          <span className="text-white/90 font-semibold text-sm tracking-wide">Cold-OS</span>
        </div>
        <div className="text-white/90 text-sm font-medium">
          {currentTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div className="relative w-full h-full pt-8 pb-24">
        {windows.map(window => (
          !window.isMinimized && (
            <div
              key={window.id}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
              style={{ zIndex: window.zIndex }}
              onClick={() => focusWindow(window.id)}
            >
              <div className="h-12 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => closeWindow(window.id)}
                      className="w-3 h-3 rounded-full bg-red-400/80 hover:bg-red-500 transition-colors"
                    />
                    <button
                      onClick={() => minimizeWindow(window.id)}
                      className="w-3 h-3 rounded-full bg-yellow-400/80 hover:bg-yellow-500 transition-colors"
                    />
                    <button className="w-3 h-3 rounded-full bg-green-400/80 hover:bg-green-500 transition-colors" />
                  </div>
                  <span className="text-white/90 text-sm font-medium">{window.title}</span>
                </div>
              </div>
              <div className="p-8 h-[calc(100%-48px)] flex flex-col items-center justify-center text-white/70">
                <Icon name={window.icon as any} size={64} className="mb-4 opacity-60" />
                <h3 className="text-xl font-semibold mb-2 text-white/90">{window.title}</h3>
                <p className="text-center text-sm">Приложение готово к работе</p>
              </div>
            </div>
          )
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/30 rounded-2xl px-4 py-3 shadow-2xl">
          <div className="flex items-center gap-2">
            {dockApps.map(app => (
              <button
                key={app.id}
                onClick={() => openApp(app)}
                className="group relative w-14 h-14 rounded-xl bg-gradient-to-br transition-all duration-300 hover:scale-110 hover:-translate-y-2 active:scale-95"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                }}
              >
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${app.color} opacity-90 group-hover:opacity-100 transition-opacity`} />
                <div className="relative w-full h-full flex items-center justify-center">
                  <Icon name={app.icon as any} size={28} className="text-white drop-shadow-lg" />
                </div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-black/80 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">
                    {app.title}
                  </div>
                </div>
                {windows.some(w => w.id === app.id && !w.isMinimized) && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-lg" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColdOS;
