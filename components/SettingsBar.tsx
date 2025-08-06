'use client'
import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';


interface SettingsInterface {
  ne: boolean;  // notification email
  nt: string;   // notification time
  ae: boolean;  // automation enable
  at: string;   // automation time
}

function SettingsBar({ setShowSettings }: { setShowSettings: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [dynamicWidth, setDynamicWidth] = useState('0px');
  const [timezone, setTimezone]=useState('UTC')
  const router = useRouter();
  const [settings, setSettings] = useState<SettingsInterface>({
    ne: false,
    nt: '08:00',
    ae: false,
    at: '12:00'
  });

  useEffect(() => {
    const calculateWidth = () => {
      const screenWidth = window.innerWidth;
      const mdBreakpoint = 768;
      let newWidth;
      if (screenWidth < mdBreakpoint) {
        newWidth = '100%';
      } else if (screenWidth < 1200) {
        newWidth = '300px';
      } else {
        const calculatedPx = (screenWidth - 1200) / 2.05;
        newWidth = calculatedPx < 300 ? '300px' : `${Math.max(0, calculatedPx)}px`;
      }
      setDynamicWidth(newWidth);
    };

    calculateWidth();
    window.addEventListener('resize', calculateWidth);
    return () => {
      window.removeEventListener('resize', calculateWidth);
    };

  }, []);

const updateSettings = async () => {
  try {
    const res = await fetch('api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...settings, timezone }),
    });
    if (!res.ok) console.log('Update Settings Failed');
  } catch (error) {
    console.log('Error Updating Settings', error);
  }
}

const fetchSettings = async () => {
  try {
    const res = await fetch('api/settings');
    if (!res.ok) console.log('Fetch Settings Failed');
    const data = await res.json();
    setSettings({
      ne: data.ne ?? false,
      nt: data.nt ?? '08:00',
      ae: data.ae ?? false,
      at: data.at ?? '12:00',
    });
    setTimezone(data.timezone ?? 'UTC');
  } catch (error) {
    console.log('Error Fetching Settings', error);
  }
};
  useEffect(()=>{
    fetchSettings()
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(tz);
  },[])




  const logOutHandler = async () => {
    try {
      const res = await fetch('auth/log-out');
      if (!res.ok) throw new Error('Log Out Failed');
      setShowSettings(false);
      router.push('/auth/magic-link');
    } catch (error) {
      console.log(error);
      toast.error('Failed to Log Out');
    }
  };

  return (
    <div
      className="min-h-[94vh] pt-5 pb-35 px-6 bg-cyan-900 text-gray-50 flex flex-col items-start justify-start gap-10"
      style={{ width: dynamicWidth }}
    >
      <div className="w-full flex items-center justify-start">
        <div className="flex items-center gap-2">
          <button
            onClick={logOutHandler}
            className="p-2 cursor-pointer rounded-full bg-amber-600 shadow-md shadow-cyan-400 hover:scale-110 hover:bg-red-600 duration-500"
          >
            <LogOut className="hover:rotate-180 duration-300" />
          </button>
          Log out
        </div>
      </div>

      {/* Notification Email Settings */}
      <div>
        <h1 className="font-semibold">Notification Settings</h1>
        <div className="flex items-center justify-between w-50 mt-5">
          <div>Email Summary</div>
          <button
            onClick={() => setSettings(prev => ({ ...prev, ne: !prev.ne }))}
            className={`relative cursor-pointer w-8 h-4 rounded-full transition-colors duration-300 ${
              settings.ne ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white shadow-md transition-transform duration-300 ${
                settings.ne ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        <div>
          <label className="block mt-2 text-sm">Preferred Time</label>
          <input
            value={settings.nt}
            onChange={e => setSettings(prev => ({ ...prev, nt: e.target.value }))}
            type="time"
            className="h-10 w-55 border-2 p-2 border-amber-600 rounded-md bg-cyan-950 text-white"
          />
        </div>
      </div>

      {/* Automation Settings */}
      <div>
        <h1 className="font-semibold">Automate Task Cleaning Settings</h1>
        <div className="flex items-center justify-between w-50 mt-5">
          <div>Delete Due Tasks</div>
          <button
            onClick={() => setSettings(prev => ({ ...prev, ae: !prev.ae }))}
            className={`relative cursor-pointer w-8 h-4 rounded-full transition-colors duration-300 ${
              settings.ae ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white shadow-md transition-transform duration-300 ${
                settings.ae ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        <div>
          <label className="block mt-2 text-sm">Preferred Time</label>
          <input
            value={settings.at}
            onChange={e => setSettings(prev => ({ ...prev, at: e.target.value }))}
            type="time"
             className="h-10 w-55 border-2 p-2 border-amber-600 rounded-md bg-cyan-950 text-white"
          />
        </div>
      </div>
      <button 
       onClick={updateSettings}
      className='px-4 py-2 bg-amber-600 rounded-md cursor-pointer hover:scale-105 duration-300'>
        Save
      </button>
    </div>
  );
}

export default SettingsBar;
