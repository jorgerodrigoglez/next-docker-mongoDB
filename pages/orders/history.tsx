import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import NextLink from 'next/link';
import { dbOrders } from '@/databasejrg';
import { IOrder } from '@/interfacesjrg';
import { ShopLayout } from "@/components/layoutsjrg";
import { Typography, Grid, Chip, Link } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";


const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullname', headerName: 'Nombre completo', width: 300 },

  {
    field: 'paid',
    headerName: 'Pagado',
    description: 'Muestra información si está pagada o no',
    width: 200,
    renderCell: (params:GridRenderCellParams) => {
      return (
        params.row.paid
          ? <Chip color="success" label="Pagado" variant="outlined" />
          : <Chip color="error" label="No Pagada" variant="outlined" />
      )
    }
  },

  {
    field: 'orden',
    headerName: 'Ver orden',
    width: 200,
    sortable: false,
    renderCell: (params:GridRenderCellParams) => {
      return (
        <NextLink href={`/orders/${params.row.orderId}`} passHref legacyBehavior>
          <Link underline="always">
            Ver orden
          </Link>
        </NextLink>
      )
    }
  }
];

/*const rows: GridRowsProp = [
  { id: 1, paid: true, fullName: 'Jorge Rodrigo'},
  { id: 2, paid: false, fullName: 'Maria Hernandez'},
  { id: 3, paid: true, fullName: 'Javier Perez'},
  { id: 4, paid: true, fullName: 'Pedro Garcia'},
  { id: 5, paid: false, fullName: 'Helena Martinez'},
  { id: 6, paid: true, fullName: 'Juan Huertas'},
]*/

interface Props {
  orders: IOrder[];
}

const HistoryPage:NextPage<Props> = ({orders}) => {

  console.log({orders});

  const rows = orders.map( (order, idx) => ({
    id: idx + 1,
    paid: order.isPaid,
    fullname: `${ order.shippingAddress.firstName } ${ order.shippingAddress.lastName }`,
    orderId: order._id
  }));

  
  return (
    <ShopLayout title={"Historial de ordenes"} pageDescription={"Historial de ordenes del cliente"}>
        <Typography variant="h1" component="h1">Historial de ordenes</Typography>

        <Grid container className="fadeIn">
            <Grid item xs={12} sx={{ height: 650, width: '100%'}}>
              <DataGrid 
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: { 
                    paginationModel: { pageSize: 5 } 
                  },
                }}
                pageSizeOptions={[5, 10, 25]}
              />

            </Grid>

        </Grid>

    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    
  const session: any = await getSession({ req });

  if ( !session ) {
      return {
          redirect: {
              destination: '/auth/login?p=/orders/history',
              permanent: false,
          }
      }
  }

  const orders = await dbOrders.getOrdersByUser( session.user._id );


  return {
      props: {
          orders
      }
  }
}

export default HistoryPage;