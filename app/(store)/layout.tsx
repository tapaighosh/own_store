import { dbConnect } from "@/lib/mongodb";
import { getOrCreateSettings } from "@/models/ShopSettings";
import { colorMap, accentMap, fontMap } from "@/config/theme";
import { LenisProvider } from "@/components/store/LenisProvider";
import { Navbar } from "@/components/store/Navbar";
import { Footer } from "@/components/store/Footer";

export async function generateMetadata() {
  await dbConnect();
  const settings = await getOrCreateSettings();
  
  const title = settings.seo.metaTitle || settings.shopName;
  const description = settings.seo.metaDescription;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: settings.hero.backgroundImage ? [settings.hero.backgroundImage] : [],
    },
  };
}

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await dbConnect();
  const settings = await getOrCreateSettings();

  const primaryPalette = colorMap[settings.primaryColor];
  const accent = accentMap[settings.accentColor];
  const font = fontMap[settings.font];

  const cssVars = `
    :root {
      --color-primary-50: ${primaryPalette[50]};
      --color-primary-100: ${primaryPalette[100]};
      --color-primary-200: ${primaryPalette[200]};
      --color-primary-300: ${primaryPalette[300]};
      --color-primary-400: ${primaryPalette[400]};
      --color-primary-500: ${primaryPalette[500]};
      --color-primary-600: ${primaryPalette[600]};
      --color-primary-700: ${primaryPalette[700]};
      --color-primary-800: ${primaryPalette[800]};
      --color-primary-900: ${primaryPalette[900]};
      --color-primary-950: ${primaryPalette[950]};
      
      --color-primary: ${primaryPalette[600]};
      --color-accent: ${accent};
      --font-sans: ${font.cssFamily};
    }
  `;

  const serializedSettings = {
    shopName: settings.shopName,
    logo: settings.logo,
    footer: {
      description: settings.footer.description,
      email: settings.footer.email,
      phone: settings.footer.phone,
      address: settings.footer.address,
      socialLinks: {
        instagram: settings.footer.socialLinks?.instagram,
        facebook: settings.footer.socialLinks?.facebook,
        twitter: settings.footer.socialLinks?.twitter,
      },
    },
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      <LenisProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar shopName={settings.shopName} logo={settings.logo} />
          <div className="flex-1">{children}</div>
          <Footer settings={serializedSettings} />
        </div>
      </LenisProvider>
    </>
  );
}
