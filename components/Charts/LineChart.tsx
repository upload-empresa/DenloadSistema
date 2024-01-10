import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function LineChart() {

    const option = {
        chart: {
            toolbar: {
                show: false,
            },
        },
        tooltip: {
            theme: "dark",
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth",
        },
        xaxis: {
            categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ],
            labels: {
                style: {
                    colors: "#c8cfca",
                    fontSize: "12px",
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: "#c8cfca",
                    fontSize: "12px",
                },
            },
        },
        legend: {
            show: false,
        },
        grid: {
            strokeDashArray: 5,
        },
        fill: {
            type: "gradient",
            gradient: {
                shade: "light",
                type: "vertical",
                shadeIntensity: 0.5,
                gradientToColors: undefined,
                inverseColors: true,
                opacityFrom: 0.8,
                opacityTo: 0,
                stops: [],
            },
            colors: ["#4FD1C5", "#2D3748"],
        },
        colors: ["#4FD1C5", "#2D3748"],
    };


    const series = [{
        name: "Mobile apps",
        data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
    }]

    return (
        <>
            {/* @ts-ignore */}
            <ApexChart type="area" options={option} series={series} height={200} width={500} />
        </>
    )

}