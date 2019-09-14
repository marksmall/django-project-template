import React from 'react';
import PropTypes from 'prop-types';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

import ReactTooltip from 'react-tooltip';

import { ReactComponent as DeleteIcon } from './close.svg';
import { ReactComponent as CopyIcon } from './cog.svg';

import style from './user-table.module.css';

const EditableCell = ({ row, data, updateUser }) => (
  <div
    style={{ backgroundColor: '#fafafa' }}
    contentEditable
    suppressContentEditableWarning
    onBlur={event => {
      console.log('EVENT: ', event, row);
      const newData = [...data];
      newData[row.index][row.column.id] = event.target.innerHTML;
      updateUser(newData.find(user => user.pk === row.original.pk));
    }}
    dangerouslySetInnerHTML={{
      __html: data[row.index][row.column.id]
    }}
  />
);

const UserTable = ({ data, deleteUser, updateUser, copyUser }) => (
  <div className={style.container}>
    {data && (
      <ReactTable
        noDataText="No Data Available"
        data={data}
        // filterable
        // defaultFilterMethod={(filter, row) =>
        //   String(row[filter.id]) === filter.value
        // }
        columns={[
          // { Header: 'ID', accessor: 'id' },
          {
            Header: 'Actions',
            accessor: 'action',
            maxWidth: 150,
            Cell: row => {
              // console.log('CELL ROW: ', row);
              return (
                <span>
                  <button onClick={() => copyUser(row.original)} data-tip data-for="copy-user">
                    <CopyIcon className={style.icon} alt="Copy" />
                  </button>
                  <ReactTooltip id="copy-user">
                    <span>Copy User</span>
                  </ReactTooltip>

                  <button onClick={() => deleteUser(row.original.pk)} data-tip data-for="delete-user">
                    <DeleteIcon className={style.icon} alt="Delete" />
                  </button>
                  <ReactTooltip id="delete-user">
                    <span>Delete User</span>
                  </ReactTooltip>
                </span>
              );
            }
          },
          {
            Header: 'Key',
            id: 'pk',
            accessor: d => d.pk,
            contentEditable: true,
            filterable: true,
            filterMethod: (filter, row) => row[filter.id].startsWith(filter.value),
            Cell: row => {
              return <EditableCell row={row} data={data} updateUser={updateUser} />;
            }
          },
          {
            Header: 'Username',
            id: 'username',
            accessor: d => d.username,
            contentEditable: true,
            filterable: true,
            filterMethod: (filter, row) => row[filter.id].startsWith(filter.value),
            Cell: row => {
              return <EditableCell row={row} data={data} updateUser={updateUser} />;
            }
          },
          {
            Header: 'Email',
            id: 'email',
            accessor: d => d.email,
            contentEditable: true,
            filterable: true,
            filterMethod: (filter, row) => row[filter.id].startsWith(filter.value),
            Cell: row => {
              return <EditableCell row={row} data={data} updateUser={updateUser} />;
            }
          },
          {
            Header: 'First Name',
            id: 'first_name',
            accessor: d => d.first_name,
            contentEditable: true,
            filterable: true,
            filterMethod: (filter, row) => row[filter.id].startsWith(filter.value),
            Cell: row => {
              return <EditableCell row={row} data={data} updateUser={updateUser} />;
            }
          },
          {
            Header: 'Last Name',
            id: 'last_name',
            accessor: d => d.last_name,
            contentEditable: true,
            filterable: true,
            filterMethod: (filter, row) => row[filter.id].startsWith(filter.value),
            Cell: row => {
              return <EditableCell row={row} data={data} updateUser={updateUser} />;
            }
          }
        ]}
        defaultPageSize={5}
        className="-striped -highlight"
        // getTdProps={(state, row, col, instance) => ({
        //   onClick: (event, cb) => {
        //     // do some stuff with the event
        //     // console.log('CLICKED TD: ', row, col, instance, event);
        //     if (col.id !== 'action') {
        //       const {
        //         original: { id, name, description }
        //       } = row;
        //       setActiveUser({
        //         id,
        //         'user-name': name,
        //         'user-description': description
        //       });
        //     }
        //     // cb()
        //   }
        // })}
        // getTrProps={(state, rowInfo, column) => ({
        //   onClick: event => {
        //     console.log('CLICKED TABLE ROW: ', rowInfo, state, event, column);
        //   }
        // })}
      />
    )}
  </div>
);

UserTable.propTypes = {
  data: PropTypes.array,
  deleteUser: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  copyUser: PropTypes.func.isRequired
};

export default UserTable;
