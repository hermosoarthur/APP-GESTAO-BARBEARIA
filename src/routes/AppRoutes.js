import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inicio from '../pages/Inicio'
import Equipe from '../pages/Equipe'
import Contato from '../pages/Contato'
import Cabecalho from '../components/Cabecalho'
import Rodape from '../components/Rodape'
import Container from '../components/Container'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Cabecalho />
      <Container>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/equipe" element={<Equipe />} />
          <Route path="/contato" element={<Contato />} />
        </Routes>
      </Container>
      <Rodape />
    </BrowserRouter>
  )
}