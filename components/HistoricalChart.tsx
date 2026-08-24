import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HistoricalDataPoint, Language } from '../types';
import { BarChart3 } from 'lucide-react';

interface HistoricalChartProps {
  data: HistoricalDataPoint[];
  lang: Language;
}

const HistoricalChart: React.FC<HistoricalChartProps> = ({ data, lang }) => {
  const monthsRw = ['Mut', 'Gas', 'Wer', 'Mata', 'Gic', 'Kam', 'Nyak', 'Kan', 'Nze', 'Uku', 'Ugu', 'Uku2'];
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const formattedData = data.map((d) => {
    const date = new Date(d.date);
    const m = lang === 'rw' ? monthsRw[date.getMonth()] : monthsEn[date.getMonth()];
    return {
      ...d,
      dateFormatted: `${date.getDate()} ${m}`
    };
  });

  return (
    <div className="bg-slate-900/85 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 pb-3 border-b border-slate-700/60">
        <div>
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-sky-400" />
            <span>{lang === 'rw' ? 'Ihindagurika ry\'Ikirere n\'Ububobere (Iminsi 30 Ishize)' : '30-Day Agrometeorological Climate History'}</span>
          </h3>
          <p className="text-xs text-slate-400">
            {lang === 'rw' ? 'Isesengura ry\'ubushyuhe, imvura yaguye, n\'ububobere bw\'ubutaka' : 'Temperature, cumulative rainfall, and soil moisture variations'}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-sky-400">
            <span className="w-3 h-1 bg-sky-400 rounded-full inline-block" />
            {lang === 'rw' ? 'Ubushyuhe (°C)' : 'Temp (°C)'}
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-3 h-1 bg-emerald-400 rounded-full inline-block" />
            {lang === 'rw' ? 'Imvura (mm)' : 'Rain (mm)'}
          </span>
          <span className="flex items-center gap-1.5 text-indigo-400">
            <span className="w-3 h-1 bg-indigo-400 rounded-full inline-block" />
            {lang === 'rw' ? 'Ububobere (%)' : 'Moisture (%)'}
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="dateFormatted"
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              interval={4}
            />
            <YAxis
              yAxisId="left"
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                border: '1px solid #334155',
                borderRadius: '12px',
                color: '#F8FAFC',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
              }}
              itemStyle={{ fontSize: '12px', padding: '2px 0' }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="temp"
              stroke="#38BDF8"
              strokeWidth={3}
              dot={false}
              name={lang === 'rw' ? 'Ubushyuhe (°C)' : 'Temp (°C)'}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="rainfall"
              stroke="#34D399"
              strokeWidth={3}
              dot={false}
              name={lang === 'rw' ? 'Imvura (mm)' : 'Rain (mm)'}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="soilMoisture"
              stroke="#818CF8"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              name={lang === 'rw' ? 'Ububobere (%)' : 'Soil Moisture (%)'}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HistoricalChart;
