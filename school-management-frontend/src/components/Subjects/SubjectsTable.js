import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { GET_TEACHERS } from '../../graphql/teacherQueries';
import { CREATE_SUBJECT, DELETE_SUBJECT, EDIT_SUBJECT, GET_SUBJECTS } from '../../graphql/subjectQueries';

function SubjectsTable() {
  const client = useApolloClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({ id: '', name: '', teacher: '' });
  const { data: teachersResponse } = useQuery(GET_TEACHERS)
  const { data: subjectsResponse } = useQuery(GET_SUBJECTS)
  const [createSubject] = useMutation(CREATE_SUBJECT)
  const [editSubject] = useMutation(EDIT_SUBJECT)
  const [deleteSubject] = useMutation(DELETE_SUBJECT)

  const handleOpenDialog = (subject) => {
    setEditingSubject(subject);
    setFormData(subject ? { id: subject.id, name: subject.name, teacher: subject.teacher } : { id: '', name: '', teacher: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSubject(null);
  };

  const handleDelete = async (id) => {
    await deleteSubject({ variables: { id } })
    await client.refetchQueries({ include: ['GetSubjects'] })
  };

  const handleSave = async () => {
    if (editingSubject) {
      await editSubject({ variables: { name: formData.name, teacherId: formData.teacher.id, id: formData.id } })
    } else {
      await createSubject({ variables: { name: formData.name, teacherId: formData.teacher.id } })
    }
    await client.refetchQueries({ include: ['GetSubjects'] })

    handleCloseDialog();
  };

  return (
    <TableContainer component={Paper}>
      <Typography fontWeight={600} fontSize={24} sx={{ textAlign: 'left', p: 1 }} >Subjects</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Subject Name</TableCell>
            <TableCell>Teacher</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subjectsResponse?.getSubjects?.map((subject) => (
            <TableRow key={subject.id}>
              <TableCell>{subject.id}</TableCell>
              <TableCell>{subject.name}</TableCell>
              <TableCell>{subject.teacher.name}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpenDialog(subject)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(subject.id)}>
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

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingSubject ? 'Edit Subject' : 'Add Subject'}</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the subject's details below:</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Subject Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <FormControl fullWidth >
            <InputLabel id="teacher-select-label">Teachers</InputLabel>
            <Select
              labelId='teacher-select-label'
              label="Select Teacher"
              value={teachersResponse?.getTeachers?.find(t => t.id === formData.teacher.id) || ''}
              onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
              fullWidth
            >
              {teachersResponse?.getTeachers?.map(teacher => (
                <MenuItem key={teacher.id} value={teacher}>
                  {teacher.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}

export default SubjectsTable;
