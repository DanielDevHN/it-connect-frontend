import { GenericDetailsPage } from "../detailslayout";
import { formatDate } from "@/lib/utils";
import { incidentService } from "./incident.service";
import { Category } from "@/schemas/categoriesschema";

export default function IncidentDetailsPage() {
  return (
    <GenericDetailsPage
      entityName="Incident"
      service={incidentService}
      fields={[
        { label: "ID", value: "id" },
        { label: "Title", value: "title" },
        { label: "Description", value: "description" },
        { label: "Status", value: "status" },
        { label: "Priority", value: "priority" },
        { label: "Categories", value: (item) => item.categories.map((category:Category) => category.name).join(", ") },
        { label: "Reporter", value: (item) => item.reporter.name },
        { label: "Asignee", value: (item) => item.assignee ? item.assignee.name : "None" },
        { label: "Asset", value: (item) => item.asset ? item.asset.name : "None" },
        { label: "Resolved At", value: (item) => item.resolvedAt ? formatDate(item.resolvedAt) : "Not setted" },
        { label: "Created At", value: (item) => formatDate(item.createdAt) },
        { label: "Updated At", value: (item) => formatDate(item.updatedAt) },
      ]}
    />
  );
}