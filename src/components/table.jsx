/* eslint-disable indent */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
  TableContainer,
  TableSortLabel,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
  TablePagination,
  CircularProgress,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  table: {
    display: ({ loading }) => (loading ? 'inherit' : 'table'),
    minWidth: 400,
  },
  bodycolor: {
    color: theme.palette.text.dark,
    opacity: 0.66,
  },
  tableSort: {
    fontWeight: theme.typography.fontWeightMedium,
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    fontSize: theme.typography.fontSize,
  },
  loaderWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: theme.spacing(2, 0),
  },
  tableHead: {
    width: '100%',
    display: ({ loading }) => (loading ? 'inline-table' : 'table-header-group'),
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    fontWeight: theme.typography.fontWeightMedium,
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: theme.typography.fontSize.s2,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const StyledTablePagination = withStyles((theme) => ({
  caption: {
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: theme.typography.fontSize.s2,
    color: theme.palette.text.dark,
    opacity: 0.66,
  },
  select: {
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: theme.typography.fontSize.s2,
    color: theme.palette.text.dark,
    opacity: 0.66,
  },
  toolbar: {
    padding: 0,
  },
}))(TablePagination);

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis?.map((el) => el[0]);
}

const EnhancedTable = ({
  columns,
  rows,
  defaultRowsPerPage = 5,
  noPagination = false,
  filter = [],
  loading = false,
  ...props
}) => {
  const classes = useStyles({ loading });
  const [orderBy, setOrderBy] = useState(null);
  const [order, setOrder] = useState('asc');
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [page, setPage] = useState(0);

  const handleSort = (columnId, isSortable) => {
    const isAsc = orderBy === columnId && order === 'asc';
    if (isSortable) {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(() => (order === 'desc' ? null : columnId));
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleFilter = (nonFilteredRow) => {
    let fiteredRows = nonFilteredRow;
    if (!filter?.length) {
      return nonFilteredRow;
    }
    filter.forEach(({ id, value }) => {
      fiteredRows = fiteredRows.filter((row) => row?.[id] === value);
    });
    return fiteredRows;
  };

  const filteredRows = handleFilter(rows);

  return (
    <TableContainer component={Paper} {...props}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead className={classes.tableHead}>
          <TableRow>
            {columns.map((column, index) => {
              const key = `header-${index}`;
              return (
                <StyledTableCell key={key} align={column.align ?? 'inherit'}>
                  {column.isSortable ? (
                    <TableSortLabel
                      active={!!column.isSortable && orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleSort(column.id, column.isSortable)}
                      hideSortIcon
                    >
                      <div className={classes.tableSort}>{column.header}</div>
                    </TableSortLabel>
                  ) : (
                    column.header
                  )}
                </StyledTableCell>
              );
            })}
          </TableRow>
        </TableHead>
        {!loading ? (
          <TableBody>
            {stableSort(
              filteredRows.slice(
                noPagination ? 0 : page * rowsPerPage,
                noPagination
                  ? filteredRows.length
                  : page * rowsPerPage + rowsPerPage
              ),
              getComparator(order, orderBy)
            ).map((row, index) => (
              <StyledTableRow key={index}>
                {columns.map(({ id, align, cell }, colIndex) => (
                  <StyledTableCell
                    className={classes.bodycolor}
                    key={colIndex}
                    align={align ?? 'inherit'}
                  >
                    {cell ? cell?.(row) : row?.[id]}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        ) : (
          <div className={classes.loaderWrapper}>
            <CircularProgress className={classes.loader} />
          </div>
        )}
      </Table>
      {!noPagination && (
        <StyledTablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 75, 100]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
    </TableContainer>
  );
};

EnhancedTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]),
      id: PropTypes.string,
      isSortable: PropTypes.bool,
      cell: PropTypes.func,
      align: PropTypes.oneOf([
        'inherit',
        'initial',
        'justify',
        'right',
        'left',
        'center',
      ]),
    })
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  defaultRowsPerPage: PropTypes.oneOf([5, 10, 25, 50, 75, 100]),
  noPagination: PropTypes.bool,
  filter: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      value: PropTypes.node,
    })
  ),
};

EnhancedTable.defaultProps = {
  defaultRowsPerPage: 5,
  noPagination: false,
  filter: [],
};

export default EnhancedTable;
