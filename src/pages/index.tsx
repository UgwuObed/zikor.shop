import { GetServerSideProps } from 'next'
import { getSubdomain } from '../../lib/subdomain'
import Hero from "../components/Hero"
import Header from '../components/Header'
import Pricing from "../components/Pricing/Pricing"
import FAQ from "../components/FAQ"
import Logos from "../components/Logos"
import Benefits from "../components/Benefits/Benefits"
import Container from "../components/Container"
import Section from "../components/Section"
import Stats from "../components/Stats"
import CTA from "../components/CTA"
import Footer from '../components/Footer'


const HomePage: React.FC = () => {
  return (
    <>

      <Header />
        <div className="relative overflow-hidden">
        <Hero />
      </div>
      <div className="relative -mt-10 z-10">
        <Logos />
      </div>
      <Container>
      

    <div className="mb-16"> 
      <Benefits />
    </div>

         
          <Pricing />
    
    

        <FAQ />

        <div className="mt-16 mb-1">
        <Stats />
        </div>
        <CTA />
      </Container>
      <Footer />
      
    </>
  )

}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context
  

  const subdomain = getSubdomain(req)
  

  if (subdomain && subdomain !== 'www' && subdomain !== 'api' && subdomain !== 'admin' && subdomain !== 'prod') {
    // console.log('Redirecting to store for subdomain:', subdomain)
    return {
      redirect: {
        destination: `/store/${subdomain}`,
        permanent: false,
      },
    }
  }
  
  // console.log('Showing main homepage')
  return {
    props: {},
  }
}

export default HomePage