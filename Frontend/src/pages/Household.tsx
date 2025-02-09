import { Header } from '@/components/header/header';
import { Navbar } from '@/components/navbar/navbar';
import {
  AppShell,
  Breadcrumbs,
  Burger,
  Button,
  Group,
  Modal,
  Table,
  TextInput,
  Grid,
  Stack,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { dataPost, deleteData, fetchData } from './utils/crud';
import * as XLSX from 'xlsx';

const items = [
  { title: 'HomePage', href: '/homepage' },
  { title: 'Households', href: '#' },
].map((item, index) => (
  <Link to={item.href} key={index}>
    {item.title}
  </Link>
));

export function Household() {
  const [opened, { toggle }] = useDisclosure();
  const [modalOpened, { open, close }] = useDisclosure(false);
  const [editModalOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [name, setName] = useState('');
  const [energyConsumption, setEnergyConsumption] = useState('');
  const [solarGeneration, setSolarGeneration] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [householdData, setHouseholdData] = useState([]);

  const handleSubmit = async (isEdit = false) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('jwt');
      const endpoint = isEdit ? `api/households/${editId}/` : 'api/households/';
      const method = isEdit ? 'PUT' : 'POST';
      
      const body = {
        name,
        energy_consumption: parseFloat(energyConsumption),
        solar_generation: parseFloat(solarGeneration),
        address,
        city,
      };

      await dataPost(endpoint, method, body, token);
      await fetchHouseholdData();
      
      setName('');
      setEnergyConsumption('');
      setSolarGeneration('');
      setAddress('');
      setCity('');
      setEditId(null);
      
      isEdit ? closeEdit() : close();
    } catch (error) {
      console.error('Failed to post data:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHouseholdData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const data = await fetchData('api/households/', 'GET', null, token);
      setHouseholdData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch households:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHouseholdData();
  }, []);

  const handleEdit = (household) => {
    setName(household.name);
    setEnergyConsumption(household.energy_consumption.toString());
    setSolarGeneration(household.solar_generation.toString());
    setAddress(household.address);
    setCity(household.city);
    setEditId(household.id);
    openEdit();
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem('jwt');
    deleteData('api/households', id, token)
      .then(() => {
        alert('Data deleted successfully');
        fetchHouseholdData();
      })
      .catch(console.error);
  };

  const handleGenerateSpreadsheet = () => {
    const worksheetData = householdData.map((household) => ({
      Name: household.name,
      'Solar Generation (kWh)': household.solar_generation,
      'Energy Consumption (kWh)': household.energy_consumption,
      Address: household.address,
      City: household.city,
      'Created At': new Date(household.created_at).toLocaleDateString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Households');
    XLSX.writeFile(workbook, 'households.xlsx');
  };

  const rows = householdData.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.solar_generation}kWh</Table.Td>
      <Table.Td>{element.energy_consumption}kWh</Table.Td>
      <Table.Td>{element.address}</Table.Td>
      <Table.Td>{element.city}</Table.Td>
      <Table.Td>{new Date(element.created_at).toLocaleDateString()}</Table.Td>
      <Table.Td>
        <Group gap="xs">
          <IconEdit size={20} onClick={() => handleEdit(element)} style={{ cursor: 'pointer' }} />
          <IconTrash size={20} onClick={() => handleDelete(element.id)} style={{ cursor: 'pointer' }} />
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

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

      <AppShell.Navbar p="sm">
        <Navbar />
      </AppShell.Navbar>

      <AppShell.Main>
        <Breadcrumbs ml={15}>{items}</Breadcrumbs>
        
        <Group justify="space-between" align="center" p="md">
          <h2>Households</h2>
          <Group gap="lg">
            <Button onClick={open} color="blue">Add Household</Button>
            <Button onClick={handleGenerateSpreadsheet} color="green">Generate Spreadsheet</Button>
          </Group>
        </Group>

        <Modal opened={modalOpened} onClose={close} centered>
          <Stack p="md">
            <Grid>
              <Grid.Col span={12}>
                <TextInput
                  label="Household Name"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Solar Generation (kWh)"
                  type="number"
                  placeholder="Enter generation"
                  value={solarGeneration}
                  onChange={(e) => setSolarGeneration(e.currentTarget.value)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Energy Consumption (kWh)"
                  type="number"
                  placeholder="Enter consumption"
                  value={energyConsumption}
                  onChange={(e) => setEnergyConsumption(e.currentTarget.value)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Address"
                  placeholder="Enter address"
                  value={address}
                  onChange={(e) => setAddress(e.currentTarget.value)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="City"
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) => setCity(e.currentTarget.value)}
                />
              </Grid.Col>
            </Grid>
            <Button onClick={() => handleSubmit(false)}>Add Household</Button>
          </Stack>
        </Modal>

        <Modal opened={editModalOpened} onClose={closeEdit} centered title="Edit Household">
          <Stack p="md">
            <Grid>
              <Grid.Col span={12}>
                <TextInput
                  label="Household Name"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Solar Generation (kWh)"
                  type="number"
                  placeholder="Enter generation"
                  value={solarGeneration}
                  onChange={(e) => setSolarGeneration(e.currentTarget.value)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Energy Consumption (kWh)"
                  type="number"
                  placeholder="Enter consumption"
                  value={energyConsumption}
                  onChange={(e) => setEnergyConsumption(e.currentTarget.value)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Address"
                  placeholder="Enter address"
                  value={address}
                  onChange={(e) => setAddress(e.currentTarget.value)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="City"
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) => setCity(e.currentTarget.value)}
                />
              </Grid.Col>
            </Grid>
            <Button onClick={() => handleSubmit(true)}>Update Household</Button>
          </Stack>
        </Modal>

        <Table stickyHeader stickyHeaderOffset={60}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Solar Generation</Table.Th>
              <Table.Th>Energy Consumption</Table.Th>
              <Table.Th>Address</Table.Th>
              <Table.Th>City</Table.Th>
              <Table.Th>Created At</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </AppShell.Main>
    </AppShell>
  );
}