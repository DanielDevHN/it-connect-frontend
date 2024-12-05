/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { PageLayout } from './pagelayout';
import { Button } from '@/components/custom/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MultiSelect, Option } from '@/components/custom/multiselect';
import { categoriesService } from './categories/categories.service';
import { Category } from '@/schemas/categoriesschema';

interface EntityPageProps<T> {
    title: string;
    newEntityLabel: string;
    newEntityIcon: React.ReactNode;
    service: {
        getEntities?: () => Promise<{ status: number; data: T[] }>;
        deleteEntity?: (id: number) => Promise<{ status: number }>;
        [key: string]: any; // Allow other methods as needed
    };
    generateColumns: (onDelete: (id: number) => void) => any;
    entityFilterKey: string;
    filterByCategory?: boolean;
    entityName: string;
    DataTableComponent: React.ComponentType<{
      data: T[];
      columns: any;
      viewActions?: { filterByCategory: () => void };
      filter: { key: string; placeholder: string };
    }>;
  }
  
export function GenericEntityPage<T>({
  title,
  newEntityLabel,
  newEntityIcon,
  service,
  generateColumns,
  entityFilterKey,
  filterByCategory,
  entityName,
  DataTableComponent,
}: EntityPageProps<T>) {
  const [entities, setEntities] = useState<T[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [entityId, setEntityId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const getAndSetEntities = async () => {
      setLoading(true);

      if (service.getEntities) {
        const res = await service.getEntities();
        if (res.status === 200) setEntities(res.data);
        else
          toast({
            title: 'Something went wrong.',
            description: `Couldn't get the ${entityName}s.`,
          });
      } else {
        toast({
          title: 'Error',
          description: 'getEntities method is not defined in the service.',
        });
      }

      if (filterByCategory) {
        getAndSetCategories();
      }

      setLoading(false);
  };

  const getAndSetCategories = async () => {
    if (categoriesService.getEntities) {
        const res = await categoriesService.getEntities();
        if (res.status === 200) setCategories(res.data.map((cat:Category)=>{return {value: cat.id, label: cat.name}}));
        else
            toast({
            title: 'Something went wrong.',
            description: `Couldn't get the Categories.`,
            });
        } else {
        toast({
            title: 'Error',
            description: 'getEntities method is not defined in the service.',
        });
    }
  };

  const openDeleteDialog = (id: number) => {
    setEntityId(id);
  };

  const deleteEntity = async () => {
    if (service.deleteEntity) {
      const res = await service.deleteEntity(entityId);
      if (res.status === 200) {
        setEntities([...entities.filter((entity) => (entity as any).id !== entityId)]);
      } else {
        toast({
          title: `Couldn't delete the ${entityName}.`,
          description: `This ${entityName} has data related to it. Please remove the data first.`,
        });
      }
    } else {
      toast({
        title: 'Error',
        description: 'deleteEntity method is not defined in the service.',
      });
    }

    setEntityId(0);
  };

  const columns = generateColumns(openDeleteDialog);

  useEffect(() => {
    getAndSetEntities();
  }, []);

  return (
    <PageLayout>
      <div className="mb-2 flex items-center justify-between space-y-2">
        <div className="flex items-end justify-between w-full flex-wrap">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <div className="flex space-x-2">
            <Button asChild>
              <Link to={`${location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : location.pathname}/form`}>
                {newEntityIcon}
                {newEntityLabel}
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={getAndSetEntities}
              className="h-8 px-2 lg:px-3"
              loading={loading}
            >
              {!loading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4" />
                  Reload
                </>
              ) : (
                <>Loading...</>
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTableComponent
          data={
            selectedCategories.length > 0 
              ? entities.filter(
                  //@ts-expect-error aaa
                  (entity) => Array.isArray(entity.categories) && 
                  //@ts-expect-error aaa
                              entity.categories.some(cat => selectedCategories.includes(cat.id.toString()))
                )
              : entities
          }
          columns={columns}
          viewActions={{filterByCategory: () => setOpen(true)}}
          filter={{ key: entityFilterKey, placeholder: `Search in the table...` }}
        />
      </div>
      <AlertDialog open={Boolean(entityId)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {entityName} and remove
              your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEntityId(0)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteEntity}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {
        filterByCategory && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Filter by Categories</DialogTitle>
                <DialogDescription>
                  Select the categories you want to filter by.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 items-center gap-4">
                  <MultiSelect
                    options={categories}
                    placeholder="Select categories"
                    onChange={(value) => setSelectedCategories(value)}
                    selected={selectedCategories}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )
      }
    </PageLayout>
  );
}