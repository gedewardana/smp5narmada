'use client'
import React from 'react'
import { Printer, FileText, Download, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

function FilterHarianPMB({ 
    tahunOptions = [], 
    selectedYear, 
    onYearChange, 
    onReset, 
    onPrint, 
    onExcel, 
    onPDF,
    showExcel = true,
    showPDF = true
}) {
    return (
        <Card className="border-0 bg-white shadow-sm rounded-2xl overflow-hidden border border-slate-100 mb-4">
            <CardContent className="p-4 lg:p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    {/* FILTER AREA */}
                    <div className="flex items-center gap-3 w-full md:w-auto">

                        {/* FILTER TAHUN - Standard Select */}
                        <div className="relative flex-1 lg:flex-none">
                            <select
                                value={selectedYear}
                                onChange={(e) => onYearChange(e.target.value)}
                                className="appearance-none w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer outline-none transition-all min-w-[130px]"
                            >
                                {tahunOptions.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>

                        {/*button reset*/}
                        <Button
                            onClick={onReset}
                            variant="outline"
                            className="h-10"
                        >
                            Reset
                        </Button>
                    </div>

                    {/* print dan export */}
                    <div className="flex w-full md:w-auto items-center gap-2">

                        <Button
                            className="bg-blue-500 hover:bg-blue-600"
                            size="lg"
                            onClick={onPrint}>
                            <Printer className="w-4 h-4" />
                            Print
                        </Button>

                        {showExcel && (
                            <Button
                                className="bg-green-500 hover:bg-green-600"
                                size="lg"
                                onClick={onExcel}>
                                <FileText className="w-4 h-4" />
                                Excel
                            </Button>
                        )}

                        {showPDF && (
                            <Button
                                className="bg-red-500 hover:bg-red-600"
                                size="lg"
                                onClick={onPDF}>
                                <Download className="w-4 h-4" />
                                PDF
                            </Button>
                        )}
                    </div>

                </div>
            </CardContent>
        </Card>
    )
}

export default FilterHarianPMB