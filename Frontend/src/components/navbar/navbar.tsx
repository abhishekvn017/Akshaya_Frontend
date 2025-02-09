import { useState } from 'react';
import {
  IconMapPinQuestion,
  IconDeviceNintendo,
  IconSourceCode,
  IconSettings,
  IconUserStar,
  IconHeartRateMonitor,
  IconBuildingFactory,
  IconLogout,
  IconDashboard,
  IconHome2,
} from '@tabler/icons-react';
import classes from './navbar.module.css';
import { Link } from 'react-router-dom';
import { NavLink } from '@mantine/core';

export function Navbar() {
  const [active, setActive] = useState('Dashboard');

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Link to="/homepage" className={classes.link} style={{ textDecoration: 'none' }}>
          {' '}
          {/* Apply class for consistent styling */}
          <NavLink
            href="#required-for-focus"
            label="Dashboard"
            leftSection={<IconDashboard className={classes.linkIcon} size={18} />} // Adjust size as needed
          />
        </Link>

        <Link to="/inspection" className={classes.link} style={{ textDecoration: 'none' }}>
          {' '}
          {/* Apply class for consistent styling */}
          <NavLink
            href="#required-for-focus"
            label="Inspection"
            leftSection={<IconMapPinQuestion className={classes.linkIcon} size={18} />} // Adjust size as needed
          />
        </Link>

        <Link to="/maintenance" className={classes.link} style={{ textDecoration: 'none' }}>
          {' '}
          {/* Apply class for consistent styling */}
          <NavLink
            href="#required-for-focus"
            label="Maintenance"
            leftSection={<IconDeviceNintendo className={classes.linkIcon} size={18} />} // Adjust size as needed
          />
        </Link>

        <Link to="/resources" className={classes.link} style={{ textDecoration: 'none' }}>
          {' '}
          {/* Apply class for consistent styling */}
          <NavLink
            href="#required-for-focus"
            label="Resource"
            leftSection={<IconSourceCode className={classes.linkIcon} size={18} />} // Adjust size as needed
          />
        </Link>

        <Link to="/households" className={classes.link} style={{ textDecoration: 'none' }}>
          {' '}
          {/* Apply class for consistent styling */}
          <NavLink
            href="#required-for-focus"
            label="Households"
            leftSection={<IconHome2 className={classes.linkIcon} size={18} />} // Adjust size as needed
          />
        </Link>

        <Link to="/settings" className={classes.link} style={{ textDecoration: 'none' }}>
          {' '}
          {/* Apply class for consistent styling */}
          <NavLink
            href="#required-for-focus"
            label="Settings"
            leftSection={<IconSettings className={classes.linkIcon} stroke={1.5} size={18} />} // Adjust size as needed
          />
        </Link>
      </div>

      <div className={classes.footer}>
        <Link to="/" className={classes.link} style={{ textDecoration: 'none' }}>
          {' '}
          {/* Apply class for consistent styling */}
          <NavLink
            href="#required-for-focus"
            label="Logout"
            leftSection={<IconLogout className={classes.linkIcon} stroke={1.5} size={18} />} // Adjust size as needed
          />
        </Link>
      </div>
    </nav>
  );
}
