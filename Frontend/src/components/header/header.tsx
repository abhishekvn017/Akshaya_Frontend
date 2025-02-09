import { Title, Avatar, Group, Text, Popover, Button } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import classes from './header.module.css';
import { IconUser } from '@tabler/icons-react';
import { fetchData } from '@/pages/utils/crud';

export function Header() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [popoverOpened, setPopoverOpened] = useState(false);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('jwt');
      const endpoint = 'userdetails/'; // Adjust this to your actual endpoint
      const data = await fetchData(endpoint, 'GET', null, token);
      setUserData(data);
      console.log(data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className={classes.header}>
      <Title order={4} size={32} ml={20}>AKSHAYA</Title>
      <div className={classes.profile}>
        <Group>
          <Popover
            opened={popoverOpened}
            onClose={() => setPopoverOpened(false)}
            position="bottom"
            withArrow
            shadow="md"
          >
            <Popover.Target>
              <Avatar 
                color="blue" 
                radius="xl" 
                style={{ cursor: 'pointer' }} 
                onClick={() => setPopoverOpened((o) => !o)}
              >
                <IconUser size={24} />
              </Avatar>
            </Popover.Target>
            <Popover.Dropdown>
              {loading ? (  
                <Text>Loading...</Text>
              ) : error ? (
                <Text>Error loading user data</Text>
              ) : (
                <div>
                  <Text><strong>Username:</strong> {userData.username}</Text>
                  <Text><strong>Email:</strong> {userData.email}</Text>
                  <Text><strong>Role:</strong> {userData.role}</Text>
                  <Text><strong>Contact:</strong> {userData.staff_mob}</Text>
                  {/* <Text><strong>Power Plant:</strong> {userData.power_plant}</Text>
                  <Text><strong>Unit:</strong> {userData.unit}</Text> */}
                </div>
              )}
              <Group position="right" mt="md">
                <Button onClick={() => setPopoverOpened(false)}>Close</Button>
              </Group>
            </Popover.Dropdown>
          </Popover>
          {userData && <Text>{userData.staff_name}</Text>}
        </Group>
      </div>
    </div>
  );
}
