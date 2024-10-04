/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField,
  Typography,
  TablePagination,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import debounce from "debounce";
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useApolloClient, useLazyQuery, useMutation } from '@apollo/client';
import { CREATE_TEACHER, DELETE_TEACHER, EDIT_TEACHER, GET_TEACHERS } from '../../graphql/teacherQueries';

function TeachersTable() {
  const client = useApolloClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ name: '', id: '' });
  const [createTeacher] = useMutation(CREATE_TEACHER)
  const [editTeacher] = useMutation(EDIT_TEACHER)
  const [deleteTeacher] = useMutation(DELETE_TEACHER)
  const [getTeachers, { data: teachersResponse }] = useLazyQuery(GET_TEACHERS)

  useEffect(() => {
    getTeachers({
      variables: { limit: rowsPerPage * (page + 1), offset: rowsPerPage * page, searchTerm },
    })
  }, [page, rowsPerPage])
  const debouncedGetTeachers = debounce(getTeachers, 500)
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (teacher) => {
    setEditingTeacher(teacher);
    setFormData(teacher ? { name: teacher.name, id: teacher.id } : { name: '', id: '' });
    setOpenDialog(true);
  };

  useEffect(() => {
    debouncedGetTeachers({
      variables: { limit: rowsPerPage * (page + 1), offset: rowsPerPage * page, searchTerm },
    })
  }, [searchTerm,]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTeacher(null);
  };

  const handleDelete = async (id) => {
    await deleteTeacher({ variables: { id } })
    await client.refetchQueries({ include: ['GetTeachers'] })
  };

  const handleSave = async () => {
    if (editingTeacher) {
      await editTeacher({ variables: { name: formData.name, id: formData.id } })
    } else {
      await createTeacher({ variables: { name: formData.name } })
    }
    await client.refetchQueries({ include: ['GetTeachers'] })
    handleCloseDialog();
  };

  return (
    <TableContainer component={Paper}>
      <Box display={"flex"} justifyContent={"space-around"} marginTop={2}>
        <Typography fontWeight={600} fontSize={24} sx={{ textAlign: 'left', p: 1 }} >Teachers</Typography>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          onChange={(e) => {
            setSearchTerm(e.target.value)
          }}
          value={searchTerm || ''}
          sx={{ mr: 1 }}
          InputProps={{
            endAdornment: (
              <IconButton type="button" aria-label="search" size="small">
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teachersResponse?.getTeachers?.teachers.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell>{teacher.id}</TableCell>
              <TableCell>{teacher.name}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpenDialog(teacher)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(teacher.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <IconButton onClick={() => handleOpenDialog(null)}>
        <AddIcon />
      </IconButton>
      <TablePagination
        component="div"
        rowsPerPageOptions={[5, 10, 25]}
        count={teachersResponse?.getTeachers?.totalCount || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(handleChangePage)}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingTeacher ? 'Edit Teacher' : 'Add Teacher'}</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the teacher's details below:</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}

export default TeachersTable;
