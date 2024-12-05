import { GenericDetailsPage } from "../detailslayout";
import { formatDate } from "@/lib/utils";
import { requestService } from "./requests.service";
import { Category } from "@/schemas/categoriesschema";

export default function RequestDetailsPage() {
  return (
    <GenericDetailsPage
      entityName="Request"
      service={requestService}
      fields={[
        { label: "ID", value: "id" },
        { label: "Title", value: "title" },
        { label: "Description", value: "description" },
        { label: "Status", value: "status" },
        { label: "Categories", value: (item) => item.categories.map((category:Category) => category.name).join(", ") },
        { label: "Requestor", value: (item) => item.requestor.name },
        { label: "Asignee", value: (item) => item.assignee ? item.assignee.name : "None" },
        { label: "Planned for", value: (item) => item.plannedForDate ? formatDate(item.plannedForDate) : "Not setted" },
        { label: "Resolved At", value: (item) => item.resolvedAt ? formatDate(item.resolvedAt) : "Not setted" },
        { label: "Created At", value: (item) => formatDate(item.createdAt) },
        { label: "Updated At", value: (item) => formatDate(item.updatedAt) },
      ]}
    />
  );
}