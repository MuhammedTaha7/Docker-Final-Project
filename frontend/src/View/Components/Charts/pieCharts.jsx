import { ResponsivePie } from '@nivo/pie'

const MyResponsivePie = ({ data }) => {
    // --- FIX ---
    // Add a defensive check.
    if (!data || data.length === 0) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>No data available for this chart.</div>;
    }

    // --- FIX ---
    // Nivo Pie charts expect 'id' and 'value'. We map our 'name' field to 'id'.
    const formattedData = data.map(item => ({
        id: item.name,
        label: item.name,
        value: item.value,
    }));

    return (
        <ResponsivePie
            data={formattedData} // Use the correctly formatted data
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        />
    )
}

export default MyResponsivePie;
