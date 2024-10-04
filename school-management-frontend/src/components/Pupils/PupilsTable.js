import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField,
  Typography, Select, MenuItem, InputLabel, FormControl, Checkbox, ListItemText, OutlinedInput
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { GET_SUBJECTS } from '../../graphql/subjectQueries';
import { CREATE_PUPIL, DELETE_PUPIL, EDIT_PUPIL, GET_PUPILS } from '../../graphql/pupilQueries';

function PupilsTable() {
  const client = useApolloClient()
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPupil, setEditingPupil] = useState(null);
  const [formData, setFormData] = useState({ id: '', name: '', grade: '', subjectIds: [] });
  const { data: subjectsResponse } = useQuery(GET_SUBJECTS)
  const { data: pupilsResponse } = useQuery(GET_PUPILS)
  const [createPupil] = useMutation(CREATE_PUPIL)
  const [deletePupil] = useMutation(DELETE_PUPIL)
  const [editPupil] = useMutation(EDIT_PUPIL)

  const handleOpenDialog = (pupil) => {
    setEditingPupil(pupil);
    setFormData(pupil ? {
      id: pupil.id,
      name: pupil.name,
      grade: pupil.grade,
      subjectIds: pupil.subjects.map(subject => subject.id) || []
    } :
      { id: '', name: '', grade: '', subjectIds: [] });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPupil(null);
  };

  const handleDelete = async (id) => {
    await deletePupil({ variables: { id } })
    await client.refetchQueries({ include: ['GetPupils'] })
  };

  const handleSave = async () => {
    const { id, name, grade, subjectIds } = formData

    console.log({ formData })

    if (editingPupil) {
      await editPupil({ variables: { id, name, grade, subjectIds } })
    } else {
      await createPupil({ variables: { name, grade, subjectIds } })
    }
    await client.refetchQueries({ include: ['GetPupils'] })
    handleCloseDialog();
  };
  console.log(formData);

  const handleSubjectsChange = (event) => {

    const {
      target: { value },
    } = event;
    setFormData({ ...formData, subjects: typeof value === 'string' ? value.split(',') : value });
  };

  const handleSelectSubject = (subjectId) => {
    setFormData((prevFormData) => {
      if (prevFormData.subjectIds.includes(subjectId)) {
        return {
          ...prevFormData,
          subjectIds: prevFormData.subjectIds.filter((id) => id !== subjectId),
        };
      } else {
        return {
          ...prevFormData,
          subjectIds: [...prevFormData.subjectIds, subjectId],
        };
      }
    });
  };

  return (
    <TableContainer component={Paper}>
      <Typography fontWeight={600} fontSize={24} sx={{ textAlign: 'left', p: 1 }}>Pupils</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Class</TableCell>
            <TableCell>Subjects</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pupilsResponse?.getPupils?.map((pupil) => (
            <TableRow key={pupil.id}>
              <TableCell>{pupil.id}</TableCell>
              <TableCell>{pupil.name}</TableCell>
              <TableCell>{pupil.grade}</TableCell>
              <TableCell>{pupil?.subjects?.map((subject) => subject?.name).join(', ')}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpenDialog(pupil)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(pupil.id)}>
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
        <DialogTitle>{editingPupil ? 'Edit Pupil' : 'Add Pupil'}</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the pupil's details below:</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Grade"
            fullWidth
            value={formData.grade}
            onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Subjects</InputLabel>
            <Select
              multiple
              value={formData.subjectIds}
              onChange={handleSubjectsChange}
              input={<OutlinedInput label="Select Subjects" />}
              renderValue={(selected) => selected.map((id) => subjectsResponse?.getSubjects?.find(sub => sub.id === id)?.name).join(', ')}
            >
              {subjectsResponse?.getSubjects?.map((subject) => (
                <MenuItem key={subject.id} value={subject}>
                  <Checkbox
                    checked={formData.subjectIds.includes(subject.id)}
                    onChange={() => handleSelectSubject(subject.id)}
                  />
                  <ListItemText primary={subject.name} />
                </MenuItem>
              )
              )}
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

export default PupilsTable;
