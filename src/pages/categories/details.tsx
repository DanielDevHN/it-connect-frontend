import { GenericDetailsPage } from "../detailslayout";
import { categoriesService } from "./categories.service";

export default function UserDetailsPage() {
  return (
    <GenericDetailsPage
      entityName="Category"
      service={categoriesService}
      fields={[
        { label: "ID", value: "id" },
        { label: "Name", value: "name" },
      ]}
    />
  );
}