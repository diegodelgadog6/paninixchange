import TopNav from '../components/TopNav'
import Footer from '../components/Footer'
import PagePlaceholder from '../components/PagePlaceholder'

// Public landing page. Full hero + stats + process sections arrive in feat/landing-page.
function Landing() {
  return (
    <div className="min-h-screen bg-surface">
      <TopNav />
      <main className="pt-20">
        <PagePlaceholder title="Landing" icon="sports_soccer" />
      </main>
      <Footer />
    </div>
  )
}

export default Landing
