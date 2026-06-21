// app/layout.js (Server Component)
import RootLayoutClient from './RootLayoutClient';

export const metadata = {
  title: "SMP Negeri 5 Narmada",
  description: "Sistem Informasi Penerimaan Murid Baru (PMB) Online",
};

export default function RootLayout({ children }) {
  return <RootLayoutClient>{children}</RootLayoutClient>;
}