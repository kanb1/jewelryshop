import React, { useEffect, useState } from "react";
import { Box, Heading, Table, Tbody, Tr, Td, Thead, Th, Button, Select } from "@chakra-ui/react";

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("jwt");
      const response = await fetch("http://localhost:5001/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (id: string, newRole: string) => {
    const token = localStorage.getItem("jwt");
    await fetch(`http://localhost:5001/api/admin/users/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: newRole }),
    });
    setUsers(
      users.map((user) =>
        user._id === id ? { ...user, role: newRole } : user
      )
    );
    alert("User role updated successfully");
  };

  const handleDeleteUser = async (id: string) => {
    const token = localStorage.getItem("jwt");
    await fetch(`http://localhost:5001/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(users.filter((user) => user._id !== id));
    alert("User deleted successfully");
  };

  return (
    <Box p={5}>
      <Heading size="lg" mb={4}>
        Manage Users
      </Heading>

      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user._id}>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>
                <Select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Select>
              </Td>
              <Td>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => handleDeleteUser(user._id)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default AdminUsers;
