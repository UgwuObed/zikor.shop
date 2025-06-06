import { GetServerSideProps } from 'next'
import { getSubdomain } from '../../lib/subdomain'
import Hero from "../components/Hero"
import Pricing from "../components/Pricing/Pricing"
import FAQ from "../components/FAQ"
import Logos from "../components/Logos"
import Benefits from "../components/Benefits/Benefits"
import Container from "../components/Container"
import Section from "../components/Section"
import Stats from "../components/Stats"
import CTA from "../components/CTA"
// import "./globals.css"

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <Logos />
      <Container>
        <Benefits />

        <Section
          id="pricing"
          title="Pricing"
          description="Simple, transparent pricing. No surprises."
        >
          <Pricing />
        </Section>

        <FAQ />
        <Stats />
        <CTA />
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context
  

  const subdomain = getSubdomain(req)
  

  if (subdomain && subdomain !== 'www' && subdomain !== 'api' && subdomain !== 'admin' && subdomain !== 'prod') {
    console.log('Redirecting to store for subdomain:', subdomain)
    return {
      redirect: {
        destination: `/store/${subdomain}`,
        permanent: false,
      },
    }
  }
  
  console.log('Showing main homepage')
  return {
    props: {},
  }
}

export default HomePage