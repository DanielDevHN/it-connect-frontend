import { incidentService } from './incident.service';
import { generateColumns } from './components/columns';
import { IconPlus } from '@tabler/icons-react';
import { GenericEntityPage } from '../indexlayout';
// import { Category } from '../../schemas/categoriesschema';
import { DataTable } from './components/data-table';
import { Incident } from '@/schemas/incidentschema';

export default function IncidentsPage() {
  return (
    <GenericEntityPage<Incident>
      title="Incidents"
      newEntityLabel="New Incident"
      newEntityIcon={<IconPlus className="mr-2 h-4 w-4" />}
      service={incidentService}
      generateColumns={(onDelete) =>
        generateColumns<Incident>({
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
              key: 'priority',
              title: 'Priority'
            },
          ],
          options: {
            id: { key: 'id', title: 'Incident' },
            actions: { onDelete }
          },
        })
      }
      entityFilterKey="title"
      filterByCategory={true}
      entityName="Incident" 
      DataTableComponent={DataTable}
    />
  );
}