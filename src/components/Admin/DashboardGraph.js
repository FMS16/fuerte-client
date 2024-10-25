import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import React, { useEffect, useState } from 'react';
import { getISOWeek, startOfWeek, format } from 'date-fns'; // Asegúrate de instalar date-fns

// Registra los componentes necesarios
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const DashboardGraph = ({ orders }) => {
    const [chartData, setChartData] = useState(null);
    const [weeklyOrderData, setWeeklyOrderData] = useState(null);
    useEffect(() => {
        // Filtra y organiza los datos de totales de los pedidos
        if(orders.length == 0) return;
        const orderIds = orders.map(order => `#${order.id}`);

        // Crea un array con los totales en la moneda correspondiente
        const totalCurrency = orders.map(order => {
            return order.currency === 'UYU' ? order.totalUYU : order.totalUSD; // Solo muestra el total en la moneda correspondiente
        });

        const data = {
            labels: orderIds,
            datasets: [
                {
                    label: 'Total por Orden',
                    data: totalCurrency, // Mostrar solo el total en la moneda correspondiente
                    backgroundColor: (ctx) => {
                        const index = ctx.dataIndex;
                        return orders[index].currency === 'UYU' ? 'rgba(153, 102, 255, 0.6)' : 'rgba(75, 192, 192, 0.6)';
                    },
                    borderColor: (ctx) => {
                        const index = ctx.dataIndex;
                        return orders[index].currency === 'UYU' ? 'rgba(153, 102, 255, 1)' : 'rgba(75, 192, 192, 1)';
                    },
                    borderWidth: 1,
                },
            ],
        };

        setChartData(data);

        // Agrupando pedidos por semana
        const ordersByWeek = {};
        orders.forEach(order => {
            const weekStart = startOfWeek(new Date(order.date), { weekStartsOn: 1 });
            const weekLabel = format(weekStart, 'dd/MM/yyyy') + ' - ' + format(new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000), 'dd/MM/yyyy');

            if (!ordersByWeek[weekLabel]) {
                ordersByWeek[weekLabel] = 0;
            }
            ordersByWeek[weekLabel]++;
        });

        const weeks = Object.keys(ordersByWeek);
        const orderCounts = Object.values(ordersByWeek);

        setWeeklyOrderData({
            labels: weeks,
            datasets: [
                {
                    label: 'Cantidad de Pedidos por Semana',
                    data: orderCounts,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                },
            ],
        });
    }, [orders]);

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="dashboard-graph">
            <div className='mb-3'>
                <h3>Total por Orden en su Moneda Correspondiente</h3>
                {chartData && <Bar data={chartData} options={options} />}
            </div>

            <div className='mt-3'>
                <h3>Cantidad de Pedidos por Semana</h3>
                {weeklyOrderData && <Bar data={weeklyOrderData} options={options} />}
            </div>
        </div>
    );
};

export default DashboardGraph;
