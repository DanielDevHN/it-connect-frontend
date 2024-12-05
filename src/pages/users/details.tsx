import { GenericDetailsPage } from "../detailslayout";
import { formatDate } from "@/lib/utils";
import { usersService } from "./users.service";

export default function UserDetailsPage() {
  return (
    <GenericDetailsPage
      entityName="User"
      service={usersService}
      fields={[
        { label: "ID", value: "id" },
        { label: "Name", value: "name" },
        { label: "Email", value: "email" },
        { label: "Phone", value: "phone" },
        { label: "Created At", value: (user) => formatDate(user.createdAt) },
        { label: "Updated At", value: (user) => formatDate(user.updatedAt) },
      ]}
    />
  );
}
