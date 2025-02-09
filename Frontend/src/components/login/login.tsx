import React, { useState } from 'react';
import {
  Grid,
  Tabs,
  TextInput,
  PasswordInput,
  Anchor,
  Checkbox,
  Button,
  Group,
  Avatar,
  Divider,
  Fieldset,
  Text,
  GridCol,
  Image,
} from '@mantine/core';
import {
  IconBrandGoogleFilled,
  IconBrandWindows,
  IconBrandFacebookFilled,
} from '@tabler/icons-react';
import classes from './login.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { b } from 'vitest/dist/suite-IbNSsUWN';
import { loginPostFunction, UserPostFunction } from '@/pages/utils/login';

const SignUpForm = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSignup = async () => {
    setLoading(true);
    // creating data
    const userData = {
      username: username,
      email: email,
      password: password,
    };
    const endpoint = 'users';
    const redirect = '/';
    try {
      await UserPostFunction(userData, endpoint, redirect, navigate);
      setShowSuccess(true);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <Fieldset variant="unstyled">
      <Text size="lg" ta={'center'}>
        Sign Up
      </Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        mt={'md'}
      />
      <PasswordInput
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        mt={'md'}
      />
      {/* <PasswordInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        mt={'md'}
      /> */}
      <Checkbox defaultChecked label="I agree to terms and conditions" size="xs" mt={20} ml={5} />
      <Button fullWidth mt={'md'} color="black" onClick={handleSignup}>
        Sign Up
      </Button>
    </Fieldset>
  );
};

const AdminTab = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // Add this line
  const [username, setUsername] = useState(false);
  const [password, setPassword] = useState(false);
  
  let timeout: NodeJS.Timeout | undefined;
  const navigate = useNavigate();
  const handleLogin = async () => {
    setShowModal(true); // Open the modal
    setLoading(true);
    const redirect = '/homepage';
    try {
      await loginPostFunction(credentials, redirect, navigate);
      setLoading(false);
      setShowModal(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Fieldset variant="unstyled">
      <Text size="lg" ta={'center'}>
        Welcome Back Admin
      </Text>
      <TextInput
        placeholder="username"
        value={credentials.username}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
      />
      <PasswordInput
        placeholder="Password"
        mt={'md'}
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
      />
      <Anchor href="#" underline="hover">
        <Text ta={'right'}>forgot password?</Text>
      </Anchor>
      <Checkbox defaultChecked label="Remember me" size="xs" ml={5} />
      <Button fullWidth mt={'md'} color="black" onClick={handleLogin}>
        Login
      </Button>
    </Fieldset>
  );
};

export function Login() {
  return (
    <Grid className={classes.grid}>
      {/* <Grid.Col span={6} visibleFrom="md">
        <Image
          radius="md"
          height="100%"
          src="https://rymec.edu.in/wp-content/uploads/2023/03/baim5.png"
        />
      </Grid.Col> */}

      {/* <Grid.Col span={6} className={classes.col}> */}
        <Tabs variant="outline" radius="lg" defaultValue="gallery" className={classes.tabs}>
          <Tabs.List className={classes.tabslist}>
            <Tabs.Tab value="gallery" className={classes.tab}>
              Sign In
            </Tabs.Tab>
            <Tabs.Tab value="messages" className={classes.tab}>
              Sign Up
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="gallery" className={classes.panel}>
            <AdminTab />
          </Tabs.Panel>

          <Tabs.Panel value="messages" className={classes.panel}>
            <SignUpForm />
          </Tabs.Panel>
        </Tabs>
      {/* </Grid.Col> */}
    </Grid>
  );
}