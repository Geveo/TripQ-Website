/**
 *  *********   NOT IN USE *************
 * We use this documentation for tables. https://react-data-table-component.netlify.app/?path=/docs/getting-started-intro--docs
 */

import DataTable from 'react-data-table-component';

const columns = [
    {
        name: 'Title',
        selector: row => row.title,
        sortable: true,
    },
    {
        name: 'Year',
        selector: row => row.year,
    },
];

const data = [
    {
        id: 1,
        title: 'Beetlejuice',
        year: '1988',
    },
    {
        id: 2,
        title: 'Ghostbusters',
        year: '1984',
    },
]


/**
 *
 * @param keys | string array of table headers
 * @param data | Array of objects, mapping to each record
 * @returns {JSX.Element}
 * @constructor
 */
const ViewCustomerReservationGrid = () => {

    return (
        <>
            <DataTable
                columns={columns}
                data={data}
                pagination
            />
        </>
    );
}

export default ViewCustomerReservationGrid;