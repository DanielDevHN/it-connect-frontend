import { GenericDetailsPage } from "../detailslayout";
import { formatDate } from "@/lib/utils";
import { assetService } from "./assets.service";
import { Category } from "@/schemas/categoriesschema";

export default function AssetDetailsPage() {
  return (
    <GenericDetailsPage
      entityName="Asset"
      service={assetService}
      fields={[
        { label: "ID", value: "id" },
        { label: "Name", value: "name" },
        { label: "Description", value: "description" },
        { label: "Status", value: "status" },
        { label: "Type", value: "type" },
        { label: "Categories", value: (item) => item.categories.map((category:Category) => category.name).join(", ") },
        { label: "Owner", value: (item) => item.owner ? item.owner.name : "None" },
        { label: "Purchased at", value: (item) => item.purchasedAt ? formatDate(item.purchasedAt) : "Not setted" },
        { label: "Warranty expires at", value: (item) => item.warrantyExpiresAt ? formatDate(item.warrantyExpiresAt) : "Not setted" },
        { label: "Created At", value: (item) => formatDate(item.createdAt) },
        { label: "Updated At", value: (item) => formatDate(item.updatedAt) },
      ]}
    />
  );
}