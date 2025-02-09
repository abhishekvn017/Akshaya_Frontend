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
  NativeSelect,
  Select,
  PasswordInput,
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
  { title: 'Staff', href: '#' },
].map((item, index) => (
  <Link to={item.href} key={index}>
    {item.title}
  </Link>
));

export function Staff() {
  const [opened, { toggle }] = useDisclosure();
  const [modalOpened, { open, close }] = useDisclosure(false);
  const [assignModalOpened, { open: openAssign, close: closeAssign }] = useDisclosure(false);


  const [staffName, setStaffName] = useState('');
  const [role, setRole] = useState('');
  const [contact, setContact] = useState('');
  const [assignUnits, setAssignUnits] = useState('');
  const [powerPlant, setPowerPlant] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [staffData, setStaffData] = useState([]);
  const [unitsData, setUnitsData] = useState([]);
  const [plantData, setPlantData] = useState([]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('jwt');
      const endpoint = 'users/';
      const body = {
        username: username,
        email: email,
        password: username,
        staff_name: staffName,
        role: role,
        staff_mob: contact,
        power_plant: powerPlant,
        unit: assignUnits,
      };

      console.log('Request body:', body);

      const data = await dataPost(endpoint, 'POST', body, token);
      console.log('Data posted successfully:', data);
      await fetchStaffData();
      close();
    } catch (error) {
      console.error('Failed to post data:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const endpoint = 'users/';
      const data = await fetchData(endpoint, 'GET', null, token);
      if (Array.isArray(data)) {
        setStaffData(data);
      } else {
        console.error('Unexpected response format:', data);
        setStaffData([]);
      }
      console.log(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnitsData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const endpoint = 'api/units/';
      const data = await fetchData(endpoint, 'GET', null, token);
      setUnitsData(data);
    } catch (error) {
      console.error('Failed to fetch units:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPowerPlantData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const endpoint = 'api/powerplants/';
      const data = await fetchData(endpoint, 'GET', null, token);
      setPlantData(data);
    } catch (error) {
      console.error('Failed to fetch units:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffData();
    fetchUnitsData();
    fetchPowerPlantData();
  }, []);

  const handleView = (id) => {
    console.log('Edit', id);
  };

  const handleEdit = (id) => {
    console.log('Edit', id);
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem('jwt');
    const endpoint = 'users'; // Replace with your actual endpoint
    deleteData(endpoint, id, token)
      .then(() => {
        alert('Data deleted successfully');
        fetchStaffData(); // Refetch the data to update the table
      })
      .catch((error) => {
        console.error('Failed to delete data:', error);
      });
  };

  const handleAssign = () => {
    console.log('Assigned workers');
    closeAssign();
  };

  const getUnitNameById = (id) => {
    const unit = unitsData.find((unit) => unit.unit_id === id);
    return unit ? unit.unit_name : 'Unknown';
  };

  const getPlantNameById = (id) => {
    const plant = plantData.find((plant) => plant.plant_id === id);
    return plant ? plant.name : 'Unknown';
  };

  const rows = staffData.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>{element.staff_name}</Table.Td>
      <Table.Td>{element.role}</Table.Td>
      <Table.Td>{element.staff_mob}</Table.Td>
      <Table.Td>{getUnitNameById(element.unit)}</Table.Td>
      <Table.Td>
        <Group spacing="xs">
          <IconEye
            size={20}
            onClick={() => handleView(element.name)}
            style={{ cursor: 'pointer' }}
          />
          <IconEdit
            size={20}
            onClick={() => handleEdit(element.name)}
            style={{ cursor: 'pointer' }}
          />
          <IconTrash
            size={20}
            onClick={() => handleDelete(element.id)}
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
      <AppShell.Navbar p={"sm"}>
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>
        <Breadcrumbs ml={15}>{items}</Breadcrumbs>
        <div className={styles.unitHeader}>
          <h2>Staff</h2>

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
                label="Username"
                placeholder="Enter username"
                value={username}
                onChange={(event) => setUsername(event.currentTarget.value)}
                mb="sm"
              />
              {/* <PasswordInput
                label="Password"
                placeholder="Enter password"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
                mb="sm"
              /> */}
              <TextInput
                label="Email"
                placeholder="Enter email"
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
                mb="sm"
              />
              <TextInput
                label="Staff Name"
                placeholder="Enter staff name"
                value={staffName}
                onChange={(event) => setStaffName(event.currentTarget.value)}
                mb="sm"
              />
              <NativeSelect
                label="Role"
                data={[
                  { value: '', label: 'Select Role' },
                  { value: 'admin', label: 'Admin' },
                  { value: 'manager', label: 'Manager' },
                  { value: 'staff', label: 'Staff' },
                ]}
                value={role}
                onChange={(event) => {
                  setRole(event.currentTarget.value);
                  console.log('Role selected:', event.currentTarget.value); // Debug log
                }}
                mb="sm"
              />
              <TextInput
                label="Contact No"
                placeholder="Enter contact no"
                value={contact}
                onChange={(event) => setContact(event.currentTarget.value)}
                mb="sm"
              />
              <Select
                label="Power Plant"
                placeholder="Select Plant"
                data={plantData.map((plant) => ({
                  value: plant.plant_id.toString(),
                  label: plant.name,
                }))}
                value={powerPlant}
                onChange={setPowerPlant}
                mb="sm"
              />
              <Select
                label="Assign Unit"
                placeholder="Select Unit"
                data={unitsData.map((unit) => ({
                  value: unit.unit_id.toString(),
                  label: unit.unit_name,
                }))}
                value={assignUnits}
                onChange={setAssignUnits}
                mb="sm"
              />
            </div>
            <div className={styles.buttonContainer}>
              <Button className={styles.addButtonModal} onClick={handleSubmit}>
                Add
              </Button>
            </div>
          </Modal>

          <button className={styles.addButton} onClick={open}>
            Add Staff
          </button>
        </div>
        <Table stickyHeader>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Staff Name</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Contact No</Table.Th>
              <Table.Th>Assigned Unit</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </AppShell.Main>
    </AppShell>
  );
}
