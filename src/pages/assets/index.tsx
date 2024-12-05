import { assetService } from './assets.service';
import { generateColumns } from './components/columns';
import { IconPlus } from '@tabler/icons-react';
import { GenericEntityPage } from '../indexlayout';
// import { Category } from '../../schemas/categoriesschema';
import { DataTable } from './components/data-table';
import { Asset } from '@/schemas/assetsschema';

export default function RequestsPage() {
  return (
    <GenericEntityPage<Asset>
      title="Assets"
      newEntityLabel="New Asset"
      newEntityIcon={<IconPlus className="mr-2 h-4 w-4" />}
      service={assetService}
      generateColumns={(onDelete) =>
        generateColumns<Asset>({
          keys: [
            {
              key: 'name',
              title: 'Name'
            },
            {
              key: 'type',
              title: 'Type'
            },
            {
              key: 'status',
              title: 'Status'
            },
            {
              key: 'owner',
              title: 'Owner',
              render: (row) => row.owner?.name || 'Unassigned', 
            },
          ],
          options: {
            id: { key: 'id', title: 'Asset' },
            actions: { onDelete }
          },
        })
      }
      entityFilterKey="name"
      filterByCategory={true}
      entityName="Asset"
      DataTableComponent={DataTable}
    />
  );
}