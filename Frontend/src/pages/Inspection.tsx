import * as XLSX from 'xlsx';
import { Header } from '@/components/header/header';
import { Navbar } from '@/components/navbar/navbar';
import {
  AppShell,
  Breadcrumbs,
  Burger,
  Button,
  Group,
  Modal,
  Select,
  Table,
  TextInput,
  Textarea,
  Checkbox,
  Grid,
  Stack,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import { dataPost, deleteData, fetchData } from './utils/crud';

const items = [
  { title: 'HomePage', href: '/homepage' },
  { title: 'Inspection', href: '#' },
].map((item, index) => (
  <Link to={item.href} key={index}>
    {item.title}
  </Link>
));

const ViewModal = ({ opened, onClose, data }: { opened: boolean; onClose: () => void; data: any }) => {
  const generateReport = () => {
    const wb = XLSX.utils.book_new();
    const ws_data = [
      ['Unit', 'Date', 'Status', 'Inspection Details', 'Comments', 'Completed Date', 'Inspected By'],
      [
        data.unit,
        data.date,
        data.status,
        data.inspectionDetails,
        data.comments,
        data.completedDate,
        data.inspectedBy,
      ],
    ];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, 'Inspection Report');
    const filename = `inspection_report_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, filename);
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} centered>
      <Stack p="md">
        <div><strong>Unit:</strong> {data.unit}</div>
        <div><strong>Date:</strong> {data.date}</div>
        <div><strong>Status:</strong> <span style={{ color: data.statusColor }}>{data.status}</span></div>
        <div><strong>Inspection Details:</strong> {data.inspectionDetails}</div>
        <div><strong>Comments:</strong></div>
        <Textarea
          value={data.comments}
          onChange={(event) => data.setComments(event.currentTarget.value)}
        />
        <div><strong>Completed date:</strong> {data.completedDate}</div>
        <div><strong>Inspected By:</strong> {data.inspectedBy}</div>
        <Group justify="center" mt="md">
          <Button onClick={generateReport}>Generate Report</Button>
        </Group>
      </Stack>
    </Modal>
  );
};

const AssignModal = ({ opened, onClose, data, onAssign }: { opened: boolean; onClose: () => void; data: any; onAssign: () => void }) => (
  <Modal opened={opened} onClose={onClose} centered>
    <Stack p="md">
      <h3>Staff List</h3>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Select</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((worker: any, index: number) => (
            <Table.Tr key={index}>
              <Table.Td>{worker.staff_name}</Table.Td>
              <Table.Td>{worker.role}</Table.Td>
              <Table.Td><Checkbox /></Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Button onClick={onAssign} fullWidth mt="md" color="dark">Assign</Button>
    </Stack>
  </Modal>
);

export function Inspection() {
  const [opened, { toggle }] = useDisclosure();
  const [modalOpened, { open, close }] = useDisclosure(false);
  const [viewModalOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [assignModalOpened, { open: openAssign, close: closeAssign }] = useDisclosure(false);
  const [editModalOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [selectedData, setSelectedData] = useState<any>({});
  const [workersData, setWorkersData] = useState<any[]>([]);
  const [unitID, setUnitID] = useState('');
  const [idate, setIdate] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inspectionData, setInspectionData] = useState<any[]>([]);
  const [unitsData, setUnitsData] = useState<any[]>([]);

  const handleSubmit = async (isEdit: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('jwt');
      const endpoint = isEdit ? `api/inspections/${editId}/` : 'api/inspections/';
      const method = isEdit ? 'PUT' : 'POST';
      const formattedDate = new Date(idate).toISOString().split('T')[0];
      const body = { unit_id: unitID, inspection_date: formattedDate };

      await dataPost(endpoint, method, body, token);
      await fetchInspectionData();
      setUnitID('');
      setIdate('');
      setEditId(null);
      isEdit ? closeEdit() : close();
    } catch (error) {
      console.error('Failed to post data:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (data: any) => {
    const unitName = getUnitNameById(data.unit_id);
    setSelectedData({
      ...data,
      unit: unitName,
      date: data.inspection_date,
      statusColor: data.status === 'Completed' ? 'green' : 'blue',
      setComments: (comments: string) => {
        setSelectedData((prevData: any) => ({ ...prevData, comments }));
      },
    });
    openView();
  };

  const handleEdit = (data: any) => {
    setUnitID(data.unit_id);
    setIdate(new Date(data.inspection_date));
    setEditId(data.inspection_id);
    openEdit();
  };

  const handleDelete = (id: number) => {
    const token = localStorage.getItem('jwt');
    const endpoint = 'api/inspections';
    deleteData(endpoint, id, token)
      .then(() => {
        alert('Data deleted successfully');
        fetchInspectionData();
      })
      .catch(console.error);
  };

  const handleAssign = () => {
    console.log('Assigned workers');
    closeAssign();
  };

  const fetchInspectionData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const data = await fetchData('api/inspections/', 'GET', null, token);
      setInspectionData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnitsData = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const data = await fetchData('api/units/', 'GET', null, token);
      setUnitsData(data);
    } catch (error) {
      console.error('Failed to fetch units:', error);
    }
  };

  const fetchUsersData = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const data = await fetchData('users/', 'GET', null, token);
      setWorkersData(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  useEffect(() => {
    fetchInspectionData();
    fetchUnitsData();
    fetchUsersData();
  }, []);

  const getUnitNameById = (id: number) => {
    const unit = unitsData.find((unit: any) => unit.unit_id === id);
    return unit ? unit.unit_name : 'Unknown';
  };

  const rows = inspectionData.map((element: any) => (
    <Table.Tr key={element.name}>
      <Table.Td>{getUnitNameById(element.unit_id)}</Table.Td>
      <Table.Td>{new Date(element.inspection_date).toLocaleDateString()}</Table.Td>
      <Table.Td>
        <Button onClick={openAssign} variant="outline">Assign to</Button>
      </Table.Td>
      <Table.Td>
        <Group>
          <IconEye size={20} onClick={() => handleView(element)} style={{ cursor: 'pointer' }} />
          <IconEdit size={20} onClick={() => handleEdit(element)} style={{ cursor: 'pointer' }} />
          <IconTrash size={20} onClick={() => handleDelete(element.inspection_id)} style={{ cursor: 'pointer' }} />
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
          <h2>Inspection</h2>
          <Button onClick={open} color="blue">Add Inspection</Button>
        </Group>

        <Modal opened={modalOpened} onClose={close} centered>
          <Stack p="md">
            <Grid>
              <Grid.Col span={12}>
                <Select
                  label="Unit"
                  placeholder="Select Unit"
                  data={unitsData.map((unit: any) => ({
                    value: unit.unit_id.toString(),
                    label: unit.unit_name,
                  }))}
                  value={unitID}
                  onChange={setUnitID}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Inspection Date"
                  type="date"
                  value={idate instanceof Date ? idate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setIdate(new Date(e.currentTarget.value))}
                />
              </Grid.Col>
            </Grid>
            <Button onClick={() => handleSubmit(false)} fullWidth>Add</Button>
          </Stack>
        </Modal>

        <Modal opened={editModalOpened} onClose={closeEdit} centered title="Edit Inspection">
          <Stack p="md">
            <Grid>
              <Grid.Col span={12}>
                <Select
                  label="Unit"
                  placeholder="Select Unit"
                  data={unitsData.map((unit: any) => ({
                    value: unit.unit_id.toString(),
                    label: unit.unit_name,
                  }))}
                  value={unitID}
                  onChange={setUnitID}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Inspection Date"
                  type="date"
                  value={idate instanceof Date ? idate.toISOString().split('T')[0] : ''}
                  onChange={(e) => setIdate(new Date(e.currentTarget.value))}
                />
              </Grid.Col>
            </Grid>
            <Button onClick={() => handleSubmit(true)} fullWidth>Update</Button>
          </Stack>
        </Modal>

        <Table stickyHeader stickyHeaderOffset={60}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Unit</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Assigned To</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>

        <ViewModal opened={viewModalOpened} onClose={closeView} data={selectedData} />
        <AssignModal opened={assignModalOpened} onClose={closeAssign} data={workersData} onAssign={handleAssign} />
      </AppShell.Main>
    </AppShell>
  );
}