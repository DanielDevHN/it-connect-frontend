import { categoriesService } from './categories.service';
import { generateColumns } from './components/columns';
import { IconCategoryPlus } from '@tabler/icons-react';
import { GenericEntityPage } from '../indexlayout';
// import { Category } from '../../schemas/categoriesschema';
import { DataTable } from './components/data-table';
import { Category } from '@/schemas/categoriesschema';

export default function CategoriesPage() {
  return (
    <GenericEntityPage<Category>
      title="Categories"
      newEntityLabel="New Category"
      newEntityIcon={<IconCategoryPlus className="mr-2 h-4 w-4" />}
      service={categoriesService}
      generateColumns={(onDelete) =>
        generateColumns<Category>({
          keys: [
            {
              key: 'name',
              title: 'Name'
            },
          ],
          options: {
            id: { key: 'id', title: 'Category' },
            actions: { onDelete }
          },
        })
      }
      entityFilterKey="name"
      entityName="Category"
      DataTableComponent={DataTable}
    />
  );
}