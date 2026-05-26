import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react";

interface SocialLinks {
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

interface FooterProps {
  settings: {
    shopName: string;
    logo: string;
    footer: {
      description: string;
      email: string;
      phone: string;
      address: string;
      socialLinks: SocialLinks;
    };
  };
}

export function Footer({ settings }: FooterProps) {
  const { shopName, logo, footer } = settings;
  const currentYear = new Date().getFullYear();
  const hasSocials = footer.socialLinks.instagram || footer.socialLinks.facebook || footer.socialLinks.twitter;

  return (
    <footer className="bg-zinc-950 text-zinc-300 py-16 px-6 lg:px-8 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        {/* Brand Column */}
        <div className="space-y-4">
          <Link href="/" className="inline-block relative w-32 h-8">
            {logo ? (
              <Image src={logo} alt={shopName} fill className="object-contain object-left" />
            ) : (
              <span className="font-bold text-2xl text-white tracking-tight">
                {shopName}
              </span>
            )}
          </Link>
          {footer.description && (
            <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
              {footer.description}
            </p>
          )}
        </div>

        {/* Contact Column */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white text-lg">Contact</h3>
          <ul className="space-y-3 text-sm">
            {footer.email && (
              <li>
                <a href={`mailto:${footer.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-zinc-500" />
                  {footer.email}
                </a>
              </li>
            )}
            {footer.phone && (
              <li>
                <a href={`tel:${footer.phone}`} className="flex items-center gap-2 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-zinc-500" />
                  {footer.phone}
                </a>
              </li>
            )}
            {footer.address && (
              <li className="flex items-start gap-2 text-zinc-400">
                <MapPin className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
                <span className="whitespace-pre-wrap">{footer.address}</span>
              </li>
            )}
          </ul>
        </div>

        {/* Social Column */}
        <div className="space-y-4">
          <h3 className="font-semibold text-white text-lg">Follow Us</h3>
          {hasSocials ? (
            <div className="flex gap-4">
              {footer.socialLinks.instagram && (
                <a 
                  href={footer.socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                  <span className="sr-only">Instagram</span>
                </a>
              )}
              {footer.socialLinks.facebook && (
                <a 
                  href={footer.socialLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                  <span className="sr-only">Facebook</span>
                </a>
              )}
              {footer.socialLinks.twitter && (
                <a 
                  href={footer.socialLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                  <span className="sr-only">Twitter</span>
                </a>
              )}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">No social profiles added yet.</p>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-900 text-sm text-zinc-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© {currentYear} {shopName}. All rights reserved.</p>
        <div className="flex gap-4 text-xs">
          <a href="#" className="hover:text-zinc-300">Privacy Policy</a>
          <a href="#" className="hover:text-zinc-300">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
