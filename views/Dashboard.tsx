import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Activity, Battery, Cpu, Wifi } from 'lucide-react';

const generateData = () => {
  return Array.from({ length: 15 }, (_, i) => ({
    name: `T-${15 - i}`,
    sys: Math.floor(Math.random() * 30) + 50,
    net: Math.floor(Math.random() * 40) + 30,
    ai: Math.floor(Math.random() * 50) + 20,
  }));
};

const radarData = [
  { subject: 'Compute', A: 120, fullMark: 150 },
  { subject: 'Memory', A: 98, fullMark: 150 },
  { subject: 'Storage', A: 86, fullMark: 150 },
  { subject: 'Network', A: 99, fullMark: 150 },
  { subject: 'Security', A: 85, fullMark: 150 },
  { subject: 'Logic', A: 65, fullMark: 150 },
];

export const Dashboard: React.FC = () => {
  const [data, setData] = useState(generateData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1), {
          name: 'Now',
          sys: Math.floor(Math.random() * 30) + 50,
          net: Math.floor(Math.random() * 40) + 30,
          ai: Math.floor(Math.random() * 50) + 20,
        }];
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 h-full overflow-y-auto">
      {/* Top Stats Row */}
      <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Cpu, label: "CPU Load", value: "34%", color: "text-neon-blue" },
          { icon: Activity, label: "AI Latency", value: "12ms", color: "text-neon-green" },
          { icon: Wifi, label: "Bandwidth", value: "2.4 GB/s", color: "text-neon-pink" },
          { icon: Battery, label: "Power", value: "OPTIMAL", color: "text-yellow-400" },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-4 rounded-xl flex items-center space-x-4 border-l-4 border-l-neon-blue hover:bg-white/5 transition-all">
            <stat.icon className={`w-8 h-8 ${stat.color}`} />
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
              <div className="text-2xl font-display font-bold">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="lg:col-span-2 glass-panel p-6 rounded-xl min-h-[300px]">
        <h3 className="text-xl font-display mb-4 text-neon-blue flex items-center gap-2">
          <Activity className="w-5 h-5" /> Real-time System Telemetry
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSys" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00f3ff" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#bc13fe" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#bc13fe" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #333' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="sys" stroke="#00f3ff" fillOpacity={1} fill="url(#colorSys)" />
              <Area type="monotone" dataKey="net" stroke="#bc13fe" fillOpacity={1} fill="url(#colorNet)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="glass-panel p-6 rounded-xl min-h-[300px]">
        <h3 className="text-xl font-display mb-4 text-neon-pink">System Efficiency</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#444" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#aaa', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
              <Radar name="Current" dataKey="A" stroke="#0aff68" strokeWidth={2} fill="#0aff68" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
