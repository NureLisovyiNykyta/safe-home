import { useState } from "react";
import TablePage from "./tablePage";
import RegisterForm from "../components/forms/register";
import Modal from "../components/modal";

const Admins = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const columnDefs = [
    { field: "name", headerName: "Name" },
    { field: "email", headerName: "Email" },
    { field: "createdAt", headerName: "Created at" },
  ];

  const transformData = (data) =>
    data.admins.map((admin) => ({
      ...admin,
      name: admin.name,
      email: admin.email,
      createdAt: new Date(admin.created_at).toLocaleDateString(),
    }));

  return (
    <>
      <TablePage
        apiEndpoint="/admin/admins"
        columnDefs={columnDefs}
        transformData={transformData}
        showActions={true}
        onAddClick={() => setModalIsOpen(true)}
      />
      {modalIsOpen && (
        <Modal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}>
          <RegisterForm onBack={() => setModalIsOpen(false)} />
        </Modal>
      )}
    </>
  );
};

export default Admins;
