import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { DashboardSummaryResponse } from '@/interfacesjrg';
import { Grid, Typography } from "@mui/material";
import { SummaryTile } from "@/components/adminjrg";
import { AdminLayout } from "@/components/layoutsjrg";


const DashboardPage = () => {

    const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
        refreshInterval: 30 * 1000 // 30 segundos
    });

    // revisar inventario cada 30s
    const [refreshIn, setRefreshIn] = useState(30);

    useEffect(() => {
      const interval = setInterval(()=>{
        //console.log('Tick');
        setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn - 1 : 30 );
      }, 1000 );
      return () => clearInterval(interval);
    }, []);

    if ( !error && !data ) {
        return <></>
    }

    if ( error ){
        console.log(error);
        return <Typography>Error al cargar la información</Typography>
    }

    const {
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
        notPaidOrders,
    } = data!;

  return (
    <AdminLayout
        title="dashboard"
        subTitle="Estadisticas generales"
        
    >
        <Grid container spacing={2}>
            <SummaryTile 
                title={numberOfOrders}
                subTitle="Ordenes totales"
                icon="credit_card"
                color="orange-icon"
            />
               <SummaryTile 
                title={paidOrders}
                subTitle="Ordenes pagadas"
                icon="attach_money"
                color="blue-icon"

            />

            <SummaryTile 
                title={notPaidOrders}
                subTitle="Ordenes pendientes"
                icon="credit_card_off"
                color="red-icon"
            />

            <SummaryTile 
                title={numberOfClients}
                subTitle="Clientes"
                icon="person_add_alt"
                color="green-icon"
            />

            <SummaryTile 
                title={numberOfProducts}
                subTitle="Productos"
                icon="inventory"
                color="orange-icon"
            />

            <SummaryTile 
                title={productsWithNoInventory}
                subTitle="Sin existencias"
                icon="free_cancellation"
                color="red-icon"
            />

            <SummaryTile 
                title={lowInventory}
                subTitle="Bajo inventario"
                icon="production_quantity_limits"
                color="blue-icon"
            />

            <SummaryTile 
                title={refreshIn}
                subTitle="Actualización en:"
                icon="access_time"
                color="black-icon"
            />
        </Grid>
    </AdminLayout>
  )
}

export default DashboardPage