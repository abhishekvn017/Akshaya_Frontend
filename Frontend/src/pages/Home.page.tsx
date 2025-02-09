
import { Header } from '@/components/header/header';
import { AppShell, Burger, Group, LoadingOverlay, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { BarChart } from '@mantine/charts';
import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar/navbar';

interface EnergyData {
  date: string;
  Solar: number;
  Wind: number;
  Hydro: number;
  Biomass: number;
  Nuclear: number;
  Gas: number;
}

export function HomePage() {
  const [opened, { toggle }] = useDisclosure();
  const [liveData, setLiveData] = useState<EnergyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const processDataPoint = (entry: any): EnergyData => {
    const date = new Date(entry.from).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      date,
      Solar: 4.9,
      Wind: entry.generationmix.find((f: any) => f.fuel === 'wind')?.perc || 0,
      Hydro: 1.8,
      Biomass: entry.generationmix.find((f: any) => f.fuel === 'biomass')?.perc || 0,
      Nuclear: entry.generationmix.find((f: any) => f.fuel === 'nuclear')?.perc || 0,
      Gas: entry.generationmix.find((f: any) => f.fuel === 'gas')?.perc || 0,
    };
  };

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const response = await fetch('https://api.carbonintensity.org.uk/generation');
        if (!response.ok) throw new Error('Failed to fetch live data');
        const data = await response.json();
        const newDataPoint = processDataPoint(data.data);
        setLiveData((prev) => [...prev, newDataPoint].slice(-5));
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch live data');
        setLoading(false);
      }
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppShell header={{ height: 60 }} navbar={{ width: 275, breakpoint: 'sm', collapsed: { mobile: !opened } }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Header />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p={'sm'}>
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>
        <h2>Renewable Energy  Data (Live)</h2>
        <Group justify="center" mb="md" gap="lg">
          <Text c="#FFD700" fw={500}>Solar</Text>
          <Text c="#87CEEB" fw={500}>Wind</Text>
          <Text c="#228B22" fw={500}>Hydro</Text>
          <Text c="#A0522D" fw={500}>Biomass</Text>
          <Text c="#EE82EE" fw={500}>Nuclear</Text>
          <Text c="#FF6347" fw={500}>Gas</Text>
        </Group>
        {error ? (
          <Text color="red">{error}</Text>
        ) : (
          <div style={{ position: 'relative' }}>
            <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
            {liveData.length > 0 ? (
              <BarChart
                h={550}
                w={1150}
                data={liveData}
                dataKey="date"
                series={[
                  { name: 'Solar', color: '#FFD700', label: 'Solar Energy' },
                  { name: 'Wind', color: '#87CEEB', label: 'Wind Power' },
                  { name: 'Hydro', color: '#228B22', label: 'Hydroelectric' },
                  { name: 'Biomass', color: '#A0522D', label: 'Biomass' },
                  { name: 'Nuclear', color: '#EE82EE', label: 'Nuclear' },
                  { name: 'Gas', color: '#FF6347', label: 'Natural Gas' },
                ]}
                
                withLabels
                labelOrientation="vertical"
                withXAxis={true}
                gridAxis="x"
                xAxisLabel="Time (HH:MM)"
                yAxisLabel="Generation Mix (%)"
                legendProps={{
                  vertical: 'bottom',
                  height: 50,
                  marginTop: 20,
                  style: { justifyContent: 'center' } 
                }}
                tooltipAnimationDuration={200}
                tickLine="xy"
              />
            ) : (
              <Text>No data available</Text>
            )}
          </div>
        )}
      </AppShell.Main>
    </AppShell>
  );
}