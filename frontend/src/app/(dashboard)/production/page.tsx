import { redirect } from 'next/navigation';

export default function ProductionRootPage() {
  redirect('/production/floor');
}
