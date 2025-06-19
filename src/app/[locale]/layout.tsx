import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/i18n/config";
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "next-themes";
import DynamicContent from "@/components/DynamicContent";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    return notFound();
  }

  setRequestLocale(locale); // 设置请求的 locale

  const messages = await getMessages();

  return (
    <ThemeProvider attribute="class">
      <NextIntlClientProvider messages={messages} locale={locale}>
        <Banner />
        <Navbar />
        <DynamicContent>{children}</DynamicContent>
        <Footer />
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
