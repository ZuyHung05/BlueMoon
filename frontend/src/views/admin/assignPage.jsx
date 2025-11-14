// material-ui
import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Pagination from '@mui/material/Pagination';
import SearchIcon from '@mui/icons-material/Search';

export default function AssignCustomerPage() {
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');

  return (
    <Box sx={{ p: 3 }}>
      {/* Page Title */}
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
        All Customers
      </Typography>
      <Typography variant="subtitle2" sx={{ color: '#777C6D', mb: 3 }}>
        Active Members
      </Typography>

      {/* Top Controls */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={8} md={4}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: 2,
              px: 2,
              py: 1,
              border: '1px solid #E0E0E0'
            }}
          >
            <SearchIcon sx={{ mr: 1, color: '#777C6D' }} />
            <InputBase
              placeholder="Search"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={4} md={2} sx={{ ml: 'auto' }}>
          <Select
            fullWidth
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            sx={{
              backgroundColor: '#FFFFFF',
              borderRadius: 2,
              height: '42px'
            }}
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
          </Select>
        </Grid>
      </Grid>

      {/* Table Wrapper */}
      <Card
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: '#F7F7F7',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
        }}
      >
        {/* Header Row */}
        <Grid container sx={{ fontWeight: 600, color: '#777C6D', mb: 2, justifyContent: "space-around" }}>
          <Grid item xs={2}>Report ID</Grid>
          <Grid item xs={2}>Category</Grid>
          <Grid item xs={2}>Location</Grid>
          <Grid item xs={2}>Citizen</Grid>
          <Grid item xs={2}>Status</Grid>
          <Grid item xs={2}>Engineer Assigned</Grid>
        </Grid>

        {/* Example Row */}
        <Grid container sx={{ py: 2, borderBottom: '1px solid #E0E0E0', justifyContent: "space-around" }}>
          <Grid item xs={2}>1</Grid>
          <Grid item xs={2}>Ổ gà</Grid>
          <Grid item xs={2}>361 Ngô Quyền</Grid>
          <Grid item xs={2}>LocNg</Grid>
          <Grid item xs={2}>Pending</Grid>
          <Grid item xs={2}>Mr Gold</Grid>
        </Grid>

        <Grid container sx={{ py: 2, borderBottom: '1px solid #E0E0E0', justifyContent: "space-around" }}>
          <Grid item xs={2}>2</Grid>
          <Grid item xs={2}>Ổ chuot</Grid>
          <Grid item xs={2}>361 Ngô Quyền</Grid>
          <Grid item xs={2}>LocNg</Grid>
          <Grid item xs={2}>Pending</Grid>
          <Grid item xs={2}>Mr Gold</Grid>
        </Grid>

        <Grid container sx={{ py: 2, borderBottom: '1px solid #E0E0E0', justifyContent: "space-around" }}>
          <Grid item xs={2}>3</Grid>
          <Grid item xs={2}>Ổ gà</Grid>
          <Grid item xs={2}>361 Ngô Quyền</Grid>
          <Grid item xs={2}>LocNg</Grid>
          <Grid item xs={2}>Pending</Grid>
          <Grid item xs={2}>Mr Gold</Grid>
        </Grid>

        {/* Pagination */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination count={40} variant="outlined" shape="rounded" />
        </Box>
      </Card>
    </Box>
  );
}
