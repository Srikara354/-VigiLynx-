import { motion } from 'framer-motion';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function AnalysisResult({ result }) {
  const insightsText = result.geminiInsights || '';

  // Robust parsing aligned with backend's geminiInsights format
  const sections = {
    title: result.input || 'Unknown Input',
    threats: insightsText.match(/Threats & Vulnerabilities:\*\*([\s\S]*?)(?=\*\*|$)/i)?.[1]?.trim().split('\n').map(line => line.replace(/^\*\s*|-|\s*\*/g, '').trim()).filter(line => line.length > 0) || ['No specific threats detected'],
    reputation: insightsText.match(/Reputation:\*\*([\s\S]*?)(?=\*\*|$)/i)?.[1]?.trim().split('\n').map(line => line.replace(/^\*\s*|-|\s*\*/g, '').trim()).filter(line => line.length > 0) || ['No data available'],
    context: insightsText.match(/Context:\*\*([\s\S]*?)(?=\*\*|$)/i)?.[1]?.trim().split('\n').map(line => line.replace(/^\*\s*|-|\s*\*/g, '').trim()).filter(line => line.length > 0) || ['No data available'],
    safetyTips: (() => {
      // Updated regex to match the entire "Safety Tips" section
      const match = insightsText.match(/Safety Tips:\*\*([\s\S]*?)(?=\n\*\*|$)/i);
      console.log('Safety Tips Match:', match);
      if (match && match[1]) {
        const tips = match[1]
          .trim()
          .split('\n') // Split into lines
          .map(line => line.replace(/^\d+\.\s*|\*\s*|-|\s*\*/g, '').trim()) // Clean up each line
          .filter(line => line.length > 0 && !line.match(/^\s*$/)); // Remove empty lines
        console.log('Parsed Safety Tips:', tips);
        return tips.length > 0 ? tips : ['No specific tips available'];
      }
      return ['No specific tips available'];
    })(),
    pieChart: insightsText.match(/```json\s*([\s\S]*?)\s*```/) ? JSON.parse(insightsText.match(/```json\s*([\s\S]*?)\s*```/)[1].replace(/\s/g, '')) : {
      Safe: Math.round(((result.vtStats?.harmless || 0) + (result.vtStats?.undetected || 0)) / ((result.vtStats?.harmless || 0) + (result.vtStats?.undetected || 0) + (result.vtStats?.malicious || 0) + (result.vtStats?.suspicious || 0) + (result.vtStats?.timeout || 0)) * 100),
      Malicious: result.vtStats?.malicious || 0,
      Suspicious: result.vtStats?.suspicious || 0
    },
  };

  const chartData = {
    labels: ['Safe', 'Malicious', 'Suspicious'],
    datasets: [
      {
        data: result.safetyScore === 0
          ? [100, 0, 0] // If safetyScore is 0, show 100% Safe
          : [result.vtStats.harmless + result.vtStats.undetected, result.vtStats.malicious, result.vtStats.suspicious], // Otherwise, use actual data
        backgroundColor: ['#00c4b4', '#ff6384', '#ffcd56'],
        borderColor: ['#00c4b4', '#ff6384', '#ffcd56'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8 w-full"
    >
      <div className="card bg-[#000000] p-8 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div className="highlight-box p-6 border-l-4 border-[#ffffff] bg-[#666666] rounded-md">
            <p>
              <strong className="text-[#ffffff] animated-text">Status:</strong>{' '}
              <span className={result.isSafe ? 'text-[#00c4b4]' : 'text-[#ef4444]'}>
                {result.isSafe ? 'Safe' : 'Unsafe'}
              </span>
            </p>
            <p className="mt-2">
              <strong className="text-[#ffffff] animated-text">Safety Score:</strong>{' '}
            <span className="text-[#00c4b4]">
  {result.safetyScore === 0 ? 100 : result.safetyScore}/100
</span>
            </p>
            {result.vtStats && (
              <p className="text-sm text-[#cccccc] mt-2 animated-text">
                Malicious: {result.vtStats.malicious || 0} | Suspicious: {result.vtStats.suspicious || 0} | Harmless: {result.vtStats.harmless || 0} | Undetected: {result.vtStats.undetected || 0}
              </p>
            )}
            {result.vtFullData?.threat_names?.length > 0 && (
              <p className="mt-2 text-sm text-[#cccccc] animated-text">
                <strong>Threats:</strong> {result.vtFullData.threat_names.join(', ')}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center">
            <div style={{ width: '200px', height: '200px' }}>
            <Pie
  data={chartData}
  options={{
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: { font: { size: 12 }, color: '#ffffff', padding: 10 },
      },
      tooltip: {
        backgroundColor: '#e5e7eb',
        titleFont: { size: 12 },
        bodyFont: { size: 10 },
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          },
        },
      },
    },
  }}
/>
            </div>
          </div>
          <div className="output-box p-6 bg-[#666666] rounded-md">
            <h3 className="text-lg font-semibold text-[#ffffff] animated-text">Threats & Vulnerabilities</h3>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-sm text-[#cccccc]">
              {sections.threats.map((threat, idx) => <li key={idx} className="animated-text">{threat}</li>)}
            </ul>
          </div>
          <div className="output-box p-6 bg-[#666666] rounded-md">
            <h3 className="text-lg font-semibold text-[#ffffff] animated-text">Reputation</h3>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-sm text-[#cccccc]">
              {sections.reputation.map((rep, idx) => <li key={idx} className="animated-text">{rep}</li>)}
            </ul>
          </div>
          <div className="output-box p-6 bg-[#666666] rounded-md">
            <h3 className="text-lg font-semibold text-[#ffffff] animated-text">Context</h3>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-sm text-[#cccccc]">
              {sections.context.map((ctx, idx) => <li key={idx} className="animated-text">{ctx}</li>)}
            </ul>
          </div>
          <div className="output-box p-6 bg-[#666666] rounded-md">
            <h3 className="text-lg font-semibold text-[#ffffff] animated-text">Safety Tips</h3>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-sm text-[#cccccc]">
              {sections.safetyTips.map((tip, idx) => <li key={idx} className="animated-text">{tip}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default AnalysisResult;