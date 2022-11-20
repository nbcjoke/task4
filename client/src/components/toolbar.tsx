import { observer } from "mobx-react-lite";
import React, { FC } from "react";

import IconButton from "@mui/material/IconButton";
import { LockOpen, Lock, Delete } from "@mui/icons-material";

interface Properties {
  deleteUsers: () => void;
  updateStatus: (status: boolean) => void;
}

const Toolbar: FC<Properties> = ({ deleteUsers, updateStatus }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
      <IconButton onClick={() => updateStatus(true)}>
        <Lock />
      </IconButton>
      <IconButton onClick={() => updateStatus(false)}>
        <LockOpen />
      </IconButton>
      <IconButton onClick={deleteUsers}>
        <Delete />
      </IconButton>
    </div>
  );
};

export default observer(Toolbar);
