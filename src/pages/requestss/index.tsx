import { requestService } from './requests.service';
import { generateColumns } from './components/columns';
import { IconPlus } from '@tabler/icons-react';
import { GenericEntityPage } from '../indexlayout';
// import { Category } from '../../schemas/categoriesschema';
import { DataTable } from './components/data-table';
import { RequestSchema } from '@/schemas/requestsschema';

export default function RequestsPage() {
  return (
    <GenericEntityPage<RequestSchema>
      title="Requests"
      newEntityLabel="New Request"
      newEntityIcon={<IconPlus className="mr-2 h-4 w-4" />}
      service={requestService}
      generateColumns={(onDelete) =>
        generateColumns<RequestSchema>({
          keys: [
            {
              key: 'title',
              title: 'Title'
            },
            {
              key: 'assignee',
              title: 'Assignee',
              render: (row) => row.assignee?.name || 'Unassigned', // Safe fallback for missing names
            },
            {
              key: 'status',
              title: 'Status'
            },
            {
              key: 'plannedForDate',
              title: 'Planned For Date'
            },
          ],
          options: {
            id: { key: 'id', title: 'Request' },
            actions: { onDelete }
          },
        })
      }
      entityFilterKey="title"
      filterByCategory={true}
      entityName="RequestScchema"
      DataTableComponent={DataTable}
    />
  );
}