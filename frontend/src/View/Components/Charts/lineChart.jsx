import { ResponsiveLine } from "@nivo/line";

const LineChart = ({ data }) => {
  // We still check if the data is valid before rendering.
  if (!data || data.length === 0 || !data[0].data || data[0].data.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>No data available to display.</div>;
  }

  return (
    <ResponsiveLine
      // --- FIX: Pass the data prop directly, assuming it's already formatted ---
      data={data}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Assignment / Activity",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Submissions / Progress",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[]}
    />
  );
};

export default LineChart;