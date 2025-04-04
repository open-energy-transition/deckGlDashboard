import { regionalGeneratorTypes } from "@/utilities/GenerationMixChartConfig";

interface RegionalLegendProps {
  generatorType: keyof typeof regionalGeneratorTypes;
  parameterType: string;
}

const RegionalLegend = ({ generatorType, parameterType }: RegionalLegendProps) => {
  const [r, g, b] = regionalGeneratorTypes[generatorType];
  const steps = 5;
  const legendItems = Array.from({ length: steps }, (_, i) => {
    const value = (i * 100) / (steps - 1);
    const alpha = Math.floor((value * 155) / 100 + 100);
    return {
      color: `rgba(${r}, ${g}, ${b}, ${alpha / 255})`,
      value: value.toFixed(0)
    };
  });

  return (
    <div className="mt-4 p-2 bg-primary rounded-lg">
      <div className="text-sm font-medium mb-2">
        {parameterType === 'cf' ? 'Capacity Factor' : parameterType} (%)
      </div>
      <div className="flex justify-between items-center h-8">
        {legendItems.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className="w-8 h-4 rounded"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs mt-1">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegionalLegend;
