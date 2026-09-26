import { Suspense } from 'react';
import { getHeaderData } from '@/services/HeaderFooter.service';
import { LoginContent } from '@/components/login/login-content';

export default async function LoginPage() {
  let logo: string | undefined;

  try {
    logo = (await getHeaderData()).logo;
  } catch {
    logo = undefined;
  }

  return (
    <Suspense>
      <LoginContent logo={logo} />
    </Suspense>
  );
}
