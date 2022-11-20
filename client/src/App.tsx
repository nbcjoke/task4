import React, { FC, useContext, useEffect, useState } from "react";
import { Context } from "./index";
import { observer } from "mobx-react-lite";

import { UserService } from "./services/UserService";
import LoginForm from "./components/LoginForm";
import Toolbar from "./components/toolbar";
import Checkbox from "@mui/material/Checkbox";
import { IUser } from "./models/IUser";

import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const App: FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const { store } = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      store.checkAuth();
    }

    if (store.isAuth) {
      getUsers();
    }
  }, [store.isAuth]);

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data.map((user) => ({ ...user, selected: false })));
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteUsers() {
    try {
      const ids: string[] = users
        .filter(({ selected }) => selected)
        .map(({ _id }) => _id);
      if (!ids.length) {
        return;
      }
      await UserService.deleteUsers(ids);
      const currentUser = JSON.parse(localStorage.getItem("user") || "");
      setUsers(users.filter((user) => !ids.includes(user._id)));
      if (ids.includes(currentUser._id)) {
        store.logout();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function updateStatus(status: boolean) {
    try {
      const ids: string[] = users
        .filter(({ selected }) => selected)
        .map(({ _id }) => _id);
      if (!ids.length) {
        return;
      }
      await UserService.updateStatus(ids, status);
      const currentUser = JSON.parse(localStorage.getItem("user") || "");
      setUsers(
        users.map((user) => {
          if (ids.includes(user._id)) {
            return { ...user, status };
          }
          return user;
        })
      );
      if (ids.includes(currentUser._id) && status) {
        store.logout();
      }
    } catch (err) {
      console.log(err);
    }
  }

  function toggleSelection(selectedUser: IUser) {
    const updatedUsers = users.map((user) => {
      if (user._id === selectedUser._id) {
        return { ...user, selected: !user.selected };
      }
      return user;
    });
    setUsers(updatedUsers);

    setAllSelected(updatedUsers.every(({ selected }) => selected));
  }

  function toggleAllSelection() {
    let selected = false;
    if (users.some((user) => !user.selected)) {
      selected = true;
    }
    setUsers(users.map((user) => ({ ...user, selected })));
    setAllSelected(selected);
  }

  if (store.isLoading) {
    return <div>Loading...</div>;
  }

  if (!store.isAuth) {
    return <LoginForm />;
  }

  const tableCells = [
    "name",
    "id",
    "email",
    "registraion time",
    "last online",
    "status",
  ];

  return (
    <>
      <h1 style={{ textAlign: "center" }}>
        {store.isAuth
          ? "Пользователь авторизован"
          : "Пользователь не авторизован"}
      </h1>
      <Button variant="outlined" onClick={() => store.logout()}>
        logout
      </Button>
      <Toolbar deleteUsers={deleteUsers} updateStatus={updateStatus} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={allSelected}
                  onChange={() => toggleAllSelection()}
                />
              </TableCell>
              {tableCells.map((cell) => {
                return (
                  <TableCell key={cell} align="center">
                    {cell}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">
                  <Checkbox
                    checked={user.selected}
                    onChange={() => toggleSelection(user)}
                  />
                </TableCell>
                <TableCell align="center">{user.name}</TableCell>
                <TableCell align="center">{user._id}</TableCell>
                <TableCell align="center">{user.email}</TableCell>
                <TableCell align="center">{user.registrationTime}</TableCell>
                <TableCell align="center">{user.lastOnline}</TableCell>
                <TableCell align="center">
                  {user.status ? "Blocked" : "Unblocked"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default observer(App);
