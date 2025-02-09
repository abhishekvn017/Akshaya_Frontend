import { Header } from '@/components/header/header';
import { Navbar } from '@/components/navbar/navbar';
import { AppShell, Burger, Group, Grid, Card, Breadcrumbs, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link } from 'react-router-dom';

const items = [
  { title: 'HomePage', href: '/homepage' },
  { title: 'Settings', href: '#' },
].map((item, index) => (
  <Link to={item.href} key={index}>
    {item.title}
  </Link>
));

export function Settings() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 275, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
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
        <Breadcrumbs ml={15}>{items}</Breadcrumbs>
        <h2>Settings</h2>
        <Grid justify="space-around" mt={"50px"}>
          <Grid.Col span={3.5}>
            <Link to="/powerplant" style={{ textDecoration: 'none' }}>
              <Card 
                shadow="sm" 
                ta={"center"} 
                h={"100%"} 
                padding="xl" 
                radius="md" 
                withBorder
                style={{ backgroundColor: '#e3f2fd' }} // Light blue
              >
                <Text fz="lg" fw={700} c="#0d47a1"> {/* Dark blue text */}
                  Power Plant
                </Text>
              </Card>
            </Link>
          </Grid.Col>

          <Grid.Col span={3.5}>
            <Link to="/units" style={{ textDecoration: 'none' }}>
              <Card 
                shadow="sm" 
                ta={"center"} 
                h={"100%"} 
                padding="xl" 
                radius="md" 
                withBorder
                style={{ backgroundColor: '#e3f2fd' }} // Light red/pink
              >
                <Text fz="lg" fw={700} c="#0d47a1"> {/* Dark red text */}
                  Units
                </Text>
              </Card>
            </Link>
          </Grid.Col>

          <Grid.Col span={3.5}>
            <Link to="/staff" style={{ textDecoration: 'none' }}>
              <Card 
                shadow="sm" 
                padding="xl" 
                ta={"center"} 
                h={"100%"} 
                radius="md" 
                withBorder
                style={{ backgroundColor: '#e3f2fd' }} // Light yellow
              >
                <Text fz="lg" fw={700} c="#0d47a1"> {/* Dark yellow text */}
                  Staff
                </Text>
              </Card>
            </Link>
          </Grid.Col>
        </Grid>
      </AppShell.Main>
    </AppShell>
  );
}