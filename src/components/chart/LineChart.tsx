import { useState, useEffect } from 'react'
import { groupByDate } from '../../helper/groupBy'
import { Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import { useTranslation } from 'react-i18next'

Chart.register(...registerables)

const LineChart = ({
  by = 'hours',
  items = [],
  role = 'admin',
  groupBy = groupByDate,
  title = 'Sales statistics',
  sliceEnd = 6,
  value = ''
}) => {
  const [data, setData] = useState<{ labels: string[]; datasets: any[] }>({
    labels: [],
    datasets: []
  })
  const { t } = useTranslation()

  useEffect(() => {
    const newData = groupBy(items, by, role)

    const datasets = [
      {
        data: newData?.map((item) => item[1]),
        label: title,
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        borderColor: '#3b82f6',
        backgroundColor: '#86d3ff',
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#3b82f6'
      }
    ]

    if (role === 'seller' && value === 'order') {
      datasets.push({
        data: newData?.map((item) => item[2]),
        label: 'Chiết khấu',
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        borderColor: '#F66',
        backgroundColor: '#ffbbbb',
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#F66'
      })
    }

    setData({
      labels: newData?.map((item) => item[0]),
      datasets
    })
  }, [items, by, role, sliceEnd])

  return (
    <div className='bg-body box-shadow rounded-1 w-100'>
      <h5 className='text-capitalize border-bottom p-3 text-start'>
        {t('breadcrumbs.overview')} {t(`${value}`)}
      </h5>
      <div className='p-3'>
        <Line
          data={data}
          options={{
            interaction: {
              mode: 'index',
              intersect: false
            },
            responsive: true,
            scales: {
              x: { display: false },
              y: { beginAtZero: true }
            },
            elements: {
              point: {
                radius: 1,
                hoverRadius: 3
              }
            },
            plugins: {
              title: {
                display: true,
                text: title
              },
              legend: {
                display: true,
                position: 'bottom'
              },
              tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false
              }
            }
          }}
        />
      </div>
    </div>
  )
}

export default LineChart
