'use client';

import React from 'react';
import { GenericModuleWorkspace } from '@/components/GenericModuleWorkspace';

export default function DashboardCatchAllPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const slug = params?.slug;

  return (
    <GenericModuleWorkspace slug={slug} />
  );
}
