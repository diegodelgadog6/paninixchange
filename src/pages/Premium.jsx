import TopNav from '../components/TopNav'
import Footer from '../components/Footer'
import PagePlaceholder from '../components/PagePlaceholder'

// Premium / pricing page (Stripe placeholder). Pricing card arrives in feat/premium-page.
function Premium() {
  return (
    <div className="min-h-screen bg-surface">
      <TopNav />
      <main className="pt-20">
        <PagePlaceholder title="Premium" icon="workspace_premium" />
      </main>
      <Footer />
    </div>
  )
}

export default Premium
