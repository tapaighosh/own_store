import { dbConnect } from "@/lib/mongodb";
import { getOrCreateSettings } from "@/models/ShopSettings";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";

export async function generateMetadata() {
  await dbConnect();
  const settings = await getOrCreateSettings();
  
  return {
    title: `${settings.shopName} | Contact`,
  };
}

export default async function ContactPage() {
  await dbConnect();
  const settings = await getOrCreateSettings();
  
  const { email, phone, address, socialLinks } = settings.footer;
  const hasContactInfo = email || phone || address;
  const hasSocialLinks = socialLinks.instagram || socialLinks.facebook || socialLinks.twitter;

  return (
    <main className="min-h-screen py-24 px-6 lg:px-8 bg-[var(--color-primary-50)] text-[var(--color-primary-900)] font-sans flex flex-col items-center">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Contact Us</h1>
          <p className="text-lg text-[var(--color-primary-600)] max-w-2xl mx-auto">
            Get in touch with {settings.shopName}. We&apos;re here to help and answer any questions you might have.
          </p>
        </div>

        <div className="bg-white dark:bg-[var(--color-primary-950)] shadow-sm border border-[var(--color-primary-200)] rounded-2xl p-8 md:p-12 mt-12">
          {!hasContactInfo && !hasSocialLinks ? (
            <p className="text-[var(--color-primary-600)] py-8">
              Contact information is currently unavailable.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
              {hasContactInfo && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-semibold border-b border-[var(--color-primary-100)] pb-4">Contact Info</h2>
                  <div className="space-y-6">
                    {email && (
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-[var(--color-primary-100)] rounded-full text-[var(--color-accent)] shrink-0">
                          <Mail className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-medium text-[var(--color-primary-900)]">Email</h3>
                          <a href={`mailto:${email}`} className="text-[var(--color-primary-600)] hover:text-[var(--color-accent)] transition-colors mt-1 block">
                            {email}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {phone && (
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-[var(--color-primary-100)] rounded-full text-[var(--color-accent)] shrink-0">
                          <Phone className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-medium text-[var(--color-primary-900)]">Phone</h3>
                          <a href={`tel:${phone}`} className="text-[var(--color-primary-600)] hover:text-[var(--color-accent)] transition-colors mt-1 block">
                            {phone}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {address && (
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-[var(--color-primary-100)] rounded-full text-[var(--color-accent)] shrink-0">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-medium text-[var(--color-primary-900)]">Address</h3>
                          <p className="text-[var(--color-primary-600)] mt-1 whitespace-pre-wrap">
                            {address}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {hasSocialLinks && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-semibold border-b border-[var(--color-primary-100)] pb-4">Follow Us</h2>
                  <div className="flex flex-col space-y-4">
                    {socialLinks.instagram && (
                      <a 
                        href={socialLinks.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-primary-200)] hover:border-[var(--color-accent)] hover:bg-[var(--color-primary-50)] transition-all group"
                      >
                        <Instagram className="w-5 h-5 text-[var(--color-primary-600)] group-hover:text-[var(--color-accent)]" />
                        <span className="font-medium text-[var(--color-primary-800)] group-hover:text-[var(--color-primary-900)]">Instagram</span>
                      </a>
                    )}
                    
                    {socialLinks.facebook && (
                      <a 
                        href={socialLinks.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-primary-200)] hover:border-[var(--color-accent)] hover:bg-[var(--color-primary-50)] transition-all group"
                      >
                        <Facebook className="w-5 h-5 text-[var(--color-primary-600)] group-hover:text-[var(--color-accent)]" />
                        <span className="font-medium text-[var(--color-primary-800)] group-hover:text-[var(--color-primary-900)]">Facebook</span>
                      </a>
                    )}
                    
                    {socialLinks.twitter && (
                      <a 
                        href={socialLinks.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 rounded-xl border border-[var(--color-primary-200)] hover:border-[var(--color-accent)] hover:bg-[var(--color-primary-50)] transition-all group"
                      >
                        <Twitter className="w-5 h-5 text-[var(--color-primary-600)] group-hover:text-[var(--color-accent)]" />
                        <span className="font-medium text-[var(--color-primary-800)] group-hover:text-[var(--color-primary-900)]">X (Twitter)</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
