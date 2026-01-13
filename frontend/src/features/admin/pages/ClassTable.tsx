import { useState } from "react";
import { AdminTable } from "../components/AdminTable";
import { AdminPageActions } from "../components/AdminPageActions";
import { ClassFormModal } from "../components/ClassFormModal";
import { createClass,updateClass } from "../../../api/class.api";
import toast from "react-hot-toast";

type ClassRow = {
  _id: string;
  name: string;
  isDeleted: boolean;
};

const initialClasses: ClassRow[] = [
  { _id: "1", name: "Class 8", isDeleted: false },
  { _id: "2", name: "Class 9", isDeleted: false },
];

export default function ClassPage() {
  const [classes, setClasses] = useState(initialClasses);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingClass, setEditingClass] = useState<ClassRow | undefined>();

  const columns = [
    { key: "name", label: "Class Name" },
    {
      key: "status",
      label: "Status",
      render: (c: ClassRow) =>
        c.isDeleted ? "Inactive" : "Active",
    },
  ];

  const handleCreate = () => {
    setMode("create");
    setEditingClass(undefined);
    setModalOpen(true);
  };

  const handleEdit = (cls: ClassRow) => {
    setMode("edit");
    setEditingClass(cls);
    setModalOpen(true);
  };

  const handleSubmit = async (data: { _id?: string; name: string }) => {
  try {
    if (mode === "create") {
      const created = await createClass({ name: data.name });

      setClasses((prev) => [...prev, created]);
      toast.success("Class created successfully");
    } else if (mode === "edit" && data._id) {
      const updated = await updateClass(data._id, { name: data.name });

      setClasses((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c))
      );
      toast.success("Class updated successfully");
    }

    setModalOpen(false);
  } catch (err: any) {
    toast.error(
      err?.response?.data?.message || "Something went wrong"
    );
  }
};


  return (
    <div className="space-y-4">
      <AdminPageActions
        title="Classes"
        actions={[
          {
            label: "+ Create Class",
            onClick: handleCreate,
          },
        ]}
      />

      <AdminTable
        data={classes}
        columns={columns}
        actions={[
          {
            label: "Edit",
            onClick: handleEdit,
          },
        ]}
      />

      <ClassFormModal
        open={modalOpen}
        mode={mode}
        initialData={editingClass}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
