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
  Checkbox,
  TextInput,
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
  { title: 'Maintenance', href: '#' },
].map((item, index) => (
  <Link to={item.href} key={index}>
    {item.title}
  </Link>
));

const ViewModal = ({ opened, onClose, data }: { opened: boolean; onClose: () => void; data: any }) => {
  const generateReport = () => {
    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws_data = [
      ['Unit', 'Date', 'Status', 'Maintenance Type', 'Specification', 'Assigned To', 'Completed Date'],
      [
        data.unit,
        data.date,
        data.status,
        data.type,
        data.specification,
        `${data.assignedTo?.name ?? 'N/A'} (${data.assignedTo?.department ?? 'N/A'})`,
        data.completedDate,
      ],
    ];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, 'Maintenance Report');

    // Generate a unique filename
    const filename = `maintenance_report_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Write the workbook to a file
    XLSX.writeFile(wb, filename);

    // Close the modal after generating the report
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} centered>
      <Stack p={20}>
        <div><strong>Unit:</strong> {data.unit}</div>
        <div><strong>Date:</strong> {data.date}</div>
        <div><strong>Status:</strong> <span style={{ color: data.statusColor }}>{data.status}</span></div>
        <div><strong>Maintenance type:</strong> {data.type}</div>
        <div><strong>Specification:</strong> {data.specification}</div>
        <div><strong>Assigned To:</strong></div>
        <div>Name: {data.assignedTo?.name ?? 'N/A'}</div>
        <div>Department: {data.assignedTo?.department ?? 'N/A'}</div>
        <div>Place: {data.assignedTo?.place ?? 'N/A'}</div>
        <div><strong>Completed date:</strong> {data.completedDate}</div>
        <Group justify="center" mt={20}>
          <Button onClick={generateReport}>Generate Report</Button>
        </Group>
      </Stack>
    </Modal>
  );
};

const AssignModal = ({ opened, onClose, data, onAssign }: { opened: boolean; onClose: () => void; data: any; onAssign: () => void }) => (
  <Modal opened={opened} onClose={onClose} centered>
    <Stack p={20}>
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
      <Button onClick={onAssign} style={{ margin: '20px auto' }} color="black">
        Assign
      </Button>
    </Stack>
  </Modal>
);

const EditModal = ({ opened, onClose, data, unitsData, onUpdate, setEditData }: { opened: boolean; onClose: () => void; data: any; unitsData: any; onUpdate: () => void; setEditData: (data: any) => void }) => (
  <Modal opened={opened} onClose={onClose} centered>
    <Stack p={20}>
      <Select
        label="Unit"
        placeholder="Select Unit"
        data={unitsData.map((unit: any) => ({
          value: unit.unit_id.toString(),
          label: unit.unit_name,
        }))}
        value={data.unit_id?.toString()}
        onChange={(value) => setEditData(prev => ({ ...prev, unit_id: value }))}
      />
      <Select
        label="Type"
        placeholder="Select Type"
        data={['Preventive', 'Corrective', 'Condition-based', 'Predictive', 'Scheduled', 'Emergency', 'Proactive', 'Deferred']}
        value={data.maintenance_type}
        onChange={(value) => setEditData(prev => ({ ...prev, maintenance_type: value }))}
      />
      <TextInput
        label="Date"
        type="date"
        value={data.maintenance_date}
        onChange={(e) => setEditData(prev => ({ ...prev, maintenance_date: e.target.value }))}
      />
      <TextInput
        label="Record Specification"
        placeholder="Record Specification"
        value={data.record_specifications}
        onChange={(e) => setEditData(prev => ({ ...prev, record_specifications: e.target.value }))}
      />
      <Button onClick={onUpdate} style={{ marginTop: 20 }}>Update</Button>
    </Stack>
  </Modal>
);

export function Maintenance() {
  const [opened, { toggle }] = useDisclosure();
  const [modalOpened, { open, close }] = useDisclosure(false);
  const [viewModalOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [assignModalOpened, { open: openAssign, close: closeAssign }] = useDisclosure(false);
  const [editModalOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [selectedData, setSelectedData] = useState<any>({});
  const [editData, setEditData] = useState<any>({
    record_id: '',
    unit_id: '',
    maintenance_type: '',
    maintenance_date: '',
    record_specifications: ''
  });
  const [workersData, setWorkersData] = useState<any[]>([]);
  const [specification, setSpecification] = useState('');
  const [type, setType] = useState('');
  const [mdate, setMdate] = useState('');
  const [unitID, setUnitID] = useState('');
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [maintenanceData, setMaintenanceData] = useState<any[]>([]);
  const [unitsData, setUnitsData] = useState<any[]>([]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('jwt');
      const endpoint = 'api/maintenance/';
      const formattedDate = new Date(mdate).toISOString().split('T')[0];
      const body = {
        unit_id: unitID,
        maintenance_type: type,
        maintenance_date: formattedDate,
        record_specifications: specification,
      };

      await dataPost(endpoint, 'POST', body, token);
      await fetchMaintenanceData();
      setUnitID('');
      setType('');
      setSpecification('');
      setMdate('');
      close();
    } catch (error) {
      console.error('Failed to post data:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (element: any) => {
    const viewData = {
      unit: getUnitNameById(element.unit_id),
      date: element.maintenance_date,
      status: element.status,
      statusColor: 'blue',
      type: element.maintenance_type,
      specification: element.record_specifications,
      assignedTo: element.assigned_to,
      completedDate: element.completed_date,
    };
    setSelectedData(viewData);
    openView();
  };

  const handleEdit = (element: any) => {
    setEditData({
      record_id: element.record_id,
      unit_id: element.unit_id.toString(),
      maintenance_type: element.maintenance_type,
      maintenance_date: element.maintenance_date.split('T')[0],
      record_specifications: element.record_specifications
    });
    openEdit();
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('jwt');
      const endpoint = `api/maintenance/${editData.record_id}/`;
      const body = {
        unit_id: editData.unit_id,
        maintenance_type: editData.maintenance_type,
        maintenance_date: editData.maintenance_date,
        record_specifications: editData.record_specifications,
      };

      await dataPost(endpoint, 'PUT', body, token);
      await fetchMaintenanceData();
      closeEdit();
    } catch (error) {
      console.error('Failed to update data:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    const token = localStorage.getItem('jwt');
    const endpoint = 'api/maintenance';
    deleteData(endpoint, id, token)
      .then(() => {
        alert('Data deleted successfully');
        fetchMaintenanceData();
      })
      .catch((error) => {
        console.error('Failed to delete data:', error);
      });
  };

  const handleAssign = () => {
    console.log('Assigned workers');
    closeAssign();
  };

  const fetchMaintenanceData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const endpoint = 'api/maintenance/';
      const data = await fetchData(endpoint, 'GET', null, token);
      setMaintenanceData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch maintenance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersData = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const endpoint = 'users/';
      const data = await fetchData(endpoint, 'GET', null, token);
      setWorkersData(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchUnitsData = async () => {
    try {
      const token = localStorage.getItem('jwt');
      const endpoint = 'api/units/';
      const data = await fetchData(endpoint, 'GET', null, token);
      setUnitsData(data);
    } catch (error) {
      console.error('Failed to fetch units:', error);
    }
  };

  useEffect(() => {
    fetchMaintenanceData();
    fetchUnitsData();
    fetchUsersData();
  }, []);

  const getUnitNameById = (id: number) => {
    const unit = unitsData.find((unit: any) => unit.unit_id === id);
    return unit ? unit.unit_name : 'Unknown';
  };

  const rows = maintenanceData.map((element: any) => (
    <Table.Tr key={element.record_id}>
      <Table.Td>{getUnitNameById(element.unit_id)}</Table.Td>
      <Table.Td>{element.maintenance_type}</Table.Td>
      <Table.Td>{new Date(element.maintenance_date).toLocaleDateString()}</Table.Td>
      <Table.Td>
        <Button onClick={openAssign} variant="outline">
          Assign to
        </Button>
      </Table.Td>
      <Table.Td>
        <Group>
          <IconEye size={20} onClick={() => handleView(element)} style={{ cursor: 'pointer' }} />
          <IconEdit size={20} onClick={() => handleEdit(element)} style={{ cursor: 'pointer' }} />
          <IconTrash size={20} onClick={() => handleDelete(element.record_id)} style={{ cursor: 'pointer' }} />
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Header />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>
        <Breadcrumbs ml={15}>{items}</Breadcrumbs>
        <Group justify="space-between" align="center" p={15}>
          <h2>Maintenance</h2>
          <Button onClick={open} color="blue">
            Add Maintenance
          </Button>
        </Group>

        <Modal opened={modalOpened} onClose={close} centered>
          <Stack p={20}>
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
                <Select
                  label="Type"
                  placeholder="Select Type"
                  data={['Preventive', 'Corrective', 'Condition-based', 'Predictive', 'Scheduled', 'Emergency', 'Proactive', 'Deferred']}
                  value={type}
                  onChange={setType}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Date"
                  type="date"
                  value={mdate}
                  onChange={(e) => setMdate(e.currentTarget.value)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  label="Record Specification"
                  placeholder="Record Specification"
                  value={specification}
                  onChange={(e) => setSpecification(e.currentTarget.value)}
                />
              </Grid.Col>
            </Grid>
            <Group justify="flex-end">
              <Button onClick={handleSubmit}>Add</Button>
            </Group>
          </Stack>
        </Modal>

        <Table stickyHeader stickyHeaderOffset={60}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Unit</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Assigned To</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>

        <ViewModal opened={viewModalOpened} onClose={closeView} data={selectedData} />
        <AssignModal
          opened={assignModalOpened}
          onClose={closeAssign}
          data={workersData}
          onAssign={handleAssign}
        />
        <EditModal
          opened={editModalOpened}
          onClose={closeEdit}
          data={editData}
          unitsData={unitsData}
          onUpdate={handleUpdate}
          setEditData={setEditData}
        />
      </AppShell.Main>
    </AppShell>
  );
}