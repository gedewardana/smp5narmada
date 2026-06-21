'use client'
import React, { useState, useEffect } from 'react'
import Navbar from '@/components/home1/Navbar'
import Hero from '@/components/home1/Hero'
import InfoSection from '@/components/home1/InfoSection'
import Timeline from '@/components/home1/Timeline'
import Requirements from '@/components/home1/Requirements'
import FAQ from '@/components/home1/FAQ'
import Contact from '@/components/home1/Contact'
import Footer from '@/components/home1/Footer'
import Prestasi from '@/components/home1/Prestasi'
// import Ekstrakurikuler from '@/components/home1/Ekstrakurikuler'
import ModalDetail from '@/components/home1/ModalDetail'

export default function Home() {
  const [listJadwal, setListJadwal] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPrestasi, setSelectedPrestasi] = useState(null)

  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const res = await fetch('/api/home/jadwal')
        const result = await res.json()
        if (result.status === 200) {
          setListJadwal(result.data)
        }
      } catch (error) {
        console.error('Error fetching jadwal:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJadwal()
  }, [])
  const activeJadwal = listJadwal?.find(j => j.status_jadwal === 'DIBUKA') || (listJadwal?.length > 0 ? listJadwal[0] : null)

  const handleShowDetail = (data) => {
    setSelectedPrestasi(data)
    setIsModalOpen(true)
  }

  return (
    <main className="min-h-screen bg-white">
      <ModalDetail 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        data={selectedPrestasi} 
      />
      <Navbar />
      <Hero jadwal={activeJadwal} />
      <InfoSection />
      <Prestasi onShowDetail={handleShowDetail} />
      <Timeline jadwal={activeJadwal} />
      <Requirements />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  )
}




