import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

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

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  icon: string;
}

const ColdOS = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [windows, setWindows] = useState<AppWindow[]>([]);
  const [highestZIndex, setHighestZIndex] = useState(100);
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const [currentWallpaper, setCurrentWallpaper] = useState(0);
  const [brightness, setBrightness] = useState([80]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const wallpapers = [
    { id: 0, name: 'Морозная ночь', gradient: 'from-[#0a1628] via-[#1a2d4f] to-[#0d1b2e]' },
    { id: 1, name: 'Северное сияние', gradient: 'from-[#0a1628] via-[#1a4d4f] to-[#0d2e1b]' },
    { id: 2, name: 'Ледяной рассвет', gradient: 'from-[#1a2d4f] via-[#2d4f7a] to-[#4f7ab5]' },
    { id: 3, name: 'Кристалл', gradient: 'from-[#1e1e2e] via-[#2e3e5e] to-[#3e4e6e]' },
  ];

  const files: FileItem[] = [
    { id: '1', name: 'Документы', type: 'folder', icon: 'Folder' },
    { id: '2', name: 'Изображения', type: 'folder', icon: 'FolderOpen' },
    { id: '3', name: 'Зима.jpg', type: 'file', icon: 'FileImage' },
    { id: '4', name: 'Проекты', type: 'folder', icon: 'Folder' },
    { id: '5', name: 'Заметки.txt', type: 'file', icon: 'FileText' },
  ];

  const apps = [
    { id: 'calc', name: 'Калькулятор', icon: 'Calculator', color: 'from-orange-400 to-orange-600' },
    { id: 'notes', name: 'Заметки', icon: 'StickyNote', color: 'from-yellow-400 to-yellow-600' },
    { id: 'browser', name: 'Браузер', icon: 'Globe', color: 'from-blue-400 to-blue-600' },
    { id: 'music', name: 'Музыка', icon: 'Music', color: 'from-pink-400 to-pink-600' },
    { id: 'terminal', name: 'Терминал', icon: 'Terminal', color: 'from-gray-600 to-gray-800' },
    { id: 'camera', name: 'Камера', icon: 'Camera', color: 'from-purple-400 to-purple-600' },
  ];

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

  const renderWindowContent = (window: AppWindow) => {
    switch (window.id) {
      case 'home':
        return (
          <div className="p-6 h-full overflow-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Добро пожаловать в Cold-OS</h2>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-white/5 border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Clock" size={24} className="text-blue-400" />
                  <h3 className="text-white font-semibold">Время</h3>
                </div>
                <p className="text-white/70 text-2xl">{currentTime.toLocaleTimeString('ru-RU')}</p>
              </Card>
              <Card className="p-4 bg-white/5 border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Calendar" size={24} className="text-purple-400" />
                  <h3 className="text-white font-semibold">Дата</h3>
                </div>
                <p className="text-white/70">{currentTime.toLocaleDateString('ru-RU')}</p>
              </Card>
              <Card className="p-4 bg-white/5 border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Snowflake" size={24} className="text-cyan-400" />
                  <h3 className="text-white font-semibold">Температура</h3>
                </div>
                <p className="text-white/70 text-xl">-15°C</p>
              </Card>
              <Card className="p-4 bg-white/5 border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Cpu" size={24} className="text-green-400" />
                  <h3 className="text-white font-semibold">Система</h3>
                </div>
                <p className="text-white/70 text-sm">Активна</p>
              </Card>
            </div>
          </div>
        );

      case 'apps':
        return (
          <div className="p-6 h-full overflow-auto">
            <h2 className="text-xl font-bold text-white mb-4">Все приложения</h2>
            <div className="grid grid-cols-3 gap-4">
              {apps.map(app => (
                <button
                  key={app.id}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center`}>
                    <Icon name={app.icon as any} size={32} className="text-white" />
                  </div>
                  <span className="text-white/90 text-sm">{app.name}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'files':
        return (
          <div className="p-6 h-full overflow-auto">
            <h2 className="text-xl font-bold text-white mb-4">Файловый менеджер</h2>
            <div className="space-y-2">
              {files.map(file => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <Icon name={file.icon as any} size={24} className={file.type === 'folder' ? 'text-blue-400' : 'text-white/70'} />
                  <span className="text-white/90">{file.name}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="p-6 h-full overflow-auto">
            <h2 className="text-xl font-bold text-white mb-4">Параметры системы</h2>
            <div className="space-y-4">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Icon name="Volume2" size={24} className="text-white/70" />
                  <span className="text-white/90">Звук</span>
                </div>
                <div className={`w-12 h-6 rounded-full transition-all ${soundEnabled ? 'bg-blue-500' : 'bg-white/20'}`}>
                  <div className={`w-5 h-5 mt-0.5 rounded-full bg-white transition-all ${soundEnabled ? 'ml-6' : 'ml-0.5'}`} />
                </div>
              </button>
              
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className="w-full flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Icon name="Bell" size={24} className="text-white/70" />
                  <span className="text-white/90">Уведомления</span>
                </div>
                <div className={`w-12 h-6 rounded-full transition-all ${notificationsEnabled ? 'bg-blue-500' : 'bg-white/20'}`}>
                  <div className={`w-5 h-5 mt-0.5 rounded-full bg-white transition-all ${notificationsEnabled ? 'ml-6' : 'ml-0.5'}`} />
                </div>
              </button>

              <div className="p-4 rounded-lg bg-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="Sun" size={24} className="text-white/70" />
                  <span className="text-white/90">Яркость</span>
                  <span className="ml-auto text-white/60">{brightness[0]}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={brightness[0]}
                  onChange={(e) => setBrightness([parseInt(e.target.value)])}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="p-6 h-full overflow-auto">
            <h2 className="text-xl font-bold text-white mb-4">Информация о системе</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-white/5">
                <p className="text-white/60 text-sm mb-1">Операционная система</p>
                <p className="text-white/90 font-semibold">Cold-OS v1.0</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <p className="text-white/60 text-sm mb-1">Процессор</p>
                <p className="text-white/90">Ice-Core 8x 3.5 GHz</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <p className="text-white/60 text-sm mb-1">Память</p>
                <p className="text-white/90">16 GB Frozen RAM</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5">
                <p className="text-white/60 text-sm mb-1">Хранилище</p>
                <p className="text-white/90">512 GB Crystal SSD</p>
              </div>
            </div>
          </div>
        );

      case 'wallpaper':
        return (
          <div className="p-6 h-full overflow-auto">
            <h2 className="text-xl font-bold text-white mb-4">Выбор обоев</h2>
            <div className="grid grid-cols-2 gap-4">
              {wallpapers.map(wp => (
                <button
                  key={wp.id}
                  onClick={() => setCurrentWallpaper(wp.id)}
                  className={`relative h-32 rounded-xl bg-gradient-to-br ${wp.gradient} overflow-hidden transition-all ${
                    currentWallpaper === wp.id ? 'ring-4 ring-white/50' : 'hover:scale-105'
                  }`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    {currentWallpaper === wp.id && (
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <Icon name="Check" size={20} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-sm font-medium">{wp.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden bg-gradient-to-br ${wallpapers[currentWallpaper].gradient} transition-all duration-500`}>
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
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
              style={{ zIndex: window.zIndex }}
              onClick={() => focusWindow(window.id)}
            >
              <div className="h-12 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeWindow(window.id);
                      }}
                      className="w-3 h-3 rounded-full bg-red-400/80 hover:bg-red-500 transition-colors"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        minimizeWindow(window.id);
                      }}
                      className="w-3 h-3 rounded-full bg-yellow-400/80 hover:bg-yellow-500 transition-colors"
                    />
                    <button className="w-3 h-3 rounded-full bg-green-400/80 hover:bg-green-500 transition-colors" />
                  </div>
                  <span className="text-white/90 text-sm font-medium">{window.title}</span>
                </div>
              </div>
              <div className="h-[calc(100%-48px)]">
                {renderWindowContent(window)}
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