'use client'

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Download, TrendingUp } from 'lucide-react'

interface PerformanceChartProps {
  campaignId?: string
  data: Array<{
    date: string
    revenue: number
    donorCount: number
    shared?: number
  }>
  goal?: number
  chartType?: 'line' | 'area'
  onExport?: () => void
}

const ChartContainer = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
`

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`

const ControlsGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    flex-wrap: wrap;
  }
`

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: ${(props) => (props.variant === 'primary' ? '#3b82f6' : 'white')};
  color: ${(props) => (props.variant === 'primary' ? 'white' : '#374151')};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: ${(props) => (props.variant === 'primary' ? '#2563eb' : '#f3f4f6')};
    border-color: #9ca3af;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
  }
`

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
`

const MetricItem = styled.div`
  text-align: center;
`

const MetricLabel = styled.p`
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 4px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const MetricValue = styled.p`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
`

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: 'white',
          padding: '12px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#6b7280' }}>
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ margin: '2px 0', fontSize: '13px', color: entry.color }}>
            <strong>{entry.name}:</strong> ${entry.value?.toFixed(2) || 0}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  goal,
  chartType = 'area',
  onExport,
}) => {
  const [chartData, setChartData] = useState(data)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    averageDaily: 0,
    peakDay: 0,
    totalDonors: 0,
    daysActive: 0,
  })

  useEffect(() => {
    setChartData(data)

    // Calculate stats
    const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0)
    const totalDonors = data.length > 0 ? data[data.length - 1].donorCount : 0
    const averageDaily = data.length > 0 ? totalRevenue / data.length : 0
    const peakDay = Math.max(...data.map((d) => d.revenue), 0)

    setStats({
      totalRevenue,
      averageDaily,
      peakDay,
      totalDonors,
      daysActive: data.length,
    })
  }, [data])

  const handleExport = () => {
    if (onExport) {
      onExport()
      return
    }

    // Default CSV export
    const csv = [
      ['Date', 'Revenue', 'Donors'],
      ...chartData.map((d) => [d.date, d.revenue, d.donorCount]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'performance-export.csv'
    a.click()
  }

  const ChartComponent = chartType === 'area' ? AreaChart : LineChart
  const DataComponent = chartType === 'area' ? Area : Line

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>
          <TrendingUp size={20} />
          Revenue Performance
        </ChartTitle>
        <ControlsGroup>
          <Button variant="secondary" onClick={handleExport}>
            <Download size={16} />
            Export
          </Button>
        </ControlsGroup>
      </ChartHeader>

      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            stroke="#e5e7eb"
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 12 }}
            stroke="#e5e7eb"
            label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {goal && goal > 0 && (
            <ReferenceLine
              y={goal}
              stroke="#ef4444"
              strokeDasharray="5 5"
              label={{ value: `Goal: $${goal}`, position: 'right', fill: '#ef4444' }}
            />
          )}
          <DataComponent
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={chartType === 'area' ? 0.2 : 1}
            isAnimationActive={true}
            animationDuration={800}
          />
          <DataComponent
            type="monotone"
            dataKey="donorCount"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={chartType === 'area' ? 0.2 : 1}
            isAnimationActive={true}
            animationDuration={800}
          />
        </ChartComponent>
      </ResponsiveContainer>

      <MetricsGrid>
        <MetricItem>
          <MetricLabel>Total Revenue</MetricLabel>
          <MetricValue>${stats.totalRevenue.toFixed(2)}</MetricValue>
        </MetricItem>
        <MetricItem>
          <MetricLabel>Daily Average</MetricLabel>
          <MetricValue>${stats.averageDaily.toFixed(2)}</MetricValue>
        </MetricItem>
        <MetricItem>
          <MetricLabel>Peak Day</MetricLabel>
          <MetricValue>${stats.peakDay.toFixed(2)}</MetricValue>
        </MetricItem>
        <MetricItem>
          <MetricLabel>Total Donors</MetricLabel>
          <MetricValue>{stats.totalDonors}</MetricValue>
        </MetricItem>
        <MetricItem>
          <MetricLabel>Days Active</MetricLabel>
          <MetricValue>{stats.daysActive}</MetricValue>
        </MetricItem>
        {goal && goal > 0 && (
          <MetricItem>
            <MetricLabel>Progress to Goal</MetricLabel>
            <MetricValue>{((stats.totalRevenue / goal) * 100).toFixed(1)}%</MetricValue>
          </MetricItem>
        )}
      </MetricsGrid>
    </ChartContainer>
  )
}

export default PerformanceChart
