import { ResponsiveBar } from '@nivo/bar'

const MyResponsiveBar = ({ data }) => {
    // --- FIX ---
    // Add a defensive check.
    if (!data || data.length === 0) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>No data available for this chart.</div>;
    }

    return (
        <ResponsiveBar
            data={data}
            // --- FIX ---
            // The 'keys' prop tells the chart which property to use for the bar's value.
            keys={['value']}
            // The 'indexBy' prop tells the chart which property to use for the labels on the axis.
            indexBy="name"
            margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'nivo' }}
            borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Department',
                legendPosition: 'middle',
                legendOffset: 32,
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Enrollments',
                legendPosition: 'middle',
                legendOffset: -40,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            legends={[]} // Removing legends as they are not needed for a single-value bar chart
            role="application"
        />
    )
}

export default MyResponsiveBar;
