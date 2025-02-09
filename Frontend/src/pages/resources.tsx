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
  Select,
  Grid,
  Stack,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { dataPost, deleteData, fetchData } from './utils/crud';

const items = [
  { title: 'HomePage', href: '/homepage' },
  { title: 'Resources', href: '#' },
].map((item, index) => (
  <Link to={item.href} key={index}>
    {item.title}
  </Link>
));

interface Resource {
  id: number;
  name: string;
  type: string;
  quantity: number;
}

export function Resource() {
  const [opened, { toggle }] = useDisclosure();
  const [modalOpened, { open, close }] = useDisclosure(false);
  const [editModalOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [resourceName, setResourceName] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [resourceData, setResourceData] = useState<Resource[]>([]);

  const handleSubmit = async (isEdit: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('jwt');
      const endpoint = isEdit ? `api/resources/${editId}/` : 'api/resources/';
      const method = isEdit ? 'PUT' : 'POST';
      
      // Convert quantity to positive number
      const quantityValue = Math.abs(Number(quantity));
      
      const body = { 
        name: resourceName, 
        type, 
        quantity: quantityValue 
      };
      
      await dataPost(endpoint, method, body, token);
      await fetchResourceData();
      
      setResourceName('');
      setType('');
      setQuantity('');
      setEditId(null);
      
      isEdit ? closeEdit() : close();
    } catch (error: any) {
      console.error('Failed to post data:', error);
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchResourceData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const data = await fetchData('api/resources/', 'GET', null, token);
      setResourceData(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Failed to fetch resources:', error);
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResourceData();
  }, []);

  const handleEdit = (resource: Resource) => {
    setResourceName(resource.name);
    setType(resource.type);
    setQuantity(resource.quantity.toString());
    setEditId(resource.id);
    openEdit();
  };

  const handleDelete = (id: number) => {
    const token = localStorage.getItem('jwt');
    deleteData('api/resources', id, token)
      .then(() => {
        alert('Data deleted successfully');
        fetchResourceData();
      })
      .catch((error: any) => {
        console.error('Failed to delete resource:', error);
        setError(error.message || 'An error occurred');
      });
  };

  const rows = resourceData.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.type}</Table.Td>
      <Table.Td>{element.quantity}</Table.Td>
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
          <h2>Resource</h2>
          <Button onClick={open} color="blue">Add Resource</Button>
        </Group>

        <Modal opened={modalOpened} onClose={close} centered>
          <Stack p="md">
            <Grid>
              <Grid.Col span={12}>
                <Select
                  label="Resource Name"
                  placeholder="Select Resource name"
                  data={['Solar Panels', 'Wind Turbines', 'Hydro Turbines','Geothermal Systems','Batteries']}
                  value={resourceName}
                  onChange={(value) => setResourceName(value)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Select
                  label="Type"
                  placeholder="Select Type"
                  data={['Energy', 'Storage', 'Operational','Environmental','Technological']}
                  value={type}
                  onChange={(value) => setType(value)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Quantity"
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.currentTarget.value)}
                  min="0"
                />
              </Grid.Col>
            </Grid>
            <Button onClick={() => handleSubmit(false)}>Add Resource</Button>
          </Stack>
        </Modal>

        <Modal opened={editModalOpened} onClose={closeEdit} centered title="Edit Resource">
          <Stack p="md">
            <Grid>
              <Grid.Col span={12}>
                <Select
                  label="Resource Name"
                  placeholder="Select Resource name"
                  data={['Solar Panels', 'Wind Turbines', 'Hydro Turbines','Geothermal Systems','Batteries']}
                  value={resourceName}
                  onChange={(value) => setResourceName(value)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Select
                  label="Type"
                  placeholder="Select Type"
                  data={['Energy', 'Storage', 'Operational','Environmental','Technological']}
                  value={type}
                  onChange={(value) => setType(value)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Quantity"
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.currentTarget.value)}
                  min="0"
                />
              </Grid.Col>
            </Grid>
            <Button onClick={() => handleSubmit(true)}>Update Resource</Button>
          </Stack>
        </Modal>

        <Table stickyHeader stickyHeaderOffset={60}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Quantity</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </AppShell.Main>
    </AppShell>
  );
}