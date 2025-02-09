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
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import styles from './HomePage.module.css';
import { Link } from 'react-router-dom';
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import { dataPost, deleteData, fetchData } from './utils/crud';

const items = [
  { title: 'HomePage', href: '/homepage' },
  { title: 'Settings', href: '/settings' },
  { title: 'Power Plant', href: '#' },
].map((item, index) => (
  <Link to={item.href} key={index}>
    {item.title}
  </Link>
));

const ViewModal = ({ opened, onClose, data }) => (
  <Modal opened={opened} onClose={onClose} centered>
    <div style={{ padding: '20px' }}>
      <div>
        <strong>Plant Name:</strong> {data.name}
      </div>
      <div>
        <strong>Location:</strong> {data.location}
      </div>
      <div>
        <strong>Capacity:</strong> {data.capacity}
      </div>
      <div>
        <strong>Energy Type:</strong> {data.type_of_energy}
      </div>
    </div>
  </Modal>
);

const EditModal = ({ opened, onClose, data, onUpdate, setEditData }) => (
  <Modal opened={opened} onClose={onClose} centered>
    <div className={styles.gridContainer}>
      <TextInput
        label="Plant Name"
        placeholder="Name"
        value={data.name}
        onChange={(event) => setEditData(prev => ({ ...prev, name: event.target.value }))}
        mb="sm"
      />

      <TextInput
        label="Capacity"
        type="number"
        placeholder="Capacity"
        value={data.capacity}
        onChange={(event) => setEditData(prev => ({ ...prev, capacity: event.target.value }))}
        mb="sm"
      />

      <Select
        label="Location"
        placeholder="Select Location"
        data={[
          { value: 'location1', label: 'Location 1' },
          { value: 'location2', label: 'Location 2' },
          { value: 'location3', label: 'Location 3' },
        ]}
        value={data.location}
        onChange={(value) => setEditData(prev => ({ ...prev, location: value }))}
        mb="sm"
      />

      <Select
        label="Type of Energy"
        placeholder="Select Type of Energy"
        data={[
          { value: 'solar', label: 'Solar' },
          { value: 'wind', label: 'Wind' },
          { value: 'hydro', label: 'Hydro' },
        ]}
        value={data.type_of_energy}
        onChange={(value) => setEditData(prev => ({ ...prev, type_of_energy: value }))}
        mb="sm"
      />
      
      <Button onClick={onUpdate} style={{ display: 'block', margin: '20px auto' }}>
        Update
      </Button>
    </div>
  </Modal>
);

export function PowerPlant() {
  const [opened, { toggle }] = useDisclosure();
  const [modalOpened, { open, close }] = useDisclosure(false);
  const [viewModalOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [editModalOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [selectedData, setSelectedData] = useState({});
  const [editData, setEditData] = useState({
    plant_id: '',
    name: '',
    location: '',
    capacity: '',
    type_of_energy: ''
  });

  const [plantName, setPlantName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [energyType, setEnergyType] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [powerplantData, setPowerPlantData] = useState([]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('jwt');
      const endpoint = 'api/powerplants/';
      const body = {
        name: plantName,
        location: location,
        capacity: capacity,
        type_of_energy: energyType,
      };

      await dataPost(endpoint, 'POST', body, token);
      await fetchPowerPlantData();
      setPlantName('');
      setLocation('');
      setCapacity('');
      setEnergyType('');
      close();
    } catch (error) {
      console.error('Failed to post data:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (data) => {
    setSelectedData(data);
    openView();
  };

  const handleEdit = (data) => {
    setEditData({
      plant_id: data.plant_id,
      name: data.name,
      location: data.location,
      capacity: data.capacity,
      type_of_energy: data.type_of_energy
    });
    openEdit();
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('jwt');
      const endpoint = `api/powerplants/${editData.plant_id}/`;
      const body = {
        name: editData.name,
        location: editData.location,
        capacity: editData.capacity,
        type_of_energy: editData.type_of_energy,
      };

      await dataPost(endpoint, 'PUT', body, token);
      await fetchPowerPlantData();
      closeEdit();
    } catch (error) {
      console.error('Failed to update data:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem('jwt');
    const endpoint = 'api/powerplants';
    deleteData(endpoint, id, token)
      .then(() => {
        alert('Data deleted successfully');
        fetchPowerPlantData();
      })
      .catch((error) => {
        console.error('Failed to delete data:', error);
      });
  };

  const fetchPowerPlantData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const endpoint = 'api/powerplants/';
      const data = await fetchData(endpoint, 'GET', null, token);
      setPowerPlantData(data);
    } catch (error) {
      console.error('Failed to fetch power plants:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPowerPlantData();
  }, []);

  const rows = powerplantData.map((element) => (
    <Table.Tr key={element.plant_id}>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.location}</Table.Td>
      <Table.Td>{element.capacity}</Table.Td>
      <Table.Td>{element.type_of_energy}</Table.Td>
      <Table.Td>
        <Group spacing="xs">
          <IconEye
            size={20}
            onClick={() => handleView(element)}
            style={{ cursor: 'pointer' }}
          />
          <IconEdit
            size={20}
            onClick={() => handleEdit(element)}
            style={{ cursor: 'pointer' }}
          />
          <IconTrash
            size={20}
            onClick={() => handleDelete(element.plant_id)}
            style={{ cursor: 'pointer' }}
          />
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
        <div className={styles.unitHeader}>
          <h2>Power Plant</h2>

          <Modal
            opened={modalOpened}
            onClose={close}
            overlayProps={{
              backgroundOpacity: 0.55,
              blur: 3,
            }}
            centered
          >
            <div className={styles.gridContainer}>
              <TextInput
                label="Plant Name"
                placeholder="Name"
                value={plantName}
                onChange={(event) => setPlantName(event.currentTarget.value)}
                mb="sm"
              />

              <TextInput
                label="Capacity"
                type="number"
                placeholder="Capacity"
                value={capacity}
                onChange={(event) => setCapacity(event.currentTarget.value)}
                mb="sm"
              />

              <Select
                label="Location"
                placeholder="Select Location"
                data={[
                  { value: 'location1', label: 'Location 1' },
                  { value: 'location2', label: 'Location 2' },
                  { value: 'location3', label: 'Location 3' },
                ]}
                value={location}
                onChange={setLocation}
                mb="sm"
              />

              <Select
                label="Type of Energy"
                placeholder="Select Type of Energy"
                data={[
                  { value: 'solar', label: 'Solar' },
                  { value: 'wind', label: 'Wind' },
                  { value: 'hydro', label: 'Hydro' },
                ]}
                value={energyType}
                onChange={setEnergyType}
                mb="sm"
              />
            </div>

            <div className={styles.buttonContainer}>
              <Button className={styles.addButtonModal} onClick={handleSubmit}>
                Add
              </Button>
            </div>
          </Modal>

          <button
            className={styles.addButton}
            onClick={open}
            style={{ backgroundColor: 'green', color: 'white' }}
          >
            Add Plant
          </button>
        </div>
        <Table stickyHeader stickyHeaderOffset={60}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Plant Name</Table.Th>
              <Table.Th>Location</Table.Th>
              <Table.Th>Capacity</Table.Th>
              <Table.Th>Type of Energy</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>

        <ViewModal opened={viewModalOpened} onClose={closeView} data={selectedData} />
        <EditModal
          opened={editModalOpened}
          onClose={closeEdit}
          data={editData}
          onUpdate={handleUpdate}
          setEditData={setEditData}
        />
      </AppShell.Main>
    </AppShell>
  );
}