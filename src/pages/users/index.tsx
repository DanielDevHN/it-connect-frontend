import { usersService } from './users.service';
import { generateColumns } from './components/columns';
import { IconUserPlus } from '@tabler/icons-react';
import { GenericEntityPage } from '../indexlayout';
// import { Category } from '../../schemas/categoriesschema';
import { DataTable } from './components/data-table';
import { User } from '@/schemas/usersschema';

export default function UsersPage() {
  return (
    <GenericEntityPage<User>
      title="Users"
      newEntityLabel="New User"
      newEntityIcon={<IconUserPlus className="mr-2 h-4 w-4" />}
      service={usersService}
      generateColumns={(onDelete) =>
        generateColumns<User>({
          keys: [
            {
              key: 'name',
              title: 'Name'
            },
            {
              key: 'email',
              title: 'Email'
            },
            {
              key: 'phone',
              title: 'Phone'
            },
          ],
          options: {
            id: { key: 'id', title: 'User' },
            actions: { onDelete }
          },
        })
      }
      entityFilterKey="name"
      entityName="User"
      DataTableComponent={DataTable}
    />
  );
}