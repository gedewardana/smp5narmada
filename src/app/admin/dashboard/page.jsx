'use client'
import React from 'react'
import ProgressChart from '@/components/ui-admin/dashboard/ProgressChart.jsx'
import LineChart from '@/components/ui-admin/dashboard/ProgressLineChart.jsx'
import CardSummary from '@/components/ui-admin/dashboard/CardSummaryDasboard.jsx'
import Welcome from '@/components/reasublecomponents/Welcome.jsx'


function DashboardPage() {

    return (
        <div className="min-h-screen">
            {/* Header Section */}
            <Welcome />

            {/* Main Content */}
            <div className="pt-6">
                <CardSummary />
                <div className='pt-6'>
                    <ProgressChart />
                </div>
                <div className='pt-6'>
                    <LineChart />
                </div>
            </div>
        </div>
    )
}

export default DashboardPage
