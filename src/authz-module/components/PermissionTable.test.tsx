import { render, screen } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { Role, PermissionsResourceGrouped } from '@src/types';
import PermissionTable from './PermissionTable';

const mockMessages = {
  'authz.role.card.permission.for.role.status.granted': 'Permission granted for {roleName}',
  'authz.role.card.permission.for.role.status.denied': 'Permission denied for {roleName}',
};

const renderWithIntl = (component: React.ReactElement) => render(
  <IntlProvider locale="en" messages={mockMessages}>
    {component}
  </IntlProvider>,
);

const mockRoles: Role[] = [
  {
    name: 'Admin',
    description: 'Administrator role',
    userCount: 0,
    permissions: [],
    role: '',
  },
  {
    name: 'Editor',
    description: 'Editor role',
    userCount: 0,
    permissions: [],
    role: '',
  },
  {
    name: 'Viewer',
    description: 'Viewer role',
    userCount: 0,
    permissions: [],
    role: '',
  },
];

const mockPermissionsTable: PermissionsResourceGrouped[] = [
  {
    key: 'users',
    label: 'User Management',
    description: 'Manage user accounts',
    permissions: [
      {
        key: 'users.read',
        resource: 'users',
        label: 'View Users',
        actionKey: 'read',
        roles: {
          Admin: true,
          Editor: true,
          Viewer: true,
        },
      },
      {
        key: 'users.write',
        resource: 'users',
        label: 'Edit Users',
        actionKey: 'write',
        roles: {
          Admin: true,
          Editor: true,
          Viewer: false,
        },
      },
    ],
  },
  {
    key: 'courses',
    label: 'Course Management',
    description: 'Manage courses',
    permissions: [
      {
        key: 'courses.delete',
        resource: 'courses',
        label: 'Delete Courses',
        actionKey: 'delete',
        roles: {
          Admin: true,
          Editor: false,
          Viewer: false,
        },
      },
    ],
  },
];

describe('PermissionTable', () => {
  it('renders within a Card component', () => {
    renderWithIntl(<PermissionTable roles={mockRoles} permissionsTable={mockPermissionsTable} />);

    expect(document.querySelector('.card')).toBeInTheDocument();
  });

  it('renders table with correct class', () => {
    renderWithIntl(<PermissionTable roles={mockRoles} permissionsTable={mockPermissionsTable} />);

    const table = screen.getByRole('table');
    expect(table).toHaveClass('permission-table', 'w-100');
  });

  it('renders table headers for all roles', () => {
    renderWithIntl(<PermissionTable roles={mockRoles} permissionsTable={mockPermissionsTable} />);

    mockRoles.forEach(role => {
      expect(screen.getByRole('columnheader', { name: role.name })).toBeInTheDocument();
    });
  });

  it('applies correct classes to role headers', () => {
    renderWithIntl(<PermissionTable roles={mockRoles} permissionsTable={mockPermissionsTable} />);

    mockRoles.forEach(role => {
      const header = screen.getByRole('columnheader', { name: role.name });
      expect(header).toHaveClass('text-center', 'py-3');
    });
  });

  it('renders resource group headers', () => {
    renderWithIntl(<PermissionTable roles={mockRoles} permissionsTable={mockPermissionsTable} />);

    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Course Management')).toBeInTheDocument();
  });

  it('applies correct classes to resource group headers', () => {
    const { container } = renderWithIntl(<PermissionTable roles={mockRoles} permissionsTable={mockPermissionsTable} />);

    const resourceRows = container.querySelectorAll('.bg-info-100.text-primary');
    expect(resourceRows).toHaveLength(2);
  });

  it('renders resource group headers with correct colspan', () => {
    const { container } = renderWithIntl(<PermissionTable roles={mockRoles} permissionsTable={mockPermissionsTable} />);

    const resourceCells = container.querySelectorAll('td[colspan]');
    resourceCells.forEach(cell => {
      expect(cell).toHaveAttribute('colspan', '4');
    });
  });

  it('renders permission labels with icons', () => {
    renderWithIntl(<PermissionTable roles={mockRoles} permissionsTable={mockPermissionsTable} />);

    expect(screen.getByText('View Users')).toBeInTheDocument();
    expect(screen.getByText('Edit Users')).toBeInTheDocument();
    expect(screen.getByText('Delete Courses')).toBeInTheDocument();
  });

  it('applies correct classes to permission label cells', () => {
    const { container } = renderWithIntl(<PermissionTable roles={mockRoles} permissionsTable={mockPermissionsTable} />);

    const labelCells = container.querySelectorAll('td.text-start.d-flex');
    labelCells.forEach(cell => {
      expect(cell).toHaveClass('align-items-center', 'small', 'px-4', 'py-3');
    });
  });

  it('renders permission row borders', () => {
    const { container } = renderWithIntl(<PermissionTable roles={mockRoles} permissionsTable={mockPermissionsTable} />);

    const borderRows = container.querySelectorAll('tr.border-top');
    expect(borderRows).toHaveLength(3);
  });

  it('renders Check icons for granted permissions', () => {
    renderWithIntl(<PermissionTable roles={mockRoles} permissionsTable={mockPermissionsTable} />);

    const grantedIcons = screen.getAllByLabelText(/Permission granted for/);
    expect(grantedIcons.length).toBeGreaterThan(0);
  });

  it('renders Close icons for denied permissions', () => {
    renderWithIntl(<PermissionTable roles={mockRoles} permissionsTable={mockPermissionsTable} />);

    const deniedIcons = screen.getAllByLabelText(/Permission denied for/);
    expect(deniedIcons.length).toBeGreaterThan(0);
  });

  it('applies text-danger class to denied permission icons', () => {
    renderWithIntl(<PermissionTable roles={mockRoles} permissionsTable={mockPermissionsTable} />);

    const deniedIcons = screen.getAllByLabelText(/Permission denied for/);
    deniedIcons.forEach(icon => {
      expect(icon).toHaveClass('text-danger');
    });
  });

  it('applies correct classes to granted permission icons', () => {
    renderWithIntl(<PermissionTable roles={mockRoles} permissionsTable={mockPermissionsTable} />);

    const grantedIcons = screen.getAllByLabelText(/Permission granted for/);
    grantedIcons.forEach(icon => {
      expect(icon).toHaveClass('d-inline-block');
      expect(icon).not.toHaveClass('text-danger');
    });
  });

  it('centers permission status cells', () => {
    const { container } = renderWithIntl(<PermissionTable roles={mockRoles} permissionsTable={mockPermissionsTable} />);

    const statusCells = container.querySelectorAll('tbody td.text-center');
    expect(statusCells.length).toBeGreaterThan(0);
  });

  it('renders correct aria-labels for granted permissions', () => {
    renderWithIntl(<PermissionTable roles={mockRoles} permissionsTable={mockPermissionsTable} />);

    mockRoles.forEach(role => {
      const grantedLabel = `Permission granted for ${role.name}`;
      const icons = screen.queryAllByLabelText(grantedLabel);
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  it('renders correct aria-labels for denied permissions', () => {
    renderWithIntl(<PermissionTable roles={mockRoles} permissionsTable={mockPermissionsTable} />);

    const deniedLabel = 'Permission denied for Viewer';
    expect(screen.getAllByLabelText(deniedLabel)).toHaveLength(2);
  });

  it('handles empty roles array', () => {
    renderWithIntl(<PermissionTable roles={[]} permissionsTable={mockPermissionsTable} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('User Management')).toBeInTheDocument();
  });

  it('handles empty permissions table', () => {
    renderWithIntl(<PermissionTable roles={mockRoles} permissionsTable={[]} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    mockRoles.forEach(role => {
      expect(screen.getByText(role.name)).toBeInTheDocument();
    });
  });

  it('applies correct margin to permission icons', () => {
    const { container } = renderWithIntl(<PermissionTable roles={mockRoles} permissionsTable={mockPermissionsTable} />);

    const permissionIcons = container.querySelectorAll('td.text-start .paragon-icon');
    permissionIcons.forEach(icon => {
      expect(icon).toHaveClass('d-inline-block', 'mr-2');
    });
  });
});
