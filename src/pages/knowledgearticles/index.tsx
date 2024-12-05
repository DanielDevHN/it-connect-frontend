import { knowledgearticleService } from './knowledgearticle.service';
import { generateColumns } from './components/columns';
import { IconExternalLink, IconPlus } from '@tabler/icons-react';
import { GenericEntityPage } from '../indexlayout';
// import { Category } from '../../schemas/categoriesschema';
import { DataTable } from './components/data-table';
import { KnowledgeArticle } from '@/schemas/knowledgearticlesschema';

export default function IncidentsPage() {
  return (
    <GenericEntityPage<KnowledgeArticle>
      title="Know Ledge Article"
      newEntityLabel="New Know Ledge Article"
      newEntityIcon={<IconPlus className="mr-2 h-4 w-4" />}
      service={knowledgearticleService}
      generateColumns={(onDelete) =>
        generateColumns<KnowledgeArticle>({
          keys: [
            {
              key: 'title',
              title: 'Title'
            },
            {
              key: 'docUrl',
              title: 'Document',
              render: (row) => (
                <a href={row.docUrl} className='flex items-center hover:underline' target="_blank" rel="noopener noreferrer">
                  <IconExternalLink className="mr-2 h-4 w-4" />
                  Open
                </a>
              ),
            },
            {
              key: 'createdBy',
              title: 'Created By',
              render: (row) => row.createdBy?.name || 'Unassigned',
            },
            {
              key: 'lastModifiedBy',
              title: 'Last Modified By',
              render: (row) => row.lastModifiedBy?.name || 'Unassigned',
            },
          ],
          options: {
            id: { key: 'id', title: 'Article' },
            actions: { onDelete }
          },
        })
      }
      entityFilterKey="title"
      entityName="KnowledgeArticle"
      DataTableComponent={DataTable}
    />
  );
}