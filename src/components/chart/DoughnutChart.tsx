// import { useState, useEffect } from 'react'
// import { groupByDate } from '../../helper/groupBy'
// import { randomColorsArray } from '../../helper/color'
// import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

// const DoughnutChart = ({
//   by = 'hours',
//   items = [],
//   role = 'admin',
//   groupBy = groupByDate,
//   title = 'Sales statistics',
//   sliceEnd = 6
// }) => {
//   const [chartData, setChartData] = useState<any[]>([])

//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

//   useEffect(() => {
//     const newData = groupBy(items, by, role, sliceEnd)
//     const formattedData = newData.map((item, index) => ({
//       name: item[0],
//       value: item[1],
//       color: COLORS[index % COLORS.length]
//     }))
//     setChartData(formattedData)
//   }, [items, by, role, sliceEnd])

//   const renderCustomizedLabel = (props: any) => {
//     const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props
//     const radius = innerRadius + (outerRadius - innerRadius) * 0.5
//     const x = cx + radius * Math.cos(-midAngle * Math.PI / 180)
//     const y = cy + radius * Math.sin(-midAngle * Math.PI / 180)

//     return percent > 0.05 ? (
//       <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
//         {`${(percent * 100).toFixed(0)}%`}
//       </text>
//     ) : null
//   }

//   return (
//     <div style={{ maxWidth: '50%', margin: '0 auto' }}>
//       <h3 className="text-center mb-3">{title}</h3>
//       <ResponsiveContainer width="100%" height={300}>
//         <PieChart>
//           <Pie
//             data={chartData}
//             cx="50%"
//             cy="50%"
//             innerRadius={60}
//             outerRadius={90}
//             labelLine={false}
//             label={renderCustomizedLabel}
//             dataKey="value"
//           >
//             {chartData.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={entry.color} />
//             ))}
//           </Pie>
//           <Tooltip />
//           <Legend />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

// export default DoughnutChart
